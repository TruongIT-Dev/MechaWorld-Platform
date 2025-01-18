import { NavLink } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export default function UserNavbar() {
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
                        <UserOutlined />
                    </NavLink>
                    <div className="dropdown-menu right-[0.5rem] fade-down m-0">
                        {/* Đăng Nhập */}
                        <NavLink
                            to="/error"
                            className="dropdown-item"
                            activeClassName="active"
                        >
                            Đăng nhập
                        </NavLink>

                        {/* Tài khoản của tôi */}
                        <NavLink
                            to="/error"
                            className="dropdown-item"
                            activeClassName="active"
                        >
                            Tài khoản của tôi
                        </NavLink>

                        {/* Đăng xuất */}
                        <NavLink
                            to="/error"
                            className="dropdown-item"
                            activeClassName="active"
                        >
                            Đăng xuất
                        </NavLink>
                    </div>
                </div>
            </div>
        </>
    );
}
