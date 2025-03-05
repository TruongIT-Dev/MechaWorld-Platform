import { Card } from "antd";
import { CheckCircleOutlined, ThunderboltOutlined, CustomerServiceOutlined } from "@ant-design/icons";


const ProductInfo = ({ info }) => {
    return (
        <>
            <div className="max-w-2xl mx-auto space-y-4">
                {/* An tâm mua sắm */}
                <Card className="shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">An tâm mua sắm</h2>
                    <div className="space-y-2">
                        <p className="flex items-center gap-2">
                            <CheckCircleOutlined className="text-green-500 text-lg" />
                            Được đồng kiểm khi nhận hàng
                        </p>
                        <p className="flex items-center gap-2">
                            <ThunderboltOutlined className="text-yellow-500 text-lg" />
                            Giao hàng nhanh chóng, đóng gói cẩn thận
                        </p>
                        <p className="flex items-center gap-2">
                            <CustomerServiceOutlined className="text-purple-500 text-lg" />
                            Hỗ trợ 24/7 từ đội ngũ chuyên nghiệp
                        </p>

                    </div>
                </Card>

                {/* Thông tin chi tiết */}
                <Card className="shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold mb-3">Thông tin chi tiết</h2>
                    <div className="divide-y divide-gray-200">
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Tỉ lệ</span>
                            <span className="font-medium">{info?.scale}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Phân khúc</span>
                            <span className="font-medium">{info?.grade}</span>
                        </div>
                        {/* <div className="flex justify-between py-2">
                            <span className="text-gray-500">Tình trạng</span>
                            <span className="font-medium">{info?.condition}</span>
                        </div> */}
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Khối lượng</span>
                            <span className="font-medium">1.2kg</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Phụ kiện đi kèm</span>
                            <span className="font-medium">Đế trưng bày</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-500">Nhà sản xuất</span>
                            <span className="font-medium">{info?.manufacturer}</span>
                        </div>
                        {/* <div className="flex justify-between py-2">
                            <span className="text-gray-500">Xuất xứ</span>
                            <span className="font-medium">Nhật Bản</span>
                        </div> */}
                    </div>
                </Card>

                {/* Mô tả sản phẩm */}
                <Card className="shadow-md rounded-lg">
                    <h2 className="text-xl font-semibold text-gray-900">Mô tả sản phẩm</h2>
                    <p className="mt-4 text-gray-700">{info?.description}</p>
                </Card>
            </div>
        </>
    )
}
export default ProductInfo