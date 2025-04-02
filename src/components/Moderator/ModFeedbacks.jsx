import { useState } from "react";
import { Table, Input, Select, Button, Dropdown, Menu, Avatar, Space, Typography } from "antd";
import { MoreOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

// Dữ liệu giả lập danh sách khiếu nại
const feedbackData = [
  {
    key: "1",
    customerName: "Nguyễn Văn A",
    reason: "Sản phẩm lỗi",
    product: "Mô hình Gundam RX-78",
    status: "Chưa xử lý",
  },
  {
    key: "2",
    customerName: "Trần Thị B",
    reason: "Hàng không đúng mô tả",
    product: "Mô hình Gundam Wing",
    status: "Đã phản hồi",
  },
  {
    key: "3",
    customerName: "Lê Văn C",
    reason: "Sản phẩm bị hỏng",
    product: "Mô hình Zaku II",
    status: "Đã giải quyết",
  },
];

const statusColors = {
  "Chưa xử lý": "#ffccc7",
  "Đã phản hồi": "#ffe58f",
  "Đã giải quyết": "#d9f7be",
};

const ModFeedbacks = () => {
  const [filteredStatus, setFilteredStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc danh sách khiếu nại theo từ khóa tìm kiếm & trạng thái
  const filteredFeedbacks = feedbackData.filter(
    (item) =>
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filteredStatus ? item.status === filteredStatus : true)
  );

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Xử lý lọc theo trạng thái
  const handleStatusFilter = (value) => {
    setFilteredStatus(value);
  };

  // Menu hành động (Xem chi tiết / Phản hồi)
  const renderActions = () => (
    <Menu>
      <Menu.Item key="view">👁️ Xem chi tiết</Menu.Item>
      <Menu.Item key="reply">✍️ Phản hồi</Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: "Tên khách hàng",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Lý do",
      dataIndex: "reason",
      key: "reason",
    },
    {
      title: "Sản phẩm khiếu nại",
      dataIndex: "product",
      key: "product",
      render: (product) => (
        <Space>
          <Avatar size={40} icon={<ExclamationCircleOutlined />} />
          <span>{product}</span>
        </Space>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <span
          style={{
            backgroundColor: statusColors[status],
            padding: "4px 8px",
            borderRadius: 4,
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={renderActions(record)} trigger={["click"]}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
      width: 80,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f9f9f9", minHeight: "100vh" }}>
      <Title level={2} style={{ marginBottom: 16 }}>
        ⚠️ Quản lý Khiếu Nại
      </Title>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Search
          placeholder="🔍 Tìm kiếm khách hàng..."
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />

        <Select
          placeholder="📌 Lọc theo trạng thái"
          allowClear
          onChange={handleStatusFilter}
          style={{ width: 200 }}
        >
          {/* Tự động lấy danh sách trạng thái từ dữ liệu */}
          {[...new Set(feedbackData.map((item) => item.status))].map((status) => (
            <Option key={status} value={status}>
              {status}
            </Option>
          ))}
        </Select>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={filteredFeedbacks}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ModFeedbacks;
