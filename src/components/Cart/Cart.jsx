import { Col, Row, Tooltip } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export default function Cart() {
    const cartData = [
        {
            category: "High Grade",
            items: [
                {
                    id: 1,
                    name: "Gundam RX-78-2",
                    seller: "Masashi Kishimoto",
                    price: 50000,
                    image: "https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg",
                },
                {
                    id: 2,
                    name: "Gundam RX-78-2",
                    seller: "Masashi Kishimoto",
                    price: 240000,
                    image: "https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg",
                },
            ],
        },
        {
            category: "None Grade",
            items: [
                {
                    id: 3,
                    name: "Gundam RX-78-2",
                    seller: "Marvel Comics",
                    price: 125000,
                    image: "https://i.ebayimg.com/images/g/GG4AAOSw3SpmO9qK/s-l1200.jpg",
                },
            ],
        },
    ];

    const totalPrice = cartData.reduce((total, category) => {
        return (
            total +
            category.items.reduce((sum, item) => sum + item.price, 0)
        );
    }, 0);

    return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 uppercase">Giỏ hàng ({cartData.length} danh mục)</h1>

            <Row gutter={24}>
                <Col span={16}>
                    {/* Cart Items */}
                    <div className="space-y-6">
                        {cartData.map((category, index) => (
                            <div key={index} className="bg-white p-6 rounded-lg shadow-lg">
                                {/* Category Header */}
                                <div className="category-header-section">
                                    <div className="flex justify-between items-center font-semibold border-b pb-2">
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                className="mr-2 w-5 h-5 accent-orange-500 opacity-60"
                                            />
                                            <span className="text-lg font-medium">{category.category}</span>
                                        </div>

                                        <p className="text-sm font-medium text-gray-600 mr-7">Thành tiền</p>
                                    </div>
                                </div>

                                {/* Items List */}
                                <div className="mt-6 space-y-4">
                                    {category.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between border-b pb-4 last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-4">
                                                <input
                                                    type="checkbox"
                                                    className="mr-2 w-5 h-5 accent-orange-500 opacity-60"
                                                />
                                                {/* Product Image */}
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-20 h-20 object-cover rounded-lg"
                                                />
                                                {/* Product Details */}
                                                <div className="ml-4">
                                                    <h2 className="text-lg font-medium">{item.name}</h2>
                                                    <p className="text-sm text-gray-500">Nhà bán: {item.seller}</p>
                                                </div>
                                            </div>
                                            {/* Product Price and Remove Button */}
                                            <div className="flex items-center space-x-4">
                                                <p className="text-red-500 font-semibold">
                                                    {item.price.toLocaleString("vi-VN", {
                                                        style: "currency",
                                                        currency: "VND",
                                                    })}
                                                </p>
                                                <Tooltip placement="bottom" title="Bỏ sản phẩm">
                                                    <button className="text-sm text-gray-400 hover:text-red-500">
                                                        <CloseOutlined />
                                                    </button>
                                                </Tooltip>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>

                <Col span={8}>
                    {/* Total Price and Checkout */}
                    <div className="flex flex-col bg-white p-6 rounded-lg shadow-lg">
                        <div className="flex justify-between items-center text-lg font-semibold">
                            <span>Tổng số tiền:</span>
                            <span className="text-red-500">
                                {totalPrice.toLocaleString("vi-VN", {
                                    style: "currency",
                                    currency: "VND",
                                })}
                            </span>
                        </div>
                        <button className="bg-orange-500 text-white py-2 mt-6 rounded-lg hover:bg-orange-600 transition duration-300">
                            Thanh toán
                        </button>
                    </div>
                </Col>
            </Row>

        </div>
    );
}