import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RiAuctionFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, PrimaryButton, Title } from "../Design";
import { Input, Select, Card, Modal, message } from "antd";
import { GetListAuction, ParticipateInAuction } from "../../../apis/Auction/APIAuction";
import Cookies from 'js-cookie';

const { Search } = Input;
const { Option } = Select;

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const useCountdown = (endTime) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!endTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(endTime);
      const diff = end - now;

      if (diff <= 0) {
        clearInterval(interval);
        setTimeLeft('Đã kết thúc');
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  return timeLeft;
};


const parseUserCookie = (cookieString) => {
  try {
    if (!cookieString) return null;
    
    const cookieMatch = cookieString.match(/user=([^;]+)/);
    if (!cookieMatch) return null;
    
    const encodedValue = cookieMatch[1];
    let decodedValue;
    
    try {
      decodedValue = decodeURIComponent(encodedValue);
    } catch {
      decodedValue = encodedValue
        .replace(/%22/g, '"')
        .replace(/%2C/g, ',')
        .replace(/%3A/g, ':')
        .replace(/%7B/g, '{')
        .replace(/%7D/g, '}');
    }

    let cleanJson = decodedValue
      .replace(/\\"/g, '"')
      .replace(/"\s*\+\s*"/g, '')
      .replace(/\n/g, '')
      .replace(/\r/g, '');

    const firstBrace = cleanJson.indexOf('{');
    const lastBrace = cleanJson.lastIndexOf('}');
    
    if (firstBrace === -1 || lastBrace === -1) return null;
    
    cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);

    cleanJson = cleanJson
      .replace(/([{,]\s*)([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/:\s*([a-zA-Z0-9_]+)(\s*[},])/g, ':"$1"$2')
      .replace(/:true([^"])/g, ':true$1')
      .replace(/:false([^"])/g, ':false$1')
      .replace(/:null([^"])/g, ':null$1');

    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Failed to parse user cookie:", e);
    return null;
  }
};

const getCurrentUserFromCookies = () => {
  try {
    if (typeof Cookies !== 'undefined') {
      const userCookie = Cookies.get('user');
      if (userCookie) {
        try {
          return JSON.parse(userCookie);
        } catch {
          // Nếu không được thì chuyển sang parse thủ công
        }
      }
    }
    
    return parseUserCookie(document.cookie);
  } catch (e) {
    console.error("Error getting user from cookies:", e);
    return null;
  }
};

const AuctionCard = ({ auctionData }) => {
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [cookieError, setCookieError] = useState(false);

  // Destructure data correctly
  const { 
    auction, 
    auction_participants: participants = [], 
    auction_bids: bids = [] 
  } = auctionData;

  useEffect(() => {
    console.log("Participants data:", participants);
    console.log("Auction data:", auction);
  }, [participants, auction]);

  useEffect(() => {
    try {
      const user = getCurrentUserFromCookies();
      if (user) {
        setCurrentUser(user);
        
        // Kiểm tra xem user hiện tại đã tham gia chưa
        const userParticipated = participants.some(
          participant => participant.user_id === user.id
        );
        setHasParticipated(userParticipated);
      }
    } catch (e) {
      console.error("Error processing user cookie:", e);
      setCookieError(true);
    }
  }, [participants]);

  
  const countdown = useCountdown(auction.end_time);

  const getAuctionStatus = () => {
    const now = new Date();
    const startTime = new Date(auction.start_time);
    const endTime = new Date(auction.end_time);
    
    // Nếu có actual_end_time và auction đã hoàn thành (có người thắng)
    if (auction.actual_end_time != null && auction.order_id != null) {
      return "completed";
    }
    
    // Nếu có actual_end_time nhưng không có người thắng
    if (auction.actual_end_time != null) {
      return "ended";
    }
    
    // Kiểm tra trạng thái theo thời gian
    if (now < startTime) return "scheduled";
    if (now >= startTime && now <= endTime) return "active";
    return "ended";
  };
  const status = getAuctionStatus();

  const statusStyles = {
    active: { text: "text-green-500", bg: "bg-green-100" },
    ended: { text: "text-red-500", bg: "bg-red-100" },
    scheduled: { text: "text-blue-500", bg: "bg-blue-100" },
    completed: { text: "text-purple-500", bg: "bg-purple-100" }
  };
  const dateOnly = new Date(auction.actual_end_time).toISOString().split('T')[0];
  const renderStatusInfo = () => {
    switch (status) {
      case 'scheduled':
        return (
          <div className="text-[19px] text-gray-500 mt-1">
            Bắt đầu: {formatDate(auction.start_time)}
          </div>
        );
      case 'active':
        return (
          <div className="text-[19px] text-green-500 mt-1">
            Kết thúc trong: {countdown}
          </div>
        );
      case 'ended':
        return (
          <div className="text-[19px] text-green-500 mt-1">
            Kết thúc vào: {dateOnly}
          </div>
        );
      case 'completed':
        return (
          <div className="text-[19px] text-green-500 mt-1">
            Kết thúc vào: {dateOnly}
          </div>
        );
      default:
        return null;
    }
  };

  const handleClickedDetailAution = (id) => {
    if (status === "ended" || hasParticipated || currentUser?.id === auction.seller_id) {
      window.location.assign(`/auction/${id}`);
      return;
    }
    
    message.warning("Vui lòng nhấn 'Tham gia' để đăng ký trước khi xem chi tiết");
  };

  const handleJoinAuction = () => {
    if (!currentUser) {
      message.warning("Vui lòng đăng nhập để tham gia đấu giá.");
      return;
    }

    if (status === "scheduled") {
      message.warning("Hiện tại phiên chưa bắt đầu nên chưa thể tham gia.");
      return;
    }

    if (currentUser.id === auction.seller_id) {
      message.warning("Bạn không thể tham gia phiên đấu giá của chính mình.");
      return;
    }

    const deposit = auction.deposit_amount || Math.floor(auction.starting_price * 0.15);
    setDepositAmount(deposit);
    setIsModalOpen(true);
  };

  const confirmParticipation = async () => {
    try {
      await ParticipateInAuction(auction.id);
      message.success("Tham gia đấu giá thành công!");
      setHasParticipated(true);
    } catch (err) {
      console.error("Chi tiết lỗi:", err);

      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Lỗi không xác định";

      if (errorMsg.toLowerCase().includes("insufficient balance")) {
        message.error("Vui lòng nạp tiền. Số dư không đủ để đặt cọc.");
      } else if (errorMsg.toLowerCase().includes("already participated")) {
        message.info("Bạn đã tham gia phiên đấu giá này.");
        setHasParticipated(true);
      } else {
        message.error("Không thể tham gia đấu giá. Vui lòng thử lại!");
      }
    } finally {
      setIsModalOpen(false);
    }
  };

  if (cookieError) {
    return (
      <div className="bg-white shadow-s1 rounded-xl p-4 w-full sm:w-[300px] mx-auto mt-4">
        <div className="text-red-500 text-center py-4">
          Lỗi khi xác thực thông tin người dùng. Vui lòng đăng nhập lại.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-s1 rounded-xl p-4 w-full sm:w-[300px] mx-auto mt-4">
      <div className="h-40 sm:h-56 relative overflow-hidden">
        <div onClick={() => handleClickedDetailAution(auction.id)}>
          <img
            src={auction.gundam_snapshot?.image_url || "default-image.jpg"}
            alt={auction.gundam_snapshot?.name || "No Name"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 left-0 py-2 w-full">
          <div className="flex items-center justify-between">
            <Caption className={`${statusStyles[status]?.text} ${statusStyles[status]?.bg} px-3 py-1 text-sm`}>
              {status}
            </Caption>
            <Caption className="text-green-500 bg-green-100 px-3 py-1 text-sm">
              {participants.length || 0} Người tham gia
            </Caption>
          </div>
        </div>
      </div>

      <div className="details">

        {renderStatusInfo()}
        <Title className="uppercase text-sm sm:text-base">{auction.gundam_snapshot.name}</Title>
        <div className="text-xs text-gray-500 mt-1">
          {auction.gundam_snapshot.grade} - {auction.gundam_snapshot.scale}
        </div>

        

        <hr className="mt-3" />
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <RiAuctionFill size={30} className="text-green-500" />
            <div>
              <Caption className="text-green-500">Giá khởi điểm</Caption>
              <Title className="text-sm sm:text-base">
                {auction.starting_price.toLocaleString()} VNĐ
              </Title>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-gray-300"></div>
          <div className="flex items-center gap-3 sm:gap-5">
            <GiTakeMyMoney size={30} className="text-red-500" />
            <div>
              <Caption className="text-red-500">Mua ngay</Caption>
              <Title className="text-sm sm:text-base">
                {auction.buy_now_price.toLocaleString()} VNĐ
              </Title>
            </div>
          </div>
        </div>

        <hr className="mb-3" />
        <div className="flex items-center justify-between mt-3 gap-2">
          <button
            onClick={() => handleClickedDetailAution(auction.id)}
            className={`flex-1 text-sm px-3 py-2 rounded-md ${
              status === "ended" ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {status === "ended" ? "Xem kết quả" : "Xem chi tiết"}
          </button>

          {currentUser?.id === auction.seller_id ? (
            <button
              className="flex-1 text-sm px-3 py-2 rounded-md bg-gray-400 text-white cursor-not-allowed"
              disabled
            >
              Phiên của bạn
            </button>
          ) : (
            <button
              onClick={handleJoinAuction}
              disabled={hasParticipated}
              className={`flex-1 text-sm px-3 py-2 rounded-md ${
                hasParticipated ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'
              } text-white`}
            >
              {hasParticipated ? "Đã tham gia" : "Tham gia"}
            </button>
          )}
        </div>
      </div>

      <Modal
        title="Xác nhận tham gia"
        open={isModalOpen}
        onOk={confirmParticipation}
        onCancel={() => setIsModalOpen(false)}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ className: "bg-blue-500 hover:bg-blue-600" }}
      >
        <p>
          Số tiền cọc là <strong>{depositAmount.toLocaleString()} VNĐ</strong> (15% giá khởi điểm). <br />
          Bạn có chắc chắn muốn tham gia đấu giá?
        </p>
        {currentUser && (
          <p className="mt-2 text-sm">
            Tham gia với tư cách: <strong>{currentUser.full_name}</strong> ({currentUser.email})
          </p>
        )}
      </Modal>
    </div>
  );
};

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await GetListAuction();
        
        // Giữ nguyên toàn bộ dữ liệu trả về (bao gồm auction, participants, bids)
        const validAuctions = response.data.filter(item => 
          ["scheduled", "active", "ended","completed"].includes(item.auction?.status) &&
          item.auction?.gundam_snapshot &&
          item.auction?.start_time &&
          item.auction?.end_time
        );
        
        validAuctions.sort((a, b) => 
          new Date(b.auction.start_time) - new Date(a.auction.start_time)
        );
        
        setAuctions(validAuctions);
      } catch (error) {
        console.error("Error fetching auction data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen mt-14 flex justify-center items-center">
        <div>Loading auctions...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen mt-24">
      <div className="rounded-xl w-full mt-10">
        <h1 className="text-3xl font-bold">Sàn Đấu Giá GunDam</h1>
        <p className="text-gray-400">Tham gia đấu giá các Gundam phiên bản giới hạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctions.length > 0 ? (
              auctions.map((auctionData) => (
                <AuctionCard key={auctionData.auction.id} auctionData={auctionData} />
              ))
            ) : (
              <div>No auctions available</div>
            )}
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <Card className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sắp xếp theo</label>
              <Select defaultValue="newest" className="w-full">
                <Option value="newest">Mới nhất</Option>
                <Option value="price-low">Giá thấp đến cao</Option>
                <Option value="price-high">Giá cao đến thấp</Option>
                <Option value="ending-soon">Sắp kết thúc</Option>
              </Select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
              <Search placeholder="Nhập tên sản phẩm" enterButton />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Sản phẩm sắp kết thúc</h3>
            {auctions
              .filter(auctionData => new Date(auctionData.auction.end_time) > new Date())
              .sort((a, b) => new Date(a.auction.end_time) - new Date(b.auction.end_time))
              .slice(0, 3)
              .map((auctionData) => (
                <div key={auctionData.auction.id} className="mb-4">
                  <div className="text-md font-semibold">{auctionData.auction.gundam_snapshot.name}</div>
                  <div className="text-sm text-gray-500">
                    Giá khởi điểm: {auctionData.auction.starting_price.toLocaleString()} VNĐ
                  </div>
                  <div className="text-xs text-gray-400">
                    Kết thúc: {new Date(auctionData.auction.end_time).toLocaleString()}
                  </div>
                </div>
              ))}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AuctionList;