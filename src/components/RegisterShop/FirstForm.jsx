import { Form, Input, Button, message, Modal } from "antd";
import { useEffect, useState } from "react";
import { PhoneOutlined, LockOutlined } from "@ant-design/icons";
import Cookies from 'js-cookie';
import { verifyToken } from '../../apis/Auth/APIAuth';
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, verifyPhone } from "../../apis/User/APIUserProfile";
import { updateUser } from "../../features/auth/authSlice";

const FirstForm = ({ form, setIsPhoneVerified }) => {

    // const [user, setUser] = useState(useSelector((state) => state.auth.user));
    const user = useSelector((state) => state.auth.user);

    const [email, setEmail] = useState(user?.email || "");
    const [fullName, setFullName] = useState(user?.full_name || "");
    const [newPhoneNumber, setNewPhoneNumber] = useState(user?.phone_number || "")

    const [phoneNumber, setPhoneNumber] = useState("");
    const [modalVisible, setModalVisible] = useState(false);
    const [step, setStep] = useState(1); // Step 1: Nhập SĐT, Step 2: Nhập OTP

    const [otp, setOtp] = useState("");
    const [otpCode, setOtpCode] = useState("");
    const [otpVisible, setOtpVisible] = useState(false);

    const [countdown, setCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(true);


    const dispatch = useDispatch();

    // Cập nhật các State khi user có thay đổi
    useEffect(() => {
        setEmail(user?.email || "");
        setFullName(user?.full_name || "");
        setNewPhoneNumber(user?.phone_number || "");
    }, [user]);


    // Lấy Thông tin User từ Cookie
    useEffect(() => {
        const access_token = Cookies.get('access_token');
        if (access_token) {
            try {
                verifyToken(access_token).then(response => {
                    console.log("Data user", response.data);
                    // setUser(response.data);
                    setEmail(response.data.email);
                    setFullName(response.data.full_name);
                    setNewPhoneNumber(response.data.phone_number);

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


    // Hàm xử lý Thay đổi tên Shop
    useEffect(() => {
        if (user) {
            form.setFieldsValue({ full_name: user?.full_name });
            form.setFieldsValue({ email: user?.email });
        }
    }, [user, form]);



    const handleNameChange = (e) => {
        setFullName(e.target.value);
    };


    // Gửi OTP
    const handleSendOtp = async () => {

        // Validate Ko nhập Sđt
        if (!phoneNumber) {
            message.error("Vui lòng nhập số điện thoại!");
            return;
        }

        // Validate Nhập Sđt không hợp lệ
        if (!/^[0-9]{10}$/.test(phoneNumber)) {
            message.error("Số điện thoại không hợp lệ!");
            return;
        }


        try {
            const response = await verifyPhone(phoneNumber);
            const otpValue = response.data.otp_code;

            setOtpCode(otpValue); // Cập nhật state nhưng không dùng ngay lập tức

            // console.log("✅ Gửi OTP Response:", response);
            // console.log("otpCode từ API:", otpValue); // ✅ Đảm bảo in ra đúng giá trị

            if (response.status === 200) {
                console.log("Gửi OTP thành công", response);

                message.success({
                    content: `OTP của bạn là: ${otpValue}`,
                    duration: 10, // ⏳ Giữ thông báo trong 10 giây
                });
                setStep(2); // Chuyển qua bước nhập OTP
                setOtpVisible(true);
                setIsResendDisabled(true);
                setCountdown(60);
                const interval = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev === 1) {
                            clearInterval(interval);
                            setIsResendDisabled(false);
                        }
                        return prev - 1;
                    });
                }, 1000);
            }
        } catch (error) {
            message.error("Không thể gửi OTP! Vui lòng thử lại.");
        }
    };


    // Hàm xác thực OTP
    const handleVerifyOtp = async () => {
        console.log("📩 Đã gọi handleVerifyOtp");
        console.log("🔢 OTP hiện tại:", otp);

        if (!otp) {
            message.error("Vui lòng nhập mã OTP!");
            return;
        }

        try {
            const response = await verifyOtp(user?.id, phoneNumber, otp);
            console.log("✅ Xác thực OTP Response:", response);

            if (response.status === 200) {
                message.success("Xác thực thành công!");
                setOtpVisible(false);
                setModalVisible(false); // Đảm bảo đúng cách đóng modal
                setIsPhoneVerified(true);
                setOtp("");
                setStep(1);

                // Cập nhật thông tin người dùng với số điện thoại mới
                dispatch(updateUser({
                    ...user,  // giữ lại các thông tin hiện có
                    phone_number: phoneNumber  // cập nhật số điện thoại
                }));

            } else {
                message.error("OTP không đúng! Vui lòng kiểm tra lại.");
            }
        } catch (error) {
            message.error("Lỗi khi xác thực OTP.");
        }
    };



    const prefixSelector = (
        <div className="bg-gray-100 border-r border-gray-300 px-2 mr-2 flex items-center h-full">
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg"
                alt="Vietnam flag"
                className="w-5 h-3 mr-1"
            />
            (+84)
        </div>
    );

    return (
        <>
            <div className="max-w-2xl mx-auto space-y-4 gap-4">

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
                    <Input value={fullName} onChange={handleNameChange} />
                </Form.Item>

                {/* Disply email */}
                <Form.Item
                    label={<span className="font-semibold">Email</span>}
                    name="email"
                >
                    <Input disabled value={email} />
                </Form.Item>

                {/* Display Phone Number */}
                <Form.Item
                    label={<span className="font-semibold">Số điện thoại</span>}
                >
                    <div className="flex items-center">
                        {newPhoneNumber ? (
                            <>
                                <span className="">{newPhoneNumber}</span>
                                <Button type="link" className="underline" onClick={() => setModalVisible(true)}>
                                    Thay Đổi
                                </Button>
                            </>
                        ) : (
                            <Button type="link" className="text-blue-500 underline" onClick={() => setModalVisible(true)}>
                                Thêm mới
                            </Button>
                        )}
                    </div>
                </Form.Item>

                
                <Modal
                    open={modalVisible}
                    onCancel={() => {
                        setModalVisible(false);
                        setStep(1);
                    }}
                    footer={null}
                    width={450}
                    centered
                    title={
                        <div className="text-center font-semibold text-lg">
                            {step === 1 ? "Cập nhật số điện thoại" : "Xác Thực Mã OTP"}
                        </div>
                    }
                >
                    <div className="text-center space-y-4">
                        {/* Nhập Số Điện Thoại */}
                        {step === 1 && (
                            <>
                                <div className="flex flex-col items-center mb-4">
                                    <div className="bg-blue-100 p-3 rounded-full mb-2">
                                        <PhoneOutlined className="text-3xl text-blue-500" />
                                    </div>
                                    <p className="text-gray-600 mb-4">Vui lòng nhập số điện thoại để <br /> nhận mã kích hoạt OTP!</p>
                                </div>

                                <div className="mb-4">
                                    <Input
                                        addonBefore={prefixSelector}
                                        size="large"
                                        placeholder="Nhập số điện thoại"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="mb-1"
                                    />
                                    {!/^[0-9]{10}$/.test(phoneNumber) && phoneNumber &&
                                        <div className="text-red-500 text-center text-sm mt-1">Số điện thoại không hợp lệ!</div>
                                    }
                                </div>

                                <Button
                                    type="primary"
                                    className="w-full bg-blue-500 hover:bg-blue-600 h-10"
                                    onClick={handleSendOtp}
                                    disabled={!/^[0-9]{10}$/.test(phoneNumber)}
                                >
                                    Gửi mã OTP
                                </Button>
                            </>
                        )}

                        {/* Nhập OTP */}
                        {step === 2 && (
                            <>
                                <LockOutlined className="text-4xl text-blue-500 mb-2" />
                                <p className="text-gray-600 text-base">Nhập mã OTP đã gửi đến <strong>{phoneNumber}</strong></p>
                                <Input.OTP
                                    size="large"
                                    placeholder="Nhập mã OTP"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(value) => setOtp(value)}
                                />
                                <Button
                                    type="primary"
                                    className="w-full bg-blue-500"
                                    onClick={handleVerifyOtp}
                                >
                                    Xác thực OTP
                                </Button>
                                <div className="text-gray-500 text-sm mt-2">
                                    {isResendDisabled ? (
                                        `Gửi lại mã sau ${countdown}s`
                                    ) : (
                                        <Button type="link" onClick={handleSendOtp}>
                                            Gửi lại OTP
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default FirstForm;
