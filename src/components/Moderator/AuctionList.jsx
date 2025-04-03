import { Table, Avatar, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const auctionData = [
  {
    key: "1",
    seller: { name: "Nguyễn Văn A", avatar: "https://via.placeholder.com/32" },
    gundamName: "Gundam RX-78",
    status: "Đang diễn ra",
    startingPrice: 1000000,
    stepPrice: 50000,
    currentPrice: 1500000,
  },
  {
    key: "2",
    seller: { name: "Trần Thị B", avatar: "https://via.placeholder.com/32" },
    gundamName: "Gundam Wing",
    status: "Kết thúc",
    startingPrice: 2000000,
    stepPrice: 100000,
    currentPrice: 3500000,
  },
];

const formatCurrency = (value) => value.toLocaleString("vi-VN") + " đ";

const AuctionList = ({ searchTerm, filteredStatus }) => {
  const filteredData = auctionData.filter(
    (item) =>
      (item.seller.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gundamName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filteredStatus ? item.status === filteredStatus : true)
  );

  const columns = [
    {
      title: "Người bán",
      dataIndex: "seller",
      key: "seller",
      render: (seller) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Avatar src={seller.avatar} size={32} />
          <span>{seller.name}</span>
        </div>
      ),
    },
    { title: "Tên Gundam", dataIndex: "gundamName", key: "gundamName" },
    { title: "Trạng thái", dataIndex: "status", key: "status" },
    {
      title: "Giá khởi điểm",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: formatCurrency,
    },
    {
      title: "Bước giá",
      dataIndex: "stepPrice",
      key: "stepPrice",
      render: formatCurrency,
    },
    {
      title: "Giá hiện tại",
      dataIndex: "currentPrice",
      key: "currentPrice",
      render: formatCurrency,
    },
    {
      title: "Chi tiết",
      key: "details",
      render: () => (
        <Tooltip title="Xem chi tiết">
          <Button icon={<InfoCircleOutlined />} />
        </Tooltip>
      ),
    },
  ];

  return <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />;
};

export default AuctionList;
