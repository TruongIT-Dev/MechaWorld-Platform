// RequestDetail.jsx
import { Avatar, Typography, Card, Button, Tag, Carousel, Divider, Statistic, Row, Col } from 'antd';
import { UserOutlined, ClockCircleOutlined, EnvironmentOutlined, DollarOutlined, SwapOutlined, PhoneOutlined, EyeOutlined, HeartOutlined, CommentOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Link, Paragraph, Title } = Typography;

export default function RequestDetail({ selectedRequest }) {

    const navigate = useNavigate();

    const handleStartExchange = () => {
        // Điều hướng đến trang ExchangeDetail khi người dùng click vào nút
        navigate('/exchange/request');
    };

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

            {/* <Tag color="blue" className="mb-3">{selectedRequest.category}</Tag> */}

            {/* Images List */}
            {selectedRequest.images && selectedRequest.images.length > 0 && (
                <div className="mb-4 grid grid-cols-2 md:grid-cols-3 gap-2">
                    {selectedRequest.images.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Ảnh ${index + 1}`}
                            className="w-full h-40 object-cover"
                        />
                    ))}
                </div>
            )}

            <Divider />

            {/* Content */}
            <Paragraph className="whitespace-pre-line text-base">{selectedRequest.content}</Paragraph>

            <Divider />

            {/* Action Buttons */}
            <div className="flex gap-3">
                <Button type="primary" size="large" className="w-full bg-blue-500" onClick={handleStartExchange}>
                    Bắt đầu Trao đổi
                </Button>
            </div>
        </div>
    );
}