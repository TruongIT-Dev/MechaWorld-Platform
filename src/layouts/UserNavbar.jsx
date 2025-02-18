import { useState } from "react";
import { FaWallet } from "react-icons/fa6";
import { useSelector,useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { UserOutlined } from "@ant-design/icons";

import { logout } from "../features/auth/authSlice";

import Notification from "./Notification";
import CartContext from "./CartContext";

const UserNavbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const [userData, setUserData] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // useEffect(() => {
    //     const storedUser = localStorage.getItem('user');
    //     if (storedUser) {
    //         try {
    //             setUserData(JSON.parse(storedUser));
    //         } catch (error) {
    //             console.error("Lỗi từ localStorage:", error);
    //             localStorage.removeItem('user');
    //         }
    //     }
    // }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <>
            <div className="space-x-6 flex items-center">

                {/* Cart */}
                <CartContext />
                <div className="h-4 border-l-2 border-l-black"></div>
                {/* Notification */}
                <div className="cart-section">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group">
                        <NavLink className="group-hover:block hover:text-black capitalize transition-all duration-200" to="/wallet">
                            Ví Cá Nhân
                        </NavLink>
                        <FaWallet  className="text-xl text-white drop-shadow-sm cursor-pointer" />
                    </button>
                </div>
                <div className="h-4 border-l-2 border-l-black"></div>

                {/* Notification */}
                <Notification />

                <div className="h-4 border-l-2 border-l-black"></div>

                <div className="user-icon relative">
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="btn text-xl hover:text-blue-700 flex justify-center items-center m-0"
                    >
                        <UserOutlined />
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">

                            <>
                                <NavLink
                                    to="/profile/user"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    Tài khoản của tôi
                                </NavLink>
                                <NavLink
                                    onClick={handleLogout}
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    Đăng xuất
                                </NavLink>
                            </>

                        </div>
                    )}
                </div>
                
            </div>

        </>
    )
}
export default UserNavbar