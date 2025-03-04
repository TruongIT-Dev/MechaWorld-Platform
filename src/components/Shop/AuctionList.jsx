import { Table, Tag, Image } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";

const AuctionList = () => {
  const [auctionData, setAuctionData] = useState([]);

  useEffect(() => {
    // Giả lập API - Thay thế bằng fetch("/api/auctions")
    setAuctionData([
      {
        key: "1",
        image: "https://via.placeholder.com/100",
        name: "Gundam HG Strike Freedom Bandai",
        startTime: "2025-03-05T12:00:00Z",
        endTime: "2025-03-06T12:00:00Z",
        startPrice: 50000,
        minBidStep: 5000,
        currentPrice: 75000,
        status: "Đang diễn ra",
      },
      {
        key: "2",
        image: "https://via.placeholder.com/100",
        name: "Gundam HG GN-005 Virtue",
        startTime: "2025-03-07T14:00:00Z",
        endTime: "2025-03-08T14:00:00Z",
        startPrice: 60000,
        minBidStep: 7000,
        currentPrice: 95000,
        status: "Đã kết thúc",
      },
    ]);
  }, []);

  const columns = [
    { title: "Ảnh Chính", dataIndex: "image", render: (text) => <Image width={100} src={text} /> },
    { title: "Tên Gundam", dataIndex: "name" },
    { title: "Thời Gian Bắt Đầu", dataIndex: "startTime", render: (text) => moment(text).format("DD/MM/YYYY HH:mm") },
    { title: "Thời Gian Kết Thúc", dataIndex: "endTime", render: (text) => moment(text).format("DD/MM/YYYY HH:mm") },
    { title: "Giá Khởi Điểm", dataIndex: "startPrice", render: (text) => `${text.toLocaleString()} Đ` },
    { title: "Bước Giá Tối Thiểu", dataIndex: "minBidStep", render: (text) => `${text.toLocaleString()} Đ` },
    { title: "Giá Hiện Tại", dataIndex: "currentPrice", render: (text) => `${text.toLocaleString()} Đ` },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      render: (text) => <Tag color={text === "Đang diễn ra" ? "green" : "red"}>{text}</Tag>,
    },
  ];

  return <Table columns={columns} dataSource={auctionData} pagination={{ pageSize: 5 }} />;
};

export default AuctionList;
