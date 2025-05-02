import { Avatar, Button, Space, Table, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    UserOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
} from "@ant-design/icons";
import { getAllExchangeOffer, getAllExchangeParticipating } from "../../../apis/Exchange/APIExchange";
import moment from "moment/min/moment-with-locales";

moment.locale("vi");
const { Text } = Typography;

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

    const [offerData, setOfferData] = useState([]);
    const [exchangeData, setExchangeData] = useState([]);
    const [filteredData, setFilteredData] = useState(exchangeData);
    // Filter functionality
    const filterData = (filter) => {
        setActiveFilter(filter);
        if (filter === "all") {
            setFilteredData(exchangeData);
        } else {
            const statusMap = {
                "pending": "Đang trao đổi",
                "failed": "Trao đổi thất bại",
                "canceled": "Bị hủy",
                "completed": "Thành công",
                "ongoing": "Đang chờ xác nhận",
                "packaging": "Đang đóng gói",
                "delivering": "Đang vận chuyển",
                "delivered": "Đã được giao",
            };

            setFilteredData(exchangeData.filter(item => {item.status === statusMap[filter]}));
        }
    };

    const filterOptions = [
        { label: "Tất cả", value: "all" },
        { label: "Đang trao đổi", value: "pending" },
        { label: "Đang đóng gói", value: "packaging" },
        { label: "Đang vận chuyển", value: "delivering" },
        { label: "Đã được giao", value: "delivered" },
        { label: "Thành công", value: "completed" },
        { label: "Bị hủy", value: "canceled" },
        { label: "Trao đổi thất bại", value: "failed" }
    ];


    const columns = [
            // {
            //     title: "STT",
            //     dataIndex: "key",
            //     key: "key",
            //     width: 60,
            //     align: "center",
            // },
            {
                title: "Người trao đổi",
                dataIndex: "partner",
                key: "partner",
                width: 160,
                render: (user) => (
                    <Space>
                        <Avatar
                            src={user.avatar_url}
                            icon={<UserOutlined />}
                            className="border-2 border-blue-500"
                        />
                        <span className="font-medium">{user.full_name}</span>
                    </Space>
                ),
            },
            {
                title: "Tiền bù trừ",
                dataIndex: "compensation_amount",
                key: "compensation_amount",
                width: 220,
                render: (offer) => (
                    <Space direction="vertical" size={0}>
                        <Text>
                            {offer === null ? (
                            <Text type="success">
                                Không có bù trừ
                            </Text>
                            ) : (
                                <Text type="success">
                                    {offer.toLocaleString()}đ
                                </Text>
                            )}
                        </Text>
                    </Space>
                )
            },
            {
                title: "Trạng thái",
                dataIndex: "status",
                key: "status",
                width: 220,
                render: (src) => (
                    <Space direction="vertical" size={0}>
                        <Typography.Text strong>{src}</Typography.Text>
                    </Space>
                ),
            },
            {
                title: "Thời gian",
                dataIndex: "created_at",
                key: "time",
                width: 160,
                render: (src) => (
                    <Space direction="vertical" size={0}>
                        {moment(src.created_at).format('LL')
                        }
                    </Space>
                ),
            },
            // {
            //     title: "Trạng thái",
            //     dataIndex: "status",
            //     key: "status",
            //     width: 180,
            //     render: (status) => (
            //         <Tag icon={status.icon} color={status.color}>
            //             {status.text}
            //         </Tag>
            //     ),
            // },
            {
                title: "Hành động",
                key: "action",
                width: 100,
                render: (src) => (
                    <Link to={`/exchange/detail/${src.id}`}>
                        <Button className="bg-blue-500" type="primary" size="middle">
                            Xem chi tiết
                        </Button>
                    </Link>
                ),
            },
        ];

        useEffect(() => {
                getAllExchangeOffer().then((res) => {
                    setOfferData(res.data);
                    console.log(res.data);
                })
                getAllExchangeParticipating().then((res) => {
                    setExchangeData(res.data);
                    console.log(res.data);
                })
        },[])


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
                // dataSource={filteredData}
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