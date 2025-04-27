import { useState } from "react";
import { Tabs, Card } from "antd";

import ExchangeManageList from "./ExchangeManageList";
import ExchangeManageNegotiation from "./ExchangeManageNegotiation";

const { TabPane } = Tabs;


export default function ExchangeManage() {
    const [activeTab, setActiveTab] = useState("1");

    return (
        <div className="max-w-7xl mx-auto mt-36 px-4 py-6">
            <Card
                className="shadow-md"
                bodyStyle={{ padding: "12px 20px" }}
            >
                <Tabs
                    centered
                    activeKey={activeTab}
                    onChange={setActiveTab}
                    type="card"
                    size="large"
                    className="gundam-tabs"
                >
                    <TabPane tab="Cuộc trao đổi của bạn" key="1">
                        {/* List các Trao đổi Request */}
                        <ExchangeManageList />
                    </TabPane>

                    <TabPane tab="Thương lượng được đề xuất" key="2">
                        {/* List các Trao đổi đang Thương lượng */}
                        <ExchangeManageNegotiation />
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}