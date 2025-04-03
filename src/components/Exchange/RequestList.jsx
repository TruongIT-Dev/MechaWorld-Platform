// RequestList.jsx
import { Card, List, Avatar, Typography, Modal } from 'antd';
import { UserOutlined, ClockCircleOutlined, PictureOutlined } from '@ant-design/icons';
import { useState } from 'react';
import RequestDetail from './RequestDetail';

import Logo from '../../assets/image/Logo2.png';
import Logo2 from '../../assets/image/Logo.png';
import Logo3 from '../../assets/image/Logo4.png';

import GundamPic from '../../assets/image/gun9.jpg';
import GundamPic2 from '../../assets/image/gun10.jpg';
import GundamPic3 from '../../assets/image/gun2.jpg';


const { Link, Text, Paragraph } = Typography;

const fakeRequests = [
    {
        id: 1,
        title: 'Trao đổi MG RX-78-2 Gundam Ver.3.0 mới lắp 80% còn nguyên phụ kiện',
        user: 'GundamCollector_Hanoi',
        userProfile: '#',
        userAvatar: Logo,
        mainImage: GundamPic,
        images: [
            GundamPic,
            GundamPic2,
            GundamPic3,
        ],
        category: 'Mô hình Gunpla - Master Grade',
        time: '2024-03-29T10:30:00',
        content: 'Chào cộng đồng Gundam Việt Nam! Mình đang muốn trao đổi bộ MG RX-78-2 Gundam Ver.3.0 đã lắp được khoảng 80%, tình trạng rất tốt, các chi tiết còn nguyên vẹn và sắc nét. Mình mới sơn một số chi tiết nhỏ và panel line cơ bản.\n\nLý do trao đổi: Mình đang muốn hoàn thiện bộ sưu tập dòng Gundam SEED và cần nhường lại em này để lấy không gian trưng bày.\n\nMình đang tìm kiếm mô hình thuộc series SEED, đặc biệt là MG Freedom 2.0 hoặc MG Justice. Có thể trao đổi kèm thêm tiền tùy vào giá trị mô hình. Bộ này mình mua với giá 1tr5, giờ trao đổi với giá trị tương đương.\n\nĐịa điểm: Khu vực Hà Nội, ưu tiên gặp mặt trực tiếp để kiểm tra mô hình. Có thể ship COD nếu ở xa.\n\nLiên hệ qua tin nhắn hoặc comment phía dưới nhé!',
        location: 'Hà Nội',
        condition: 'Đã lắp 80%, có panel line',
        originalPrice: '1,500,000 VND',
        exchangeFor: 'MG Freedom 2.0, MG Justice, hoặc các mô hình Gundam SEED khác',
        contactMethod: 'Tin nhắn trực tiếp hoặc gặp mặt',
    },
    {
        id: 2,
        title: 'Tìm SD Gundam World Heroes Full Series - Đổi nhiều loại SD và HG',
        user: 'SD_Master_Saigon',
        userProfile: '#',
        userAvatar: Logo2,
        mainImage: GundamPic2,
        images: [
            GundamPic,
            GundamPic2,
            GundamPic3,
        ],
        category: 'Tìm kiếm sản phẩm - SD Gundam',
        time: '2024-03-30T15:45:00',
        content: 'Mình đang sưu tầm dòng SD Gundam World Heroes và hiện còn thiếu vài em trong series. Hiện tại mình đang cần tìm:\n\n1. SD Gundam World Heroes - Wukong Impulse Gundam\n2. SD Gundam World Heroes - Alexander Gundam\n3. SD Gundam World Heroes - Cao Cao Wing Gundam\n\nMình có thể đổi lại các mô hình SD Sangoku Soketsuden hoặc SDCS gần như mới 100%, đã build rất cẩn thận và panel line. Ngoài ra mình còn có nhiều mô hình HG IBO và HG 00 có thể trao đổi.\n\nƯu tiên gặp mặt tại TP.HCM để kiểm tra tình trạng mô hình. Các bạn có thể xem thêm hình ảnh chi tiết của các mô hình mình muốn đổi trong album đính kèm.\n\nMình rất mong được hoàn thiện bộ sưu tập SD World Heroes của mình. Cảm ơn mọi người đã đọc!',
        location: 'TP.HCM',
        condition: 'Mới 100%, đã build và panel line',
        originalPrice: 'Đa dạng, từ 350,000 - 500,000 VND/mô hình',
        exchangeFor: 'SD Gundam World Heroes Series (Wukong Impulse, Alexander, Cao Cao Wing)',
        contactMethod: 'Gặp trực tiếp tại TP.HCM',
    },
    {
        id: 3,
        title: 'Trao đổi PG Unleashed RX-78-2 nguyên seal lấy PG Exia Lighting Model hoặc PG Unicorn Full LED',
        user: 'GunplaExpert_Danang',
        userProfile: '#',
        userAvatar: Logo3,
        mainImage: GundamPic3,
        images: [
            GundamPic,
            GundamPic2,
            GundamPic3,
            GundamPic3,
            GundamPic3,
            GundamPic3,
        ],
        category: 'Trao đổi - Perfect Grade',
        time: '2024-03-28T09:15:00',
        content: 'Mình mới nhận được PG Unleashed RX-78-2 từ Nhật về, còn nguyên seal chưa mở hộp. Đây là phiên bản mới nhất với độ chi tiết cực cao và khung inner frame hoàn hảo.\n\nTuy nhiên, mình đã có một em RX-78-2 bản thường rồi nên muốn trao đổi lấy PG Exia có Lighting Model hoặc PG Unicorn Full LED (ưu tiên bản có LED). Mình có thể bù thêm tiền nếu cần thiết vì giá trị các mô hình này hơi chênh lệch.\n\nMô hình PG Unleashed của mình mua chính hãng từ Yodobashi Camera với giá 27,000 yên, về VN khoảng 7 triệu đồng. Mình có đầy đủ hóa đơn mua hàng và có thể cung cấp mã barcode để check.\n\nĐịa điểm: Mình ở Đà Nẵng nhưng có thể ship toàn quốc (người nhận trả phí ship). Ưu tiên gặp trực tiếp để kiểm tra mô hình.\n\nNgoài ra mình còn nhiều mô hình RG và MG khác có thể trao đổi nếu bạn không có PG. Các bạn có thể xem trong album và liên hệ trao đổi nhé!',
        location: 'Đà Nẵng (có thể ship toàn quốc)',
        condition: 'Mới 100%, nguyên seal',
        originalPrice: '7,000,000 VND (27,000 yên)',
        exchangeFor: 'PG Exia Lighting Model hoặc PG Unicorn Full LED',
        contactMethod: 'Gặp trực tiếp hoặc ship toàn quốc',
        additionalInfo: 'Có hóa đơn mua hàng và mã barcode để kiểm tra'
    },
];

export default function RequestList() {
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (request) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-bold mb-3">CÁC BÀI VIẾT TRAO ĐỔI GUNDAM</h2>

                {/* List các Yêu cầu Trao đổi */}
                <List
                    itemLayout="vertical"
                    dataSource={fakeRequests}
                    renderItem={(item) => (
                        <Card
                            onClick={() => handleOpenModal(item)}
                            className="mb-3 cursor-pointer hover:shadow-md transition-all"
                        >
                            <List.Item className="flex items-center">
                                <div className="content-wrapp space-y-2">
                                    {/* Icon user - username - Time posted */}
                                    <div className="flex flex-col items-start">
                                        <div className='flex items-center gap-3'>
                                            <Avatar size={48} src={item.userAvatar} icon={!item.userAvatar && <UserOutlined />} />
                                            <div className="">
                                                <Link href={item.userProfile} className="mr-4 text-sm">
                                                    {item.user}
                                                </Link>
                                                <Text type="secondary" className="flex items-center text-xs">
                                                    <ClockCircleOutlined className="mr-1" /> {new Date(item.time).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </Text>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nội dung bài Post */}
                                    <div className='content-post flex'>
                                        {/* List ảnh Gundam đăng Trao đổi - Chỉ hiển thị ảnh đại diện */}
                                        <div className="relative mr-4">
                                            <Avatar
                                                src={item.mainImage}
                                                size={80}
                                                shape="square"
                                                className="rounded-md"
                                            />
                                            {item.images && item.images.length > 1 && (
                                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded-bl-md rounded-tr-md flex items-center">
                                                    <PictureOutlined className="mr-1" /> +{item.images.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Nội dung chính của bài post */}
                                        <div className="flex-1">
                                            <h3 className="text-base font-semibold m-0">{item.title}</h3>
                                            <Text type="secondary" className="block text-xs mb-1">
                                                {item.category}
                                            </Text>
                                            <Paragraph ellipsis={{ rows: 2 }} className="text-sm text-gray-600">
                                                {item.content}
                                            </Paragraph>
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        </Card>
                    )}
                />
            </div>

            {/* Modal để hiển thị chi tiết */}
            <Modal
                open={isModalOpen}
                onCancel={handleCloseModal}
                footer={null}
                width={800}
                className='mt-0'
                title={<span className="text-lg font-bold">Chi tiết trao đổi</span>}
            >
                <RequestDetail selectedRequest={selectedRequest} />
            </Modal>
        </>
    );
}