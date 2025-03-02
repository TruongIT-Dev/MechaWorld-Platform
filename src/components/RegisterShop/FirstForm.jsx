import { Form, Input, Button, message, Space } from "antd";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { verifyToken } from '../../apis/Auth/APIAuth';
import { useSelector } from "react-redux";
import { verifyOtp, verifyPhone } from "../../apis/User/APIUserProfile";

const FirstForm = ({ form, setIsPhoneVerified }) => {

    const [user, setUser] = useState(useSelector((state) => state.auth.user));

    const [otpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpCode, setOtpCode] = useState("");

    // Lấy Thông tin User từ Cookie
    useEffect(() => {
        const access_token = Cookies.get('access_token');
        if (access_token) {
            try {
                verifyToken(access_token).then(response => {
                    console.log(response.data);
                    setUser(response.data);
                })
            } catch (error) {
                console.error("Lỗi lấy Thông tin User:", error);
            }
        }
    }, []);


    // Hàm xử lý Thay đổi tên Shop
    useEffect(() => {
        if (user?.full_name) {
            // console.log("🔄 Cập nhật Form Cha với full_name:", user.full_name);
            form.setFieldsValue({ full_name: user.full_name });
        }
    }, [user, form]);


    // Gửi OTP
    const handleSendOtp = async () => {
        try {
            const phoneNumber = form.getFieldValue("phone_number");
            if (!phoneNumber) {
                message.error("Vui lòng nhập số điện thoại trước khi gửi OTP!");
                return;
            }

            const response = await verifyPhone(phoneNumber);
            const otpValue = response.data.otp_code; // ✅ Lấy trực tiếp từ response

            setOtpCode(otpValue); // Cập nhật state nhưng không dùng ngay lập tức
            console.log("✅ Gửi OTP Response:", response);
            console.log("otpCode từ API:", otpValue); // ✅ Đảm bảo in ra đúng giá trị
            if (response.status === 200) {
                message.success({
                    content: `OTP của bạn là: ${otpValue}`,
                    duration: 10, // ⏳ Giữ thông báo trong 10 giây
                });

                setOtpVisible(true);
            }
        } catch (error) {
            message.error("Không thể gửi OTP! Vui lòng thử lại.");
        }
    };



    // Nhập OTP
    const handleOtp = (value) => {
        setOtp(value); // ✅ Đảm bảo nhận giá trị đúng từ Input.OTP
        console.log("OTP nhập vào:", value);
    };


    // Xác thực OTP
    const handleVerifyOtp = async () => {
        try {
            const phoneNumber = form.getFieldValue("phone_number");
            if (!otp) {
                message.error("Vui lòng nhập mã OTP!");
                return;
            }

            const response = await verifyOtp(user?.id, phoneNumber, otp);
            console.log("✅ Xác thực OTP Response:", response);

            if (response.status === 200) {
                message.success("Xác thực thành công!");
                setOtpVisible(false);
                setIsPhoneVerified(true);
            } else {
                message.error("OTP không đúng! Vui lòng kiểm tra lại.");
            }
        } catch (error) {
            message.error("Lỗi khi xác thực OTP.");
        }
    };

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-6 gap-4">

                <div className="first-form-header">
                    <h2 className="text-xl font-bold">NHẬP THÔNG TIN CỦA SHOP</h2>
                    <p className="text-gray-500">
                        Vui lòng cung cấp đầy đủ thông tin cửa hàng của bạn.
                        Những thông tin này sẽ giúp khách hàng dễ dàng nhận diện và tìm kiếm SHOP của bạn trên nền tảng.
                    </p>
                    <p className="text-red-500 mt-2 italic text-sm">Lưu ý: Tài khoản người dùng và tài khoản Shop sẽ có cùng sử dụng một tên duy nhất.</p>
                </div>

                {/* Input full name */}
                <Form.Item
                    label={<span className="font-semibold">Tên Shop của bạn</span>}
                    name="full_name"
                    rules={[{ required: true, message: "Vui lòng nhập tên người bán!" }]}
                >
                    <Input />
                </Form.Item>

                {/* Input phone number */}
                <Form.Item
                    label={<span className="font-semibold">Số điện thoại</span>}
                    name="phone_number"
                    rules={[
                        { required: true, message: "Vui lòng nhập số điện thoại!" },
                        { pattern: /^[0-9]{10}$/, message: "Số điện thoại không hợp lệ!" },
                    ]}
                >
                    <Space.Compact style={{ width: "100%" }}>
                        <Input placeholder="Nhập số điện thoại" />
                        <Button
                            onClick={handleSendOtp}
                            type="primary"
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Gửi mã OTP
                        </Button>
                    </Space.Compact>
                </Form.Item>

                {otpVisible && (
                    <div className="flex items-center space-x-4 mt-4">
                        <Input.OTP
                            placeholder="Nhập OTP"
                            maxLength={6}
                            value={otp}
                            onChange={handleOtp}
                        />
                        <Button
                            type="primary"
                            onClick={handleVerifyOtp}
                            className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded"
                        >
                            Xác thực
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default FirstForm;
