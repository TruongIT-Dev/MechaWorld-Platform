// RequestDetail.jsx
import { Avatar, Typography, Card, Button, Tag, Carousel, Divider, Statistic, Row, Col } from 'antd';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, SwapOutlined, PhoneOutlined, EyeOutlined, HeartOutlined, CommentOutlined, InfoCircleOutlined } from '@ant-design/icons';

const { Text, Link, Paragraph, Title } = Typography;

export default function RequestDetail({ selectedRequest }) {
    if (!selectedRequest) {
        return (
            <Card className="shadow-md rounded-lg flex flex-col items-center justify-center h-60">
                <p className="text-gray-500">Chưa có yêu cầu nào được chọn</p>
            </Card>
        );
    }

    const formattedDate = new Date(selectedRequest.time).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    return (
        <div className="max-h-[80vh] overflow-y-auto pr-2">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <Avatar size={48} src={selectedRequest.userAvatar} icon={!selectedRequest.userAvatar && <UserOutlined />} />
                <div>
                    <Link href={selectedRequest.userProfile} className="font-semibold text-base">{selectedRequest.user}</Link>
                    <div className="text-gray-500 text-sm flex items-center gap-1">
                        <ClockCircleOutlined /> {formattedDate}
                    </div>
                </div>
            </div>

            {/* Title */}
            <Title level={3} className="mt-2 mb-3">{selectedRequest.title}</Title>

            <Tag color="blue" className="mb-3">{selectedRequest.category}</Tag>

            {/* Images Carousel */}
            {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="mb-4">
                    <Carousel autoplay className="rounded-lg overflow-hidden">
                        {selectedRequest.images.map((image, index) => (
                            <div key={index}>
                                <div style={{ height: '300px', position: 'relative' }}>
                                    <img
                                        src={image}
                                        alt={`Ảnh ${index + 1}`}
                                        className="w-full h-full object-contain"
                                    />
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            )}

            <Divider />

            {/* Content */}
            <Paragraph className="whitespace-pre-line text-base">{selectedRequest.content}</Paragraph>

            <Divider />

            {/* Details */}
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <Title level={4} className="mb-3">Thông tin chi tiết</Title>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                        <EnvironmentOutlined className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Địa điểm:</span>
                        <span>{selectedRequest.location}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <InfoCircleOutlined className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Tình trạng:</span>
                        <span>{selectedRequest.condition}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <DollarOutlined className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Giá gốc:</span>
                        <span>{selectedRequest.originalPrice}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <SwapOutlined className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Muốn đổi lấy:</span>
                        <span>{selectedRequest.exchangeFor}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <PhoneOutlined className="text-gray-500" />
                        <span className="text-gray-700 font-medium">Liên hệ:</span>
                        <span>{selectedRequest.contactMethod}</span>
                    </div>

                    {selectedRequest.additionalInfo && (
                        <div className="flex items-center gap-2">
                            <InfoCircleOutlined className="text-gray-500" />
                            <span className="text-gray-700 font-medium">Thông tin thêm:</span>
                            <span>{selectedRequest.additionalInfo}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button type="primary" size="large" className="flex-1 bg-blue-500">
                    Bắt đầu Trao đổi
                </Button>
                <Button size="large" className="flex-1">
                    Lưu Bài Viết
                </Button>
            </div>
        </div>
    );
}