import { useState } from "react";
import { Tabs } from "antd";
import AuctionList from "./AuctionList";
import AuctionRequests from "./AuctionRequests";

const { TabPane } = Tabs;

const ShopAuctionManagement = () => {
  const [activeTab, setActiveTab] = useState("auctions");

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Quản Lý Đấu Giá</h2>
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="📢 Quản lý đấu giá" key="auctions">
          <AuctionList />
        </TabPane>
        <TabPane tab="📝 Quản lý yêu cầu đấu giá" key="requests">
          <AuctionRequests />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ShopAuctionManagement;
