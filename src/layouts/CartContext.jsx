import React, { useEffect, useState } from 'react';
import { GetCart, DeleteCart } from '../apis/Cart/APICart';
import { NavLink } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { FiTrash2 } from 'react-icons/fi'
import { Link } from 'react-router-dom';

const CartContext = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    

    const fetchCartItems = async () => {
        try {
            const response = await GetCart();
            console.log("API response:", response); 
            console.log("Response Data:", response.data); // Kiểm tra xem dữ liệu đúng chưa
    
            if (Array.isArray(response.data)) {
                setCartItems(response.data);
            } else {
                console.error("Unexpected data format:", response.data);
                setCartItems([]); 
            }
    
            setLoading(false);
        } catch (err) {
            console.error("Error fetching cart:", err);
            setError(err.message);
            setLoading(false);
            setCartItems([]); 
        }
    };
    

    useEffect(() => {
        fetchCartItems();
    }, []);


    const handleRemoveItem = async (itemId) => {
        try {
            await DeleteCart(itemId);
            fetchCartItems(); // Refresh the cart items after deletion
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        
        <div>
            {/* Nút mở giỏ hàng */}
            <div className="cart-section">
                <button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-1 px-4 rounded-full flex items-center gap-3"
                    onClick={() => setIsOpen(true)}
                >   
                    <NavLink className="group-hover:block  hover:text-black capitalize transition-all duration-200" >
                            Giỏ hàng
                    </NavLink>
                    
                    <div className="flex relative">
                        <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
                        <div className="bg-red-500 absolute -right-2 -bottom-2 text-[12px] w-[18px] h-[18px] text-white rounded-full flex justify-center items-center">
                            {cartItems.length}
                        </div>
                    </div>
                </button>
            </div>

            {/* Modal giỏ hàng */}
            <div
                className={`w-full bg-white fixed top-0 h-full shadow-2xl md:w-[35vw] xl:max-w-[30vw] transform
                     ${ isOpen ? 'right-0':'-right-full '} 
                     transition-all duration-300 z-50 px-4 lg:px-[15px]`}
            >
                    
                <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="uppercase text-sm font-semibold">Shopping Bag ({cartItems.length})</h2>
                        <button
                            className="text-red-500 text-xl"
                            onClick={() => setIsOpen(false)}
                        >
                            &times;
                        </button>
                    </div>

                    <ul className="flex flex-col gap-y-4 h-[520px] lg:h-[640px] overflow-y-auto overflow-x-hidden border-b px-2">
                        {cartItems.map((item) => (
                            <li key={item.cart_item_id} 
                                className="flex items-center gap-4 bg-white shadow-md p-4 rounded-lg border border-gray-200 hover:shadow-lg transition">
                                
                                {/* Hình ảnh sản phẩm */}
                                <img 
                                    src={item.gundam_image_url} 
                                    alt={item.gundam_name} 
                                    className="w-16 h-16 object-cover rounded-lg border border-gray-300"
                                />
                                
                                {/* Thông tin sản phẩm */}
                                <div className="flex-1">
                                    <h3 className="text-md font-semibold text-gray-800">{item.gundam_name}</h3>
                                    <p className="text-sm text-gray-600">Price: <span className="text-red-500 font-semibold">${item.gundam_price}</span></p>
                                </div>
                                
                                {/* Nút Xóa */}
                                <button 
                                    onClick={() => handleRemoveItem(item.cart_item_id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600 transition">
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>


                    
                    <div className=' flex flex-col gap-y-3 py-4'>
                        <div className=' flex w-full justify-between items-center'>
                        {/* total */}
                            <div className='uppercase font-semibold'>
                                <span className='mr-2'> Total: </span>
                            </div>
                            <div  className='bg-red-500 cursor-pointer py4 bg-re-500 text-white w-12 h-12 flex 
                                            justify-center items-center text-xl'><FiTrash2 />
                            </div>
                        </div>

                        <Link 
                            to={'/cart'} 
                            className='bg-gray-200 flex p-4 justify-center items-center text-black w-full font-medium'>
                                Xem Chi Tiết Giỏ Hàng
                        </Link>  

                        <Link 
                            to={'/checkout'} 
                            className='bg-black flex p-4 justify-center items-center text-white w-full font-medium'>
                                Thanh Toán
                        </Link>  
                    </div>

                </div>
            </div>

            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </div>
    );
};

export default CartContext;