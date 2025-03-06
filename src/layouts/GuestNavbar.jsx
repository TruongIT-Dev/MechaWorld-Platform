import { NavLink } from "react-router-dom";
// import { useEffect, useState } from "react";
import UserProfile from "./UserNavbar";
import { useSelector } from "react-redux";

const GuestNavbar = () => {
    const [user] = useSelector(state => state.auth.user);
    // const isLoggedIn = useSelector(state => state.auth.isLoggedIn); 

    // useEffect(() => {
    //     const Access_token = Cookies.get("access_token");

    //     if (Access_token) {
    //         verifyToken(Access_token)
    //             .then(response => {
    //                 setUser(response.data);
    //             })
    //             .catch(error => {
    //                 console.error("Lỗi từ API:", error);
    //                 setUser(null); // Nếu token hết hạn, reset user
    //                 Cookies.remove("access_token");
    //                 Cookies.remove("user");
    //             });
    //     } else {
    //         setUser(null);
    //     }
    // }, [isLoggedIn]);

    return (
        <div className="space-x-3 flex items-center relative">

            {user ? (
                <>
                    {/* User Profile */}
                    <UserProfile user={user}/>
                </>
            ) : (
                <>
                    <NavLink
                        to="/signIn"
                        className="text-lg font-semibold capitalize text-gray-900 hover:text-gray-500"
                    >
                        Đăng nhập
                    </NavLink>
                    <div className="h-4 border-l-2 border-l-black"></div>
                    <NavLink
                        to="/signIn"
                        className="text-lg font-semibold capitalize text-gray-900 hover:text-gray-500"
                    >
                        Đăng ký
                    </NavLink>
                </>
            )}
        </div>
    )
}
export default GuestNavbar