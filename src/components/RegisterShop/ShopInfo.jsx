import { Form, Input } from "antd";

const ShopInfo = () => {

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
                {/* Tên Shop */}
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên Shop!',
                        },
                    ]}
                    label={<span className="font-semibold">Tên Shop</span>}
                >
                    <Input value="TruongNguyen" className="w-80" />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập email!',
                        },
                    ]}
                    label={<span className="font-semibold">Email</span>}>
                    <Input value="dangtruongnguyen2@gmail.com" className="w-80" />
                </Form.Item>

                {/* Số điện thoại */}
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số điện thoại!',
                        },
                    ]}
                    label={<span className="font-semibold">Số điện thoại</span>}>
                    <Input value="+84385145207" className="w-80" />
                </Form.Item>
            </Form>

        </div>
    );
};

export default ShopInfo;
