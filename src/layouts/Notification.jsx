import { useState } from "react";
import { BellOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const Notification = () => {
    const [isNotifyOpen, setIsNotifyOpen] = useState(false);

    const toggleNotify = () => {
        setIsNotifyOpen(!isNotifyOpen);
    };

    return (
        <>
            <Tooltip placement="bottom" title="Thông báo">
                <div className="notification-section relative">
                    {/* Bell Icon with Badge */}
                    <div className="bell-icon relative">
                        <button
                            onClick={toggleNotify}
                            className="btn text-xl hover:text-orange-500 flex justify-center items-center m-0 relative"
                        >
                            <BellOutlined />
                            {/* Notification Badge */}
                        </button>
                    </div>

                    {/* Notification Dropdown */}
                    {isNotifyOpen && (
                        <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-lg z-10">
                            <div className="p-4 border-b">
                                <h3 className="text-lg font-semibold">Notifications</h3>
                            </div>
                            <ul className="max-h-60 overflow-auto">
                                <li className="p-3 bg-yellow-100 font-semibold hover:bg-gray-200 cursor-pointer">
                                    New update available!
                                </li>
                                <li className="p-3 bg-yellow-100 font-semibold hover:bg-gray-200 cursor-pointer">
                                    Your order has been shipped.
                                </li>
                                <li className="p-3 bg-gray-100 hover:bg-gray-200 cursor-pointer">
                                    Welcome to our platform!
                                </li>
                                <li className="p-3 text-gray-500 text-center">
                                    No new notifications
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </Tooltip >
        </>
    );
}
export default Notification