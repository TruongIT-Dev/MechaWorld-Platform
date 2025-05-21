import React, { useEffect, useState } from "react";
import { Body, Caption, Container, Title } from "../Design";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";
import { commonClassNameOfInput } from "../Design";
import { AiOutlinePlus } from "react-icons/ai";
import { GetListAuctionDetial, PlaceBid, PayForWinningBid } from "../../../apis/Auction/APIAuction";
import { useParams } from "react-router-dom";
import { message } from "antd";
import { useCountdownFromDuration } from "./useCountdownFromDuration";

const AutionDetail = () => {
  const { auctionID } = useParams();
  const [auctionDetail, setAuctionDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("description");
  const [bidPrice, setBidPrice] = useState('');
  const [bidError, setBidError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [isAuctionEnded, setIsAuctionEnded] = useState(false);
  const [bidHistory, setBidHistory] = useState([]);
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const startTime = new Date(auctionDetail?.start_time);
  const endTime = new Date(auctionDetail?.end_time);

  const duration = endTime.getTime() - startTime.getTime();
  const countdowns = useCountdownFromDuration(duration);

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
      setAuctionDetail(response.data);
      setIsAuctionEnded(response.data.status === "ended" || new Date(response.data.end_time).getTime() < new Date().getTime());
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đấu giá:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuctionDetail();
  }, [auctionID]);

  useEffect(() => {
    if (!auctionID) return;

    const source = new EventSource(`/v1/auctions/${auctionID}/stream`);

    source.onopen = () => {
      console.log("🔗 SSE connected");
    };

    source.onerror = (e) => {
      console.error("❌ SSE connection error", e);
      message.error("Mất kết nối đến máy chủ!");
      source.close();
    };

    source.addEventListener("new_participant", (event) => {
      const data = JSON.parse(event.data);
      setParticipants((prev) => {
        const exists = prev.find(p => p.id === data.user.id);
        if (exists) return prev;
        return [...prev, data.user];
      });
      message.success(`${data.user.full_name} vừa tham gia đấu giá!`);
    });

    source.addEventListener("new_bid", (event) => {
      const data = JSON.parse(event.data);
      setAuctionDetail(prev => ({
        ...prev,
        current_price: data.new_price
      }));
      setBidHistory(prev => [{
        user: data.user,
        price: data.new_price,
        timestamp: new Date().toISOString()
      }, ...prev]);
      message.info(`${data.user.full_name} đã đặt giá ${data.new_price.toLocaleString()} VNĐ`);
    });

    source.addEventListener("auction_end", (event) => {
      const data = JSON.parse(event.data);
      setIsAuctionEnded(true);
      setAuctionDetail(prev => ({ ...prev, status: "ended" }));
      if (data.winner) {
        message.success(`Phiên đấu giá kết thúc! Người thắng cuộc: ${data.winner.full_name}`);
      } else {
        message.warning("Phiên đấu giá kết thúc mà không có người thắng cuộc");
      }
    });

    return () => {
      source.close();
      console.log("❌ SSE closed");
    };
  }, [auctionID]);
  
  const countdown = useCountdown(auctionDetail?.end_time);

  const handleTabClick = (tab) => setActiveTab(tab);

  const handleBidChange = (e) => {
    const value = e.target.value;
    setBidPrice(value);
    if (!value) return setBidError('');

    const numericValue = Number(value);
    const minBid = auctionDetail.current_price + auctionDetail.bid_increment;

    setBidError(numericValue < minBid ? `Giá đấu phải tối thiểu ${minBid.toLocaleString()} VNĐ` : '');
  };

  const handleSubmitBid = async (e) => {
    e.preventDefault();

    if (bidError || !bidPrice || isAuctionEnded) return;

    try {
      setIsSubmitting(true);
      await PlaceBid(auctionID, Number(bidPrice));

      message.success("Đặt giá thành công!");
      setBidPrice('');
    } catch (error) {
      const apiError = error?.response?.data?.error || error?.response?.data?.message;

      if (apiError === "user has not participated in this auction yet") {
        message.error("Bạn chưa cọc tiền để tham gia phiên đấu giá này.");
      } else {
        message.error("Đã có lỗi xảy ra khi đặt giá. Vui lòng thử lại.");
      }

      console.error("Lỗi khi đặt giá:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = async () => {
    try {
      setPaymentProcessing(true);
      const response = await PayForWinningBid(auctionID);
      message.success("Thanh toán thành công!");
      // Optionally refresh auction details
      fetchAuctionDetail();
    } catch (error) {
      message.error("Thanh toán thất bại. Vui lòng thử lại.");
      console.error("Lỗi khi thanh toán:", error);
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (!auctionDetail) return <div>Không tìm thấy chi tiết đấu giá.</div>;

  return (
    <section className="mt-10 pt-24 px-8">
      <Container>
        <div className="flex justify-between gap-8">
          <div className="w-1/2">
            <div className="h-[70vh]">
              <img
                src={auctionDetail.gundam_snapshot.image_url}
                alt={auctionDetail.gundam_snapshot.name}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
          </div>

          <div className="w-1/2">
            <Title level={2} className="capitalize">{auctionDetail.gundam_snapshot.name}</Title>
            <div className="flex gap-5">
              <div className="flex text-green ">
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStar size={20} />
                <IoIosStarHalf size={20} />
                <IoIosStarOutline size={20} />
              </div>
              <Caption>(2 customer reviews)</Caption>
            </div>
            <br />
            <Caption>Tình Trạng Sản Phẩm: {auctionDetail.gundam_snapshot.condition}</Caption>
            <br />
            <Caption>Sản phẩm đã được xác nhận: {auctionDetail.is_verified ? "Yes" : "No"}</Caption>
            <br />
            <Caption>Thời gian đấu giá:</Caption>
            <br />
            <div className="flex gap-8 text-center">
              {['days', 'hours', 'minutes', 'seconds'].map((unit, i) => (
                <div className="p-5 px-10 shadow-s1" key={i}>
                  <Title level={4}>{countdowns[unit]}</Title>
                  <Caption>{unit === 'days' ? 'Ngày' : unit === 'hours' ? 'Tiếng' : unit === 'minutes' ? 'Phút' : 'Giây'}</Caption>
                </div>
              ))}
            </div>
            <br />
            <Title className="flex items-center gap-2">
              Đấu giá kết thúc:
              <Caption>{new Date(auctionDetail.end_time).toLocaleString()}</Caption>
            </Title>
            <Title className="flex items-center gap-2 my-5">
              Timezone: <Caption>UTC 0</Caption>
            </Title>
            <Title className="flex items-center gap-2 my-5">
              Giá sàn: <Caption>{auctionDetail.starting_price.toLocaleString()} VNĐ</Caption>
            </Title>
            <Title className="flex items-center gap-2 my-5">
              Bước giá: <Caption>{auctionDetail.bid_increment.toLocaleString()} VNĐ</Caption>
            </Title>
            <Title className="flex items-center gap-2">
              Đấu giá gần nhất:
              <Caption className="text-3xl">{auctionDetail.current_price.toLocaleString()} VNĐ</Caption>
            </Title>

            {auctionDetail.status === "ended" ? (
              <div className="p-5 px-10 shadow-2xl py-8">
                <div className="p-5 rounded-lg bg-gray-50">
                  <Title level={4} className="mb-4">Phiên đấu giá đã kết thúc</Title>
                  {auctionDetail.winner ? (
                    <>
                      <p className="mb-4">Người thắng cuộc: {auctionDetail.winner.full_name}</p>
                      <p className="mb-4">Giá thắng: {auctionDetail.current_price.toLocaleString()} VNĐ</p>
                      <button
                        onClick={handlePayment}
                        disabled={paymentProcessing}
                        className={`py-3 px-8 rounded-lg ${
                          paymentProcessing ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                        } text-white shadow-md`}
                      >
                        {paymentProcessing ? 'Đang xử lý thanh toán...' : 'Thanh toán ngay'}
                      </button>
                    </>
                  ) : (
                    <p>Không có người thắng cuộc trong phiên đấu giá này.</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-5 px-10 shadow-2xl py-8">
                <form onSubmit={handleSubmitBid} className="flex gap-3 justify-between p-5 rounded-lg">
                  <div className="flex-1">
                    <input
                      className={`${commonClassNameOfInput} ${bidError ? 'border-red-500' : ''}`}
                      type="number"
                      name="price"
                      placeholder={`Nhập giá đấu (tối thiểu ${(auctionDetail.current_price + auctionDetail.bid_increment).toLocaleString()} VNĐ)`}
                      value={bidPrice}
                      onChange={handleBidChange}
                      min={auctionDetail.current_price + auctionDetail.bid_increment}
                    />
                    {bidError && <p className="text-red-500 text-sm mt-1">{bidError}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isAuctionEnded || !!bidError || !bidPrice || isSubmitting}
                    className={`py-3 px-8 rounded-lg ${
                      isAuctionEnded
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : bidError || !bidPrice
                        ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                        : 'bg-green-500 text-white hover:bg-green-600'
                    } shadow-md`}
                  >
                    {isAuctionEnded ? 'Đấu giá đã kết thúc' : isSubmitting ? 'Đang xử lý...' : 'Submit'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        <div className="details mt-8">
          <div className="flex items-center gap-5">
            <button
              className={`rounded-md px-10 py-4 text-black shadow-s3 ${
                activeTab === "description" ? " bg-black text-white" : "bg-white"
              }`}
              onClick={() => handleTabClick("description")}
            >
              Description
            </button>
            <button
              className={`rounded-md px-10 py-4 text-black shadow-s3 ${
                activeTab === "auctionHistory" ? "bg-black text-white" : "bg-white"
              }`}
              onClick={() => handleTabClick("auctionHistory")}
            >
              Auction History
            </button>
          </div>

          <div className="tab-content mt-8">
            {activeTab === "description" && (
              <div className="description-tab shadow-s3 p-8 rounded-md">
                <Title level={4}>Giới thiệu mô hình:</Title>
                <Caption className="leading-7">{auctionDetail.gundam_snapshot.description}</Caption>
              </div>
            )}
            {activeTab === "auctionHistory" && (
              <AuctionHistory participants={participants} bidHistory={bidHistory} />
            )}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default AutionDetail;

export const AuctionHistory = ({ participants, bidHistory = [] }) => {
  return (
    <div className="shadow-s1 p-8 rounded-lg">
      <div className="flex gap-8">
        <div className="w-1/2">
          <Title level={5} className="font-normal">Lịch sử đấu giá</Title>
          <hr className="my-5" />

          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Thời gian</th>
                  <th className="px-6 py-3">Người đấu giá</th>
                  <th className="px-6 py-3">Giá</th>
                </tr>
              </thead>
              <tbody>
                {bidHistory.length === 0 && (
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td colSpan={3} className="px-6 py-4">Chưa có lịch sử đấu giá.</td>
                  </tr>
                )}
                {bidHistory.map((bid, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(bid.timestamp).toLocaleString()}</td>
                    <td className="px-6 py-4">{bid.user.full_name}</td>
                    <td className="px-6 py-4 font-semibold">{bid.price.toLocaleString()} VNĐ</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-1/2">
          <Title level={5} className="font-normal">Người tham gia</Title>
          <hr className="my-5" />

          <div className="relative overflow-x-auto rounded-lg">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                <tr>
                  <th className="px-6 py-3">Ngày</th>
                  <th className="px-6 py-3">Người đấu giá</th>
                  <th className="px-6 py-3">Avatar</th>
                </tr>
              </thead>
              <tbody>
                {participants.length === 0 && (
                  <tr className="bg-white border-b hover:bg-gray-50">
                    <td colSpan={3} className="px-6 py-4">Chưa có ai tham gia.</td>
                  </tr>
                )}
                {participants.map((user) => (
                  <tr key={user.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date().toLocaleString()}</td>
                    <td className="px-6 py-4">{user.full_name}</td>
                    <td className="px-6 py-4">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name} className="w-8 h-8 rounded-full" />
                      ) : (
                        "Không có"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};