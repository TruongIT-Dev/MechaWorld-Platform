import { useState } from "react";
import { signupEmail } from "../../apis/Auth/APIAuth";
import { Form, Input, Button, message, Typography } from "antd";

import Footer from "../../layouts/Footer";
import Logo from '../../assets/image/logo4.png';
import { NavLink } from "react-router-dom";

export default function SignUp() {

    const [form] = Form.useForm();
    const { Title, Text } = Typography;

    const [loading, setLoading] = useState(false);


    const onFinishSignUpFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    const onFinishSignUp = async (values) => {
        const { email, password, confirmPassword } = values;
        console.log(email);
        console.log(password);
        console.log(confirmPassword);
        if (!validateEmail(email)) {
            message.error('Email không hợp lệ! Vui lòng nhập lại.')
            return;
        }
        if (password !== confirmPassword) {
            message.error('Mật khẩu không khớp! Vui lòng kiểm tra lại."')
            return;
        }
        setLoading(true);
        try {
            const response = await signupEmail(email, password);

            if (response.status === 201) {
                message.success('Email đăng kí thành công! Trở về trang đang nhập.');
                setTimeout(() => {
                    return;
                }, 1800);
            }
        } catch (error) {
            if (error.response?.status === 409) {
                return message.error("Email đã được đăng ký! Vui lòng chọn email khác.");
            } else {
                return message.error("Đăng ký thất bại! Vui lòng thử lại.");
            }
        } finally {
            setLoading(false); // Tắt loading sau khi gọi API
        }
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <>
            {/* HEADER */}
            <header className="w-full bg-white py-3 px-40 flex justify-between items-center shadow">
                {/* Logo + Text */}
                <div className="flex items-center space-x-3">
                    {/* Thay thế phần SVG bằng ảnh logo Shopee nếu bạn có file */}
                    <div className="flex items-center text-blue-400 font-bold text-3xl space-x-4">
                        <img src={Logo} alt="Ảnh Logo" className="w-14 h-14 rounded-full" />
                        <p>MechaWorld</p>
                    </div>
                </div>

                {/* Link trợ giúp */}
                <a href="/" className="text-blue-400">
                    Quay về Trang chủ ?
                </a>
            </header>


            {/* CONTENT */}
            <div className="flex-1 bg-blue-400 flex justify-center items-center py-10">
                {/* Container chia layout 50:50 */}
                <div className="max-w-6xl w-full flex">
                    {/* Cột bên trái: Logo và thông tin */}
                    <div className="w-1/2 flex flex-col justify-center items-center text-white text-center px-8">
                        <div>
                            {/* SVG logo, có thể thay bằng ảnh thực nếu có */}
                            <img src={Logo} alt="Ảnh Logo" className="w-96 h-96 rounded-full" />
                        </div>
                        <p className="text-2xl font-bold mt-2">
                            Nền tảng GUNDAM thương mại điện tử <br /> lần đầu tiên có mặt tại Việt Nam.
                        </p>
                    </div>

                    {/* Cột bên phải: Form đăng nhập */}
                    <div className="w-1/2 flex justify-center items-center">
                        <div className="relative z-10">
                            <div className="bg-white shadow-lg rounded-3xl p-8 md:p-10">
                                <Title level={2} className="text-center mb-6">Đăng Ký</Title>

                                <Form
                                    style={{width: 310}}
                                    form={form}
                                    name="signin"
                                    layout='vertical'
                                    // onFinish={onFinish}
                                    // onFinishFailed={onFinishFailed}
                                    autoComplete="off"
                                >
                                    <Form.Item
                                        name="email"
                                        label="E-mail"
                                        rules={[{ required: true, message: "Vui lòng nhập email!" }]}
                                    >
                                        <Input size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        name="password"
                                        label="Mật khẩu"
                                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>

                                    <Form.Item
                                        name="re-password"
                                        label="Nhập lại mật khẩu"
                                        rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                                    >
                                        <Input.Password size="large" />
                                    </Form.Item>

                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            className="bg-blue-500 uppercase w-full"
                                        >
                                            Đăng ký
                                        </Button>
                                    </Form.Item>
                                </Form>

                                {/* <div className="flex items-center justify-between mt-6">
                                    <span className="flex-1 border-t border-gray-300"></span>
                                    <span className="mx-2 text-gray-400 uppercase text-sm">Hoặc</span>
                                    <span className="flex-1 border-t border-gray-300"></span>
                                </div> */}

                                <div className="flex items-center justify-center mt-4">
                                    <Text className="text-gray-500 mr-2">Đã có Tài khoản ?</Text>
                                    <NavLink
                                        className="text-blue-500 text-xs uppercase hover:underline"
                                        to="/member/login"
                                    >
                                        Quay lại Đăng nhập!
                                    </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            {/* FOOTER */}
            <Footer />
        </>
    )
}
