import { NavLink, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { FaCartShopping } from "react-icons/fa6";
import { useEffect, useState } from "react";

import Notification from "./Notification";

const UserNavbar = () => {
    const [user, setUser] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Lỗi từ localStorage:", error);
                localStorage.removeItem('user');
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className="space-x-6 flex items-center relative">

            {/* Cart */}
            <div className="cart-section">
                <button
                    className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
                >
                    <NavLink className="group-hover:block hidden transition-all duration-200" to="/cart">
                        Giỏ hàng
                    </NavLink>
                    <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
                </button>
            </div>

            <div className="h-4 border-l-2 border-l-black"></div>

            {/* Notification */}
            <Notification />

            <div className="h-4 border-l-2 border-l-black"></div>

            {/* User Profile */}
            <div className="profile-section relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="btn text-xl hover:text-orange-500 flex justify-center items-center m-0"
                >
                    <UserOutlined />
                </button>
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                        {user ? (
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
                        ) : (
                            <div className="guest">
                                <NavLink
                                    to="/signIn"
                                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    Đăng nhập
                                </NavLink>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
export default UserNavbar