import React, { createContext, useState, useContext, useEffect } from 'react';
import { GetCart, DeleteCart,AddToCart } from '../apis/Cart/APICart'; // Import API của bạn

// Tạo Context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch giỏ hàng từ API
    const fetchCartItems = async () => {
        try {
            const response = await GetCart();
            if (Array.isArray(response.data)) {
                setCartItems(response.data);
            } else {
                setCartItems([]);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setCartItems([]);
        }
    };

    // Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = async (item) => {
        try {
            const response = await AddToCart(item.id); // Gọi API thêm vào giỏ hàng
            const newItem = response.data; // Giả sử API trả về sản phẩm vừa thêm vào
            setCartItems((prevItems) => [...prevItems, newItem]); // Cập nhật state
        } catch (error) {
            console.error("Error adding to cart:", error);
        }
    };

    // Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (itemId) => {
        try {
            await DeleteCart(itemId); // Gọi API xóa sản phẩm
            setCartItems((prevItems) => prevItems.filter((item) => item.cart_item_id !== itemId)); // Cập nhật state
        } catch (error) {
            console.error("Error removing from cart:", error);
        }
    };

    // Fetch giỏ hàng khi component mount
    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, loading, error }}>
            {children}
        </CartContext.Provider>
    );
};

// Hook để sử dụng Context
export const useCart = () => useContext(CartContext);