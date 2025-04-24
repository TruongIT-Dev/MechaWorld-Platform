// RequestList.jsx
import { Card, List, Avatar, Typography, Modal, Button, Image, Carousel } from 'antd';
import { UserOutlined, ClockCircleOutlined, PictureOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import Logo from '../../assets/image/Logo2.png';
import Logo2 from '../../assets/image/Logo.png';
import Logo3 from '../../assets/image/Logo4.png';

import GundamPic from '../../assets/image/gun9.jpg';
import GundamPic2 from '../../assets/image/gun10.jpg';
import GundamPic3 from '../../assets/image/gun2.jpg';
import ModalOfferExchange from './ModalOfferExchange';
import { getAllExchangePost } from '../../apis/Exchange/APIExchange';
import moment from "moment/min/moment-with-locales";

moment.locale("vi");

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


export default function ExchangeList() {
    const [selectedRequest, setSelectedRequest] = useState(null);
    
    // Modal List Poster Gundam Avaiable
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestData, setRequestData] = useState();
    // Moda Offer Exchange Request
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [listRequest,setListRequest] = useState([]);

    // const requestData = {
    //     id: 'req123',
    //     title: 'Tìm kiếm Gundam Strike Freedom để trao đổi',
    //     user: 'GundamCollector'
    // };
    const [selectedGundamList, setSelectedGundamList] = useState([]);
    const gundamList = [
        {
            id: 1,
            title: 'Gundam EG LAH',
            author: '1/144',
            condition: 'Trung bình khá',
            cover: GundamPic,
            previews: [
                GundamPic2,
                GundamPic3,
                GundamPic
            ]
        },
        {
            id: 2,
            title: 'Doraemon Nihongo',
            author: 'Fujiko F. Fujio',
            condition: 'Trung bình khá',
            cover: 'https://i.imgur.com/bvhm26T.jpg',
            preview: 'https://i.imgur.com/Y3n0N6Z.jpg'
        },
        {
            id: 3,
            title: 'Gundam EG LAH',
            author: '1/144',
            condition: 'Trung bình khá',
            cover: GundamPic,
            previews: [
                GundamPic2,
                GundamPic3,
                GundamPic
            ]
        },
        {
            id: 4,
            title: 'Gundam EG LAH',
            author: '1/144',
            condition: 'Trung bình khá',
            cover: GundamPic,
            previews: [
                GundamPic2,
                GundamPic3,
                GundamPic
            ]
        },
    ];

    const [expandedContent, setExpandedContent] = useState(false);

    const handleOpenModal = (request) => {
         console.log(request);
        setSelectedRequest(request.exchange_post_items);
        setIsModalOpen(true);
       
    };
    const handleOfferModal = (request) => {
         // console.log(request);
        setSelectedRequest(request.exchange_post_items);
        setRequestData(request.poster)
        setIsOfferModalOpen(true);
       
    };
    useEffect(() => {
            getAllExchangePost().then((res) => {
                setListRequest(res.data);
            })
           
    },[])

    return (
        <>
            <div className="bg-white p-4 shadow rounded-lg">
                <h2 className="text-xl font-bold mb-3">CÁC BÀI VIẾT TRAO ĐỔI GUNDAM</h2>

                {/* List các Yêu cầu Trao đổi */}
                <List
                    itemLayout="vertical"
                    dataSource={listRequest}
                    renderItem={(item) => (
                        <Card className="mb-3" >
                            <List.Item className="flex items-center">
                                <div className="content-wrapp space-y-2">
                                    {/* Icon user - username - Time posted */}
                                    <div className="flex flex-col items-start">
                                        <div className='flex items-center justify-between w-full'>
                                            <div className='flex items-center gap-3'>
                                                <Avatar size={48} src={item.poster.avatar_url} icon={!item.poster.avatar_url && <UserOutlined />} />
                                                <div className="">
                                                    <Link href={item.userProfile} className="mr-4 text-sm">
                                                        {item.poster.full_name}
                                                    </Link>
                                                    <Text type="secondary" className="flex items-center text-xs">
                                                        <ClockCircleOutlined className="mr-1" /> {moment(item.exchange_post.created_at).format("LLL")}
                                                    </Text>
                                                </div>
                                            </div>
                                            <div className='space-x-2'>
                                                <Button onClick={() => handleOpenModal(item)} ghost type='primary' className='bg-blue-400'>Gundam Trao Đổi</Button>
                                                <Button onClick={() => handleOfferModal(item)} type='primary' className='bg-blue-500 px-4'>Đề xuất trao đổi</Button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Nội dung bài Post */}
                                    <div className='content-post flex items-center'>
                                        {/* List ảnh Gundam đăng Trao đổi - Chỉ hiển thị ảnh đại diện */}
                                        <div className="relative mr-4">
                                            <Avatar
                                                src={item.exchange_post.post_image_urls[0]}
                                                size={150}
                                                shape="square"
                                                className="rounded-md"
                                            />
                                            {item.exchange_post.post_image_urls && item.exchange_post.post_image_urls.length > 1 && (
                                                <div className="absolute bottom-0 right-0 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded-bl-md rounded-tr-md flex items-center">
                                                    <PictureOutlined className="mr-1" /> +{item.exchange_post.post_image_urls.length - 1}
                                                </div>
                                            )}
                                        </div>

                                        {/* Nội dung chính của bài post */}
                                        <div className="flex-1">
                                            <Paragraph
                                                ellipsis={!expandedContent ? { rows: 4 } : false}
                                                className="text-base text-gray-600"
                                            >
                                                {item.exchange_post.content}
                                            </Paragraph>
                                            <Text
                                                type="secondary"
                                                className="text-blue-500 cursor-pointer text-sm"
                                                onClick={() => setExpandedContent(!expandedContent)}
                                            >
                                                {expandedContent ? 'Ẩn bớt' : 'Xem thêm'}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            </List.Item>
                        </Card>
                    )}
                />
            </div>

            {/* Modal Gửi Yêu cầu Đề Xuất Trao Đổi */}
            <ModalOfferExchange
                isOpen={isOfferModalOpen}
                onClose={() => setIsOfferModalOpen(false)}
                requestData={requestData}
                gundamList={selectedRequest}
            />

            {/* Modal để hiển thị các gundam mà Người đăng sẵn sàng Trao đổi */}
            <Modal
                title="DANH SÁCH GUNDAM CÓ SẴN ĐỂ TRAO ĐỔI"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                width={800}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={selectedRequest}
                    className="mt-4 max-h-96 overflow-auto"
                    renderItem={(item) => (
                        <List.Item className="items-start">
                            <List.Item.Meta
                                avatar={<Image src={item.primary_image_url} width={120} height={150} />}
                                title={<Text strong className='text-base'>{item.title}</Text>}
                                description={
                                    <>
                                        <div>Phân khúc: {item.grade}</div>
                                        <div>
                                            Tình trạng: <Text strong>{item.condition}</Text>
                                        </div>
                                        <div>
                                            Phiên bản: <Text strong>{item.version}</Text>
                                        </div>
                                    </>
                                }
                            />
                            <Carousel
                                dots={false}
                                arrows
                                slidesToShow={2}
                                slidesToScroll={1}
                                className="w-[320px]"
                                prevArrow={<button className="text-black bg-black rounded-full p-2">←</button>}
                                nextArrow={<button className="text-white bg-black rounded-full p-2">→</button>}
                            >
                                {(item.secondary_image_urls || []).map((imgUrl, idx) => (
                                    <div key={idx} className="px-1">
                                        <Image
                                            src={imgUrl}
                                            width={120}
                                            height={170}
                                            className="object-cover rounded-md"
                                            preview={true}
                                        />
                                    </div>
                                ))}
                            </Carousel>

                        </List.Item>
                    )}
                />

                <div className="flex justify-end mt-4">
                    <Button type="primary" onClick={() => setIsModalOpen(false)}>
                        Đóng
                    </Button>
                </div>
            </Modal>
        </>
    );
}