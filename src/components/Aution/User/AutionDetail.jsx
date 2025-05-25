import React, { useEffect, useState, useRef } from 'react';
import { Body, Caption, Container, Title } from '../Design';
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from 'react-icons/io';
import { commonClassNameOfInput } from '../Design';
import { AiOutlinePlus } from 'react-icons/ai';
import { GetListAuctionDetial, PlaceBid, PayForWinningBid } from '../../../apis/Auction/APIAuction';
import { getUserAddresses } from '../../../apis/User/APIUser';
import { getUser } from '../../../apis/User/APIUser';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, message, Modal, Form, Input, Radio, Divider } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import Cookies from 'js-cookie';
import axios from 'axios';

// Hàm format thời gian chuẩn ISO 8601
const formatToISOTime = (date) => {
  if (!date) return new Date().toISOString();
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString();
};

const AuctionDetail = () => {
  const { auctionID } = useParams();
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [winnerInfo, setWinnerInfo] = useState(null);
  const eventSourceRef = useRef(null);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [paymentForm] = Form.useForm();
  const [userAddresses, setUserAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [shippingFee, setShippingFee] = useState(0);
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState('');
  const [bidHistory, setBidHistory] = useState([]);

  const useCountdown = (targetDate) => {
    const [countdown, setCountdown] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    useEffect(() => {
      if (!targetDate) return;

      const formattedDate = formatToISOTime(targetDate);
      if (isNaN(new Date(formattedDate).getTime())) {
        console.error('Invalid targetDate:', targetDate);
        return;
      }

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(formattedDate).getTime() - now;

        if (distance < 0) {
          clearInterval(interval);
          setIsAuctionEnded(true);
          return;
        }

        setCountdown({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [targetDate]);

    return countdown;
  };

  const countdown = useCountdown(auctionDetail?.auction?.end_time);
  
  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const response = await GetListAuctionDetial(auctionID);
      const data = response.data;

      if (!data.auction?.gundam_snapshot) {
        message.warning('Thông tin sản phẩm chưa có sẵn');
      }

      // Xử lý thời gian kết thúc
      const endTime = data.auction?.end_time;
      const isValidEndTime = endTime && !isNaN(new Date(formatToISOTime(endTime)).getTime());

      setAuctionDetail(data);
      setIsAuctionEnded(
        data.auction?.status === 'ended' ||
          (isValidEndTime && new Date(formatToISOTime(endTime)).getTime() < Date.now())
      );

      if (data.auction?.winning_bid_id) {
        const winningBid = data.auction_bids?.find((bid) => bid.id === data.auction.winning_bid_id);
        if (winningBid) {
          try {
            const userResponse = await getUser(winningBid.bidder_id);
            setWinnerInfo({
              winner: userResponse.data,
              finalPrice: winningBid.amount,
              reason: data.auction.status
            });
          } catch (error) {
            setWinnerInfo({
              winner: { full_name: 'Người dùng ẩn danh' },
              finalPrice: winningBid.amount,
              reason: data.auction.status
            });
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải chi tiết đấu giá:', error);
      message.error('Không thể tải thông tin đấu giá');
    } finally {
      setLoading(false);
    }
  };

  
  useEffect(() => {
    fetchAuctionDetail();
  }, [auctionID]);

const fetchUserAddresses = async () => {
    try {
      const userId = JSON.parse(decodeURIComponent(Cookies.get('user'))).id;
      const response = await getUserAddresses(userId);
      setUserAddresses(response.data);
      const primaryAddress = response.data.find(addr => addr.is_primary);
      setSelectedAddress(primaryAddress || response.data[0]);
    } catch (error) {
      console.error("Failed to fetch user addresses:", error);
    }
  };

  // Calculate shipping fee với fallback
  const calculateShippingFee = async () => {
    if (!selectedAddress) return;

    try {
      const shopAddress = {
        district_id: 1454,
        ward_code: '21012'
      };

      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          from_district_id: shopAddress.district_id,
          from_ward_code: shopAddress.ward_code,
          to_district_id: selectedAddress.ghn_district_id,
          to_ward_code: selectedAddress.ghn_ward_code,
          service_id: 0,
          service_type_id: 2,
          weight: 200,
          insurance_value: winnerInfo?.finalPrice || 0,
          coupon: null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            token: import.meta.env.VITE_GHN_TOKEN_API,
            shop_id: import.meta.env.VITE_GHN_SHOP_ID
          }
        }
      );

      const feeData = response.data.data;
      setShippingFee(feeData.total);

      // Set thời gian dự kiến với định dạng chuẩn
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      setExpectedDeliveryTime(deliveryDate.toISOString());
    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      // Fallback với định dạng chuẩn
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 3);
      setExpectedDeliveryTime(fallbackDate.toISOString());
      setShippingFee(30000);
    }
  };

  // Handle payment submission
  const handlePaymentSubmit = async () => {
    try {
      setPaymentProcessing(true);

      if (!selectedAddress?.id) {
        message.error('Vui lòng chọn địa chỉ nhận hàng!');
        return;
      }

      const values = await paymentForm.validateFields();
      
      // Đảm bảo expected_delivery_time có định dạng chuẩn
      const formattedDeliveryTime = expectedDeliveryTime 
        ? formatToISOTime(expectedDeliveryTime)
        : new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

      const paymentData = {
        delivery_fee: shippingFee,
        expected_delivery_time: formattedDeliveryTime,
        note: values.note,
        user_address_id: selectedAddress.id
      };

      await PayForWinningBid(auctionID, paymentData);
      message.success('Thanh toán thành công!');
      setPaymentModalVisible(false);
      fetchAuctionDetail();
    } catch (error) {
      console.error('Payment error:', error);
      message.error(error.response?.data?.message || 'Lỗi khi thanh toán');
    } finally {
      setPaymentProcessing(false);
    }
  };

  // SSE connection
  useEffect(() => {
    if (!auctionID || isAuctionEnded) return;

    const connect = () => {
      setConnectionStatus('connecting');
      try {
        const url = `/v1/auctions/${auctionID}/stream`;
        const eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          setConnectionStatus('connected');
        };

        eventSource.onerror = () => {
          setConnectionStatus('error');
          eventSource.close();
        };

        eventSource.addEventListener('new_bid', (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data?.current_price) {
              setAuctionDetail(prev => ({
                ...prev,
                auction: {
                  ...prev.auction,
                  current_price: data.current_price
                }
              }));
            }
          } catch (e) {
            console.error("Error parsing bid data:", e);
          }
        });

        eventSource.addEventListener('auction_ended', (event) => {
          try {
            const data = JSON.parse(event.data);
            setIsAuctionEnded(true);
            setWinnerInfo({
              winner: data.winner || { full_name: "Người dùng ẩn danh" },
              finalPrice: data.final_price,
              reason: data.reason
            });
            eventSource.close();
          } catch (e) {
            console.error("Error parsing end event:", e);
          }
        });

        return () => eventSource.close();
      } catch (error) {
        console.error('SSE connection error:', error);
        setConnectionStatus('failed');
      }
    };

    connect();
  }, [auctionID, isAuctionEnded]);

  

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleBidChange = (e) => {
    const value = e.target.value;
    setBidPrice(value);
    if (!value) return setBidError('');

    const numericValue = Number(value);
    const minBid = (auctionDetail?.auction?.current_price || 0) + 
                  (auctionDetail?.auction?.bid_increment || 0);

    setBidError(numericValue < minBid ? 
      `Giá đấu phải tối thiểu ${minBid.toLocaleString()} VNĐ` : '');
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();
    if (bidError || !bidPrice || isAuctionEnded || !auctionDetail) return;

    try {
      setIsSubmitting(true);
      await PlaceBid(auctionID, Number(bidPrice));
      message.success("Đặt giá thành công!");
      setBidPrice('');
      // Không cần fetch lại vì SSE sẽ cập nhật
    } catch (error) {
      const apiError = error?.response?.data?.message;
      message.error(apiError || "Đặt giá thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      await PayForWinningBid(auctionID);
      message.success("Thanh toán thành công!");
      fetchAuctionDetail(); // Cần fetch lại để cập nhật trạng thái thanh toán
    } catch (error) {
      message.error("Thanh toán thất bại.");
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Tính phí vận chuyển khi mở modal thanh toán, đổi địa chỉ hoặc winnerInfo thay đổi
  useEffect(() => {
    if (winnerInfo && paymentModalVisible) {
      fetchUserAddresses();
    }
  }, [paymentModalVisible]);

  useEffect(() => {
    if (selectedAddress && winnerInfo) {
      calculateShippingFee();
    }
  }, [selectedAddress, winnerInfo]);

  if (loading) return <div className="text-center py-10">Đang tải dữ liệu...</div>;
  if (!auctionDetail || !auctionDetail.auction.gundam_snapshot) {
    return <div className="text-center py-10 text-red-500">Không tìm thấy thông tin đấu giá hoặc sản phẩm</div>;
  }

  return (
    <section className="mt-10 pt-24 px-8">
      <Container>
        {/* Hiển thị trạng thái kết nối SSE */}
        <div className="sse-status mb-4">
          {connectionStatus === 'connecting' && (
            <div className="bg-yellow-100 p-2 rounded text-center">
              <span className="animate-pulse">🔄 Đang kết nối với máy chủ...</span>
            </div>
          )}
          {connectionStatus === 'connected' && (
            <div className="bg-green-100 p-2 rounded text-center">
              ✅ Đã kết nối thời gian thực
            </div>
          )}
          {connectionStatus === 'error' && (
            <div className="bg-orange-100 p-2 rounded text-center">
              ⚠️ Đang thử kết nối lại...
            </div>
          )}
          {connectionStatus === 'failed' && (
            <div className="bg-red-100 p-2 rounded text-center">
              ❌ Mất kết nối với máy chủ
            </div>
          )}
        </div>

        <div className="flex justify-between gap-8">
          {/* Product Image Section */}
          <div className="w-1/2">
            <div className="h-[70vh] bg-gray-100 rounded-xl flex items-center justify-center">
              {auctionDetail.auction.gundam_snapshot?.image_url ? (
                <img
                  src={auctionDetail.auction.gundam_snapshot.image_url}
                  alt={auctionDetail.auction.gundam_snapshot.name || 'Gundam image'}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-gray-500">Không có hình ảnh</div>
              )}
            </div>
          </div>

          {/* Auction Info Section */}
          <div className="w-1/2">
            <Title level={2} className="capitalize">
              {auctionDetail.auction.gundam_snapshot?.name || 'Tên sản phẩm không có'}
            </Title>
            
            <div className="flex gap-5 items-center my-4">
              <div className="flex text-yellow-400">
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStarHalf size={20} />
                <IoIosStarOutline size={20} />
              </div>
              <Caption>(2 đánh giá)</Caption>
            </div>

            <div className="space-y-3 my-6">
              <Caption>
                <span className="font-medium">Tình trạng:</span> {auctionDetail.auction.gundam_snapshot?.condition || 'Không xác định'}
              </Caption>
              <Caption>
                <span className="font-medium">Xác minh:</span> {auctionDetail.is_verified ? "Đã xác minh" : "Chưa xác minh"}
              </Caption>
            </div>

            {/* Countdown Timer */}
            <div className="my-6">
              <Caption>Thời gian còn lại:</Caption>
              <div className="flex gap-4 text-center mt-3">
                {['days', 'hours', 'minutes', 'seconds'].map((unit) => (
                  <div key={unit} className="p-4 px-6 shadow-md rounded-lg">
                    <Title level={4}>{countdown[unit]}</Title>
                    <Caption>
                      {unit === 'days' ? 'Ngày' : 
                       unit === 'hours' ? 'Giờ' : 
                       unit === 'minutes' ? 'Phút' : 'Giây'}
                    </Caption>
                  </div>
                ))}
              </div>
            </div>

            {/* Auction Details */}
            <div className="space-y-3 my-6">
              <Title level={6} className="flex items-center gap-2">
                Kết thúc lúc: <Caption>{new Date(auctionDetail.auction.end_time).toLocaleString()}</Caption>
              </Title>
              <Title level={6} className="flex items-center gap-2">
                Giá khởi điểm: <Caption>{auctionDetail.auction.starting_price?.toLocaleString() || '0'} VNĐ</Caption>
              </Title>
              <Title level={6} className="flex items-center gap-2">
                Bước giá: <Caption>{auctionDetail.auction.bid_increment?.toLocaleString() || '0'} VNĐ</Caption>
              </Title>
              <Title level={6} className="flex items-center gap-2">
                Giá hiện tại: <Caption className="text-2xl text-green-600">
                  {auctionDetail.auction.current_price?.toLocaleString() || '0'} VNĐ
                </Caption>
              </Title>
              <Title level={6} className="flex items-center gap-2">
                Số người tham gia: <Caption>{auctionDetail.auction.total_participants}</Caption>
              </Title>
            </div>

            {/* Bid Form or Winner Info */}
            {isAuctionEnded ? (
              <div className="p-5 bg-gray-50 rounded-lg shadow-md mt-6">
            <Title level={4} className="mb-4">Phiên đấu giá đã kết thúc</Title>
            {winnerInfo?.winner ? (
              <>
                <p className="mb-2">Người thắng: {winnerInfo.winner.full_name}</p>
                <p className="mb-2">Giá cuối: {winnerInfo.finalPrice?.toLocaleString() || '0'} VNĐ</p>
                
                {/* Sửa lại điều kiện kiểm tra người thắng là người dùng hiện tại */}
                {Cookies.get('user') && JSON.parse(decodeURIComponent(Cookies.get('user'))).id === winnerInfo.winner.id && (
                  <>
                    <button
                      onClick={() => {
                        fetchUserAddresses();
                        setPaymentModalVisible(true);
                      }}
                      disabled={paymentProcessing}
                      className={`mt-4 py-2 px-6 rounded-lg ${
                        paymentProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                      } text-white`}
                    >
                      {paymentProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                    </button>
                          {/* Payment Modal */}
              <Modal
                  title="Thanh toán đấu giá"
                  visible={paymentModalVisible}
                  onCancel={() => setPaymentModalVisible(false)}
                  onOk={handlePaymentSubmit}
                  confirmLoading={paymentProcessing}
                  width={800}
                >
                  <Form form={paymentForm} layout="vertical">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-4">Thông tin sản phẩm</h3>
                      <div className="flex items-center gap-4 mb-4">
                        <img 
                          src={auctionDetail.auction.gundam_snapshot.image_url} 
                          alt={auctionDetail.auction.gundam_snapshot.name}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div>
                          <p className="font-medium">{auctionDetail.auction.gundam_snapshot.name}</p>
                          <p>Giá thắng: {winnerInfo.finalPrice.toLocaleString()} VNĐ</p>
                        </div>
                      </div>

                      <h3 className="font-semibold mb-4 mt-6">Địa chỉ nhận hàng</h3>
                      {userAddresses.length > 0 ? (
                        <Radio.Group
                          value={selectedAddress?.id}
                          onChange={(e) => {
                            const addr = userAddresses.find(a => a.id === e.target.value);
                            setSelectedAddress(addr);
                          }}
                          className="w-full"
                        >
                          <div className="space-y-3">
                            {userAddresses.map(address => (
                              <Radio key={address.id} value={address.id} className="w-full">
                                <div className={`p-3 border rounded-lg ml-2 ${selectedAddress?.id === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                                  <div className="flex justify-between">
                                    <div>
                                      <p className="font-medium">{address.full_name} ({address.phone_number})</p>
                                      <p className="text-sm">
                                        {address.detail}, {address.ward_name}, {address.district_name}, {address.province_name}
                                      </p>
                                    </div>
                                    {address.is_primary && (
                                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mặc định</span>
                                    )}
                                  </div>
                                </div>
                              </Radio>
                            ))}
                          </div>
                        </Radio.Group>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ trong trang cá nhân.
                        </div>
                      )}

                      <Button
                        type="link"
                        className="mt-2"
                        onClick={() => navigate('/member/profile/address')}
                      >
                        + Thêm địa chỉ mới
                      </Button>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">Thông tin thanh toán</h3>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span>Giá thắng đấu giá:</span>
                          <span className="font-medium">{winnerInfo.finalPrice.toLocaleString()} VNĐ</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Phí vận chuyển:</span>
                          <span className="font-medium">
                            {`${shippingFee.toLocaleString()} VNĐ`}
                          </span>
                        </div>
                        <Divider className="my-2" />
                        <div className="flex justify-between text-lg">
                          <span className="font-semibold">Tổng thanh toán:</span>
                          <span className="font-semibold text-red-600">
                            { `${(winnerInfo.finalPrice + shippingFee).toLocaleString()} VNĐ`}
                          </span>
                        </div>
                      </div>

                      <Form.Item label="Ghi chú" name="note">
                        <Input.TextArea rows={3} placeholder="Ghi chú cho người bán..." />
                      </Form.Item>

                      <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          <InfoCircleOutlined className="mr-2" />
                          Sau khi thanh toán, người bán sẽ liên hệ với bạn để xác nhận đơn hàng.
                        </p>
                      </div>
                    </div>
                  </div>
                </Form>
              </Modal>
                  </>
                  
                )}
                
              </>
            ) : (
              <p>Không có người thắng cuộc</p>
            )}
          </div>
            ) : (
              <form onSubmit={handleSubmitBid} className="mt-6 p-5 bg-white rounded-lg shadow-md">
                <div className="mb-4">
                  <input
                    className={`${commonClassNameOfInput} ${bidError ? 'border-red-500' : ''} w-full`}
                    type="number"
                    placeholder={`Tối thiểu ${((auctionDetail.auction.current_price || 0) + (auctionDetail.auction.bid_increment || 0)).toLocaleString()} VNĐ`}
                    value={bidPrice}
                    onChange={handleBidChange}
                    min={(auctionDetail?.auction?.current_price || 0) + (auctionDetail?.auction?.bid_increment || 0)}
                  />
                  {bidError && <p className="text-red-500 text-sm mt-1">{bidError}</p>}
                </div>
                <button
                  type="submit"
                  disabled={!!bidError || !bidPrice || isSubmitting}
                  className={`w-full py-3 rounded-lg ${
                    bidError || !bidPrice ? 'bg-gray-300' : 'bg-green-500 hover:bg-green-600'
                  } text-white`}
                >
                  {isSubmitting ? 'Đang đặt giá...' : 'Đặt giá'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 ${activeTab === 'description' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => handleTabClick('description')}
            >
              Mô tả sản phẩm
            </button>
            <button
              className={`px-6 py-3 ${activeTab === 'auctionHistory' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => handleTabClick('auctionHistory')}
            >
              Lịch sử đấu giá
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'description' && (
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <Title level={4} className="mb-4">Mô tả chi tiết</Title>
                <Body>
                  {auctionDetail.gundam_snapshot?.description || 'Không có mô tả sản phẩm'}
                </Body>
              </div>
            )}

            {activeTab === 'auctionHistory' && (
              <AuctionHistory 
                participants={bidHistory.filter(b => b.type === 'participant_joined').map(b => b.user)} 
                bidHistory={bidHistory.filter(b => b.type === 'bid')} 
              />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

const AuctionHistory = ({ participants = [], bidHistory = [] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Bid History */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Title level={5} className="mb-4">Lịch sử đấu giá ({bidHistory.length})</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Thời gian</th>
                <th className="px-4 py-2 text-left">Người đấu</th>
                <th className="px-4 py-2 text-left">Giá</th>
              </tr>
            </thead>
            <tbody>
              {bidHistory.length > 0 ? (
                bidHistory.map((bid, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3">{new Date(bid.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-3">{bid.user?.full_name || 'Ẩn danh'}</td>
                    <td className="px-4 py-3 font-medium">{bid.price?.toLocaleString() || '0'} VNĐ</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={3} className="px-4 py-6 text-center text-gray-500">
                    Chưa có lịch sử đấu giá
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Participants */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Title level={5} className="mb-4">Người tham gia ({participants.length})</Title>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Người đấu</th>
                <th className="px-4 py-2 text-left">Tham gia lúc</th>
              </tr>
            </thead>
            <tbody>
              {participants.length > 0 ? (
                participants.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="px-4 py-3 flex items-center gap-2">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt="Avatar" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <AiOutlinePlus />
                        </div>
                      )}
                      {user.full_name || 'Ẩn danh'}
                    </td>
                    <td className="px-4 py-3">{new Date().toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr className="border-t">
                  <td colSpan={2} className="px-4 py-6 text-center text-gray-500">
                    Chưa có người tham gia
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetail;