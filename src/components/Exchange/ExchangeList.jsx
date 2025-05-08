// RequestList.jsx
import { Card, List, Avatar, Typography, Modal, Button, Image, Carousel } from 'antd';
import { UserOutlined, ClockCircleOutlined, PictureOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import ModalOfferExchange from './ModalOfferExchange';
import { getAllExchangePost } from '../../apis/Exchange/APIExchange';
import moment from "moment/min/moment-with-locales";
import { useSelector } from 'react-redux';
import { GetGundamByID } from '../../apis/User/APIUser';

moment.locale("vi");

const { Link, Text, Paragraph } = Typography;


export default function ExchangeList() {
    const [selectedRequest, setSelectedRequest] = useState(null);

    // Modal List Poster Gundam Avaiable
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [requestData, setRequestData] = useState();
    // Moda Offer Exchange Request
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [listRequest, setListRequest] = useState([]);
    const user = useSelector((state) => state.auth.user);
    const [requestPost, setRequestPost] = useState(null);
    const [yourGundamList, setYourGundamList] = useState([]);


    const [expandedContent, setExpandedContent] = useState(false);

    const handleOpenModal = (request) => {
        console.log(request);
        setSelectedRequest(request.exchange_post_items);
        setIsModalOpen(true);

    };
    const handleOfferModal = (request) => {
        // console.log(request);
        setSelectedRequest(request.exchange_post_items);
        setRequestData(request.poster);
        setRequestPost(request.exchange_post);
        setIsOfferModalOpen(true);

    };
    useEffect(() => {
        getAllExchangePost().then((res) => {
            setListRequest(res.data);
        })
        GetGundamByID(user.id, "").then((res) => {
            setYourGundamList(res.data);
        })


    }, [])

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
                yourGundamList={yourGundamList}
                requestPost={requestPost}
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
                                        <div><Text className='text-base' strong>{item.name}</Text></div>
                                        <div> Tình trạng: <Text strong>{item.condition}</Text> </div>
                                        <div> Phân khúc: <Text strong>{item.grade}</Text></div>
                                        <div> Phiên bản: <Text strong>{item.version}</Text></div>
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