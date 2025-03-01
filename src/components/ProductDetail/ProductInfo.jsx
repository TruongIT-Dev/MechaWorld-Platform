import { Card } from "antd";
import { CheckCircleOutlined, SyncOutlined, GiftOutlined } from "@ant-design/icons";


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


const ProductInfo = () => {
    return (
        <>
            <div className="max-w-2xl mx-auto space-y-4">
                {/* An tâm mua sắm */}
                <Card className="shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">An tâm mua sắm</h2>
                    <div className="space-y-2">
                        <p className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-blue-500" />
                            Được đồng kiểm khi nhận hàng
                        </p>
                        <p className="flex items-center gap-2 text-blue-600 font-semibold">
                            <SyncOutlined spin className="text-blue-500" />
                            Được hoàn tiền 200% nếu là hàng giả.
                        </p>
                    </div>
                </Card>

                {/* Thông tin chi tiết */}
                <Card className="shadow-md rounded-lg">
                    <h2 className="text-lg font-semibold mb-3">Thông tin chi tiết</h2>
                    <div className="divide-y divide-gray-200">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Tỉ lệ</span>
                            <span className="font-medium">1/100</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Loại</span>
                            <span className="font-medium">Super Deformed</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Tình trạng</span>
                            <span className="font-medium">Tốt</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Khối lượng</span>
                            <span className="font-medium">1.2kg</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Phụ kiện đi kèm</span>
                            <span className="font-medium">Đế dựng đứng Gundam</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Nhà sản xuất</span>
                            <span className="font-medium">Bandai</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Xuất xứ</span>
                            <span className="font-medium">Nhật Bản</span>
                        </div>
                    </div>
                </Card>

                {/* Mô tả sản phẩm */}
                <Card className="shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900">Mô tả sản phẩm</h2>
                    <p className="mt-4 text-gray-700">{product.description}</p>
                </Card>
            </div>
        </>
    )
}
export default ProductInfo