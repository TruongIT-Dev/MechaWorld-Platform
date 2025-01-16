import { NavLink } from "react-router-dom";
import { UserOutlined, ShoppingCartOutlined } from '@ant-design/icons';

export default function UserNavbar() {
    return (
        <>
            <div className="space-x-2 flex items-center">
                <NavLink
                    to="/error"
                    className="btn text-xl hover:text-blue-400 flex justify-center items-center mb-1"
                    activeClassName="text-blue-700"
                >
                    <ShoppingCartOutlined />
                </NavLink>
                <div className="h-5 border-l-2 border-l-black"></div>
                <NavLink
                    to="/profile"
                    className="btn text-xl hover:text-blue-400 flex justify-center items-center mb-1"
                    activeClassName="text-blue-700"
                >
                    <UserOutlined />
                </NavLink>
            </div>
        </>
    );
}
