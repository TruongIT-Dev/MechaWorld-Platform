import { Input, Form } from "antd";

const ShippingInfo = () => {
    return (
        <div className="flex justify-center">
            <Form
                layout="horizontal"
                labelCol={{
                    span: 6,
                }}
                wrapperCol={{
                    span: 16,
                }}
                initialValues={{
                    remember: true,
                }}
            >
                
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên Shop!',
                        },
                    ]}
                    label={<span className="font-semibold">Tỉnh</span>}
                >
                    <Input value="TruongNguyen" className="w-80" />
                </Form.Item>

                
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                    ]}
                    label={<span className="font-semibold">Quận/huyện</span>}>
                    <Input value="dangtruongnguyen2@gmail.com" className="w-80" />
                </Form.Item>

                
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                        },
                    ]}
                    label={<span className="font-semibold">Thành phố</span>}>
                    <Input value="+84385145207" className="w-80" />
                </Form.Item>

                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                        },
                    ]}
                    label={<span className="font-semibold">Địa chỉ cụ thể</span>}>
                    <Input value="+84385145207" className="w-80" />
                </Form.Item>
            </Form>

        </div>
    );
};

export default ShippingInfo;
