import { Avatar, Button, Card, Space, Table, Tag, Typography } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
    UserOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";

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
        paymentDirection: Math.random() > 0.5 ? "you" : "them",
        paymentAmount: Math.floor(Math.random() * 500 + 100) * 1000,
        note: "Mẫu này tôi rất thích, mong bạn đồng ý trao đổi."
    }));
};

const mockData = generateData(12);
// Filter only pending negotiations

export default function ExchangeManageList() {
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

    const filterOptions = [
        { label: "Tất cả", value: "all" },
        { label: "Đề xuất đã gửi đi", value: "pending" },
        { label: "Đang trao đổi", value: "ongoing" },
        { label: "Thành công", value: "success" },
        { label: "Bị từ chối", value: "rejected" }
    ];


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
                width: 220,
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

    return (
        <>
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
        </>
    )
}