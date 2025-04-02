import Cookies from 'js-cookie';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Steps, Button, Form, message } from "antd";
import { ShopOutlined ,TruckOutlined, ContainerOutlined, FileDoneOutlined } from "@ant-design/icons";

import FirstForm from "./FirstForm";
import SecondForm from "./SecondForm";
import ThirdForm from "./ThirdForm";
import FourthForm from "./FourthForm";

import { verifyToken } from '../../apis/Auth/APIAuth';
import { BecomeSeller, updateUserData } from "../../apis/User/APIUserProfile";

const { Step } = Steps;

export default function RegisterShop() {

  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [current, setCurrent] = useState(0);

  const [user, setUser] = useState(useSelector((state) => state.auth.user));

  const [formData, setFormData] = useState({
    full_name: "",
    phone_number: "",
    address: "",
    agreedToTerms: false,
  });
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [canProceed, setCanProceed] = useState(true);

  // console.log("formData", formData);

  const steps = [
    {
      title: "Thông tin Shop",
      icon: <ShopOutlined />,
      content: <FirstForm
        form={form}
        setIsPhoneVerified={setIsPhoneVerified}
      />,
    },
    {
      title: "Cài đặt vận chuyển",
      icon: <TruckOutlined />,
      content: <SecondForm
        user={user}
      />,
    },
    {
      title: "Điều khoản sử dụng",
      icon: <ContainerOutlined />,
      content: <ThirdForm
        formData={formData}
        setFormData={setFormData}
        setCanProceed={setCanProceed}
      />,
    },
    {
      title: "Hoàn tất",
      icon: <FileDoneOutlined />,
      content: <FourthForm />,
    },
  ];


  // Lấy Thông tin User từ Cookie
  useEffect(() => {
    const access_token = Cookies.get('access_token');
    if (access_token) {
      try {
        verifyToken(access_token).then(response => {
          setUser(response.data);

          // Kiểm tra số điện thoại và cập nhật trạng thái xác thực
          if (response.data.phone_number) {
            setIsPhoneVerified(true);
          }
        });
      } catch (error) {
        console.error("Lỗi lấy Thông tin User:", error);
      }
    }
  }, []);


  // Hàm btn Next - Prev
  const next = async () => {

    try {
      const values = await form.validateFields();

      if (current === 0) {
        // 🟢 Gọi API cập nhật Thông tin Shop
        await updateUserData(user?.id, values.full_name);

      } else if (current === 1) {
        // 🟢 Gọi API cập nhật Cài đặt vận chuyển
        console.log("Form 2 done");

      } else if (current === 2) {
        // 🟢 Gọi API cập nhật Điều khoản sử dụng
        await BecomeSeller();
      }

      // Nếu API thành công thì mới chuyển bước
      setCurrent((prev) => prev + 1);

    } catch (err) {
      console.error("Validation Failed:", err);
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  const prev = () => setCurrent((prev) => prev - 1);


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      console.log("Gửi dữ liệu:", values);

      message.success("Đăng ký thành công! Chuyển về trang chủ...");
      setTimeout(() => {
        navigate("/shop/dashboard");
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error("Validation Failed:", err);
      message.error("Vui lòng kiểm tra lại thông tin!");
    }
  };

  return (
    <div className="container mx-auto p-6 bg-white">
      <Steps
        current={current}
        // onChange={setCurrent}
        // progressDot
        className="max-w-5xl mx-auto mb-6"
      >
        {steps.map((step, index) => (
          <Step key={index} title={step.title} icon={step.icon} />
        ))}
      </Steps>

      <Form
        form={form}
        layout="horizontal"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 12,
        }}
        initialValues={formData}>
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
              Đến Shop của bạn
            </Button>
          )}
        </div>
      </Form>
    </div>
  );
}
