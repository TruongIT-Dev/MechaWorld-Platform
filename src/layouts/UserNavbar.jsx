import {
    //  useEffect,
     useState } from "react";
// import { FaWallet } from "react-icons/fa6";
import { FaUser, FaSignOutAlt, FaClipboardList, FaStore } from "react-icons/fa";
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
    // useEffect(() => {
    //     console.log(user);
    // }, []);

    // Hover Enter hiện dropdown
    const handleMouseEnter = () => {
        clearTimeout(timeoutId);
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
        { to: "/registe-shop", icon: <FaStore className="mr-2 text-green-600" />, label: "Đăng ký bán hàng", role: "member" },
        { to: "/shop/dashboard", icon: <FaStore className="mr-2 text-green-600" />, label: "Quản lý Shop", role: "seller" },
        { to: "/profile/user", icon: <FaUser className="mr-2 text-blue-600" />, label: "Tài khoản" },
        { to: "#", icon: <FaClipboardList className="mr-2 text-yellow-500" />, label: "Đơn mua" },
        { to: "#", icon: <FaSignOutAlt className="mr-2 text-red-500" />, label: "Đăng xuất", onClick: handleLogout },
    ];

    // Lọc menu dựa trên role
    const filteredMenu = menuItems.filter(item => !item.role || item.role === user?.role);

    return (
        <>
            <div className="space-x-6 flex items-center">

                {/* Cart */}
                <CartContext />

                <div className="h-6 border-l-2 border-l-black"></div>

                {/* Ví tiền ảo */}
                {/* <div className="cart-section">
                    <button className="bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group">
                        <NavLink className="group-hover:block hover:text-black capitalize transition-all duration-200" to="/wallet">
                            Ví Cá Nhân
                        </NavLink>
                        <FaWallet className="text-xl text-white drop-shadow-sm cursor-pointer" />
                    </button>
                </div>
                <div className="h-4 border-l-2 border-l-black"></div> */}

                {/* Thông báo Component */}
                <Notification />

                <div className="h-6 border-l-2 border-l-black"></div>

                <div
                    className="user-icon relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <button className="btn text-xl space-x-4 hover:text-blue-700 flex justify-center items-center m-0">
                        <span className="text-sm font-semibold max-w-[200px] truncate">
                            Xin chào, {user?.full_name}
                        </span>
                        <img
                            src={user?.avatar_url}
                            className="w-[40px] h-[40px] rounded-full bg-white"
                            alt="avatar"
                        />
                    </button>

                    {isDropdownOpen && (
                        <div
                            data-aos="zoom-in"
                            data-aos-duration="300"
                            className="absolute right-0 mt-2 min-w-[200px] bg-white border rounded-lg shadow-lg z-50"
                        >
                            {filteredMenu.map((item, index) => (
                                <NavLink
                                    key={index}
                                    to={item.to}
                                    onClick={item.onClick}
                                    className="flex items-center text-base px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
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
        avatar_url: PropTypes.string,
        full_name: PropTypes.string,
        role: PropTypes.string
    }).isRequired
};

export default UserNavbar