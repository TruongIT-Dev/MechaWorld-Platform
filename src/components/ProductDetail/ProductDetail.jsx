import { Col, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AddToCart, GetAllCartItem, GetGundamDetailBySlug } from '../../apis/ProductDetail/APIProductDetail';
import { verifyToken } from '../../apis/Auth/APIAuth';
import Cookies from 'js-cookie';
import ReviewProduct from './Review';
import SuggestProduct from './SuggestProduct';
import ShopInfo from './ShopInfo';
import ProductInfo from './ProductInfo';
import { useCart } from '../../context/CartContext'; // Import useCart từ Context

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
    const navigate = useNavigate();

    const [detailGundam, setDetailGundam] = useState([]);
    const [accessories, setAccessories] = useState([]);

    const [idGundam, setIdGundam] = useState(null);
    const [loadingAdded, setLoadingAdded] = useState(false);
    const [added, setAdded] = useState(false);
    const [imageGundam, setImageGundam] = useState([]);
    const [shopId, setShopId] = useState([]);
    const [userId, setUserId] = useState("");
    const [disableBuy, setDisableBuy] = useState(false);
    const [selectedImage, setSelectedImage] = useState(imageGundam[0]);

    // Fetch chi tiết sản phẩm
    useEffect(() => {
        const fetchDetailGundamBySlug = async (slug) => {
            try {
                const detailGundam = await GetGundamDetailBySlug(slug);
                console.log("detailGundam", detailGundam);

                // Mapping condition từ tiếng Anh sang tiếng Việt
                const conditionMapping = {
                    "new": "Hàng mới 100%",
                    "open box": "Đã mở hộp",
                    "used": "Đã qua sử dụng"
                };
                let gundamData = detailGundam?.data?.Gundam || {};
                let assessoriesData = detailGundam?.data?.accessories; 
                if (gundamData.condition) {
                    gundamData.condition = conditionMapping[gundamData.condition] || gundamData.condition;
                }
                setDetailGundam(gundamData);
                setAccessories(assessoriesData);
                setIdGundam(gundamData?.id || null);
                setShopId(gundamData?.owner_id || []);
                setImageGundam(gundamData?.image_urls || []);
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
                // console.log("cartItems", cartItems);

                if (cartItems.some(item => item?.gundam_id === idGundam)) {
                    setAdded(true); // Nếu sản phẩm đã có trong giỏ hàng thì đổi UI
                }
            } catch (error) {
                console.error("Lỗi khi lấy giỏ hàng:", error);
            }
        };
        fetchCartItems();
    }, [idGundam]);


    // Lấy thông tin User từ Cookie để nhận dạng items có phải của Shop?
    useEffect(() => {
        const Access_token = Cookies.get('access_token');
        if (Access_token) {
            try {
                verifyToken(Access_token).then(response => {
                    // console.log(response?.data);
                    setUserId(response?.data?.id);

                })
            } catch (error) {
                console.error("Lỗi từ API:", error);
            }
        }
    }, [])


    // Kiểm tra nếu shopId === userId thì disable nút
    useEffect(() => {
        if (shopId !== null && userId !== null && shopId === userId) {
            setDisableBuy(true);
        } else {
            setDisableBuy(false);
        }
    }, [shopId, userId]);

    // Handle Add To Cart
    const handleAddToCart = async (id) => {
        setLoadingAdded(true);

        try {
            // Kiểm tra nếu chưa đăng nhập
            if (!userId) {
                message.error('Bạn cần phải Đăng nhập trước!');
                navigate('/signIn');
                return;
            }

            // Tạo độ trễ trước khi thêm vào giỏ hàng
            setTimeout(async () => {
                try {
                    // Gọi API để thêm vào giỏ hàng
                    const response = await AddToCart(id);
                    if (response?.data) {
                        setAdded(true);
                        message.success('Đã thêm vào giỏ hàng.');
                    }
                } catch (error) {
                    message.error("Lỗi khi thêm vào giỏ hàng!");
                    console.error("Error:", error);
                } finally {
                    setLoadingAdded(false);
                }
            }, 1500); // Độ trễ 1.5 giây

        } catch (error) {
            message.error("Lỗi Added Cart!");
            console.error("Error:", error);
            setLoadingAdded(false);
        }
    };


    // Handle Buy Instant
    const handleBuyNow = async (id) => {
        try {
            // Kiểm tra nếu chưa đăng nhập
            if (!userId) {
                message.error('Bạn cần phải Đăng nhập trước!');
                navigate('/signIn');
                return; // Dừng function tại đây
            }

            // Gọi API để thêm vào giỏ hàng
            const response = await AddToCart(id);
            if (response?.data) {
                setAdded(true);
                navigate('/checkout');
            }

        } catch (error) {
            message.error("Sản phẩm đã có trong Giỏ hàng!");
            console.error("Error:", error);
        } finally {
            setLoadingAdded(false);
        }
    }


    // ************** Hàm Format Tiền Việt *****************
    const formatCurrencyVND = (price) => {
        if (!price) return "0 vnd";
        return price.toLocaleString("vi-VN") + " VND";
    };

    // Cập nhật ảnh được chọn
    useEffect(() => {
        if (imageGundam.length > 0) {
            setSelectedImage(imageGundam[0]);
        }
    }, [imageGundam]);

    return (
        <div className="container mt-24 p-6 bg-gray-100">
            <div className="wrapper mx-40">
                {/* Main Section */}
                <div className="top-section">
                    <Row gutter={24}>
                        {/* Image */}
                        <Col span={8}>
                            <div className="image-section sticky top-24">
                                {/* Main Display Image */}
                                <div className="flex justify-center items-center bg-white shadow-md rounded-md">
                                    <img
                                        src={selectedImage}
                                        className="w-full h-[750px] max-w-full max-h-96 object-contain"
                                    />
                                </div>

                                {/* Thumbnail List */}
                                <div className="mt-4 overflow-auto bg-white shadow-md py-2 rounded-lg">
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
                                <ProductInfo info={detailGundam} assessories={accessories} />
                            </div>
                        </Col>

                        {/* Add to card */}
                        <Col span={7}>
                            <div className='space-y-4 sticky top-24'>
                                <div className="p-4 border rounded-lg bg-white shadow-md space-y-3">
                                    {/* Product Name */}
                                    <h1 className="text-xl font-bold text-gray-900">{detailGundam?.name}</h1>

                                    {/* Price */}
                                    <div className="flex items-center space-x-4">
                                        <p className="text-2xl font-semibold text-red-500">
                                            Giá: {formatCurrencyVND(detailGundam?.price)}
                                        </p>
                                    </div>


                                    {/* Gundam Info */}
                                    <div className="space-y-2 text-sm">
                                        <p className='text-green-600 font-semibold'><span className="font-semibold text-black">Tình trạng:</span> {detailGundam.condition}</p>
                                    </div>

                                    {/* Buy Button */}
                                    <button
                                        type="button"
                                        className={`w-full py-3 rounded-lg font-semibold transition ${disableBuy ? "bg-gray-300 text-gray-400 cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"
                                            }`}
                                        onClick={disableBuy ? null : () => handleBuyNow(idGundam)}
                                        disabled={disableBuy}
                                    >
                                        Mua ngay
                                    </button>

                                    {/* Add to Cart Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleAddToCart(idGundam)}
                                        disabled={disableBuy || loadingAdded || added}
                                        className={`w-full py-3 rounded-lg font-semibold transition 
    ${disableBuy ? "bg-gray-300 text-gray-400 cursor-not-allowed" :
                                                added ? "bg-green-500 text-white hover:bg-green-600" :
                                                    "bg-gray-300 text-black hover:bg-gray-400"}
  `}
                                    >
                                        {disableBuy
                                            ? "🚫 Không thể mua"
                                            : added
                                                ? "✅ Đã thêm vào giỏ hàng"
                                                : loadingAdded
                                                    ? "Đang thêm..."
                                                    : "Thêm vào giỏ hàng"}
                                    </button>
                                </div>
                                {/* Seller Info */}
                                <div className="shop-info sticky ">
                                    <ShopInfo shopID={shopId} />
                                </div>
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