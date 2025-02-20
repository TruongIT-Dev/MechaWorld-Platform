import { useState } from 'react';
import { Card, Form, Input, Button, Upload, Tag, Flex, message } from 'antd';
import { UploadOutlined, SwapOutlined } from '@ant-design/icons';
import gun3 from '../../assets/image/gun3.jpg';

const exchangeRequest = {
    id: 1,
    title: "Xin trao đổi Gundam Striker Defense Blue RX-50",
    desc: `💥 Mình đang có: Gundam Obsidian – Chi tiết sắc nét, tình trạng tốt, đã lắp ráp cẩn thận.
📌 Tình trạng: Nguyên vẹn, đầy đủ phụ kiện.
📸 Hình ảnh chi tiết có sẵn, ai quan tâm ib trao đổi nhé!
📍 Khu vực: Tp. Hồ Chí Minh

🤝 Ai có nhu cầu trao đổi thì liên hệ mình nha! 🚀💫`,
    want: "Gundam Barbatos",
    image: gun3,
};

export default function CustomerExchangeDetail() {
    const [form] = Form.useForm();
    const [customerOffer, setCustomerOffer] = useState({
        offerTitle: '',
        offerDesc: '',
        offerImage: [],
        offerNote: '',
    });

    const onFinish = (values) => {
        console.log('Đề nghị trao đổi của Customer:', values);
        message.success('Gửi đề nghị trao đổi thành công!');
        // Xử lý gửi dữ liệu lên server hoặc điều hướng sau khi submit.
    };

    const onValuesChange = (changedValues, allValues) => {
        setCustomerOffer(allValues);
    };

    // Hàm normFile để lấy fileList từ event Upload
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    };

    // Xử lý hiển thị preview cho hình ảnh được tải lên
    let offerImagePreview = "https://placehold.co/400";
    if (customerOffer.offerImage && customerOffer.offerImage.length > 0) {
        const fileObj = customerOffer.offerImage[0]?.originFileObj;
        if (fileObj) {
            offerImagePreview = URL.createObjectURL(fileObj);
        }
    }

    return (
        <div className="container">
            <div className="max-w-6xl mx-auto mt-24 p-4">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">
                    Chi tiết Trao đổi
                </h1>
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    {/* Left Column: Bài trao đổi gốc và preview của Customer */}
                    <div className="w-full md:w-3/5">
                        <Card>
                            <div className="card-content flex space-x-4">
                                <img
                                    className="rounded-lg w-[150px] h-[200px] object-cover"
                                    src={exchangeRequest.image}
                                    alt={exchangeRequest.title}
                                />
                                <div className="flex flex-col justify-between w-full">
                                    <h3 className="text-lg font-semibold text-left text-blue-700">
                                        {exchangeRequest.title}
                                    </h3>
                                    <p className="text-gray-600 text-left whitespace-pre-line">
                                        {exchangeRequest.desc}
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <p className="font-medium">Mong muốn đổi:</p>
                                        <Flex gap="4px 0" wrap>
                                            <Tag color="blue">{exchangeRequest.want}</Tag>
                                        </Flex>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Icon trao đổi giữa 2 Card */}
                        <div className="flex items-center justify-center my-4">
                            <SwapOutlined style={{ fontSize: '2rem', color: '#1890ff' }} />
                        </div>

                        {/* Card preview sản phẩm Customer (cập nhật real-time) */}
                        <Card>
                            <div className="card-content flex space-x-4">
                                <img
                                    className="rounded-lg w-[150px] h-[200px] object-cover shadow-md"
                                    src={offerImagePreview}
                                    alt={customerOffer.offerTitle || "Preview sản phẩm của bạn"}
                                />
                                <div className="flex flex-col justify-between w-full">
                                    <h3 className="text-lg font-semibold text-left text-blue-700">
                                        {customerOffer.offerTitle || "Tiêu đề sản phẩm của bạn"}
                                    </h3>
                                    <p className="text-black text-left whitespace-pre-line">
                                        {customerOffer.offerDesc || "Mô tả chi tiết sản phẩm của bạn"}
                                    </p>
                                    <div className="flex items-center space-x-2 justify-end">
                                        <p className="text-gray-700 font-medium">Ghi chú:</p>
                                        <span className="text-sm text-gray-500">
                                            {customerOffer.offerNote || "Không có ghi chú"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Right Column: Form nhập thông tin trao đổi của Customer */}
                    <div className="w-full md:w-2/5">
                        <Card className="shadow-md">
                            <Form
                                form={form}
                                layout="vertical"
                                onFinish={onFinish}
                                onValuesChange={onValuesChange}
                            >
                                <Form.Item
                                    label="Tiêu đề sản phẩm của bạn"
                                    name="offerTitle"
                                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề sản phẩm của bạn' }]}
                                >
                                    <Input placeholder="Nhập tiêu đề sản phẩm của bạn" size="large" />
                                </Form.Item>

                                <Form.Item
                                    label="Mô tả sản phẩm của bạn"
                                    name="offerDesc"
                                    rules={[{ required: true, message: 'Vui lòng nhập mô tả sản phẩm của bạn' }]}
                                >
                                    <Input.TextArea rows={4} placeholder="Nhập mô tả chi tiết về sản phẩm của bạn" />
                                </Form.Item>

                                <Form.Item
                                    label="Hình ảnh sản phẩm của bạn"
                                    name="offerImage"
                                    valuePropName="fileList"
                                    getValueFromEvent={normFile}
                                    rules={[{ required: true, message: 'Vui lòng tải lên hình ảnh sản phẩm của bạn' }]}
                                >
                                    <Upload name="file" listType="picture" beforeUpload={() => false}>
                                        <Button icon={<UploadOutlined />} size="large">
                                            Tải lên hình ảnh
                                        </Button>
                                    </Upload>
                                </Form.Item>

                                <Form.Item label="Ghi chú (nếu có)" name="offerNote">
                                    <Input.TextArea rows={2} placeholder="Nhập ghi chú nếu có (điều kiện, yêu cầu, ...)" />
                                </Form.Item>

                                <Form.Item className="text-center">
                                    <Button type="default" htmlType="submit" size="large">
                                        Gửi Đề Nghị Trao đổi
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
