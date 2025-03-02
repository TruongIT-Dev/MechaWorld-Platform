import React, { useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { useCart } from '../context/CartContext';

const CartContext = () => {
    const { cartItems, removeFromCart, loading, error } = useCart();
    const [isOpen, setIsOpen] = useState(false);

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.gundam_price, 0);
    };

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-500 py-4">Error: {error}</div>;

    return (
        <div>
            <div className="cart-section flex justify-end p-4">
                <button
                    className="bg-blue-600 text-white py-2 px-5 rounded-full flex items-center gap-3"
                    onClick={() => setIsOpen(true)}
                >
                    <span className="hidden sm:inline">Giỏ hàng</span>
                    <div className="relative">
                        <FaCartShopping className="text-2xl" />
                        <div className="bg-red-500 absolute -right-2 -bottom-2 text-xs w-5 h-5 flex items-center justify-center text-white rounded-full">
                            {cartItems.length}
                        </div>
                    </div>
                </button>
            </div>

            {/* Modal giỏ hàng */}
            <div className={`fixed top-0 h-full max-h-screen bg-white shadow-2xl transition-transform duration-300 ${isOpen ? 'right-0' : '-right-full'} w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 z-50 p-4 overflow-y-auto`}>
                <div className="flex justify-between items-center border-b pb-4">
                    <h2 className="uppercase font-semibold">Giỏ Hàng ({cartItems.length})</h2>
                    <button className="text-red-500 text-2xl" onClick={() => setIsOpen(false)}>&times;</button>
                </div>

                <div className='w-full min-h-[150px] flex flex-col gap-x-4'>
                    <ul className="mt-4 h-[60vh] overflow-y-auto">
                        {cartItems.map((item) => (
                            <li key={item.cart_item_id} className="flex items-center gap-4 p-3 rounded-lg shadow-sm hover:shadow-md transition">
                                <img src={item.gundam_image_url} alt={item.gundam_name} className="max-w-[80px]" />
                                <div className="flex-1">
                                    <h3 className="text-sm uppercase font-medium max-w-[240px] text-black hover:underline">{item.gundam_name}</h3>
                                    <p className="text-sm text-gray-600">Giá: <span className="text-red-500 font-semibold">{item.gundam_price}vnd</span></p>
                                </div>
                                <button onClick={() => removeFromCart(item.cart_item_id)} className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600">Xóa</button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-4 border-t pt-4 flex flex-col gap-3 sticky bottom-0 bg-white py-4">
                    <div className="flex justify-between items-center">
                        <span className="font-semibold">Tổng:</span>
                        <span className="font-semibold text-red-500">{calculateTotal()}vnd</span>
                    </div>
                    <Link to='/cart' className="bg-gray-200 text-center py-3 rounded-lg hover:bg-gray-300">Xem Chi Tiết Giỏ Hàng</Link>
                    <Link to='/checkout' className="bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800">Thanh Toán</Link>
                </div>
            </div>

            {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)}></div>}
        </div>
    );
};

export default CartContext;
