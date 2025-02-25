import { Avatar, Button } from "antd";
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { FaStore } from "react-icons/fa";
import { useEffect, useState } from "react";
import { GetShopInfoById } from "../../apis/ProductDetail/APIProductDetail";

const ShopInfo = ({ shop }) => {
    const [shopInfo, setShopInfo] = useState(null);


    // ************* Fetch Thông Tin Shop ******************
    useEffect(() => {
        const fetchShopInfo = async (id) => {
            try {
                const ShopInfo = await GetShopInfoById(id);
                setShopInfo(ShopInfo?.data || null);
            } catch (error) {
                console.log(error);

            }
        }
        fetchShopInfo(shop);
    }, [shop])
    // ******************************************************


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
