import { Avatar, Button, Card, Form, Input, InputNumber, Modal, Space, Table, Typography } from "antd";
import {
    UserOutlined,
    SyncOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ClockCircleOutlined,
    DollarOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";
import { useState } from "react";


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
const pendingNegotiations = mockData.filter(item => item.status.text === "Đang chờ xác nhận");


export default function ExchangeManageNegotiation() {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNegotiation, setCurrentNegotiation] = useState(null);
    const [form] = Form.useForm();

    const [compensationType, setCompensationType] = useState('none');


    const handleEditNegotiation = (record) => {
        setCurrentNegotiation(record);
        form.setFieldsValue({
            paymentAmount: record.paymentAmount,
            note: record.note
        });
        setIsModalVisible(true);
    };


    const handleModalCancel = () => {
        setIsModalVisible(false);
    };

    const handleModalSubmit = () => {
        form.validateFields().then(values => {
            console.log("Updated negotiation:", values);
            // Here you would typically update the data and send it to backend
            setIsModalVisible(false);
        });
    };

    // Columns for negotiation tab
    const negotiationColumns = [
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
            title: "Bù trừ tiền",
            dataIndex: "paymentDirection",
            key: "paymentDirection",
            width: 180,
            render: (direction, record) => (
                <Space>
                    {direction === "you" ? (
                        <Typography.Text type="danger">
                            <ArrowDownOutlined /> Bạn bù {record.paymentAmount.toLocaleString()}đ
                        </Typography.Text>
                    ) : (
                        <Typography.Text type="success">
                            <ArrowUpOutlined /> Họ bù {record.paymentAmount.toLocaleString()}đ
                        </Typography.Text>
                    )}
                </Space>
            ),
        },
        {
            title: "Note",
            dataIndex: "note",
            key: "note",
            width: 160,
            render: (_, record) => (
                <p>{record.note}</p>
            ),
        },
        {
            title: "Hành động",
            key: "action",
            width: 140,
            render: (_, record) => (
                <Button
                    className="bg-blue-500"
                    type="primary"
                    size="middle"
                    onClick={() => handleEditNegotiation(record)}
                >
                    Chỉnh sửa đề xuất
                </Button>
            ),
        },
    ];


    return (
        <>
            <Table
                columns={negotiationColumns}
                dataSource={pendingNegotiations}
                pagination={{
                    pageSize: 3,
                    showSizeChanger: true,
                    pageSizeOptions: ['6', '12', '20'],
                    showTotal: (total) => `Tổng ${total} đề xuất đang chờ`
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


            {/* Modal for editing negotiation */}
            <Modal
                title="CHỈNH SỬA ĐỀ XUẤT TRAO ĐỔI"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" className="bg-blue-500" onClick={handleModalSubmit}>
                        Cập nhật đề xuất
                    </Button>,
                ]}
                width={500}
            >
                {currentNegotiation && (
                    <div className="py-2">
                        <Form
                            form={form}
                            layout="vertical"
                            className="pt-2"
                            initialValues={{
                                compensationType: 'none',
                                compensationAmount: 0
                            }}
                        >
                            <Form.Item
                                label={<span className="font-medium text-base">Bạn muốn ai là người Bù Trừ tiền?</span>}
                                className="mb-4"
                            >
                                <div className="flex flex-wrap gap-2">
                                    <Button
                                        type={compensationType === 'none' ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('none');
                                            form.setFieldsValue({
                                                compensationType: 'none',
                                                compensationAmount: 0
                                            });
                                        }}
                                        className={compensationType === 'none' ? 'bg-blue-500' : ''}
                                    >
                                        Không ai bù trừ tiền
                                    </Button>
                                    <Button
                                        type={compensationType === 'receiver' ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('receiver');
                                            form.setFieldsValue({ compensationType: 'receiver' });
                                        }}
                                        className={compensationType === 'receiver' ? 'bg-blue-500' : ''}
                                    >
                                        Toàn sẽ bù tiền
                                    </Button>
                                    <Button
                                        type={compensationType === 'sender' ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('sender');
                                            form.setFieldsValue({ compensationType: 'sender' });
                                        }}
                                        className={compensationType === 'sender' ? 'bg-blue-500' : ''}
                                    >
                                        Bạn sẽ bù tiền
                                    </Button>
                                </div>
                                <Form.Item
                                    name="compensationType"
                                    hidden
                                >
                                    <Input value="463,000VND" />
                                </Form.Item>
                            </Form.Item>

                            <Form.Item
                                name="compensationAmount"
                                label="Số tiền bù trừ (VND)"
                                rules={compensationType !== 'none' ? [
                                    { required: true, message: 'Vui lòng nhập số tiền bù trừ' },
                                    { type: 'number', min: 1000, message: 'Số tiền bù trừ phải từ 1,000 VND trở lên' }
                                ] : []}
                            >
                                <InputNumber
                                    className="w-full"
                                    placeholder="Nhập số tiền bù trừ"
                                    min={1000}
                                    step={10000}
                                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                    addonBefore={<DollarOutlined />}
                                    disabled={compensationType === 'none'}
                                />
                            </Form.Item>

                            <Form.Item
                                name="note"
                                label="Ghi chú (không bắt buộc)"
                            >
                                <Input.TextArea
                                    rows={4}
                                    placeholder="Nhập ghi chú về đề nghị trao đổi của bạn (nếu có)..."
                                    maxLength={500}
                                    showCount
                                />
                            </Form.Item>
                        </Form>
                    </div>
                )}
            </Modal>
        </>
    )
}