import { NavLink, useNavigate } from "react-router-dom";
import { UserOutlined } from "@ant-design/icons";
import { FaCartShopping } from "react-icons/fa6";
import { useEffect, useState } from "react";

export default function UserNavbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);

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
            <button
                className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group"
            >
                <span className="group-hover:block hidden transition-all duration-200">
                    Giỏ hàng
                </span>
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
            </button>

            <div className="h-5 border-l-2 border-l-black"></div>

            <div className="relative">
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
