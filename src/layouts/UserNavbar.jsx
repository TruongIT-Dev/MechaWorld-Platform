import { NavLink, useNavigate } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export default function UserNavbar({ picture }) {
    const navigate = useNavigate(); 

    const handleLogout = () => {
        localStorage.removeItem('user'); 
        navigate('/'); 
    };
    return (
        <>
            <div className="space-x-2 flex items-center">
                <NavLink
                    to="/error"
                    className="btn text-xl hover:text-blue-400 flex justify-center items-center m-0"
                    activeClassName="text-blue-700"
                >
                    <ShoppingCartOutlined />
                </NavLink>
                <div className="h-5 border-l-2 border-l-black"></div>

                <div className="nav-item dropdown">
                    <NavLink
                        to="/profile"
                        className="btn text-xl hover:text-blue-400 flex justify-center items-center m-0"
                        activeClassName="text-blue-700"
                    >
                        {picture ? (
                        <img src={picture} alt="User Avatar" className="rounded-full w-8 h-8 object-cover" />
                        ) : (
                        <UserOutlined />
                        )}
                    </NavLink>
                    <div className="dropdown-menu right-[0.5rem] fade-down m-0">
                        {/* Đăng Nhập */}
                        {/* <NavLink
                            to="/signIn"
                            className="dropdown-item"
                            activeClassName="active"
                        >
                            Đăng nhập
                        </NavLink> */}

                        {/* Tài khoản của tôi */}
                        <NavLink
                            to="/profile/user"
                            className="dropdown-item"
                            activeClassName="active"
                        >
                            Tài khoản của tôi
                        </NavLink>

                        {/* Đăng xuất */}
                        {/* <NavLink
                            to="/"
                            className="dropdown-item"
                            activeClassName="active"
                        >
                            Đăng xuất
                        </NavLink> */}
                        <button // Thay NavLink bằng button
                        onClick={handleLogout} // Gắn sự kiện onClick
                        className="dropdown-item"
                        >
                        Đăng xuất
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
