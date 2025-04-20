import { Avatar, Button } from "antd";
import { FaStore } from "react-icons/fa";
import { useEffect, useState } from "react";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";

import { GetShopInfoById } from "../../apis/Seller Profile/APISellerProfile";

const ShopInfo = ({ shopID }) => {
    const [shopInfo, setShopInfo] = useState(null);


    // Fetch Shop Info
    useEffect(() => {
        if (!shopID) return;

        const fetchShopInfo = async () => {
            try {
                // console.log("Fetching shop info for ID:", shopID);
                const response = await GetShopInfoById(shopID);
                setShopInfo(response?.data || null);
            } catch (error) {
                console.error("Lỗi khi fetch shop info:", error);
            }
        };

        fetchShopInfo();
    }, [shopID]);

    return (
        <div className="border rounded-lg p-4 bg-white shadow-md transition-shadow flex items-center">
            {/* Left Side - Avatar & Shop Info */}
            <div className="w-full flex items-center space-x-3">
                <Avatar
                    size={50}
                    src={shopInfo?.avatar_url}
                    icon={<UserOutlined />}
                    className="border border-gray-300"
                />
                <div>
                    <p className="text-sm font-semibold text-gray-800">{shopInfo?.full_name || "Shop name"}</p>
                    <p className="text-xs text-gray-500">Đánh giá: ⭐20 like</p>
                </div>
            </div>

            {/* Right Side - Buttons */}
            <div className="w-1/3 flex flex-col space-y-2 items-end">
                <Button type="primary" icon={<FaStore />} className="w-full bg-blue-600">
                    Xem Shop
                </Button>
                <Button type="default" icon={<MessageOutlined />} className="w-full border-gray-400">
                    Chat
                </Button>
            </div>
        </div>
    );
};

export default ShopInfo;
