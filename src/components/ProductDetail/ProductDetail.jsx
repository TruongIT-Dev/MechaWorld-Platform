import { Col, Row  } from 'antd';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { AddToCart, GetAllCartItem, GetGundamDetailBySlug } from '../../apis/ProductDetail/APIProductDetail';

import ReviewProduct from './Review';
import SuggestProduct from './SuggestProduct';
import ShopInfo from './ShopInfo';
import ProductInfo from './ProductInfo';


const GundamProductPage = () => {
    const { slug } = useParams();

    const [detailGundam, setDetailGundam] = useState([]);
    const [idGundam, setIdGundam] = useState(null);
    const [loadingAdded, setLoadingAdded] = useState(false);
    const [added, setAdded] = useState(false);
    const [imageGundam, setImageGundam] = useState([]);
    const [shopId, setShopId] = useState([]);
    const [selectedImage, setSelectedImage] = useState(imageGundam[0]);



    // ************ Fetch Data Deatail Gundam by Slug ******************
    useEffect(() => {
        const fetchDetailGundamBySlug = async (slug) => {
            try {
                const detailGundam = await GetGundamDetailBySlug(slug);

                // Mapping condition từ tiếng Anh sang tiếng Việt
                const conditionMapping = {
                    "new": "Hộp mới nguyên dạng, chưa bóc seal, linh kiện không bị hư hại, đủ phụ kiện đi kèm",
                    "open box": "Đã mở hộp",
                    "second hand": "Đã qua sử dụng"
                };

                // Chuyển đổi condition nếu có
                let gundamData = detailGundam?.data || {};
                if (gundamData.condition) {
                    gundamData.condition = conditionMapping[gundamData.condition] || gundamData.condition;
                }

                // Cập nhật state
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



    // Khi component mount, lấy danh sách sản phẩm từ API
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const response = await GetAllCartItem(); // Gọi API lấy giỏ hàng từ DB
                const cartItems = response?.data || [];  // Đảm bảo có dữ liệu
                console.log("cartItems", cartItems);

                if (cartItems.some(item => item?.gundam_id === idGundam)) {
                    setAdded(true); // Nếu sản phẩm đã có trong giỏ hàng thì đổi UI
                }
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
        };
        fetchCartItems();
    }, [idGundam]);


    // Handle Add To Cart
    const handleAddToCart = async (id) => {
        setLoadingAdded(true);
        try {
            const response = await AddToCart(id);

            // Cập nhật localStorage
            const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            if (!cartItems.includes(id)) {
                cartItems.push(id);
                localStorage.setItem("cartItems", JSON.stringify(cartItems));
            }

            setAdded(true);
            console.log("Added to cart:", response.data);
            alert("Sản phẩm đã được thêm vào giỏ hàng!");
        } catch (error) {
            console.error("Error:", error);
            alert("Lỗi khi thêm vào giỏ hàng!");
        } finally {
            setLoadingAdded(false);
        }
    };


    // ************** Hàm Format Tiền Việt *****************
    const formatCurrencyVND = (price) => {
        if (!price) return "0 vnd";
        return price.toLocaleString("vi-VN") + " vnd";
    };



    // *************** Lưu Mảng Ảnh gundam *****************
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
                                <ProductInfo />
                            </div>
                        </Col>

                        {/* Add to card */}
                        <Col span={7} className='space-y-2'>
                            <div className="p-4 border rounded-lg shadow-md space-y-3">
                                {/* Product Name */}
                                <h1 className="text-xl font-bold text-gray-900">{detailGundam.name}</h1>

                                {/* Price */}
                                <div className="flex items-center space-x-4">
                                    <p className="text-2xl font-semibold text-red-500">
                                        Giá: {formatCurrencyVND(detailGundam?.price)}
                                    </p>
                                </div>

                                {/* Gundam Info */}
                                <div className="space-y-2 text-sm">
                                    {/* <p><span className="font-semibold text-black">Tỉ lệ:</span> {detailGundam.scale}</p> */}
                                    <p className='text-green-600 font-semibold'><span className="font-semibold text-black">Tình trạng:</span> {detailGundam.condition}</p>
                                    {/* <p><span className="font-semibold text-black">Nhà sản xuất:</span> {detailGundam.manufacturer} </p> */}
                                </div>

                                {/* Buy Button */}
                                <button
                                    type="button"
                                    className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                    onClick={handleAddToCart} // Thêm sự kiện onClick
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

                            {/* Seller Info */}
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
}
export default GundamProductPage