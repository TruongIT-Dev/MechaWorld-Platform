import { NavLink } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { FaCartShopping } from "react-icons/fa6";
import { useState } from "react";

export default function UserNavbar() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
                        <NavLink
                            to="/error"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Đăng nhập
                        </NavLink>
                        <NavLink
                            to="/error"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Tài khoản của tôi
                        </NavLink>
                        <NavLink
                            to="/error"
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            Đăng xuất
                        </NavLink>
                    </div>
                )}
            </div>
        </div>
    );
}
