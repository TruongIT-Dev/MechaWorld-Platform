import React, { useEffect, useState, useRef } from "react";
import { Body, Caption, Container, Title } from "../Design";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../Design";
import { AiOutlinePlus } from "react-icons/ai";
import { GetListAuctionDetial, PlaceBid, PayForWinningBid } from "../../../apis/Auction/APIAuction";
import { useParams } from "react-router-dom";
import { message } from "antd";

const AuctionDetail = () => {
  const { auctionID } = useParams();
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const [participants, setParticipants] = useState(0);
  const [winnerInfo, setWinnerInfo] = useState(null);
  const eventSourceRef = useRef(null);

  const useCountdown = (targetDate) => {
    const [countdown, setCountdown] = useState({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0
    });

    useEffect(() => {
      const interval = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(targetDate).getTime() - now;

        if (distance < 0) {
          clearInterval(interval);
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

  const fetchAuctionDetail = async () => {
    try {
      setLoading(true);
      const response = await GetListAuctionDetial(auctionID);
      const data = response.data;

      if (!data.auction?.gundam_snapshot) {
        console.error('Missing gundam_snapshot in response:', data);
        message.warning('Thông tin sản phẩm chưa có sẵn');
      }

      setAuctionDetail(data);
      setIsAuctionEnded(data.auction?.status === "ended" || 
                       new Date(data.auction?.end_time).getTime() < Date.now());

      // Nếu có thông tin người thắng từ SSE, không ghi đè bằng API
      if (!winnerInfo && data.auction?.winner) {
        setWinnerInfo({
          winner: data.auction.winner,
          finalPrice: data.auction.current_price,
          reason: data.auction.status === 'ended' ? 'time_ended' : 'unknown'
        });
      }

    } catch (error) {
      console.error("Lỗi khi tải chi tiết đấu giá:", error);
      message.error("Không thể tải thông tin đấu giá");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetail();
  }, [auctionID]);

  // SSE connection
  useEffect(() => {
    if (!auctionID || isAuctionEnded) return;

    let retryCount = 0;
    const maxRetries = 5;
    let retryDelay = 1000;
    let eventSource;

    const connect = () => {
      setConnectionStatus('connecting');
      
      try {
        const url = `/v1/auctions/${auctionID}/stream`;
        eventSource = new EventSource(url);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
          console.log('SSE connected');
          setConnectionStatus('connected');
          retryCount = 0;
        };

        eventSource.onerror = (e) => {
          console.error('SSE error:', e);
          setConnectionStatus('error');
          
          eventSource.close();
          
          if (retryCount < maxRetries) {
            retryCount++;
            retryDelay = Math.min(retryDelay * 2, 30000);
            setTimeout(connect, retryDelay);
          } else {
            setConnectionStatus('failed');
          }
        };

        // Xử lý sự kiện người tham gia mới
        eventSource.addEventListener('new_participant', (event) => {
          const data = JSON.parse(event.data);
          setParticipants(data.total_participants);
          setBidHistory(prev => [...prev, {
            type: 'participant_joined',
            user: data.user,
            timestamp: new Date().toISOString()
          }]);
        });

        // Xử lý sự kiện đấu giá mới
        eventSource.addEventListener('new_bid', (event) => {
          const data = JSON.parse(event.data);
          setAuctionDetail(prev => ({
            ...prev,
            auction: {
              ...prev.auction,
              current_price: data.current_price
            }
          }));
          setBidHistory(prev => [...prev, {
            type: 'bid',
            user: data.user,
            price: data.current_price,
            timestamp: data.timestamp || new Date().toISOString()
          }]);
        });

        // Xử lý sự kiện kết thúc đấu giá
        eventSource.addEventListener('auction_ended', (event) => {
          const data = JSON.parse(event.data);
          setIsAuctionEnded(true);
          setWinnerInfo({
            winner: data.winner,
            finalPrice: data.final_price,
            reason: data.reason
          });
          
          if (data.reason === 'buy_now_price_reached' && data.bid_details) {
            setAuctionDetail(prev => ({
              ...prev,
              auction: {
                ...prev.auction,
                current_price: data.bid_details.bid_amount
              }
            }));
          }
          
          eventSource.close();
          setConnectionStatus('ended');
        });

      } catch (error) {
        console.error('Error creating SSE connection:', error);
        setConnectionStatus('failed');
      }
    };

    connect();

    return () => {
      if (eventSource) {
        eventSource.close();
        console.log('SSE connection closed');
      }
    };
  }, [auctionID, isAuctionEnded]);

  const countdown = useCountdown(auctionDetail?.auction?.end_time || null);

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
                    {auctionDetail.auction.winner?.is_current_user && (
                      <button
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                        className={`mt-4 py-2 px-6 rounded-lg ${
                          paymentProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white`}
                      >
                        {paymentProcessing ? 'Đang xử lý...' : 'Thanh toán ngay'}
                      </button>
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