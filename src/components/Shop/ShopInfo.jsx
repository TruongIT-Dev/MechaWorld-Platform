import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Input, Button, Row, Col } from 'antd';

const ShopInfo = () => {

    const [form] = Form.useForm();
    const [shopName, setShopName] = useState("")

    const userInfo = useSelector((state) => state.auth.user);

    const onFinish = (value) => {
        console.log(value);

    }

    return (
        <div className="container w-full p-10">
            <h2 className="text-2xl font-semibold">Hồ Sơ Của Tôi</h2>
            <p className="text-gray-500 mb-6">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            <div className="border-t-2 p-6">
                <Row ow gutter={24} align="middle">
                    <Col span={14}>
                        <Form
                            form={form}
                            layout="horizontal"
                            labelCol={{ span: 6 }}
                            wrapperCol={{ span: 18 }}
                            className="max-w-lg"
                        >
                            {/* Tên tài khoản */}
                            <Form.Item label="Tên Shop">
                                <Input onChange={(e) => setShopName(e.target.value)} />
                            </Form.Item>

                            {/* Nút Lưu */}
                            <Form.Item wrapperCol={{ offset: 6 }}>
                                <Button type="primary" className="bg-blue-500 px-6 py-2 rounded text-white" onClick={onFinish}>
                                    Cập nhật
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default ShopInfo;
