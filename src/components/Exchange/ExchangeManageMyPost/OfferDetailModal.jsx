import { Modal, Button, Card, Tag, Avatar, Typography, Image, Row, Col, Statistic, Space } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function OfferDetailModal({ visible, offer, post, onClose, onAction }) {
    if (!offer || !post) return null;

    const offerStatusMap = {
        pending: { text: "Đang chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
        accepted: { text: "Đã chấp nhận", color: "green", icon: <CheckCircleOutlined /> },
        rejected: { text: "Đã từ chối", color: "red", icon: <CloseCircleOutlined /> }
    };

    return (
        <Modal
            title="Chi tiết đề xuất trao đổi"
            open={visible}
            onCancel={onClose}
            footer={
                offer.status === "pending" ? [
                    <Button key="reject" danger onClick={() => onAction(offer.id, "reject")}>
                        Từ chối đề xuất
                    </Button>,
                    <Button key="accept" type="primary" className="bg-blue-500" onClick={() => onAction(offer.id, "accept")}>
                        Chấp nhận đề xuất
                    </Button>,
                ] : [
                    <Button key="close" onClick={onClose}>
                        Đóng
                    </Button>
                ]
            }
            width={700}
        >
            <div className="flex items-center mb-4">
                <Avatar src={offer.avatar} size={40}>{offer.user[0]}</Avatar>
                <div className="ml-2">
                    <Text strong>{offer.user}</Text>
                    <div>
                        <Text type="secondary">{offer.createdAt}</Text>
                    </div>
                </div>
                <div className="ml-auto">
                    <Tag icon={offerStatusMap[offer.status].icon} color={offerStatusMap[offer.status].color}>
                        {offerStatusMap[offer.status].text}
                    </Tag>
                </div>
            </div>

            <Card className="mb-4">
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="text-center mb-2">
                            <Text strong>Gundam của bạn</Text>
                        </div>
                        <Image
                            src={post.gunplas[0]?.image}
                            width="100%"
                            height={180}
                            className="object-contain bg-gray-100"
                        />
                        <div className="mt-2 text-center">
                            <Text>{post.gunplas[0]?.title}</Text>
                            <div>
                                <Text type="secondary">{post.gunplas[0]?.category}</Text>
                            </div>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="text-center mb-2">
                            <Text strong>Gundam được đề xuất</Text>
                        </div>
                        <Image
                            src={offer.offerModel.image}
                            width="100%"
                            height={180}
                            className="object-contain bg-gray-100"
                        />
                        <div className="mt-2 text-center">
                            <Text>{offer.offerModel.title}</Text>
                            <div>
                                <Text type="secondary">{offer.offerModel.subtitle}</Text>
                            </div>
                            <div>
                                <Tag color="blue">Tình trạng: {offer.offerModel.condition}</Tag>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card className="mb-4">
                <Statistic
                    title="Số tiền bù trừ"
                    value={offer.paymentAmount}
                    precision={0}
                    valueStyle={{ color: offer.paymentDirection === 'them' ? '#3f8600' : '#cf1322' }}
                    prefix={offer.paymentDirection === 'them' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="đ"
                />
                <Text type="secondary">
                    {offer.paymentDirection === 'them' ? "Người trao đổi sẽ bù thêm tiền cho bạn" : "Bạn sẽ bù thêm tiền cho người trao đổi"}
                </Text>
            </Card>

            <Card>
                <Typography.Title level={5}>Ghi chú</Typography.Title>
                <Paragraph>{offer.note}</Paragraph>
            </Card>
        </Modal>
    );
}