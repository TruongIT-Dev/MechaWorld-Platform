import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RiAuctionFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, PrimaryButton, Title } from "../Design";
import { Input, Select, Card, Modal, message } from "antd";
import { GetListAuction, ParticipateInAuction } from "../../../apis/Auction/APIAuction";

const { Search } = Input;
const { Option } = Select;

const AuctionCard = ({ auction }) => {
  const [hasParticipated, setHasParticipated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);

  const getAuctionStatus = () => {
    const now = new Date();
    const startTime = new Date(auction.start_time);
    const endTime = new Date(auction.end_time);

    if (now < startTime) return auction.status;
    if (now >= startTime && now <= endTime) return auction.status;
    return auction.status;
  };

  const status = getAuctionStatus();
  const statusStyles = {
    active: { text: "text-green-500", bg: "bg-green-100" },
    ended: { text: "text-red-500", bg: "bg-red-100" },
    scheduled: { text: "text-blue-500", bg: "bg-blue-100" }
  };

  const handleClickedDetailAution = (id) => {
    window.location.assign(`/auction/${id}`);
  };

  const handleJoinAuction = () => {
    const deposit = Math.floor(auction.start_price * 0.15);
    setDepositAmount(deposit);
    setIsModalOpen(true);
    console.log("Modal opened");
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
    } else {
      message.error("Không thể tham gia đấu giá. Vui lòng thử lại!");
    }
  } finally {
    setIsModalOpen(false);
  }
};



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
              {auction.total_participants || 0} Người tham gia
            </Caption>
          </div>
        </div>
      </div>

      <div className="details mt-4">
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
            className="flex-1 text-sm px-3 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
          >
            {status === "Ended" ? "Xem kết quả" : "Đấu Giá"}
          </button>

          <button
            onClick={handleJoinAuction}
            disabled={hasParticipated}
            className={`flex-1 text-sm px-3 py-2 rounded-md ${hasParticipated ? 'bg-gray-400' : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            {hasParticipated ? "Đã tham gia" : "Tham gia"}
          </button>
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
          Số tiền cọc là <strong>{auction.starting_price.toLocaleString()} VNĐ</strong> (15% giá khởi điểm). <br />
          Bạn có chắc chắn muốn tham gia đấu giá?
        </p>
      </Modal>
    </div>
  );
};

const AuctionList = () => {
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        const response = await GetListAuction();
        console.log("Dữ liệu từ API:", response.data);

        const validAuctions = response.data.filter(auction => 
          ["scheduled", "active", "ended"].includes(auction.status) &&
          auction.gundam_snapshot &&
          auction.start_time &&
          auction.end_time
        );
        console.log("Dữ liệu hợp lệ sau khi lọc:", validAuctions);

        validAuctions.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
        setAuctionData(validAuctions);
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
            {auctionData.length > 0 ? (
              auctionData.map((auction) => <AuctionCard key={auction.id} auction={auction} />)
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
            {auctionData
              .filter(auction => new Date(auction.end_time) > new Date())
              .sort((a, b) => new Date(a.end_time) - new Date(b.end_time))
              .slice(0, 3)
              .map((auction) => (
                <div key={auction.id} className="mb-4">
                  <div className="text-md font-semibold">{auction.gundam_snapshot.name}</div>
                  <div className="text-sm text-gray-500">
                    Giá khởi điểm: {auction.current_price.toLocaleString()} VNĐ
                  </div>
                  <div className="text-xs text-gray-400">
                    Kết thúc: {new Date(auction.end_time).toLocaleString()}
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