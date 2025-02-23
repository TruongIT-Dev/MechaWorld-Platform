import { useState, useEffect, useRef } from 'react';
import { Form, Input, Upload, Button, message, Card, Modal, Checkbox } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector,useDispatch } from 'react-redux';
import { uploadAvatar, verifyOtp,verifyPhone } from '../../apis/User/APIUserProfile';
import { Cropper } from 'react-cropper';
import "cropperjs/dist/cropper.css";
import "../../assets/css/userProfile.css"
import { updateUserProfile } from '../../features/auth/authSlice';
const ProfilePage = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user); // Lấy user từ Redux
    const [avatar, setAvatar] = useState(user?.avatar_url);
    const [cropVisible, setCropVisible] = useState(false);
    const [cropper, setCropper] = useState(null);
    const [otpVisible, setOtpVisible] = useState(false);
    const [otp, setOtp] = useState("");
    const cropperRef = useRef(null);

    useEffect(() => {
        if (user) {
            try {
                // setImageUrl(user.picture)
                // form.setFieldsValue({
                //     avatar: user.picture,
                //     name: user.name,
                //     email: user.email,
                //     phone: user.phone || '', 
                //     address: user.address || '',
                //     role: user.role || 'Member',
                // });
            } catch (error) {
                console.error("Lỗi parse user từ localStorage:", error);
                localStorage.removeItem('user');
            }
        }
    }, [user, form]);
    const onChange = (e) => {
      console.log(`checked = ${e.target.checked}`);
    };

    const handleUpload = ({ file }) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target.result;
          img.onload = async () => {
            if (img.width > 400 || img.height > 400) {
              setCropVisible(true);
              setAvatar(e.target.result);
            } else {
              setAvatar(e.target.result);
              await uploadAvatar(user.id, file); // Gửi ngay nếu không cần crop
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
            setAvatar(URL.createObjectURL(blob)); 
            setCropVisible(false);
          }, "image/jpeg");
        }
      };
      

    // const getBase64 = (img, callback) => {
    //     const reader = new FileReader();
    //     reader.addEventListener('load', () => callback(reader.result));
    //     reader.readAsDataURL(img);
    // }
    const handleSendOtp = async () => {
        try {
          const response = await verifyPhone(user.phone_number);
          if (response.status === 200) {
            message.success("OTP đã được gửi!");
            setOtpVisible(true);
          }
        } catch (error) {
          message.error("Không thể gửi OTP! Vui lòng thử lại.");
        }
      };
    
      // Xác thực OTP
      const handleVerifyOtp = async () => {
        try {
          const response = await verifyOtp(user.id,user.phone_number,otp);
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
      const onFinish = (values) => {
        console.log('Success:', values);
        const updatedUser = { ...user, ...values, avatar };
        // localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch(updateUserProfile(updatedUser));
        message.success('Cập nhật thông tin thành công!');
    };


    return (
      <div>
        {/* <button onClick={console.log(user)}>Show Data</button> */}
        <div className="flex justify-center mt-10">
          <Card className="p-6 shadow-lg card-profile ">
            <div className="flex items-center space-x-6">
              {/* Avatar */}
              <Upload
                showUploadList={false}
                customRequest={handleUpload}
                accept="image/*"
              >
                <div className="w-32 h-32 border rounded-full overflow-hidden cursor-pointer">
                  <img
                    src={avatar || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <Button className="mt-2" icon={<UploadOutlined />}>
                  Upload Avatar
                </Button>
              </Upload>

              {/* Thông tin User */}
              <div className="flex-1">
                <Form
                  layout="vertical"
                  className=""
                  labelCol={{ span: 24 }} // Giữ label trên input
                  wrapperCol={{ span: 24 }}
                  onFinish={onFinish}
                  >
                  <Form.Item label="Tên người dùng" className="mb-3 ">
                    <Input value={user?.full_name} readOnly className="h-10" />
                  </Form.Item>
                  <Form.Item label="Email" className="mb-3 ">
                    <Input value={user?.email} readOnly className="h-10" />
                  </Form.Item>
                  <Form.Item label="Vai trò" className="mb-3">
                    <Input value={user?.role} readOnly className="h-10 w-fit" />
                    {/* {user?.role} */}
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded "
                    >
                      Lưu thay đổi
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>

            {/* Số điện thoại + OTP */}
            <Card className="mt-6">
              <div className="flex items-center space-x-4">
                <Input
                  value={user?.phone_number || ""}
                  placeholder="Số điện thoại chưa đăng ký"
                />
                <Input placeholder="Nhập số điện thoại" />                <Button
                  type="primary"
                  onClick={handleSendOtp}
                  className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded"
                >
                  Kiểm tra
                </Button>
              </div>
              {otpVisible && (
                <div className="flex items-center space-x-4 mt-4">
                  <Input.OTP
                    placeholder="Nhập OTP"
                    length={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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
            </Card>
          </Card>

          {/* Modal Cropper */}
          <Modal
            open={cropVisible}
            onCancel={() => setCropVisible(false)}
            onOk={handleCrop}
            title="Cắt ảnh"
            // okButtonProps={{ styles:{ defaultHoverBorderColor}  }}
            footer={[
              <Button
                key="cancel"
                onClick={() => setCropVisible(false)}
                className="custom-cancel"
              >
                Hủy
              </Button>,
              <Button
                key="crop"
                type="primary"
                onClick={handleCrop}
                className="bg-[#0056b3] hover:bg-[#4a90e2] text-white px-4 py-2 rounded"
              >
                Cắt ảnh
              </Button>,
            ]}
          >
            <Cropper
              ref={cropperRef}
              style={{ height: 300, width: "100%" }}
              aspectRatio={1}
              preview=".img-preview"
              src={avatar}
              viewMode={1}
              minCropBoxHeight={100}
              minCropBoxWidth={100}
              background={false}
              responsive={true}
              autoCropArea={1}
              checkOrientation={false}
              onInitialized={(instance) => setCropper(instance)}
            />
          </Modal>
        </div>
      </div>
    );
};

export default ProfilePage;