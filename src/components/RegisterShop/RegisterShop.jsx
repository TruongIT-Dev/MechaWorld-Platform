import { useState } from "react";
import { Steps, Button, Form, message } from "antd";
import { FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";
import ThirdForm from "./ThirdForm";
import FourthForm from "./FourthForm";

const { Step } = Steps;

export default function RegisterShop() {

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);
  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    // city: "",
    // district: "",
    // ward:"",
    address: "",
    agreedToTerms: false,
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [canProceed, setCanProceed] = useState(true);

  console.log("formData", formData);

  const steps = [
    {
      title: "Thông tin Shop",
      icon: <FaStore />,
      content: <FirstForm
        form={form}
        setIsPhoneVerified={setIsPhoneVerified}
      />,
    },
    {
      title: "Cài đặt vận chuyển",
      content: <SecondForm />,
    },
    {
      title: "Điều khoản sử dụng",
      content: <ThirdForm
        formData={formData}
        setFormData={setFormData}
        setCanProceed={setCanProceed}
      />,
    },
    {
      title: "Hoàn tất",
      content: <FourthForm />,
    },
  ];


  // Hàm btn Next - Prev
  const next = async () => {
    try {
      const values = await form.validateFields();
      setFormData((prev) => ({ ...prev, ...values }));
      setCurrent((prev) => prev + 1);
    } catch (err) {
      console.log("Validation Failed:", err);
    }
  };

  const prev = () => setCurrent((prev) => prev - 1);


  // Handle Gửi Form Final Data đến API
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const finalData = { ...formData, ...values };
      console.log("Gửi dữ liệu:", finalData);

      message.success("Đăng ký thành công! Chuyển về trang chủ...");

      setTimeout(() => {
        navigate("/");
      }, 2000);

      // Gọi API gửi dữ liệu
      // const response = await submitFormAPI(finalData);

      // if (response.status === 200) {
      //   message.success("Đăng ký thành công! Chuyển về trang chủ...");

      //   setTimeout(() => {
      //     navigate("/");
      //   }, 2000);
      // }
    } catch (err) {
      console.log("Validation Failed:", err);
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <Steps
        current={current}
        onChange={setCurrent} // Cho phép click vào Step để chuyển bước
        progressDot
        className="max-w-5xl mx-auto mb-6"
      >
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      <Form form={form} layout="vertical" initialValues={formData}>
        <div className="p-4 my-10 mx-auto max-w-5xl">
          {steps[current].content}
        </div>

        <div className="flex justify-end mt-6">
          {current > 0 && <Button onClick={prev}>Quay lại</Button>}
          {current < steps.length - 1 ? (
            <Button type="primary" disabled={!canProceed || !isPhoneVerified} onClick={next} className="bg-blue-500 mx-4 hover:bg-blue-600">
              Tiếp theo
            </Button>
          ) : (
            <Button type="primary" onClick={handleSubmit} className="bg-green-500 mx-4 hover:bg-green-600">
              Đăng ký Shop
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
