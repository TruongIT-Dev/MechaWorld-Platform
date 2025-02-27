import { Card, Button } from "antd";
import { CheckCircleOutlined, ClockCircleOutlined, ShopOutlined, ShoppingCartOutlined, StopOutlined } from "@ant-design/icons";

const plans = [
    {
        title: "GÓI BẮT ĐẦU",
        description: "Bắt đầu trải nghiệm",
        benefits: ["10 lượt đăng bán sản phẩm", "5 lượt mở đấu giá"],
        price: "Miễn phí",
        selected: true, // Mặc định được chọn
    },
    {
        title: "GÓI NÂNG CẤP",
        description: "Nâng tầm cuộc chơi",
        benefits: ["50 lượt đăng bán sản phẩm", "30 lượt mở đấu giá", "Thời hạn: 30 ngày"],
        price: "499.000 đ",
        selected: false, // Không cho chọn
    },
    {
        title: "KHÔNG GIỚI HẠN",
        description: "Bứt phá giới hạn",
        benefits: ["Đăng Bán không giới hạn", "Đấu giá Không giới hạn", "Thời hạn: 120 ngày"],
        price: "1.049.000 đ",
        selected: false, // Không cho chọn
    },
];

const FourthForm = ({ next }) => {
    return (
        <div className="bg-white rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, index) => (
                <Card
                    key={index}
                    className={`rounded-lg shadow-md text-center p-6 transition-all ${plan.selected ? "bg-white border-2 border-black" : "bg-gray-300 opacity-50 cursor-not-allowed"
                        }`}
                >
                    <h3 className="text-lg font-semibold">{plan.title}</h3>
                    <p className="text-gray-500">{plan.description}</p>

                    <div className="mt-4 space-y-2 text-gray-700">
                        {plan.benefits.map((benefit, i) => (
                            <p key={i} className="flex items-center justify-center">
                                {plan.selected ? <CheckCircleOutlined className="mr-2 text-green-500" /> : <StopOutlined className="mr-2 text-gray-500" />}
                                {benefit}
                            </p>
                        ))}
                    </div>

                    <div className="mt-6 font-bold text-lg">{plan.price}</div>

                    {plan.selected && (
                        <Button type="primary" disabled className="mt-4 bg-black px-6 py-2 w-full" onClick={next}>
                            Bản mặc định
                        </Button>
                    )}
                </Card>
            ))}
        </div>
    );
};

export default FourthForm;
