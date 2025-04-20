import { useState } from "react";
import { Input, Select, Tabs, Typography } from "antd";

import AuctionList from "./AuctionList";
import AuctionApproval from "./AuctionApproval";
import AuctionCriteria from "./AuctionCriteria";

const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const ModAuctions = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");

  const handleSearch = (value) => {
    setSearchTerm(value);
  };

  const handleStatusFilter = (value) => {
    setFilteredStatus(value);
  };

  return (
    <div style={{ padding: "24px", background: "#f9f9f9", minHeight: "100vh" }}>
      {/* Tiêu đề */}
      <Title level={2} style={{ marginBottom: 16 }}>⚖️ Quản lý Đấu Giá</Title>

      {/* Thanh tìm kiếm & bộ lọc */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
        <Search
          placeholder="🔍 Tìm kiếm theo tên người bán hoặc tên Gundam..."
          onSearch={handleSearch}
          enterButton
          style={{ width: 350 }}
        />

        <Select
          placeholder="📌 Lọc theo trạng thái đấu giá"
          allowClear
          onChange={handleStatusFilter}
          style={{ width: 200 }}
        >
          <Option value="Đang diễn ra">Đang diễn ra</Option>
          <Option value="Kết thúc">Kết thúc</Option>
          <Option value="Chưa bắt đầu">Chưa bắt đầu</Option>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="📢 Các cuộc đấu giá" key="1">
          <AuctionList searchTerm={searchTerm} filteredStatus={filteredStatus} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="🔎 Quản lý duyệt đấu giá" key="2">
          <AuctionApproval searchTerm={searchTerm} filteredStatus={filteredStatus} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="📜 Tiêu chí duyệt đấu giá" key="3">
          <AuctionCriteria />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ModAuctions;
