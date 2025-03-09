import { useState } from "react";
import { Tabs } from "antd";
import AuctionList from "./AuctionList";
import AuctionRequests from "./AuctionRequests";

const { TabPane } = Tabs;

const ShopAuctionManagement = () => {
  const [activeTab, setActiveTab] = useState("auctions");

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-4">Quản Lý Đấu Giá</h2>
      <div className="max-w-7xl mx-auto ">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="mb-4 "
          tabBarStyle={{ marginBottom: 0 }} 
        >
          <TabPane  tab={<span className="text-lg font-medium">📢 Quản lý đấu giá</span>} key="auctions" >
            <div className="w-full">
              <AuctionList />
            </div>
          </TabPane>
          <TabPane tab={<span className="text-lg font-medium">📝 Quản lý yêu cầu đấu giá</span>} key="requests">
            <div className="w-full">
              <AuctionRequests />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default ShopAuctionManagement;
