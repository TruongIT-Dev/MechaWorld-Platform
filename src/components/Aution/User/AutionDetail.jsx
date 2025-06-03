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
import { formatToCustomTime, formatDisplayTime } from './dateFormat';
import AuctionHistory from './AuctionHistory';
import AuctionPaymentModal from './AuctionPaymentModal';
import ParticipantsTable from './ParticipantsTable';  




const AuctionDetail = () => {
  const { auctionID } = useParams();
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("auctionHistory");
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
  const [participantsCount, setParticipantsCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [newParticipantPulse, setNewParticipantPulse] = useState(false);
  const navigate = useNavigate();
  

  

  const useCountdown = (targetDate) => {
    const [countdown, setCountdown] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    useEffect(() => {
      if (!targetDate) return;

      const formattedDate = formatToCustomTime(targetDate);
      const targetTime = new Date(formattedDate).getTime();

      if (isNaN(targetTime)) {
        console.error('Invalid targetDate:', targetDate);
        return;
      }

      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

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

  const countdown = useCountdown(
  auctionDetail?.auction?.status === 'ended' 
    ? auctionDetail?.auction?.actual_end_time 
    : auctionDetail?.auction?.end_time
);
  
  
  
  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const response = await GetListAuctionDetial(auctionID);
      const data = response.data;

      if (!data.auction?.gundam_snapshot) {
        message.warning('Thông tin sản phẩm chưa có sẵn');
      }

      // Xử lý thời gian kết thúc với định dạng mới
      const endTime = data.auction?.end_time;
      const formattedEndTime = formatToCustomTime(endTime);
      const isValidEndTime = endTime && !isNaN(new Date(formattedEndTime).getTime());

      setAuctionDetail(data);
      setParticipants(data.auction_participants || []);
      setIsAuctionEnded(
        data.auction?.status === 'ended' ||
          (isValidEndTime && new Date(formattedEndTime).getTime() < Date.now())
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

useEffect(() => {
  if (auctionDetail?.auction_bids) {
    const mappedBids = auctionDetail.auction_bids.map(bid => ({
      type: 'bid',
      timestamp: bid.created_at,
      price: bid.amount,
      user: participants.find(p => p.user_id === bid.bidder_id) || {}, // nếu đã có participants
    }));
    setBidHistory(mappedBids);
    console.log('Bid history updated:', mappedBids);
  }
}, [auctionDetail, participants]);



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

    const paymentData = {
      delivery_fee: shippingFee,
      expected_delivery_time: formatToCustomTime(expectedDeliveryTime), // ✅ dùng format chuẩn
      note: values.note,
      user_address_id: selectedAddress.id
    };

    console.log('Sending payment data:', paymentData);


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

  const eventSourceRef = { current: null };

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

      // Lắng nghe sự kiện new_participant
      eventSource.addEventListener('new_participant', (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('New participant event:', data);

          const newParticipantRaw = data.new_participant;

          // Tạo object theo đúng cấu trúc participants
          const newParticipant = {
            id: newParticipantRaw.id,
            user_id: newParticipantRaw.id, // dùng id làm user_id
            created_at: newParticipantRaw.created_at || new Date().toISOString(),
            is_refunded: false,
          };

          // Cập nhật danh sách người tham gia
          setParticipants(prev => [...prev, newParticipant]);

          // Cập nhật tổng số
          setAuctionDetail(prev => ({
            ...prev,
            auction: {
              ...prev.auction,
              total_participants: data.total_participants
            }
          }));

          // Thêm vào lịch sử (nếu cần)
          setBidHistory(prev => [
            ...prev,
            {
              type: 'participant_joined',
              timestamp: new Date().toISOString(),
              user: { id: newParticipant.user_id }
            }
          ]);

        } catch (e) {
          console.error("Error parsing new_participant event:", e);
        }
      });



eventSource.addEventListener('new_bid', (event) => {
  try {
    const data = JSON.parse(event.data);
    console.log('New bid received:', data);

    // Tạo bid object mới với đầy đủ thông tin
    const newBid = {
      id: data.bid_id,
      type: 'bid',
      timestamp: data.timestamp || new Date().toISOString(),
      price: data.bid_amount,
      bidder_id: data.bidder?.id,
      user: data.bidder || null // Thêm cả thông tin người dùng nếu có
    };

    // Cập nhật state
    setBidHistory(prevHistory => {
      // Kiểm tra trùng lặp
      const isDuplicate = prevHistory.some(bid => bid.id === newBid.id);
      if (isDuplicate) return prevHistory;

      // Thêm bid mới vào đầu mảng (để hiển thị mới nhất lên trên)
      return [newBid, ...prevHistory];
    });

    // Cập nhật current price
    setAuctionDetail(prev => ({
      ...prev,
      auction: {
        ...prev.auction,
        current_price: data.current_price,
        auction_bids: [...(prev.auction.auction_bids || []), {
          id: data.bid_id,
          amount: data.bid_amount,
          bidder_id: data.bidder?.id,
          created_at: data.timestamp
        }]
      }
    }));

    // Cập nhật participants nếu là người tham gia mới
    if (data.bidder?.id) {
      setParticipants(prev => {
        const existing = prev.find(p => p.user_id === data.bidder.id);
        if (!existing) {
          return [...prev, {
            user_id: data.bidder.id,
            id: data.bidder.id,
            created_at: new Date().toISOString(),
            is_refunded: false,
            user: data.bidder
          }];
        }
        return prev;
      });
    }

  } catch (e) {
    console.error('Error processing new_bid event:', e);
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

  const cleanup = connect();

  return () => {
    if (cleanup && typeof cleanup === 'function') cleanup();
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
  };
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

  const isAuctionTrulyEnded = isAuctionEnded || ['ended', 'completed'].includes(auctionDetail.auction.status);
  const currentUserId = Cookies.get('user') ? JSON.parse(decodeURIComponent(Cookies.get('user'))).id : null;
  const isCurrentUserWinner = currentUserId === winnerInfo?.winner?.id;
  const sortedBidHistory = [...bidHistory].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));



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

          {/* Right Section */}
          <div className="w-1/2">
            {isAuctionTrulyEnded ? (
              <div className="p-6 bg-gray-50 rounded-xl shadow-md">
                <Title level={3} className="mb-4">Phiên đấu giá đã kết thúc</Title>
                {winnerInfo?.winner ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={winnerInfo.winner.avatar_url || '/default-avatar.png'}
                      alt="Avatar"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-lg font-semibold">{winnerInfo.winner.full_name}</p>
                      <p className="text-gray-600">Giá cuối: {winnerInfo.finalPrice?.toLocaleString() || '0'} VNĐ</p>

                      {isCurrentUserWinner && (
                        <>
                          {auctionDetail?.auction?.status === 'completed' ? (
                            <p className="mt-2 text-green-600 font-semibold">Đã thanh toán thành công</p>
                          ) : (
                            <button
                              onClick={() => {
                                fetchUserAddresses();
                                setPaymentModalVisible(true);
                              }}
                              disabled={paymentProcessing}
                              className={`mt-2 py-2 px-6 rounded-lg ${
                                paymentProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                              } text-white`}
                            >
                              {paymentProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                            </button>
                          )}
                        </>
                      )}
                    </div>

                    {/* Modal thanh toán */}
                    <AuctionPaymentModal
                      visible={paymentModalVisible}
                      onCancel={() => setPaymentModalVisible(false)}
                      onOk={handlePaymentSubmit}
                      confirmLoading={paymentProcessing}
                      auctionDetail={auctionDetail}
                      winnerInfo={winnerInfo}
                      userAddresses={userAddresses}
                      selectedAddress={selectedAddress}
                      setSelectedAddress={setSelectedAddress}
                      shippingFee={shippingFee}
                      navigate={navigate}
                    />
                  </div>
                ) : (
                  <p>Phiên đấu giá đã kết thúc nhưng không có người thắng cuộc</p>
                )}

              </div>
            ) : (
              // --- Giữ nguyên layout khi đấu giá đang diễn ra ---
              <>
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
                </div>

                {/* Form đặt giá */}
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
              </>
            )}
          </div>
        </div>


        {/* Tabs Section */}
        <div className="mt-12">
          <div className="flex border-b">
            <button
              className={`px-6 py-3 ${activeTab === 'auctionHistory' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => handleTabClick('auctionHistory')}
            >
              Lịch sử đấu giá
            </button>
            <button
              className={`px-6 py-3 ${activeTab === 'participants' ? 'border-b-2 border-black font-medium' : 'text-gray-500'}`}
              onClick={() => handleTabClick('participants')}
            >
              Người tham gia ({participants.length})
            </button>
          </div>

          <div className="mt-6">
            {activeTab === 'auctionHistory' && (
              <AuctionHistory 
                bidHistory={bidHistory}
                participants={participants}
              />

            )}
            {activeTab === 'participants' && (
              <ParticipantsTable participants={participants} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};



export default AuctionDetail;