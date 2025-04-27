import { Drawer, Button, Card, Badge, List, Space, Avatar, Tag, Divider, Typography, Modal, Form, Input, InputNumber } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    DollarOutlined
} from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

export default function OffersDrawer({ visible, post, offers, onClose, onViewOfferDetail }) {

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [compensationType, setCompensationType] = useState('none');

    if (!post) return null;

    const offerStatusMap = {
        pending: { text: "Đang chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
        accepted: { text: "Đã chấp nhận", color: "green", icon: <CheckCircleOutlined /> },
        rejected: { text: "Đã từ chối", color: "red", icon: <CloseCircleOutlined /> }
    };


    const handleModalCancel = () => {
        setIsModalVisible(false)
    }

    const handleSelectCompensation = (type) => {
        setCompensationType(type);
        if (type === 'none') {
            form.setFieldsValue({ compensationAmount: 0 });
        }
    };

    const handleModalSubmit = (values) => {
        console.log(values);

    }

    return (
        <>
            <Drawer
                title={
                    <div>
                        <Text className="uppercase text-base" strong>Đề xuất trao đổi cho bài viết của bạn</Text>
                    </div>
                }
                width={500}
                open={visible}
                onClose={onClose}
                footer={
                    <div className="flex justify-end">
                        <Button onClick={onClose}>Đóng</Button>
                    </div>
                }
            >
                {/* <Divider orientation="left">
                <Space>
                    <Badge>
                        <Text strong>Nội dung bài viết</Text>
                    </Badge>
                </Space>
            </Divider>

            <Card className="mb-4 mt-0">
                <Paragraph ellipsis={{ rows: 3 }}>
                    {post.content}
                </Paragraph>
                <div className="mt-2">
                    <Text strong>Số Gundam đem trao đổi: </Text>
                    <Tag color="blue">{post.gunplas.length} mô hình</Tag>
                </div>
            </Card> */}

                <Divider orientation="left">
                    <Space>
                        <Badge>
                            <Text strong>Danh sách đề xuất</Text>
                        </Badge>
                    </Space>
                </Divider>

                {offers.length > 0 ? (
                    <List
                        dataSource={offers}
                        renderItem={(offer) => (
                            <List.Item
                                key={offer.id}
                                actions={[
                                    <div key={offer.id} className="flex flex-col w-32 gap-2">
                                        <Button
                                            danger
                                            ghost
                                            type="primary"
                                            block
                                            onClick={() => setIsModalVisible(true)}
                                        >
                                            Thương lượng
                                        </Button>
                                        <Button
                                            key={offer.id}
                                            type="primary"
                                            className="bg-blue-500"
                                            block
                                            onClick={() => onViewOfferDetail(offer)}
                                        >
                                            Chi tiết
                                        </Button>
                                    </div>
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<Avatar src={offer.avatar}>{offer.user[0]}</Avatar>}
                                    title={
                                        <Space>
                                            <Text strong>{offer.user}</Text>
                                            <Tag
                                                icon={offerStatusMap[offer.status].icon}
                                                color={offerStatusMap[offer.status].color}
                                            >
                                                {offerStatusMap[offer.status].text}
                                            </Tag>
                                        </Space>
                                    }
                                    description={
                                        <Space direction="vertical" size={0}>
                                            <Text>{offer.offerModel.title} - {offer.offerModel.subtitle}</Text>
                                            <Text>
                                                {offer.paymentDirection === "you" ? (
                                                    <Text type="danger">
                                                        <ArrowDownOutlined /> Bạn bù {offer.paymentAmount.toLocaleString()}đ
                                                    </Text>
                                                ) : (
                                                    <Text type="success">
                                                        <ArrowUpOutlined /> Họ bù {offer.paymentAmount.toLocaleString()}đ
                                                    </Text>
                                                )}
                                            </Text>
                                        </Space>
                                    }
                                />
                            </List.Item>
                        )}
                    />

                ) : (
                    <div className="text-center py-8">
                        <Text type="secondary">Chưa có đề xuất trao đổi nào</Text>
                    </div>
                )}
            </Drawer>

            {/* Modal Gửi Thương lượng */}
            <Modal
                title="GỬI THƯƠNG LƯỢNG ĐỀ XUẤT TRAO ĐỔI"
                open={isModalVisible}
                onCancel={handleModalCancel}
                footer={[
                    <Button key="cancel" onClick={handleModalCancel}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        className="bg-blue-500"
                        onClick={() => {
                            form.validateFields().then(values => {
                                handleModalSubmit(values);
                            }).catch(err => {
                                console.log('Validation Failed:', err);
                            });
                        }}
                    >
                        Gửi thương lượng
                    </Button>,
                ]}
                width={500}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        compensationType: 'none',
                        compensationAmount: 0,
                        note: ''
                    }}
                >
                    <Form.Item label="Bạn muốn ai là người Bù Trừ tiền?">
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            <Button
                                type={compensationType === 'none' ? 'primary' : 'default'}
                                className={compensationType === 'none' ? 'bg-blue-500' : ''}
                                onClick={() => handleSelectCompensation('none')}
                            >
                                Không ai bù trừ tiền
                            </Button>
                            <Button
                                type={compensationType === 'receiver' ? 'primary' : 'default'}
                                className={compensationType === 'receiver' ? 'bg-blue-500' : ''}
                                onClick={() => handleSelectCompensation('receiver')}
                            >
                                Toàn sẽ bù tiền
                            </Button>
                            <Button
                                type={compensationType === 'sender' ? 'primary' : 'default'}
                                className={compensationType === 'sender' ? 'bg-blue-500' : ''}
                                onClick={() => handleSelectCompensation('sender')}
                            >
                                Bạn sẽ bù tiền
                            </Button>
                        </div>
                        <Form.Item name="compensationType" hidden>
                            <Input />
                        </Form.Item>
                    </Form.Item>

                    <Form.Item
                        name="compensationAmount"
                        label="Số tiền bù trừ (VND)"
                        rules={
                            compensationType !== 'none'
                                ? [
                                    { required: true, message: 'Vui lòng nhập số tiền bù trừ' },
                                    { type: 'number', min: 1000, message: 'Số tiền bù trừ phải từ 1,000 VND trở lên' }
                                ]
                                : []
                        }
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

                    <Form.Item name="note" label="Ghi chú (không bắt buộc)">
                        <Input.TextArea
                            rows={4}
                            placeholder="Nhập ghi chú về đề nghị trao đổi của bạn (nếu có)..."
                            maxLength={500}
                            showCount
                        />
                    </Form.Item>
                </Form>
            </Modal>

        </>
    );
}