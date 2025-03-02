import { NavLink } from "react-router-dom";
import { FaStore } from "react-icons/fa";
import RegisterShop from "./RegisterShop"; // Import form đăng ký shop

const RegisterShopLayout = () => {
    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-md py-4">
                <div className="container mx-auto flex justify-between items-center px-6">
                    <NavLink to="/" className="text-blue-400 font-bold text-xl flex items-center">
                        <FaStore className="text-2xl mr-2" /> MechaWorld
                    </NavLink>
                    <span className="text-lg font-semibold text-gray-500">
                        Đăng Ký Trở Thành Nhà Bán Hàng
                    </span>
                </div>
            </header>

            {/* Nội dung chính */}
            <main className="flex-grow flex items-center justify-center bg-gray-100 py-10">
                <div className="w-full max-w-7xl bg-white shadow-md rounded-lg p-6">
                    <RegisterShop /> {/* Form đăng ký shop */}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
                © {new Date().getFullYear()} MechaWorld Seller. All rights reserved.
            </footer>
        </div>
    );
};

export default RegisterShopLayout;
