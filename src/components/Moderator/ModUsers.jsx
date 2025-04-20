import { useState } from "react";
import { Table, Input, Select, Button, Dropdown, Avatar, Typography } from "antd";
import { MoreOutlined, UserOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const userData = [
  {
    key: "1",
    avatar: "https://i.pravatar.cc/50",
    name: "Nguyễn Văn A",
    role: "Member",
  },
  {
    key: "2",
    avatar: "https://i.pravatar.cc/51",
    name: "Trần Thị B",
    role: "Seller",
  },
  {
    key: "3",
    avatar: "https://i.pravatar.cc/52",
    name: "Lê Văn C",
    role: "Moderator",
  },
];

const ModUsers = () => {
  const [filteredRole, setFilteredRole] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc người dùng theo từ khóa tìm kiếm & vai trò
  const filteredUsers = userData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filteredRole ? user.role === filteredRole : true)
  );

  // Xử lý tìm kiếm
  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  // Xử lý lọc vai trò
  const handleRoleFilter = (value) => {
    setFilteredRole(value);
  };



  const columns = [
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Avatar src={avatar} size={50} icon={<UserOutlined />} />,
      width: 100,
    },
    {
      title: "Tên người dùng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <span
          style={{
            backgroundColor: role === "Member" ? "#f0f0f0" :
                             role === "Seller" ? "#e6f7ff" :
                             role === "Moderator" ? "#fffbe6" : "#f9f0ff",
            padding: "4px 8px",
            borderRadius: 4,
          }}
        >
          {role}
        </span>
      ),
    },
    {
      title: "Thiết lập",
      key: "actions",
      render: () => (
        <Dropdown menu={{ items: [
          { key: "view", label: "👁️ Xem chi tiết" },
          { key: "ban", label: "🚫 Ban người dùng", danger: true },
        ] }} trigger={["click"]}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
      width: 120,
    },
  ];

  return (
    <div style={{ padding: "24px", background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Tiêu đề */}
      <Title level={2} style={{ marginBottom: 16 }}>
        🛠️ Quản lý Người Dùng
      </Title>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Search
          placeholder="🔍 Tìm kiếm người dùng..."
          onSearch={handleSearch}
          enterButton
          style={{ width: 300 }}
        />

        <Select
          placeholder="📌 Lọc theo vai trò"
          allowClear
          onChange={handleRoleFilter}
          style={{ width: 200 }}
        >
          <Option value="Member">Member</Option>
          <Option value="Seller">Seller</Option>
          <Option value="Moderator">Moderator</Option>
        </Select>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        columns={columns}
        dataSource={filteredUsers}
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
};

export default ModUsers;
