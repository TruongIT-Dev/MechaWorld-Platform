import { Table, Input, Select, Tag, Typography, Card, Space } from "antd";
import { useState } from "react";

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu giả lập
const transactionData = [
  {
    key: "1",
    date: "2024-03-31",
    user: "Nguyễn Văn A",
    transactionType: "Nạp tiền",
    amount: 122000,
    status: "Thành công",
    note: "Nạp qua ví Momo",
  },
  {
    key: "2",
    date: "2024-03-30",
    user: "Trần Thị B",
    transactionType: "Mua hàng",
    amount: -100000,
    status: "Đang xử lý",
    note: "Mua Gundam RX-78-2",
  },
  {
    key: "3",
    date: "2024-03-29",
    user: "Lê Hoàng C",
    transactionType: "Rút tiền",
    amount: -50000,
    status: "Thất bại",
    note: "Chuyển khoản ngân hàng",
  },
];

const ModTransactions = () => {
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Lọc dữ liệu dựa trên search & trạng thái
  const filteredData = transactionData.filter((item) => {
    return (
      (filteredStatus ? item.status === filteredStatus : true) &&
      (searchText
        ? item.user.toLowerCase().includes(searchText.toLowerCase()) ||
          item.transactionType.toLowerCase().includes(searchText.toLowerCase())
        : true)
    );
  });

  // Hàm render số tiền với màu sắc
  const renderAmount = (amount) => {
    const formattedAmount = amount.toLocaleString() + " đ";
    return (
      <span style={{ color: amount > 0 ? "green" : "red", fontWeight: "bold" }}>
        {amount > 0 ? `+${formattedAmount}` : formattedAmount}
      </span>
    );
  };

  // Cấu trúc table
  const columns = [
    {
      title: "📅 Ngày giao dịch",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "👤 Tên Người Dùng",
      dataIndex: "user",
      key: "user",
    },
    {
      title: "🔄 Loại giao dịch",
      dataIndex: "transactionType",
      key: "transactionType",
    },
    {
      title: "💰 Số Tiền",
      dataIndex: "amount",
      key: "amount",
      render: renderAmount,
    },
    {
      title: "✅ Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          "Thành công": "green",
          "Đang xử lý": "orange",
          "Thất bại": "red",
        };
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
    {
      title: "📝 Ghi Chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  return (
    <div style={{ background: "#fff", padding: 24 }}>
      <Title level={3}>📊 Quản Lý Giao Dịch</Title>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input.Search
          placeholder="🔍 Tìm kiếm theo tên hoặc loại giao dịch"
          onSearch={(value) => setSearchText(value)}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Select
          placeholder="📌 Lọc theo trạng thái"
          allowClear
          onChange={setFilteredStatus}
          style={{ width: 200 }}
        >
          <Option value="Thành công">✅ Thành công</Option>
          <Option value="Đang xử lý">⏳ Đang xử lý</Option>
          <Option value="Thất bại">❌ Thất bại</Option>
        </Select>
      </Space>

      {/* Bảng dữ liệu */}
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default ModTransactions;
