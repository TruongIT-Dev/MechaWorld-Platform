import { Avatar, Button, Card, Form, Input, InputNumber, message, Modal, Space, Table, Typography } from "antd";
import {
    UserOutlined,
    DollarOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAllExchangeOffer, updateExchangeOffer } from "../../../apis/Exchange/APIExchange";
import { useSelector } from "react-redux";

export default function ExchangeManageNegotiation() {

    const [form] = Form.useForm();
    const user = useSelector((state) => state.auth.user)

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentNegotiation, setCurrentNegotiation] = useState(null);
    const [currentCompensation, setCurrentCompensation] = useState(null);
    const [compensationID, setCompensationID] = useState(null);
    const [compensationType, setCompensationType] = useState('none');
    const [offerData, setOfferData] = useState([]);


    const handleEditNegotiation = (record) => {
        setCurrentNegotiation(record);
        form.setFieldsValue({
            compensationAmount: record.offer.compensation_amount,
            note: record.offer.note
        });
        setIsModalVisible(true);
    };


    const handleModalCancel = () => {
        setCurrentCompensation(null);
        setCurrentNegotiation(null);
        setCompensationID(null);
        setIsModalVisible(false);
    };

    const handleModalSubmit = () => {
        form.validateFields().then(values => {
            // Here you would typically update the data and send it to backend
            const offerData = {
                ...values,
                id: compensationID,
                requireCompensation: currentCompensation
            };
            console.log("Updated negotiation:", offerData);
            updateExchangeOffer(currentNegotiation?.offer.id, offerData).then((res) => {
                if (res.status === 200) {

                    setTimeout(
                        message.success('Cập nhập đề xuất thành công.'), 800
                    );
                    // setIsModalVisible(false);
                    handleModalCancel();
                } else if (res.status === 422) {
                    setTimeout(
                        message.success('Ví của bạn không đủ không đủ tiền để đề xuất. Vui lòng nạp thêm tiền vào tài khoản!'), 800
                    );
                }
            });
            // handleModalCancel();
        });
    };

    useEffect(() => {
        getAllExchangeOffer().then((res) => {
            setOfferData(res.data);
            console.log(res.data);
        })
    }, [])

    // Columns for negotiation tab
    const negotiationColumns = [
        {
            title: "Người trao đổi",
            dataIndex: "poster",
            key: "poster",
            width: 160,
            align: 'center',
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
            title: "Gundam bạn muốn nhận",
            dataIndex: "offer",
            key: "poster_item",
            width: 220,
            align: 'center',
            render: (offer) => (
                <Space direction="vertical" size={0}>
                    <Typography.Text strong>{offer.poster_exchange_items[0].name}</Typography.Text>
                    <Typography.Text type="secondary">{offer.poster_exchange_items[0].series}</Typography.Text>
                </Space>
            )
        },
        {
            title: "Gundam bạn trao đổi",
            dataIndex: "offer",
            key: "offer_item",
            width: 160,
            align: 'center',
            render: (offer) => (
                <div className="flex justify-center">
                    <Card
                        hoverable
                        bodyStyle={{ padding: 0 }}
                        style={{ width: 120, height: 80 }}
                        cover={
                            <img
                                alt="Gundam model"
                                src={offer.offerer_exchange_items[0].primary_image_url}
                                className="object-cover h-20 w-20"
                            />
                        }
                    />
                </div>
            ),
        },
        {
            title: "Bù trừ tiền",
            dataIndex: "offer",
            key: "compensation",
            width: 180,
            align: 'center',
            render: (offer) => (
                offer.payer_id !== null && offer.compensation_amount !== null ? (
                    <Space>
                        {offer.payer_id === user.id ? (
                            <Typography.Text type="danger">
                                <ArrowDownOutlined /> Bạn bù {offer.compensation_amount.toLocaleString()}đ
                            </Typography.Text>
                        ) : (
                            <Typography.Text type="success">
                                <ArrowUpOutlined /> Họ bù {offer.compensation_amount.toLocaleString()}đ
                            </Typography.Text>
                        )}
                    </Space>
                ) : (
                    <Typography.Text>Không có bù tiền</Typography.Text>
                )
            ),
        },
        {
            title: "Tin nhắn thương lượng",
            dataIndex: "offer",
            key: "note",
            width: 160,
            align: 'center',
            render: (record) => {
                return (
                    <p>{record.negotiation_notes[record.negotiations_count]?.content || 'Không có'}</p>
                );
            },
        },
        {
            title: "Hành động",
            key: "action",
            width: 140,
            align: 'center',
            render: (_, record) => (
                <Button
                    className="bg-blue-500"
                    type="primary"
                    size="middle"
                    disabled={!record.offer.last_negotiation_at}
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
                // dataSource={pendingNegotiations}
                dataSource={offerData}
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
                                            setCurrentCompensation(false);
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
                                        // type={currentNegotiation.offer.payer_id === currentNegotiation.poster.id ? 'default' : 'default'}
                                        onClick={() => {
                                            setCompensationType('receiver');
                                            setCompensationID(currentNegotiation.poster.id);
                                            setCurrentCompensation(true);
                                            form.setFieldsValue({ compensationType: 'receiver' });
                                        }}
                                        className={compensationType === 'receiver' ? 'bg-blue-500' : ''}
                                    >
                                        {currentNegotiation.poster.full_name} sẽ bù tiền
                                    </Button>
                                    <Button
                                        // type={currentNegotiation.offer.payer_id === user.id ? 'primary' : 'default'}
                                        onClick={() => {
                                            setCompensationType('sender');
                                            setCompensationID(user.id);
                                            setCurrentCompensation(true);
                                            form.setFieldsValue({ compensationType: 'sender' });
                                        }}
                                        className={compensationType === 'sender' ? 'bg-blue-500' : ''}
                                    >
                                        Bạn sẽ bù tiền
                                    </Button>
                                </div>
                                {/* <Form.Item
                                    name="compensationType"
                                    hidden
                                >
                                    <Input value="463,000VND" />
                                </Form.Item> */}
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
                                    defaultValue={currentNegotiation.offer.compensation_amount}
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