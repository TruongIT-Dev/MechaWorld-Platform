import React, { useContext,useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { NavLink, useNavigate } from "react-router-dom";
import Img1 from "../assets/image/gun1.jpg";
import { Link } from 'react-router-dom';
import { FiTrash2 } from 'react-icons/fi'


const CartContext = () => {
    const [isOpen, setIsOpen] = useState(false);


    // Fake dữ liệu giỏ hàng (thay thế bằng dữ liệu thực từ context)
    const cartItems = [
              { id: 1, name: "Mens Casual Slim Fit", price: 15.99, quantity: 1,image: Img1 },
          ];

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            {/* Nút mở giỏ hàng */}
            <div className="cart-section">
                <button
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-1 px-4 rounded-full flex items-center gap-3"
                    onClick={() => setIsOpen(true)}
                >   
                    <NavLink className="group-hover:block  hover:text-black capitalize transition-all duration-200" to="/cart1">
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
                            <li key={item.id} className="flex items-center py-4">
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="ml-4 flex-1">
                                    <h3 className="text-sm font-medium">{item.name}</h3>
                                    <div className="text-gray-500 text-sm">
                                        {item.quantity} x ${item.price.toFixed(2)}
                                    </div>
                                </div>
                                <div className="text-gray-800 font-medium">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </li>
                        ))}
                    </ul>

                    
                    <div className=' flex flex-col gap-y-3 py-4'>
                        <div className=' flex w-full justify-between items-center'>
                        {/* total */}
                            <div className='uppercase font-semibold'>
                                <span className='mr-2'> Total: </span>${total.toFixed(2)}
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
