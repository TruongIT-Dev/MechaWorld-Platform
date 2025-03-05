import { useState, useEffect, useRef } from 'react';
import { Form, Input, Upload, Button, message, Card, Modal, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  useSelector,
  // useDispatch 
} from 'react-redux';
import { updateUserData, uploadAvatar, verifyOtp, verifyPhone } from '../../apis/User/APIUserProfile';
import Cookies from 'js-cookie';
import { Cropper } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import "../../assets/css/userProfile.css"
// import { updateUserProfile } from '../../features/auth/authSlice';
import { verifyToken } from '../../apis/Auth/APIAuth';
const ProfilePage = () => {
  const [form] = Form.useForm();
  // const dispatch = useDispatch();
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  const [avatar, setAvatar] = useState(user?.avatar_url);
  const [cropVisible, setCropVisible] = useState(false);
  const [cropper, setCropper] = useState(null);
  const [otpVisible, setOtpVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const cropperRef = useRef(null);
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [phoneModalVisible, setPhoneModalVisible] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [isCounting, setIsCounting] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  useEffect(() => {
    // const userData = Cookies.get("user");

    const Access_token = Cookies.get('access_token');
    if (Access_token) {
      try {
        verifyToken(Access_token).then(response => {
          console.log(response.data);
          setUser(response.data);
          setAvatar(response.data.avatar_url);
          setFullName(response.data.full_name);
        })
      } catch (error) {
        console.error("Lỗi từ API:", error);
      }
    }
    const savedAvatar = localStorage.getItem("user_avatar");
    if (savedAvatar) {
      setAvatar(savedAvatar);
    }
  }, []);

  const handleNameChange = (e) => {
    setFullName(e.target.value);
  };
  // const handleData = (e) => {
  //   const newPhone = e.target.value;
  //   setPhoneNumber(newPhone);

  //   dispatch(updateUserProfile({ ...user, phone_number: newPhone }));
  // };
  const handleUpload = ({ file }) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      console.log("img file data: ", file);
      img.onload = async () => {
        if (img.width > 400 || img.height > 400) {
          setCropVisible(true);
          setAvatar(e.target.result);
        } else {
          setAvatar(e.target.result);
          await uploadAvatar(user.id, file);
        }
      };
    };
    reader.readAsDataURL(file);
  };
  const handleCrop = async () => {
    if (cropper) {
      const croppedCanvas = cropper.getCroppedCanvas();
      if (!croppedCanvas) return;

      croppedCanvas.toBlob(async (blob) => {
        const file = new File([blob], "avatar.jpg", { type: "image/jpeg" });
        await uploadAvatar(user.id, file);

        const newAvatarURL = URL.createObjectURL(blob);
        setAvatar(newAvatarURL);

        // 👉 Lưu avatar vào localStorage
        localStorage.setItem("user_avatar", newAvatarURL);

        setCropVisible(false);
      }, "image/jpeg");
    }
  };
  //   const handleUpdateUser = async () => {
  //     if (!fullName.trim()) {
  //         message.error("Tên không được để trống!");
  //         return;
  //     }

  //     try {
  //         await updateUserData(user.id, fullName);
  //         const updatedUser = { ...user, full_name: fullName };
  //         setUser(updatedUser); // Cập nhật vào state
  //         dispatch(updateUserProfile(updatedUser)); // Cập nhật vào Redux
  //         message.success("Cập nhật thông tin thành công!");
  //     } catch (error) {
  //         message.error("Lỗi khi cập nhật tên người dùng.");
  //     }
  // };
  // const handleSendOtp = async () => {
  //     try {
  //       const response = await verifyPhone(user.phone_number);
  //       if (response.status === 200) {
  //         message.success("OTP đã được gửi!");
  //         setOtpVisible(true);
  //       }
  //     } catch (error) {
  //       message.error("Không thể gửi OTP! Vui lòng thử lại.");
  //     }
  //   };
  //   const handleOtp = (e) => {
  //     setOtp(e.target.value);
  //     console.log(e.target.value);
  //   }
  //   // Xác thực OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await verifyOtp(user.id, user.phone_number, otp);
      if (response.status === 200) {
        message.success("Xác thực thành công!");
        setOtpVisible(false);
      } else {
        message.error("OTP không đúng! Vui lòng kiểm tra lại.");
      }
    } catch (error) {
      message.error("Lỗi khi xác thực OTP.");
    }
  };

  const handlePhoneSubmit = async () => {
    if (!newPhoneNumber) {
      message.error("Vui lòng nhập số điện thoại!");
      return;
    }
    try {
      const response = await verifyPhone(newPhoneNumber);
      if (response.status === 200) {
        message.success("OTP đã được gửi!");
        setOtpVisible(true);
        setIsCounting(true);
        setCountdown(60);
        startCountdown();
      }
    } catch (error) {
      message.error("Không thể gửi OTP! Vui lòng thử lại.");
    }
  };

  const startCountdown = () => {
    let timeLeft = 60;
    const interval = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);
      if (timeLeft === 0) {
        clearInterval(interval);
        setIsCounting(false);
      }
    }, 1000);
  };


  const onFinish = (values) => {
    console.log('Success:', values);
    // localStorage.setItem('user', JSON.stringify(updatedUser));
    updateUserData(user.id, fullName).then(response => {
      console.log(response);
      if (response.status == 200) {
        message.success('Cập nhật thông tin thành công!');
      }
    }).catch(error => {
      return message.error(error);
    })
    // dispatch(updateUserProfile(updatedUser));

  };


  return (
    // <div className="flex justify-center mt-10">
    //     <div className="flex items-center space-x-6">
    //       {/* Avatar */}
    //       <Upload
    //         showUploadList={false}
    //         customRequest={handleUpload}
    //         accept="image/*"
    //       >
    //         <div className="w-32 h-32 border rounded-full overflow-hidden cursor-pointer">
    //           <img
    //             src={avatar || "/default-avatar.png"}
    //             alt="Avatar"
    //             className="w-full h-full object-cover"
    //           />
    //         </div>
    //         <Button className="mt-2" icon={<UploadOutlined />}>
    //           Upload Avatar
    //         </Button>
    //       </Upload>

    //       {/* Thông tin User */}
    //       <div className="flex-1">
    //         <Form
    //           layout="vertical"
    //           form={form}
    //           className=""
    //           labelCol={{ span: 24 }}
    //           wrapperCol={{ span: 24 }}
    //           onFinish={onFinish}
    //         >
    //           <Form.Item label="Tên người dùng" className="mb-3 ">
    //             <Input value={fullName} onChange={handleNameChange} />
    //           </Form.Item>
    //           <Form.Item label="Email" className="mb-3 ">
    //             <Input value={user?.email} readOnly className="h-10" disabled />
    //           </Form.Item>
    //           <Form.Item className="mb-3">
    //             {/* <Input value={user?.role} readOnly className="h-10 w-fit" /> */}
    //             Số điện thoại : {user?.phone_number || "Chưa đăng kí số điện thoại"}
    //             <Button type="link" onClick={() => setPhoneModalVisible(true)}>
    //               {user?.phone_number ? "Thay đổi" : "Đăng ký"}
    //             </Button>
    //             {/* {user?.role} */}
    //           </Form.Item>
    //           <Form.Item>
    //             <Button
    //               type="primary"
    //               htmlType="submit"
    //               className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded "
    //             >
    //               Lưu thay đổi
    //             </Button>
    //           </Form.Item>
    //         </Form>
    //       </div>
    //     </div>

    //     {/* Số điện thoại + OTP */}
    //     <Modal
    //       open={phoneModalVisible}
    //       onCancel={() => setPhoneModalVisible(false)}
    //       footer={null}
    //       title={otpVisible ? "Xác thực OTP" : "Nhập số điện thoại"}
    //     >
    //       {!otpVisible ? (
    //         <>
    //           <Form layout="vertical">
    //             <Form.Item label="Số điện thoại">
    //               <Input type="number" value={newPhoneNumber} onChange={(e) => setNewPhoneNumber(e.target.value)} />
    //             </Form.Item>
    //           </Form>
    //           <Button type="primary" onClick={handlePhoneSubmit}>Xác thực</Button>
    //         </>
    //       ) : (
    //         <>
    //           <Form layout="vertical">
    //             <Form.Item label="Nhập mã OTP">
    //               <Input type="number" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
    //             </Form.Item>
    //           </Form>
    //           <div className="flex justify-between">
    //             <Button type="primary" onClick={handleVerifyOtp}>Xác thực</Button>
    //             <Button type="link" disabled={isCounting} onClick={handlePhoneSubmit}>
    //               {isCounting ? `Gửi lại sau ${countdown}s` : "Gửi lại OTP"}
    //             </Button>
    //           </div>
    //         </>
    //       )}
    //     </Modal>

    //   {/* Modal Cropper */}
    //   <Modal
    //     open={cropVisible}
    //     onCancel={() => setCropVisible(false)}
    //     onOk={handleCrop}
    //     title="Cắt ảnh"
    //     // okButtonProps={{ styles:{ defaultHoverBorderColor}  }}
    //     footer={[
    //       <Button
    //         key="cancel"
    //         onClick={() => setCropVisible(false)}
    //         className="custom-cancel"
    //       >
    //         Hủy
    //       </Button>,
    //       <Button
    //         key="crop"
    //         type="primary"
    //         onClick={handleCrop}
    //         className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded"
    //       >
    //         Cắt ảnh
    //       </Button>,
    //     ]}
    //   >
    //     <Cropper
    //       ref={cropperRef}
    //       style={{ height: 300, width: "100%" }}
    //       aspectRatio={1}
    //       preview=".img-preview"
    //       src={avatar}
    //       viewMode={1}
    //       minCropBoxHeight={100}
    //       minCropBoxWidth={100}
    //       background={false}
    //       responsive={true}
    //       autoCropArea={1}
    //       checkOrientation={false}
    //       onInitialized={(instance) => setCropper(instance)}
    //     />
    //     {/* {console.log("avattar: ",avatar)}; */}
    //   </Modal>
    // </div>
    <div className="container w-full p-10">
      <h2 className="text-2xl font-semibold">Hồ Sơ Của Tôi</h2>
      <p className="text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
      <div className="border-t-2 p-6">
        <Row gutter={24} align="middle">
          <Col span={14}>
            <Form
              form={form}
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 18 }}
              className="max-w-lg"
            >
              {/* Tên tài khoản */}
              <Form.Item label="Tên tài khoản">
                <Input value="truongnguyen00002" className='mt-3'/>
              </Form.Item>

              {/* Email */}
              <Form.Item label="Email">
                <div className="flex items-center mt-3">
                  <Input value="dangtruong@gmail.com" disabled className="bg-gray-100" />
                  <Button type="link" className="ml-2 text-blue-500">Thay Đổi</Button>
                </div>
              </Form.Item>

              {/* Số điện thoại */}
              <Form.Item label="Số điện thoại">
                <div className="flex items-center mt-3">
                  <Input value="********07" disabled className="bg-gray-100" />
                  <Button type="link" className="ml-2 text-blue-500">Thay Đổi</Button>
                </div>
              </Form.Item>

              {/* Nút Lưu */}
              <Form.Item wrapperCol={{ offset: 6 }}>
                <Button type="primary" className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded text-white">
                  Lưu
                </Button>
              </Form.Item>
            </Form>
          </Col>

          <Col span={10} className="flex flex-col items-center">
            {/* Avatar Section */}
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 border rounded-full overflow-hidden mb-4">
                <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <Upload showUploadList={false} customRequest={handleUpload} accept="image/*">
                <Button icon={<UploadOutlined />}>Chọn Ảnh</Button>
              </Upload>
              <p className="text-gray-500 text-sm text-center mt-2">
                Dung lượng tối đa 1MB<br />Định dạng: JPEG, PNG
              </p>
            </div>
          </Col>
        </Row>
      </div>
    </div>


  );
};

export default ProfilePage;