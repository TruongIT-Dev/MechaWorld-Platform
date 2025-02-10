import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { FaStore, FaRegHandPointRight } from "react-icons/fa";

const ShopInfo = ({ shop }) => {

    return (
        <div
            className="relative group cursor-pointer overflow-hidden duration-500 border rounded-lg shadow-lg flex items-center p-4"
            style={{ backgroundImage: "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 20%)" }}
        >
            {/* Avatar Seller */}
            <Avatar
                size={50}
                src={shop?.avatar_url}
                icon={<UserOutlined />}
                className="border border-gray-300"
            />

            {/* Tên Seller + Đã bán */}
            <div className="ml-4">
                <p className="text-base flex items-center font-semibold"><span><FaStore /></span>_{shop?.full_name || "Unknown"}</p>
                <p className="text-sm text-gray-500">Đánh giá: chưa có!</p>
            </div>

            {/* Hover Hiện Thông Tin */}
            <div className="absolute left-0 top-0 w-full h-full space-y-1 bg-blue-300 text-white flex cursor-auto flex-col justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <p className="text-sm font-semibold text-gray-800">📞 Số điện thoại: {shop?.phone_number || "Chưa có"}</p>
                <p className="text-sm font-semibold text-gray-800">✉ Email: {shop?.email || "Chưa có"}</p>
                <a
                    href={`/seller/${shop?.id}`}
                    className="text-gray-500 text-sm flex items-center w-fit hover:underline hover:text-red-500 hover:font-bold mt-2 cursor-pointer"
                >
                    <FaRegHandPointRight className="mx-1" /> Đi đến Shop
                </a>
            </div>
        </div>
    );
};

export default ShopInfo;
