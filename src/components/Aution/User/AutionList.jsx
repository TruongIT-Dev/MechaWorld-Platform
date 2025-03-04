import React from "react";
import { Card, Button, Badge } from "antd";
import { HeartOutlined } from "@ant-design/icons";
import { RiAuctionFill } from "react-icons/ri";
import { GiTakeMyMoney } from "react-icons/gi";
import { Caption, PrimaryButton, ProfileCard, Title } from "../Design";
import { NavLink } from "react-router-dom";
import { MdOutlineFavorite } from "react-icons/md";

const auctionData = [
  {
    id: 1,
    title: "Frida Kahlo Jungle Cat love’s Ever",
    artist: "Frida Kahlo",
    currentBid: "500000 VNĐ",
    days: 334,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png", // Replace with actual image
    price: 1000000,
    totalBids: 10,
    isSoldout: false,
  },
  {
    id: 2,
    title: "A masterpiece that invites you to dream",
    artist: "Frida Kahlo",
    currentBid: "500000 VNĐ",
    days: 333,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
    price: 1000200,
    totalBids: 5,
    isSoldout: true,
  },
  {
    id: 3,
    title: "More than just art—it’s a feeling",
    artist: "Pablo Picasso",
    currentBid: "500000 VNĐ",
    days: 362,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
    price: 1500000,
    totalBids: 8,
    isSoldout: false,
  },
  {
    id: 4,
    title: "The Last Light Echoes of My Youth",
    artist: "Pablo Picasso",
    currentBid: "500000 VNĐ",
    days: 333,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
    price: 800000,
    totalBids: 3,
    isSoldout: false,
  },
  {
    id: 5,
    title: "Frida Kahlo Jungle Cat love’s Ever",
    artist: "Frida Kahlo",
    currentBid: "500000 VNĐ",
    days: 334,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png", // Replace with actual image
    price: 1000000,
    totalBids: 10,
    isSoldout: false,
  },
  {
    id: 6,
    title: "A masterpiece that invites you to dream",
    artist: "Frida Kahlo",
    currentBid: "500000 VNĐ",
    days: 333,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
    price: 1200000,
    totalBids: 5,
    isSoldout: true,
  },
  {
    id: 7,
    title: "More than just art—it’s a feeling",
    artist: "Pablo Picasso",
    currentBid: "500000 VNĐ",
    days: 362,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
    price: 1500000,
    totalBids: 8,
    isSoldout: false,
  },
  {
    id:8,
    title: "The Last Light Echoes of My Youth",
    artist: "Pablo Picasso",
    currentBid: "500000 VNĐ",
    days: 333,
    img: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
    price: 800000,
    totalBids: 3,
    isSoldout: false,
  },
];

const AuctionCard = ({ auction }) => {
  return (
    <div className="bg-white shadow-s1 rounded-xl p-3 w-full sm:w-[300px] mx-auto">
      <div className="h-40 sm:h-56 relative overflow-hidden">
        <NavLink to={`\detail`}>
          <img
            src={auction?.img}
            alt={auction?.img}
            className="w-full h-full object-cover rounded-xl hover:scale-105 hover:cursor-pointer transition-transform duration-300 ease-in-out"
          />
        </NavLink>
        <ProfileCard className="shadow-s1 absolute right-3 bottom-3">
          <RiAuctionFill size={22} className="text-green" />
        </ProfileCard>

        <div className="absolute top-0 left-0 p-2 w-full">
          <div className="flex items-center justify-between">
            {auction?.isSoldout ? (
              <Caption className="text-red-500 bg-red-100 text-red-500 px-3 py-1 text-sm rounded-full">Ending</Caption>
            ) : (
              <Caption className="text-green bg-green-100 text-green-500 px-3 py-1 text-sm rounded-full">Living</Caption>
            )}
            <Caption className="text-green bg-green_100 px-3 py-1 text-sm rounded-full">{auction?.totalBids} Bids</Caption>
          </div>
        </div>
      </div>
      <div className="details mt-4">
        <Title className="uppercase text-sm sm:text-base">{auction.title}</Title>
        <hr className="mt-3" />
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center justify-between gap-3 sm:gap-5">
            <div>
              <RiAuctionFill size={30} className="text-green" />
            </div>
            <div>
              <Caption className="text-green">Giá Sàn</Caption>
              <Title className="text-sm sm:text-base">{auction?.currentBid}</Title>
            </div>
          </div>
          <div className="w-[1px] h-10 bg-gray-300"></div>
          <div className="flex items-center justify-between gap-3 sm:gap-5">
            <div>
              <GiTakeMyMoney size={30} className="text-red-500" />
            </div>
            <div>
              <Caption className="text-red-500">Mua ngay</Caption>
              <Title className="text-sm sm:text-base">{auction?.price} VNĐ</Title>
            </div>
          </div>
        </div>
        <hr className="mb-3" />

        <div className="flex items-center justify-between mt-3">
        <NavLink to={`\detail`}>
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
  return (
    <div className="container mt-28 text-black p-4 min-h-screen">
      <h1 className="text-3xl font-bold">Sàn Đấu Giá GunDam</h1>
      <p className="text-gray-400 mb-6">Tham gia đấu giá các Gundam phiên bản giới hạn .</p>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {auctionData.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default AuctionList;