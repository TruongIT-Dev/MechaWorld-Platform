import { FaTrashAlt } from "react-icons/fa";

const Cart = () => {
    // Mock danh sách sản phẩm trong giỏ hàng
    const cartItems = [
        {
            id: 1,
            name: "Gundam RX-78-2",
            price: 1200000,
            image: "/src/assets/image/gun1.jpg",
        },
        {
            id: 2,
            name: "Gundam Exia",
            price: 1500000,
            image: "/src/assets/image/gun4.jpg",
        },
        {
            id: 3,
            name: "Gundam Wing Zero",
            price: 1300000,
            image: "/src/assets/image/gun6.jpg",
        },
    ];

    // Tính tổng tiền
    const totalPrice = cartItems.reduce((total, item) => total + item.price, 0);

    return (
        <div className="container mx-auto mt-36 mb-14">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                <h2 className="text-blue-400 text-3xl font-semibold uppercase mb-6 text-center">🛒 Giỏ Hàng Của Bạn</h2>

                {cartItems.length === 0 ? (
                    <p className="text-gray-600 text-center">Không có sản phẩm nào trong giỏ hàng.</p>
                ) : (
                    <>
                        <ul>
                            {cartItems.map((item) => (
                                <li key={item.id} className="flex items-center justify-between border-b border-gray-300 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg shadow-md" />
                                        <div>
                                            <h3 className="text-lg font-semibold">{item.name}</h3>
                                            <p className="text-red-400 font-bold">{item.price.toLocaleString()} VNĐ</p>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-red-500 transition">
                                        <FaTrashAlt size={20} />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {/* Tổng tiền */}
                        <div className="flex justify-between items-center mt-6">
                            <div className="total flex gap-4">
                                <h3 className="text-xl font-bold">Tổng cộng:</h3>
                                <p className="text-2xl font-bold text-red-500">{totalPrice.toLocaleString()} VNĐ</p>
                            </div>
                            {/* Nút Thanh toán */}
                            <button className="w-ful p-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition">
                                Thanh toán ngay
                            </button>
                        </div>

                    </>
                )}
            </div>
        </div>
    );

};

export default Cart;
