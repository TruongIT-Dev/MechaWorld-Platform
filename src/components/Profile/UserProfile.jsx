import { useState, useEffect } from 'react';
import { Form, Input, Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { useSelector,useDispatch } from 'react-redux';
import { updateUserProfile } from '../../features/auth/authSlice';
const { Item } = Form;

const ProfilePage = () => {
    const [form] = Form.useForm();
    const [imageUrl, setImageUrl] = useState(null); // State cho URL ảnh
    const dispatch = useDispatch();
    // const [initialValues, setInitialValues] = useState(null);
    const user = useSelector((state) => state.auth.user)

    useEffect(() => {
        if (user) {
            try {
                // console.log(user.picture);
                // setInitialValues({
                //     name: user.name,
                //     email: user.email,
                //     phone: user.phone || '', 
                //     picture: user.picture,
                //     address: user.address,
                //     role: user.role || 'Người dùng', 
                //     accountPackage: user.accountPackage || 'Cơ bản',
                // });
                setImageUrl(user.picture)
                form.setFieldsValue({
                    avatar: user.picture,
                    name: user.name,
                    email: user.email,
                    phone: user.phone || '', 
                    address: user.address || '',
                    role: user.role || 'Người dùng',
                    accountPackage: user.accountPackage || 'Cơ bản',
                });
            } catch (error) {
                console.error("Lỗi parse user từ localStorage:", error);
                localStorage.removeItem('user');
            }
        }
    }, [user, form]);


    const handleUploadChange = info => {
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (url) => {
                setImageUrl(url)
            })
        }
    };
    const getBase64 = (img, callback) => {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }
    const onFinish = (values) => {
        console.log('Success:', values);
        const updatedUser = { ...user, ...values,picture:imageUrl };
        // localStorage.setItem('user', JSON.stringify(updatedUser));
        dispatch(updateUserProfile(updatedUser));
        message.success('Cập nhật thông tin thành công!');
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    const uploadButton = (
        <div>
            <UploadOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            style={{ maxWidth: "500px", margin: "0 auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}
        >
            <Item label="Ảnh đại diện" name="picture">
                <Upload
                    name="avatar"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    onChange={handleUploadChange}
                >
                    {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                </Upload>
            </Item>

            <Item
                label="Tên"
                name="name"
                rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
            >
                <Input />
            </Item>

            <Item label="Email" name="email">
                <Input readOnly />
            </Item>

            <Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: 'Vui lòng nhập số điện thoại!' }]}
            >
                <Input />
            </Item>

            <Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, message: 'Vui lòng nhập địa chỉ!' }]}
            >
                <Input />
            </Item>

            <Item label="Vai trò" name="role">
                <Input readOnly />
            </Item>

            <Item label="Gói tài khoản" name="accountPackage">
                <Input readOnly />
            </Item>

            <Item>
                <Button type="primary" htmlType="submit" name='btn submit'style={{backgroundColor:'palevioletred'}}>
                    Lưu thay đổi
                </Button>
            </Item>
        </Form>
    );
};

export default ProfilePage;