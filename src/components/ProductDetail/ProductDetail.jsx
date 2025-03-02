import { Col, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AddToCart, GetGundamDetailBySlug } from '../../apis/ProductDetail/APIProductDetail'; // Import API của bạn
import ReviewProduct from './Review';
import SuggestProduct from './SuggestProduct';
import ShopInfo from './ShopInfo';
import { useCart } from '../../context/CartContext'; // Import useCart từ Context

const GundamProductPage = () => {
    const { slug } = useParams();
    const { addToCart } = useCart(); // Sử dụng hàm addToCart từ Context

    const [detailGundam, setDetailGundam] = useState([]);
    const [idGundam, setIdGundam] = useState(null);
    const [loadingAdded, setLoadingAdded] = useState(false);
    const [added, setAdded] = useState(false);
    const [imageGundam, setImageGundam] = useState([]);
    const [shopId, setShopId] = useState([]);
    const [selectedImage, setSelectedImage] = useState(imageGundam[0]);

    // Fetch chi tiết sản phẩm
    useEffect(() => {
        const fetchDetailGundamBySlug = async (slug) => {
            try {
                const detailGundam = await GetGundamDetailBySlug(slug);
                const conditionMapping = {
                    "new": "Hàng mới 100%",
                    "open box": "Đã mở hộp",
                    "second hand": "Đã qua sử dụng"
                };
                let gundamData = detailGundam?.data || {};
                if (gundamData.condition) {
                    gundamData.condition = conditionMapping[gundamData.condition] || gundamData.condition;
                }
                setIdGundam(gundamData.id || null);
                setDetailGundam(gundamData);
                setShopId(gundamData.owner_id || []);
                setImageGundam(gundamData.image_urls || []);
            } catch (error) {
                console.log("Fail to fetch detail gundam: No data detected!");
            }
        };
        fetchDetailGundamBySlug(slug);
    }, [slug]);

    // Hàm thêm vào giỏ hàng
    const handleAddToCart = async (id) => {
        setLoadingAdded(true);
        try {
            setLoadingAdded(true);
            await addToCart({ id }); // Sử dụng hàm addToCart từ Context
            setAdded(true);
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error("Error:", error);
            alert("Lỗi khi thêm vào giỏ hàng!");
        } finally {
            setLoadingAdded(false);
        }
    };

    // Hàm định dạng tiền
    const formatCurrencyVND = (price) => {
        if (!price) return "0 vnd";
        return price.toLocaleString("vi-VN") + " vnd";
    };

    // Cập nhật ảnh được chọn
    useEffect(() => {
        if (imageGundam.length > 0) {
            setSelectedImage(imageGundam[0]);
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
                                <div className="flex justify-center items-center">
                                    <img
                                        src={selectedImage}
                                        className="w-full h-[750px] max-w-full max-h-96 object-contain"
                                    />
                                </div>
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

                        {/* Add to cart */}
                        <Col span={7} className='space-y-2'>
                            <div className="p-4 border rounded-lg shadow-md space-y-3">
                                <h1 className="text-xl font-bold text-gray-900">{detailGundam.name}</h1>
                                <div className="flex items-center space-x-4">
                                    <p className="text-2xl font-semibold text-red-500">
                                        Giá: {formatCurrencyVND(detailGundam?.price)}
                                    </p>
                                </div>
                                <div className="space-y-2 text-sm">
                                    {/* <p><span className="font-semibold text-black">Tỉ lệ:</span> {detailGundam.scale}</p> */}
                                    <p className='text-green-600 font-semibold'><span className="font-semibold text-black">Tình trạng:</span> {detailGundam.condition}</p>
                                    {/* <p><span className="font-semibold text-black">Nhà sản xuất:</span> {detailGundam.manufacturer} </p> */}
                                </div>
                                <button
                                    type="button"
                                    className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                    onClick={() => handleAddToCart(idGundam)}
                                >
                                    Mua ngay
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleAddToCart(idGundam)}
                                    disabled={loadingAdded || added}
                                    className={`w-full py-3 rounded-lg font-semibold transition ${added
                                        ? "bg-green-500 text-white cursor-not-allowed"
                                        : "bg-gray-300 text-black hover:bg-gray-400"
                                        }`}
                                >
                                    {added ? "✅ Đã thêm vào giỏ hàng" : loadingAdded ? "Đang thêm..." : "Thêm vào giỏ hàng"}
                                </button>
                            </div>
                            <div className="shop-info">
                                <ShopInfo shopID={shopId} />
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
};

export default GundamProductPage;