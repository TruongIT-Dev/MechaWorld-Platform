import { Table, Input, Select, Tag, Typography, Card, Space, Avatar, Button, Image } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;
const { Option } = Select;

// Dữ liệu giả lập
const gundamData = [
  {
    key: "1",
    image: "https://via.placeholder.com/50", // Ảnh Gundam
    name: "RX-78-2 Gundam",
    seller: { name: "Nguyễn Văn A", avatar: "https://i.pravatar.cc/32" },
    grade: "MG", // Master Grade
    series: "Mobile Suit Gundam",
    status: "Còn hàng",
  },
  {
    key: "2",
    image: "https://via.placeholder.com/50",
    name: "Gundam Barbatos",
    seller: { name: "Trần Thị B", avatar: "https://i.pravatar.cc/32" },
    grade: "HG", // High Grade
    series: "Iron-Blooded Orphans",
    status: "Hết hàng",
  },
  {
    key: "3",
    image: "https://via.placeholder.com/50",
    name: "Gundam Exia",
    seller: { name: "Lê Hoàng C", avatar: "https://i.pravatar.cc/32" },
    grade: "RG", // Real Grade
    series: "Mobile Suit Gundam 00",
    status: "Sắp có hàng",
  },
];

// Trích xuất các giá trị duy nhất cho bộ lọc
const uniqueGrades = [...new Set(gundamData.map((item) => item.grade))];
const uniqueSeries = [...new Set(gundamData.map((item) => item.series))];
const uniqueStatuses = [...new Set(gundamData.map((item) => item.status))];

const ModGundams = () => {
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredGrade, setFilteredGrade] = useState(null);
  const [filteredSeries, setFilteredSeries] = useState(null);
  const [searchText, setSearchText] = useState("");

  // Lọc dữ liệu dựa trên tìm kiếm & bộ lọc
  const filteredData = gundamData.filter((item) => {
    return (
      (filteredStatus ? item.status === filteredStatus : true) &&
      (filteredGrade ? item.grade === filteredGrade : true) &&
      (filteredSeries ? item.series === filteredSeries : true) &&
      (searchText
        ? item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.seller.name.toLowerCase().includes(searchText.toLowerCase())
        : true)
    );
  });

  // Hàm render trạng thái (tag màu)
  const getStatusTag = (status) => {
    const statusColors = {
      "Còn hàng": "green",
      "Hết hàng": "red",
      "Sắp có hàng": "orange",
    };
    return <Tag color={statusColors[status] || "default"}>{status}</Tag>;
  };

  // Cấu trúc table
  const columns = [
    {
      title: " Ảnh Chính",
      dataIndex: "image",
      key: "image",
      render: (image) => <Image src={image} width={50} height={50} />,
    },
    {
      title: " Tên Gundam",
      dataIndex: "name",
      key: "name",
    },
    {
      title: " Người Bán",
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
      title: " Grade",
      dataIndex: "grade",
      key: "grade",
    },
    {
      title: " Series",
      dataIndex: "series",
      key: "series",
    },
    {
      title: " Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getStatusTag(status),
    },
    {
      title: " Chỉnh Sửa",
      dataIndex: "edit",
      key: "edit",
      render: () => (
        <Button type="primary" icon={<EditOutlined />} size="small">
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <Card style={{ background: "#fff", padding: 24 }}>
      <Title level={3}>Quản Lý Gundam</Title>

      {/* Thanh tìm kiếm và bộ lọc */}
      <Space style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Input.Search
          placeholder="🔍 Tìm kiếm theo tên Gundam hoặc người bán"
          onSearch={(value) => setSearchText(value)}
          enterButton
          allowClear
          style={{ width: 300 }}
        />
        <Space>
          <Select
            placeholder="Trạng Thái"
            allowClear
            onChange={setFilteredStatus}
            style={{ width: 150 }}
          >
            {uniqueStatuses.map((status) => (
              <Option key={status} value={status}>
                {status}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Grade"
            allowClear
            onChange={setFilteredGrade}
            style={{ width: 150 }}
          >
            {uniqueGrades.map((grade) => (
              <Option key={grade} value={grade}>
                {grade}
              </Option>
            ))}
          </Select>
          <Select
            placeholder="Series"
            allowClear
            onChange={setFilteredSeries}
            style={{ width: 200 }}
          >
            {uniqueSeries.map((series) => (
              <Option key={series} value={series}>
                {series}
              </Option>
            ))}
          </Select>
        </Space>
      </Space>

      {/* Bảng dữ liệu */}
      <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} />
    </Card>
  );
};

export default ModGundams;
