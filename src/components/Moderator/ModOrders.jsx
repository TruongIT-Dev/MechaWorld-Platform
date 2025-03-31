import { Table, Input, Select, Tag, Typography, Card, Space, Avatar } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu giả lập
const orderData = [
  {
    key: "1",
    trackingCode: "VN123456789",
    buyer: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/32" },
    seller: { name: "Trần Thị B", avatar: "https://i.pravatar.cc/32" },
    totalAmount: 1500000,
    paymentMethod: "Chuyển khoản",
    status: "Chờ xử lí",
  },
  {
    key: "2",
    trackingCode: "VN987654321",
    buyer: { name: "Lê Hoàng C", avatar: "https://i.pravatar.cc/32" },
    seller: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/32" },
    totalAmount: 2800000,
    paymentMethod: "Ví điện tử",
    status: "Đang giao hàng",
  },
  {
    key: "3",
    trackingCode: null, // Không có mã vận đơn
    buyer: { name: "Phạm Minh D", avatar: "https://i.pravatar.cc/32" },
    seller: { name: "Lê Hoàng C", avatar: "https://i.pravatar.cc/32" },
    totalAmount: 500000,
    paymentMethod: "Thanh toán khi nhận hàng",
    status: "Thất bại",
  },
];

const ModOrders = () => {
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Lọc dữ liệu dựa trên tìm kiếm & bộ lọc
  const filteredData = orderData.filter((item) => {
    return (
      (filteredStatus ? item.status === filteredStatus : true) &&
      (searchText
        ? item.buyer.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.seller.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.trackingCode && item.trackingCode.includes(searchText))
        : true)
    );
  });

  // Hàm render số tiền với định dạng 1,000,000 đ
  const formatPrice = (amount) => amount.toLocaleString() + " đ";

  // Hàm render trạng thái (tag màu)
  const getStatusTag = (status) => {
    const statusColors = {
      "Chờ xử lí": "orange",
      "Đang đóng gói": "blue",
      "Đang giao hàng": "purple",
      "Đã giao hàng thành công": "green",
      "Hoàn tất": "cyan",
      "Thất bại": "red",
      "Bị hủy": "volcano",
    };
    return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
  };

  // Cấu trúc table
  const columns = [
    {
      title: "📦 Mã Vận Đơn",
      dataIndex: "trackingCode",
      key: "trackingCode",
      render: (code) => (code ? code : <Tag color="red">Chưa có</Tag>),
    },
    {
      title: "👤 Người Đặt",
      dataIndex: "buyer",
      key: "buyer",
      render: (buyer) => (
        <Space>
          <Avatar src={buyer.avatar} size={32} />
          {buyer.name}
        </Space>
      ),
    },
    {
      title: "🏪 Người Bán",
      dataIndex: "seller",
      key: "seller",
      render: (seller) => (
        <Space>
          <Avatar src={seller.avatar} size={32} />
          {seller.name}
        </Space>
      ),
    },
    {
      title: "💰 Tổng Tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => <strong>{formatPrice(amount)}</strong>,
    },
    {
      title: "💳 Phương Thức Thanh Toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
    },
    {
      title: "🔄 Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: "ℹ Chi tiết",
      dataIndex: "details",
      key: "details",
      render: () => <InfoCircleOutlined style={{ fontSize: 18, color: "#1890ff", cursor: "pointer" }} />,
    },
  ];

  return (
    <Card style={{ background: "#fff", padding: 24 }}>
      <Title level={3}>📦 Quản Lý Đơn Hàng</Title>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input.Search
          placeholder="🔍 Tìm kiếm theo mã vận đơn, người đặt, người bán"
          onSearch={(value) => setSearchText(value)}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder="🔄 Lọc theo trạng thái đơn hàng"
          allowClear
          onChange={setFilteredStatus}
          style={{ width: 220 }}
        >
          <Option value="Chờ xử lí">⏳ Chờ xử lí</Option>
          <Option value="Đang đóng gói">📦 Đang đóng gói</Option>
          <Option value="Đang giao hàng">🚚 Đang giao hàng</Option>
          <Option value="Đã giao hàng thành công">✅ Đã giao hàng thành công</Option>
          <Option value="Hoàn tất">🎉 Hoàn tất</Option>
          <Option value="Thất bại">❌ Thất bại</Option>
          <Option value="Bị hủy">🚫 Bị hủy</Option>
        </Select>
      </Space>

      {/* Bảng dữ liệu */}
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
    </Card>
  );
};

export default ModOrders;
