import React, { useState } from "react";
import { Tabs, Button, Table, Tag, Avatar, Space, Badge, Typography, Card, Dropdown } from "antd";
import {
    UserOutlined,
    FilterOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    DownOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { TabPane } = Tabs;
const { Title } = Typography;

// Mock data with more entries
const generateData = (count) => {
    const statuses = [
        { text: "Đang chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
        { text: "Đã xác nhận", color: "blue", icon: <SyncOutlined spin /> },
        { text: "Thành công", color: "green", icon: <CheckCircleOutlined /> },
        { text: "Bị từ chối", color: "red", icon: <CloseCircleOutlined /> }
    ];

    const users = ["Minh", "Toàn", "Nhật", "Hùng", "Khoa", "Quân", "Dũng"];
    const gundamModels = [
        { title: "RX-78-2 Gundam", subtitle: "Mobile Suit Gundam" },
        { title: "Zaku II", subtitle: "Mobile Suit Gundam" },
        { title: "Gundam Exia", subtitle: "Gundam 00" },
        { title: "Strike Freedom Gundam", subtitle: "Gundam SEED Destiny" },
        { title: "Unicorn Gundam", subtitle: "Gundam Unicorn" },
        { title: "Wing Gundam Zero", subtitle: "Gundam Wing" },
        { title: "Gundam Barbatos", subtitle: "Gundam Iron-Blooded Orphans" }
    ];

    const times = [
        "Hôm nay lúc 02:51",
        "Hôm qua lúc 15:20",
        "15/04/2025 lúc 09:45",
        "12/04/2025 lúc 19:30",
        "05/04/2025 lúc 14:15",
        "01/04/2025 lúc 10:10"
    ];

    return Array.from({ length: count }, (_, i) => ({
        key: (i + 1).toString(),
        user: users[Math.floor(Math.random() * users.length)],
        otherComic: gundamModels[Math.floor(Math.random() * gundamModels.length)],
        yourComic: `/gundam${(i % 5) + 1}.png`,
        time: times[Math.floor(Math.random() * times.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
    }));
};

const mockData = generateData(12);

export default function ExchangeManage() {
    const [activeTab, setActiveTab] = useState("1");
    const [activeFilter, setActiveFilter] = useState("all");
    const [filteredData, setFilteredData] = useState(mockData);

    // Filter functionality
    const filterData = (filter) => {
        setActiveFilter(filter);
        if (filter === "all") {
            setFilteredData(mockData);
        } else {
            const statusMap = {
                "pending": "Đang chờ xác nhận",
                "confirmed": "Đã xác nhận",
                "success": "Thành công",
                "rejected": "Bị từ chối"
            };

            setFilteredData(mockData.filter(item => item.status.text === statusMap[filter]));
        }
    };

    const columns = [
        {
            title: "STT",
            dataIndex: "key",
            key: "key",
            width: 60,
            align: "center",
        },
        {
            title: "Người trao đổi",
            dataIndex: "user",
            key: "user",
            width: 160,
            render: (user) => (
                <Space>
                    <Avatar
                        src={`/avatar-${user.toLowerCase()}.png`}
                        icon={<UserOutlined />}
                        className="border-2 border-blue-500"
                    />
                    <span className="font-medium">{user}</span>
                </Space>
            ),
        },
        {
            title: "Gundam bạn muốn nhận",
            dataIndex: "otherComic",
            key: "otherComic",
            width: 220,
            render: (model) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text strong>{model.title}</Typography.Text>
                    <Typography.Text type="secondary">{model.subtitle}</Typography.Text>
                </Space>
            )
        },
        {
            title: "Gundam bạn trao đổi",
            dataIndex: "yourComic",
            key: "yourComic",
            width: 140,
            render: (src) => (
                <div className="flex justify-center">
                    <Card
                        hoverable
                        bodyStyle={{ padding: 0 }}
                        style={{ width: 80, height: 80 }}
                        cover={
                            <img
                                alt="Gundam model"
                                src={src}
                                className="object-cover h-20 w-20"
                            />
                        }
                    />
                </div>
            ),
        },
        {
            title: "Thời gian",
            dataIndex: "time",
            key: "time",
            width: 160,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 180,
            render: (status) => (
                <Tag icon={status.icon} color={status.color}>
                    {status.text}
                </Tag>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 100,
            render: () => (
                <Link to="/exchange/detail/section">
                    <Button className="bg-blue-500" type="primary" size="middle">
                        Xem chi tiết
                    </Button>
                </Link>
            ),
        },
    ];

    const filterOptions = [
        { label: "Tất cả", value: "all" },
        { label: "Yêu cầu nhận được", value: "received" },
        { label: "Yêu cầu đã gửi đi", value: "sent" },
        { label: "Đang chờ xác nhận", value: "pending" },
        { label: "Đang trao đổi", value: "ongoing" },
        { label: "Thành công", value: "success" },
        { label: "Bị từ chối", value: "rejected" }
    ];

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
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex justify-center w-full gap-2 overflow-x-auto py-2">
                                {filterOptions.map(option => (
                                    <Button
                                        ghost
                                        className="text-black text-base"
                                        key={option.value}
                                        type={activeFilter === option.value ? "primary" : "link"}
                                        onClick={() => filterData(option.value)}
                                    >
                                        {option.label}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <Table
                            columns={columns}
                            dataSource={filteredData}
                            pagination={{
                                pageSize: 3,
                                showSizeChanger: true,
                                pageSizeOptions: ['6', '12', '20'],
                                showTotal: (total) => `Tổng ${total} giao dịch`
                            }}
                            bordered
                            className="gundam-table"
                            style={{
                                backgroundColor: '#fff',
                                borderRadius: 8,
                            }}
                            rowClassName={(record, index) =>
                                index % 2 === 0 ? 'bg-gray-50' : ''
                            }
                        />
                    </TabPane>
                    <TabPane tab="Gundam của bạn" key="2">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <Card
                                    key={item}
                                    hoverable
                                    cover={<img alt="Gundam model" src={`/gundam${(item % 5) + 1}.png`} className="h-48 object-contain bg-gray-100" />}
                                    actions={[
                                        <Button type="primary" key="exchange">Trao đổi</Button>,
                                        <Button key="edit">Chỉnh sửa</Button>
                                    ]}
                                >
                                    <Card.Meta
                                        title={`${mockData[item % mockData.length].otherComic.title}`}
                                        description={`${mockData[item % mockData.length].otherComic.subtitle}`}
                                    />
                                </Card>
                            ))}
                        </div>
                    </TabPane>
                </Tabs>
            </Card>
        </div>
    );
}