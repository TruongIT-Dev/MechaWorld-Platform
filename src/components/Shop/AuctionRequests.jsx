import { Table, Tag, Image } from "antd";
import { useEffect, useState } from "react";
import { TiEyeOutline } from "react-icons/ti";
const AuctionRequests = () => {
  const [requestData, setRequestData] = useState([]);

  useEffect(() => {
    // Giả lập API - Thay thế bằng fetch("/api/auction-requests")
    setRequestData([
      {
        key: "1",
        image: "https://via.placeholder.com/100",
        name: "BANDAI MG 1/100 Gundam 00V 00 Qant[T] Full Saver Painted Plastic Model Kit",
        duration: "2 ngày",
        startPrice: 45000,
        minBidStep: 4000,
        status: "Chờ duyệt",
      },
      {
        key: "2",
        image: "https://via.placeholder.com/100",
        name: "HG AGE 1/144 Baqto",
        duration: "3 ngày",
        startPrice: 70000,
        minBidStep: 6000,
        status: "Đã duyệt",
      },
    ]);
  }, []);

  const columns = [
    { title: "Ảnh ", dataIndex: "image", render: (text) => <Image width={100} src={text} /> },
    { title: "Tên Gundam", dataIndex: "name" },
    { title: "Thời Lượng Đấu Giá", dataIndex: "duration" },
    { title: "Giá Khởi Điểm", dataIndex: "startPrice", render: (text) => `${text.toLocaleString()} VNĐ` },
    { title: "Bước Giá Tối Thiểu", dataIndex: "minBidStep", render: (text) => `${text.toLocaleString()} VNĐ` },
    {
      title: "Trạng Thái Duyệt",
      dataIndex: "status",
      render: (text) => <Tag color={text === "Chờ duyệt" ? "orange" : "green"}>{text}</Tag>,
    },
    {
      title: "Thao tác",
      dataIndex: "actiton",
      render: () => { 

      }
    },
  ];

  return <Table columns={columns} dataSource={requestData} pagination={{ pageSize: 5 }} />;
};

export default AuctionRequests;
