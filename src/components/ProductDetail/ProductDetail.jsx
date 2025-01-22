import { Col, Row, Rate, Tag } from 'antd';
import { useState } from 'react';
import ReviewProduct from './Review';
import SuggestProduct from './SuggestProduct';

const product = {
    name: 'Gundam RX-78-2',
    price: '$299',
    originalPrice: '$349',
    discount: 15,
    href: '#',
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
        location: 'Hà Nội, Việt Nam',
    },
    seller: {
        name: 'Gundam Store',
        rating: 4.9,
        totalSales: '3.5k+',
    },
};

const reviews = { href: '#', average: 4.8, totalCount: 245 };

export default function GundamProductPage() {
    const [selectedImage, setSelectedImage] = useState(product.images[0]);

    return (
        <div className="container p-6 bg-white">
            <div className="wrapper mx-40">
                {/* Main Section */}
                <div className="top-section">
                    <Row gutter={24}>
                        {/* Product Image */}
                        <Col span={16}>
                            <div className="flex gap-6">
                                {/* Thumbnail List */}
                                <div className="flex flex-col gap-4">
                                    {product.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.src}
                                            alt={image.alt}
                                            className={`w-20 h-20 object-cover cursor-pointer rounded-lg border ${selectedImage.src === image.src
                                                ? 'border-red-500'
                                                : 'border-gray-200'
                                                }`}
                                            onClick={() => setSelectedImage(image)}
                                        />
                                    ))}
                                </div>

                                {/* Main Display Image */}
                                <div className="flex-1 flex justify-center items-center">
                                    <img
                                        src={selectedImage.src}
                                        alt={selectedImage.alt}
                                        className="max-w-full max-h-96 object-cover"
                                    />
                                </div>
                            </div>
                        </Col>

                        {/* Product Info */}
                        <Col span={8}>
                            <div className="p-4 border rounded-lg shadow-sm space-y-4">
                                {/* Product Name */}
                                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>

                                {/* Price and Discount */}
                                <div className="flex items-center space-x-4">
                                    <p className="text-4xl font-semibold text-red-600">{product.price}</p>
                                    <p className="line-through text-gray-500">{product.originalPrice}</p>
                                    <Tag color="green">-{product.discount}%</Tag>
                                </div>

                                {/* Reviews */}
                                <div className="flex items-center space-x-2">
                                    <Rate disabled defaultValue={reviews.average} />
                                    <span className="text-sm text-gray-600">({reviews.totalCount} đánh giá)</span>
                                </div>

                                {/* Shipping Info */}
                                <div className="mt-4 space-y-2 text-sm">
                                    <p>
                                        <span className="font-semibold">Giao hàng:</span> {product.shippingInfo.deliveryFee}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Xuất xứ:</span> {product.shippingInfo.location}
                                    </p>
                                </div>

                                {/* Seller Info */}
                                <div className="mt-4 space-y-2 text-sm">
                                    <p>
                                        <span className="font-semibold">Nhà bán hàng:</span> {product.seller.name}
                                    </p>
                                    <p>
                                        <span className="font-semibold">Đánh giá:</span> {product.seller.rating} / 5
                                    </p>
                                    <p>
                                        <span className="font-semibold">Đã bán:</span> {product.seller.totalSales}
                                    </p>
                                </div>

                                {/* Buy Button */}
                                <button
                                    type="button"
                                    className="w-full py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                                >
                                    Thêm vào giỏ hàng
                                </button>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Product Desciption */}
                <div className="description-section">
                    <div className="mt-8 p-4 border rounded-lg shadow-sm">
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

                {/* Comment and Rating Section */}
                <ReviewProduct />

                {/* Suggested Products */}
                <SuggestProduct />
            </div>
        </div>
    );
}
