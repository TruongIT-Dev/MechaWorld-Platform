import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { GetGundamDetailBySlug } from '../../apis/ProductDetail/APIProductDetail';

import ReviewProduct from './Review';
import SuggestProduct from './SuggestProduct';
import ShopInfo from './ShopInfo';


const product = {
    name: 'Gundam RX-78-2',
    price: '$299',
    originalPrice: '$349',
    discount: 15,
    images: [
        { src: 'https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg', alt: 'Ảnh 1' },
        { src: 'https://images-na.ssl-images-amazon.com/images/I/51qL8XPsDbS.jpg', alt: 'Ảnh 2' },
        { src: 'https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg', alt: 'Ảnh 3' },
        { src: 'https://images.amain.com/cdn-cgi/image/f=auto,width=950/images/large/bas/bas2509667_2.jpg', alt: 'Ảnh 4' },
    ],
    description:
        'Sở hữu mô hình Gundam RX-78-2 mang tính biểu tượng, được chế tác tỉ mỉ với từng chi tiết hoàn hảo. Một lựa chọn không thể thiếu cho bất kỳ fan Gundam nào!',
    highlights: [
        'Chi tiết cực kỳ chính xác',
        'Chất liệu cao cấp',
        'Bao gồm các phụ kiện và vũ khí',
        'Kích thước tỷ lệ 1/100',
    ],
    details:
        'Mô hình được sản xuất bởi Bandai, thuộc dòng sản phẩm Master Grade nổi tiếng. Gói sản phẩm bao gồm bộ phận ráp, sách hướng dẫn, và các decal dán chi tiết.',
    shippingInfo: {
        deliveryFee: 'Miễn phí',
    },
    seller: {
        name: 'Gundam Store',
        totalSales: '3.5k+',
    },
};

const GundamProductPage = () => {
    const { slug } = useParams();

    const [detailGundam, setDetailGundam] = useState([]);
    const [imageGundam, setImageGundam] = useState([]);
    const [shopId, setShopId] = useState([]);
    const [selectedImage, setSelectedImage] = useState(imageGundam[0]);

    // Fetch Data Deatail Gundam by Slug
    useEffect(() => {
        const fetchDetailGundamBySlug = async (slug) => {
            try {
                const detailGundam = await GetGundamDetailBySlug(slug);

                setDetailGundam(detailGundam?.data || []);
                setShopId(detailGundam?.data?.owner_id || []);

                setImageGundam(detailGundam?.data?.image_urls || []);


            } catch (error) {
                console.log("Fail to fetch detail gundam: No data detected!");
            }
        }

        fetchDetailGundamBySlug(slug);
    }, [slug])

    console.log("selectedImage", selectedImage);


    // Lưu Mảng Ảnh gundam
    useEffect(() => {
        if (imageGundam.length > 0) {
            setSelectedImage(imageGundam[0]); // Chọn ảnh đầu tiên làm ảnh chính
        }
    }, [imageGundam]);


    return (
        <div className="container mt-24 p-6 bg-white">
            <div className="wrapper mx-40">
                {/* Main Section */}
                <div className="top-section">
                    <Row gutter={24}>
                        {/* Image */}
                        <Col span={8}>
                            <div className="image-section">
                                {/* Main Display Image */}
                                <div className="flex justify-center items-center">
                                    <img
                                        src={selectedImage}
                                        className="w-full h-[750px] max-w-full max-h-96 object-contain"
                                    />
                                </div>

                                {/* Thumbnail List */}
                                <div className="mt-4 overflow-auto">
                                    <div className="flex gap-4 max-w-[320px]">
                                        {imageGundam.slice(0, 5).map((image, index) => (
                                            <img
                                                key={index}
                                                src={image}
                                                className={`w-20 h-20 object-cover cursor-pointer rounded-lg border 
                ${selectedImage === image ? 'border-red-500' : 'border-gray-200'}`}
                                                onClick={() => setSelectedImage(image)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Col>

                        {/* Describe */}
                        <Col span={9}>
                            <div className="description-section">
                                <div className="p-4 border rounded-lg shadow-sm">
                                    <h2 className="text-xl font-semibold text-gray-900">Mô tả sản phẩm</h2>
                                    <p className="mt-4 text-gray-700">{product.description}</p>

                                    <h2 className="mt-8 text-lg font-semibold text-gray-900">Điểm nổi bật</h2>
                                    <ul className="mt-4 list-disc pl-6 space-y-2 text-gray-700">
                                        {product.highlights.map((highlight) => (
                                            <li key={highlight}>{highlight}</li>
                                        ))}
                                    </ul>

                                    <h2 className="mt-8 text-lg font-semibold text-gray-900">Thông tin chi tiết</h2>
                                    <p className="mt-4 text-gray-700">{product.details}</p>
                                </div>
                            </div>
                        </Col>

                        {/* Add to card */}
                        <Col span={7}>
                            <div className="p-4 border rounded-lg shadow-sm space-y-4">
                                {/* Product Name */}
                                <h1 className="text-xl font-bold text-gray-900">{detailGundam.name}</h1>

                                {/* Price */}
                                <div className="flex items-center space-x-4">
                                    <p className="text-2xl font-semibold text-red-500">
                                        Giá: {detailGundam.price} VND
                                    </p>
                                </div>

                                {/* Gundam Info */}
                                <div className="space-y-2 text-sm">
                                    <p><span className="font-semibold text-black">Scale:</span> {detailGundam.scale}</p>
                                    <p><span className="font-semibold text-black">Tình trạng:</span> {detailGundam.condition}</p>
                                    <p><span className="font-semibold text-black">Nhà sản xuất:</span> {detailGundam.manufacturer} </p>
                                    <p className={`font-semibold ${detailGundam.status === "available" ? 'text-green-400' : 'text-red-400'}`}><span className="font-semibold text-black">Status:</span> {detailGundam.status}</p>
                                </div>

                                {/* Seller Info with Hover Dropdown */}
                                <div className="space-y-2">
                                    <ShopInfo shop={shopId} />
                                </div>

                                {/* Buy Button */}
                                <button
                                    type="button"
                                    className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                >
                                    Thêm vào giỏ hàng
                                </button>

                                <button
                                    type="button"
                                    className="w-full py-3 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-500 transition"
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Comment and Rating Section */}
                <ReviewProduct />

                {/* Suggested Products */}
                <SuggestProduct />
            </div>
        </div>
    );
}
export default GundamProductPage