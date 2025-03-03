import React from "react";
import { Card, Button, Badge } from "antd";
import { HeartOutlined } from "@ant-design/icons";

const auctionData = [
  {
    id: 1,
    title: "Frida Kahlo Jungle Cat love’s Ever",
    artist: "Frida Kahlo",
    currentBid: "$500.00",
    days: 334,
    img: "https://via.placeholder.com/300", // Replace with actual image
  },
  {
    id: 2,
    title: "A masterpiece that invites you to dream",
    artist: "Frida Kahlo",
    currentBid: "$500.00",
    days: 333,
    img: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "More than just art—it’s a feeling",
    artist: "Pablo Picasso",
    currentBid: "$600.00",
    days: 362,
    img: "https://via.placeholder.com/300",
  },
  {
    id: 4,
    title: "The Last Light Echoes of My Youth",
    artist: "Pablo Picasso",
    currentBid: "$294.00",
    days: 333,
    img: "https://via.placeholder.com/300",
  },
];

const AuctionCard = ({ auction }) => {
  return (
    <Card
      hoverable
      className="bg-black text-white relative w-[300px] rounded-lg overflow-hidden"
      cover={<img alt={auction.title} src={auction.img} className="h-[300px] object-cover" />}
    >
      <Badge.Ribbon text="Live" color="red" className="absolute top-2 left-2" />
      <div className="absolute top-2 right-2 text-white">
        <HeartOutlined className="text-xl cursor-pointer" />
      </div>
      <div className="p-4">
        <p className="text-sm font-light">{auction.days} Days</p>
        <h3 className="text-lg font-semibold">{auction.title}</h3>
        <p className="text-sm text-gray-400">Artist: <span className="text-white font-bold">{auction.artist}</span></p>
        <p className="text-sm text-gray-400">Current bid: <span className="text-white font-bold">{auction.currentBid}</span></p>
        <Button type="primary" className="mt-4 w-full bg-blue-500 border-none">Bidding Start</Button>
      </div>
    </Card>
  );
};

const AuctionList = () => {
  return (
    <div className="container mt-40 text-white p-4 min-h-screen">
      <h1 className="text-3xl font-bold">Streaming Auctions</h1>
      <p className="text-gray-400 mb-6">Join us for an exhilarating live auction experience where art meets excitement.</p>
      <div className="flex gap-6 overflow-x-auto">
        {auctionData.map((auction) => (
          <AuctionCard key={auction.id} auction={auction} />
        ))}
      </div>
    </div>
  );
};

export default AuctionList;
