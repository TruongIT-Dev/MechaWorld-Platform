import { Modal, Button, Card, Tag, Avatar, Typography, Image, Row, Col, Statistic } from "antd";
import {
    ClockCircleOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    SwapOutlined
} from "@ant-design/icons";

const { Text, Paragraph } = Typography;

export default function OfferDetailModal({ open, offer, post, onClose, onAction }) {
    // console.log("OfferDetailModal - visible:", open);
    // console.log("OfferDetailModal - offer:", offer);
    // console.log("OfferDetailModal - post:", post);


    if (!offer || !post) {
        console.log("OfferDetailModal - Not rendering due to missing data");
        return null;
    }

    const offerStatusMap = {
        pending: { text: "Đang chờ xác nhận", color: "orange", icon: <ClockCircleOutlined /> },
        accepted: { text: "Đã chấp nhận", color: "green", icon: <CheckCircleOutlined /> },
        rejected: { text: "Đã từ chối", color: "red", icon: <CloseCircleOutlined /> }
    };

    return (
        <Modal
            title="CHI TIẾT ĐỀ XUẤT TRAO ĐỔI"
            open={open} // Use "open" for Ant Design v4+
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
            {/* Rest of the modal content */}
            <div className="flex items-center mb-4">
                <Avatar src={offer.avatar} size={40}>{offer.user?.charAt(0)}</Avatar>
                <div className="ml-2">
                    <Text strong>{offer.user}</Text>
                    <div>
                        <Text type="secondary">{offer.createdAt}</Text>
                    </div>
                </div>
                <div className="ml-auto">
                    <Tag icon={offerStatusMap[offer.status]?.icon} color={offerStatusMap[offer.status]?.color}>
                        {offerStatusMap[offer.status]?.text}
                    </Tag>
                </div>
            </div>

            <Card className="mb-4">
                <Row gutter={24}>
                    {/* Thông tin Gundam mình */}
                    <Col span={10}>
                        <div className="text-center mb-2">
                            <Text strong>Gundam của bạn</Text>
                        </div>
                        <Image
                            src={post.exchange_post_items?.[0]?.primary_image_url || post.poster_exchange_items?.[0]?.primary_image_url}
                            width="100%"
                            height={180}
                            className="object-contain bg-gray-100"
                        />
                        <div className="mt-2 space-y-1">
                            <Text>{post.exchange_post_items?.[0]?.name || post.poster_exchange_items?.[0]?.name}</Text>
                            <div>
                                <Text type="secondary">Phân khúc: <Tag color="red">{post.exchange_post_items?.[0]?.grade || post.poster_exchange_items?.[0]?.grade}</Tag></Text>
                            </div>
                            <div>
                                <Text type="secondary">Dòng phim: <Tag color="blue">{post.exchange_post_items?.[0]?.series || post.poster_exchange_items?.[0]?.series}</Tag></Text>
                            </div>
                        </div>
                    </Col>

                    {/* Icon */}
                    <Col span={4}>
                        <div className="flex items-center justify-center h-full">
                            <SwapOutlined className="text-4xl text-blue-400 mb-16" />
                        </div>
                    </Col>

                    {/* Thông tin Gundam đối tác */}
                    <Col span={10}>
                        <div className="text-center mb-2">
                            <Text strong>Gundam được đề xuất</Text>
                        </div>
                        <Image
                            src={offer.offerModel?.image}
                            width="100%"
                            height={180}
                            className="object-contain bg-gray-100"
                        />
                        <div className="mt-2 space-y-1">
                            <Text>{offer.offerModel?.title}</Text>
                            <div>
                                <Text type="secondary">Phân khúc: <Tag color="red">{offer.offerModel?.grade}</Tag></Text>
                            </div>
                            <div>
                                <Text type="secondary">Dòng phim: <Tag color="blue">{offer.offerModel?.series}</Tag></Text>
                            </div>
                            {/* <div>
                                <Tag color="blue">Tình trạng: {offer.offerModel?.condition}</Tag>
                            </div> */}
                        </div>
                    </Col>
                </Row>
            </Card>

            <Card className="mb-4">
                <Statistic
                    title="Số tiền bù trừ"
                    value={offer.paymentAmount || 0}
                    precision={0}
                    valueStyle={{ color: offer.paymentDirection === 'them' ? '#3f8600' : '#cf1322' }}
                    prefix={offer.paymentDirection === 'them' ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    suffix="đ"
                />
                <Text type="secondary">
                    {!offer.paymentAmount ? "Không có bù trừ" :
                        (offer.paymentDirection === 'them' ? "Người trao đổi sẽ bù thêm tiền cho bạn" :
                            "Bạn sẽ bù thêm tiền cho người trao đổi")}
                </Text>
            </Card>

            <Card>
                <Typography.Title level={5}>Tin nhắn đề xuất của đối tác</Typography.Title>
                <Paragraph>{offer.note}</Paragraph>
            </Card>
        </Modal>
    );
}