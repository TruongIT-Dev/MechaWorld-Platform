import { Table, Avatar, Button, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const approvalData = [
  {
    key: "1",
    seller: { name: "Nguyễn Văn A", avatar: "https://via.placeholder.com/32" },
    gundamName: "Gundam RX-78",
    status: "Chờ duyệt",
    startingPrice: 1000000,
    stepPrice: 50000,
    deposit: 500000,
    duration: 1,
  },
];

const formatCurrency = (value) => value.toLocaleString("vi-VN") + " đ";

const AuctionApproval = () => {
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
    { title: "Bước giá", dataIndex: "stepPrice", key: "stepPrice", render: formatCurrency },
    { title: "Mức cọc", dataIndex: "deposit", key: "deposit", render: formatCurrency },
    { title: "Thời lượng đấu giá", dataIndex: "duration", key: "duration", render: (d) => `${d} ngày` },
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

  return <Table columns={columns} dataSource={approvalData} pagination={{ pageSize: 5 }} />;
};

export default AuctionApproval;
