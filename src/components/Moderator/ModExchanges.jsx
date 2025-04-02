import { Table, Input, Select, Tag, Typography, Card, Space, Avatar } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu giả lập
const exchangeData = [
  {
    key: "1",
    content: "Chào mọi người, mình đang tìm kiếm một mẫu Gundam đặc biệt...",
    sender: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/32" },
    postOwner: "Trần Thị B",
    priceDifference: 1000000,
    exchangeStatus: "Chờ xử lí",
    postStatus: "Đang được đăng",
  },
  {
    key: "2",
    content: "Cần trao đổi Gundam MG RX-78-2, ai quan tâm không?",
    sender: { name: "Lê Hoàng C", avatar: "https://i.pravatar.cc/32" },
    postOwner: "Nguyễn Văn A",
    priceDifference: 500000,
    exchangeStatus: "Đang giao hàng",
    postStatus: "Không được đăng",
  },
  {
    key: "3",
    content: "Mình có Gundam Unicorn Ver.Ka muốn đổi lấy MG Sazabi",
    sender: { name: "Phạm Minh D", avatar: "https://i.pravatar.cc/32" },
    postOwner: "Lê Hoàng C",
    priceDifference: 200000,
    exchangeStatus: "Hoàn tất",
    postStatus: "Đã xong",
  },
];

const ModExchanges = () => {
  const [filteredExchangeStatus, setFilteredExchangeStatus] = useState(null);
  const [filteredPostStatus, setFilteredPostStatus] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Lọc dữ liệu dựa trên tìm kiếm & bộ lọc
  const filteredData = exchangeData.filter((item) => {
    return (
      (filteredExchangeStatus ? item.exchangeStatus === filteredExchangeStatus : true) &&
      (filteredPostStatus ? item.postStatus === filteredPostStatus : true) &&
      (searchText
        ? item.sender.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.postOwner.toLowerCase().includes(searchText.toLowerCase()) ||
          item.content.toLowerCase().includes(searchText.toLowerCase())
        : true)
    );
  });

  // Hàm render số tiền với định dạng 1,000,000 đ
  const formatPrice = (amount) => amount.toLocaleString() + " đ";

  // Hàm render trạng thái (tag màu)
  const getStatusTag = (status, type) => {
    const exchangeStatusColors = {
      "Chờ xử lí": "orange",
      "Đang đóng gói": "blue",
      "Đang giao hàng": "purple",
      "Hoàn tất": "green",
      "Thất bại": "red",
      "Bị từ chối": "volcano",
    };

    const postStatusColors = {
      "Đang được đăng": "green",
      "Không được đăng": "red",
      "Đã xong": "blue",
    };

    const colorMap = type === "exchange" ? exchangeStatusColors : postStatusColors;
    return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
  };

  // Cấu trúc table
  const columns = [
    {
      title: "📜 Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: {
        showTitle: false,
      },
      render: (text) => (
        <span title={text}>
          {text.length > 50 ? `${text.substring(0, 50)}...` : text}
        </span>
      ),
    },
    {
      title: "📤 Người gửi yêu cầu",
      dataIndex: "sender",
      key: "sender",
      render: (sender) => (
        <Space>
          <Avatar src={sender.avatar} size={32} />
          {sender.name}
        </Space>
      ),
    },
    {
      title: "📌 Người đăng bài",
      dataIndex: "postOwner",
      key: "postOwner",
    },
    {
      title: "💰 Tiền chênh lệch",
      dataIndex: "priceDifference",
      key: "priceDifference",
      render: (amount) => <strong>{formatPrice(amount)}</strong>,
    },
    {
      title: "🔄 Trạng thái trao đổi",
      dataIndex: "exchangeStatus",
      key: "exchangeStatus",
      render: (status) => getStatusTag(status, "exchange"),
    },
    {
      title: "📢 Trạng thái bài post",
      dataIndex: "postStatus",
      key: "postStatus",
      render: (status) => getStatusTag(status, "post"),
    },
    {
      title: "ℹ Chi tiết",
      dataIndex: "details",
      key: "details",
      render: () => <InfoCircleOutlined style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }} />,
    },
  ];

  return (
    <div style={{ padding: "24px",  minHeight: "100vh" }}>
      <Title level={2}>🔄 Quản Lý Trao Đổi</Title>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input.Search
          placeholder="🔍 Tìm kiếm theo nội dung, người gửi hoặc người đăng bài"
          onSearch={(value) => setSearchText(value)}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Space>
          <Select
            placeholder="📌 Lọc theo trạng thái trao đổi"
            allowClear
            onChange={setFilteredExchangeStatus}
            style={{ width: 220 }}
          >
            <Option value="Chờ xử lí">⏳ Chờ xử lí</Option>
            <Option value="Đang đóng gói">📦 Đang đóng gói</Option>
            <Option value="Đang giao hàng">🚚 Đang giao hàng</Option>
            <Option value="Hoàn tất">✅ Hoàn tất</Option>
            <Option value="Thất bại">❌ Thất bại</Option>
            <Option value="Bị từ chối">🚫 Bị từ chối</Option>
          </Select>

          <Select
            placeholder="📢 Lọc theo trạng thái bài post"
            allowClear
            onChange={setFilteredPostStatus}
            style={{ width: 220 }}
          >
            <Option value="Đang được đăng">🟢 Đang được đăng</Option>
            <Option value="Không được đăng">🔴 Không được đăng</Option>
            <Option value="Đã xong">🔵 Đã xong</Option>
          </Select>
        </Space>
      </Space>

      {/* Bảng dữ liệu */}
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ModExchanges;
