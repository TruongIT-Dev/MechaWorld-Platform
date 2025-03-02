import { useState, useEffect } from "react";
import { FaWallet } from "react-icons/fa6";
import { FaUser, FaSignOutAlt, FaRobot, FaClipboardList, FaStore } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { NavLink } from "react-router-dom";
import PropTypes from 'prop-types';
// import { UserOutlined } from "@ant-design/icons";
import Cookies from "js-cookie";
import { logout } from "../features/auth/authSlice";

import Notification from "./Notification";
import CartContext from "./CartContext";

const UserNavbar = ({ user }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    // const isRole = useSelector(state => state.auth.user.role)
    // const [userData, setUserData] = useState(null);



    let timeoutId = null;

    // const navigate = useNavigate();
    const dispatch = useDispatch();



    // const user = useSelector((state) => state.auth.user);

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
    useEffect(() => {
        console.log(user);
    }, []);

    // Hover Enter hiện dropdown
    const handleMouseEnter = () => {
        clearTimeout(timeoutId); // Hủy delay nếu có
        setIsDropdownOpen(true);
    };



    // Hover Leave thoát Dropdown
    const handleMouseLeave = () => {
        timeoutId = setTimeout(() => {
            setIsDropdownOpen(false);
        }, 100);
    };



    // Hàm Logout
    const handleLogout = () => {
        dispatch(logout());
        Cookies.remove("access_token");
        Cookies.remove("user");

        setTimeout(() => {
            // navigate('/');
            window.location.href = "/";
        }, 50);
    };



    // Danh sách List Dropdown Menu
    const menuItems = [
        { to: "/registe-shop", icon: <FaStore className="mr-2" />, label: "Đăng ký bán hàng" },
        { to: "/shop/dashboard", icon: <FaRobot className="mr-2" />, label: "Quản lý kho" },
        { to: "/profile/user", icon: <FaUser className="mr-2" />, label: "Tài khoản của tôi" },
        { to: "#", icon: <FaClipboardList className="mr-2" />, label: "Đơn mua" },
        { to: "#", icon: <FaSignOutAlt className="mr-2 text-red-500" />, label: "Đăng xuất", onClick: handleLogout },
    ];

    return (
        <>
            <div className="space-x-6 flex items-center">

                {/* Cart */}
                <CartContext />

                <div className="h-4 border-l-2 border-l-black"></div>

                {/* Ví tiền ảo */}
                <div className="cart-section">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group">
                        <NavLink className="group-hover:block hover:text-black capitalize transition-all duration-200" to="/wallet">
                            Ví Cá Nhân
                        </NavLink>
                        <FaWallet className="text-xl text-white drop-shadow-sm cursor-pointer" />
                    </button>
                </div>
                <div className="h-4 border-l-2 border-l-black"></div>

                {/* Thông báo Component */}
                <Notification />

                <div className="h-4 border-l-2 border-l-black"></div>

                {/* User Dropdown (Hover to open) */}
                <div
                    className="user-icon relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="btn text-xl hover:text-blue-700 flex justify-center items-center m-0">
                        {/* <UserOutlined /> */}
                        <img src={user?.avatar_url} alt="avatar" style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                    </button>

                    {isDropdownOpen && (
                        <div data-aos="zoom-in" data-aos-duration="300" className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                            {menuItems.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.to}
                                    onClick={item.onClick}
                                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                >
                                    {item.icon} {item.label}
                                </NavLink>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

UserNavbar.propTypes = {
    user: PropTypes.shape({
        avatar_url: PropTypes.string
    }).isRequired
};

export default UserNavbar