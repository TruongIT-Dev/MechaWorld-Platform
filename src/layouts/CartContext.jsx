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

    useEffect(() => {
        fetchCartItems();
    }, []);

    const fetchCartItems = async () => {
        try {
            const response = await GetCart();
            if (response.data && Array.isArray(response.data)) {
                setCartItems(response.data);
            } else {
                setCartItems([]);
            }
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
            setCartItems([]); // Đặt cartItems thành mảng rỗng nếu có lỗi
        }
    };

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

                    <ul className="flex flex-col gap-y-2 h-[520px] lg:h-[640px] overflow-y-auto
                     overflow-x-hidden border-b">
                        {cartItems.map((item) => (
                        <li key={item.cart_item_id}>
                            <img src={item.gundam_image_url} alt={item.gundam_name} className="w-12 h-12 object-cover rounded"/>
                            <div className="ml-4 flex-1">
                                    <h3 className="text-sm font-medium">{item.gundam_name}</h3>
                            </div>
                            <div className="text-gray-800 font-medium">
                                Price: ${item.gundam_price}
                            </div>
                            <button onClick={() => handleRemoveItem(item.cart_item_id)}>Remove</button>
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
                            to={'/cart1'} 
                            className='bg-gray-200 flex p-4 justify-center items-center text-black w-full font-medium'>
                                View Cart
                        </Link>  

                        <Link 
                            to={'/checkout'} 
                            className='bg-black flex p-4 justify-center items-center text-white w-full font-medium'>
                                check out
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