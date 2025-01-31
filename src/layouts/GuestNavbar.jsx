import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";

import UserProfile from "./UserNavbar";

const GuestNavbar = () => {
    const [user, setUser] = useState(null);


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

    return (
        <div className="space-x-3 flex items-center relative">

            {user ? (
                <>
                    {/* User Profile */}
                    < UserProfile />
                </>
            ) : (
                <>
                    <NavLink
                        to="/signIn"
                        className="text-base font-semibold capitalize text-gray-900 hover:text-gray-500"
                    >
                        Đăng nhập
                    </NavLink>
                    <div className="h-4 border-l-2 border-l-black"></div>
                    <NavLink
                        to="/signIn"
                        className="text-base font-semibold capitalize text-gray-900 hover:text-gray-500"
                    >
                        Đăng ký
                    </NavLink>
                </>
            )}
        </div>
    )
}
export default GuestNavbar