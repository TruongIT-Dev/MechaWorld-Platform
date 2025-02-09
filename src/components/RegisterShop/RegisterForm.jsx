import { Steps, Button, Form } from "antd";
import { useState } from "react";
import ShopInfo from "./ShopInfo";
import ShippingInfo from "./ShippingInfo";
import Confirmation from "./Confirmation";

const { Step } = Steps;

const RegisterShopForm = () => {
    const [current, setCurrent] = useState(0);
    const [form] = Form.useForm();

    const steps = [
        { title: "Thông tin Shop", content: <ShopInfo /> },
        { title: "Cài đặt vận chuyển", content: <ShippingInfo /> },
        { title: "Điều khoản sử dụng", content: <Confirmation /> },
        { title: "Xác nhận", content: <Confirmation /> },
    ];

    const next = () => setCurrent(current + 1);
    const prev = () => setCurrent(current - 1);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            console.log("Dữ liệu gửi:", values);
        });
    };

    return (
        <div className="max-w-full mx-auto bg-white p-6">
            <Steps progressDot current={current} className="mb-6">
                {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                ))}
            </Steps>
            
            <div className="form-section">
                {steps[current].content}
            </div>

            <div className="flex justify-between mt-6">
                {current > 0 && <Button onClick={prev}>Quay lại</Button>}
                {current < steps.length - 1 ? (
                    <Button onClick={next}>
                        Tiếp tục
                    </Button>
                ) : (
                    <Button onClick={handleSubmit}>
                        Hoàn tất
                    </Button>
                )}
            </div>
        </div>
    );
};

export default RegisterShopForm;
