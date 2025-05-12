import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { RiAuctionFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { MdOutlineFavorite } from "react-icons/md";
import { Caption, PrimaryButton, Title } from "../Design";
import { Input, Select, Card } from "antd";
import { GetListAuctionRequestsForModerator } from "../../../apis/Moderator/APIModerator"; // đường dẫn đúng theo cấu trúc dự án của bạn

const { Search } = Input;
const { Option } = Select;

const AuctionCard = ({ auction }) => {
  return (
    <div className="bg-white shadow-s1 rounded-xl p-4 w-full sm:w-[300px] mx-auto mt-4">
      <div className="h-40 sm:h-56 relative overflow-hidden">
        <NavLink to={`/auction/${auction.id}`}>
          <img
            src={auction?.img}
            alt={auction?.title}
            className="w-full h-full object-cover rounded-xl hover:scale-105 hover:cursor-pointer transition-transform duration-300 ease-in-out"
          />
        </NavLink>
        <div className="absolute top-0 left-0 p-2 w-full">
          <div className="flex items-center justify-between">
            {auction?.isSoldout ? (
              <Caption className="text-red-500 bg-red-100 px-3 py-1 text-sm rounded-full">Ending</Caption>
            ) : (
              <Caption className="text-green-500 bg-green-100 px-3 py-1 text-sm rounded-full">Living</Caption>
            )}
            <Caption className="text-green-500 bg-green-100 px-3 py-1 text-sm rounded-full">{auction?.totalBids} Bids</Caption>
          </div>
        </div>
      </div>
      <div className="details mt-4">
        <Title className="uppercase text-sm sm:text-base">{auction.title}</Title>
        <hr className="mt-3" />
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3 sm:gap-5">
            <RiAuctionFill size={30} className="text-green-500" />
            <div>
              <Caption className="text-green-500">Giá Sàn</Caption>
              <Title className="text-sm sm:text-base">{auction?.currentBid}</Title>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-gray-300"></div>
          <div className="flex items-center gap-3 sm:gap-5">
            <GiTakeMyMoney size={30} className="text-red-500" />
            <div>
              <Caption className="text-red-500">Mua ngay</Caption>
              <Title className="text-sm sm:text-base">{auction?.price} VNĐ</Title>
            </div>
          </div>
        </div>
        <hr className="mb-3" />
        <div className="flex items-center justify-between mt-3">
          <NavLink to={`/auction/${auction.id}`}>
            <PrimaryButton className="rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600">
              Đấu Giá
            </PrimaryButton>
          </NavLink>
          <PrimaryButton className="rounded-lg px-4 py-3 bg-red-500 text-white hover:bg-red-600">
            <MdOutlineFavorite size={20} className="text-white" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

const AuctionList = () => {
  const [auctionData, setAuctionData] = useState([]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await GetListAuctionRequestsForModerator();
        const approvedAuctions = response.data.filter(item => item.status === "approved");
        
        console.log("Approved Auctions:", approvedAuctions);
        console.log("All Auctions:", response.data);

        const formattedData = approvedAuctions.map(item => ({
          id: item.id,
          title: item.gundam_snapshot.name,
          currentBid: `${item.starting_price.toLocaleString()} VNĐ`,
          img: item.gundam_snapshot.image_url,
          price: item.buy_now_price.toLocaleString(),
          totalBids: 0, 
          isSoldout: new Date(item.end_time) < new Date(),
        }));

        setAuctionData(formattedData);
      } catch (error) {
        console.error("Error fetching auction data:", error);
      }
    };

    fetchAuctions();
  }, []);

  return (
    <div className="container mx-auto p-4 min-h-screen mt-14">
      <div className="rounded-xl w-full mx-8 mt-10">
        <h1 className="text-3xl font-bold">Sàn Đấu Giá GunDam</h1>
        <p className="text-gray-400">Tham gia đấu giá các Gundam phiên bản giới hạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {auctionData.map((auction) => (
              <AuctionCard key={auction.id} auction={auction} />
            ))}
          </div>
        </div>

        <div className="col-span-1 mt-4">
          <Card className="mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Sắp xếp theo</label>
              <Select defaultValue="price" className="w-full">
                <Option value="price">Giá tiền</Option>
                <Option value="date">Ngày đăng</Option>
                <Option value="popularity">Độ phổ biến</Option>
              </Select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Tìm kiếm</label>
              <Search placeholder="Nhập tên sản phẩm" enterButton />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold mb-4">Sản phẩm mới nhất</h3>
            {auctionData.slice(0, 3).map((auction) => (
              <div key={auction.id} className="mb-4">
                <div className="text-md font-semibold">{auction.title}</div>
                <div className="text-sm text-gray-500">
                  {auction.currentBid ? `Giá hiện tại: ${auction.currentBid}` : `Giá khởi điểm: ${auction.price} VNĐ`}
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
