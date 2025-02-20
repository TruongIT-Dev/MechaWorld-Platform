import { Input, Card, Button, Tag, Flex } from 'antd';
import { SearchOutlined, PlusOutlined, SwapOutlined } from '@ant-design/icons';
import { useState } from 'react';

import gun3 from '../../assets/image/gun3.jpg';
import gun4 from '../../assets/image/gun4.jpg';
import gun8 from '../../assets/image/gun10.jpg';
import gun5 from '../../assets/image/gun5.jpg';
import gun6 from '../../assets/image/gun6.jpg';

import noProductFound from '../../assets/image/no-product-found.png';
import { Link } from 'react-router-dom';

const exchangeRequests = [
    {
        id: 1,
        title: "Xin trao đổi Gundam Striker Defense Blue RX-50",
        desc: "💥 Mình đang có: Gundam Obsidian – Chi tiết sắc nét, tình trạng tốt, đã lắp ráp cẩn thận.\n📌 Tình trạng: Nguyên vẹn, đầy đủ phụ kiện.\n📸 Hình ảnh chi tiết có sẵn, ai quan tâm ib trao đổi nhé!\n📍 Khu vực: Tp. Hồ Chí Minh\n\n🤝 Ai có nhu cầu trao đổi thì liên hệ mình nha! 🚀💫",
        want: "Gundam Barbatos",
        image: gun3,
    },
    {
        id: 2,
        title: 'Cần người trao đổi Unicorn V2.0',
        desc: "🔹 Mình đang sở hữu Gundam Exia – Đã lắp ráp, giữ gìn kỹ.\n📌 Tình trạng: Full box, phụ kiện đầy đủ.\n📍 Khu vực: Hà Nội\n\n💬 Ai quan tâm trao đổi thì inbox mình nhé!",
        want: 'Gundam Unicorn',
        image: gun4,
    },
    {
        id: 3,
        title: 'Mong muốn được trao đổi với Nemesis Blue Lock',
        desc: "✨ Hiện tại mình có Gundam Wing Zero – Đã lắp, trưng bày rất đẹp.\n📌 Tình trạng: Không thiếu món nào, còn nguyên zin.\n📍 Khu vực: Đà Nẵng\n\n💡 Muốn đổi lấy một em khác, ai có nhắn mình nhé!",
        want: 'Gundam Astray Red Frame',
        image: gun8,
    },
    {
        id: 4,
        title: 'Cần đổi Gundam Destiny Extreme Blast',
        desc: "🔥 Mình có Gundam Destiny Extreme Blast Mode, còn rất mới.\n📌 Tình trạng: Đầy đủ vũ khí, hiệu ứng.\n📍 Khu vực: Tp. Hồ Chí Minh\n\n🚀 Ai có Gundam Freedom muốn trao đổi thì liên hệ mình nhé!",
        want: 'Gundam Freedom',
        image: gun5,
    },
    {
        id: 5,
        title: 'Tìm người đổi Gundam Sinanju Stein',
        desc: "⚡️ Cần trao đổi Gundam Sinanju Stein ver.Ka.\n📌 Tình trạng: Full box, đã sơn top coat, còn đẹp.\n📍 Khu vực: Hà Nội\n\n🔁 Ai có Gundam Sazabi hoặc Nu Gundam muốn đổi thì inbox mình nhé!",
        want: 'Gundam Sazabi',
        image: gun6,
    },
];

const noGundams = [];

export default function Exchange() {
    const [search, setSearch] = useState('');

    return (
        <div className="container">
            <div className="max-w-4xl mx-auto mt-24 p-4">
                {/* Header Search */}
                <div className="mb-4 py-4 rounded-lg flex space-x-4 items-center">
                    <Button type="default" color='primary' size='large' icon={<PlusOutlined />} className='w-1/4 text-white bg-slate-600'>Đăng bài Trao đổi</Button>
                    <Input
                        size="large"
                        prefix={<SearchOutlined />}
                        placeholder="Bạn muốn tìm yêu cầu trao đổi ..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-1/2"
                    />
                    <Button type="primary" size='large' className="w-1/5 text-white bg-blue-300">Tìm kiếm</Button>
                </div>

                {/* Exchange Requests List */}
                {exchangeRequests.length > 0 ? (
                    <div className="space-y-4">
                        {exchangeRequests.map((req) => (
                            <Card key={req.id} className="shadow-md">
                                <div className="card-wrapper flex justify-between items-center space-x-4">
                                    <div className='card-content flex space-x-2'>
                                        <img
                                            className='rounded-lg w-[200px] h-[150px] object-cover'
                                            src={req.image}
                                            alt={req.title}
                                        />
                                        <div className='flex flex-col justify-between w-full'>
                                            <h3 className="text-lg font-semibold">{req.title}</h3>
                                            <p className="text-gray-600 text-left">{req.desc}</p>
                                            <div className='flex items-center space-x-2'>
                                                <p>Mong muốn đổi:</p>
                                                <Flex gap="4px 0" wrap>
                                                    <Tag color="blue">{req.want}</Tag>
                                                </Flex>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='card-button'>
                                        <Button type='default' icon={<SwapOutlined />}>
                                            <Link to='/exchange-detail'>
                                                Trao đổi
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="flex items-center space-x-4 justify-center bg-gray-100 px-4 py-10 rounded-lg shadow-md">
                            <img
                                src={noProductFound}
                                alt="Không có sản phẩm nào"
                                className="w-80 h-60 object-cover rounded-lg shadow-lg"
                            />
                            <div className='flex flex-col items-center text-justify'>
                                <h1 className="mt-6 text-3xl font-bold text-red-600">Oops! Chưa có bài trao đổi nào</h1>
                                <p className="mt-2 text-gray-600 text-lg max-w-md">
                                    Trang web hiện chưa có bài trao đổi nào. Hãy là người đầu tiên đăng bài!
                                </p>
                                <button
                                    onClick={() => window.location.href = '/'}
                                    className="mt-6 px-6 py-3 bg-rose-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-300 transition"
                                >
                                    Quay về Trang chủ
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
