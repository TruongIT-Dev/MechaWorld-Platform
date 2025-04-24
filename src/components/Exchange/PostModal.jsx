import React, { useState } from "react";
import { Input, Button, Upload, Form, Tooltip, Steps, Card, Row, Col, Checkbox, Typography, message, Divider } from "antd";
import {
    PlusOutlined,
    InfoCircleOutlined,
    FileImageOutlined,
    RobotOutlined,
    CheckCircleOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined
} from "@ant-design/icons";

const { Title, Text } = Typography;
const { Step } = Steps;

// Mock data for user's Gundam collection
const userGundams = [
    { id: 1, name: "RX-78-2 Gundam", series: "Mobile Suit Gundam", image: "/gundam1.png", condition: "Mới 90%" },
    { id: 2, name: "Zaku II", series: "Mobile Suit Gundam", image: "/gundam2.png", condition: "Mới 95%" },
    { id: 3, name: "Gundam Exia", series: "Gundam 00", image: "/gundam3.png", condition: "Mới 85%" },
    { id: 4, name: "Strike Freedom", series: "Gundam SEED Destiny", image: "/gundam4.png", condition: "Mới 100%" },
    { id: 5, name: "Unicorn Gundam", series: "Gundam Unicorn", image: "/gundam5.png", condition: "Mới 80%" },
    { id: 6, name: "Wing Zero", series: "Gundam Wing", image: "/gundam6.png", condition: "Mới 90%" },
    { id: 7, name: "Gundam Barbatos", series: "Iron-Blooded Orphans", image: "/gundam7.png", condition: "Mới 75%" },
    { id: 8, name: "Gundam Dynames", series: "Gundam 00", image: "/gundam8.png", condition: "Mới 88%" }
];

export default function PostModal({ onClose, onSuccess }) {
    const [form] = Form.useForm();
    const [currentStep, setCurrentStep] = useState(0);
    const [fileList, setFileList] = useState([]);
    const [selectedGundams, setSelectedGundams] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle image upload
    const handleUpload = ({ fileList }) => {
        if (fileList.length > 5) {
            return;
        }
        setFileList(fileList);
    };

    // Toggle Gundam selection
    const toggleGundamSelection = (gundamId) => {
        if (selectedGundams.includes(gundamId)) {
            setSelectedGundams(selectedGundams.filter(id => id !== gundamId));
        } else {
            setSelectedGundams([...selectedGundams, gundamId]);
        }
    };

    // Handle next step
    const nextStep = async () => {
        try {
            if (currentStep === 0) {
                // Validate form fields for step 1
                await form.validateFields(['topic', 'content']);
                if (fileList.length === 0) {
                    message.error('Vui lòng tải lên ít nhất một hình ảnh Gundam mong muốn!');
                    return;
                }
            }
            setCurrentStep(currentStep + 1);
        } catch (error) {
            console.log('Validation failed:', error);
        }
    };

    // Handle previous step
    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    // Final submission
    const handleSubmit = async () => {
        if (selectedGundams.length === 0) {
            message.error('Vui lòng chọn ít nhất một Gundam để trao đổi!');
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);

            // Get form values
            const formValues = form.getFieldsValue();
            const postData = {
                content: formValues.content,
                images: fileList.map(file => file.originFileObj),
                selectedGundams: selectedGundams.map(id => userGundams.find(g => g.id === id))
            };

            console.log("Post data:", postData);

            // Call the success callback from parent component
            if (onSuccess) {
                onSuccess(postData);
            }

            // Reset form
            form.resetFields();
            setFileList([]);
            setSelectedGundams([]);
            setCurrentStep(0);

        }, 1500);
    };

    // Step content
    const steps = [
        {
            title: 'Thông tin bài viết',
            content: (
                <div className="pt-2">
                    <Form.Item
                        name="content"
                        label="Nội dung bài viết"
                        rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                    >
                        <Input.TextArea
                            placeholder="Mô tả chi tiết về Gundam bạn mong muốn trao đổi..."
                            rows={4}
                            className="shadow-sm text-lg"
                        />
                    </Form.Item>

                    <Divider orientation="left">
                        <span className="flex items-center">
                            <FileImageOutlined className="mr-2" />
                            Ảnh Gundam mong muốn
                        </span>
                    </Divider>

                    <Form.Item label={
                        <span>
                            Tải lên ảnh Gundam bạn muốn trao đổi
                            <Tooltip title="Chỉ cho phép tải lên tối đa 5 ảnh">
                                <InfoCircleOutlined className="ml-2 text-gray-500" />
                            </Tooltip>
                        </span>
                    }>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleUpload}
                            beforeUpload={() => false}
                            multiple
                        >
                            {fileList.length < 5 && <div>
                                <PlusOutlined />
                                <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                            </div>}
                        </Upload>
                        {fileList.length >= 5 && <Text type="danger">Bạn chỉ có thể tải lên tối đa 5 ảnh.</Text>}
                        {fileList.length === 0 && <Text type="danger">Vui lòng tải lên ít nhất một hình ảnh!</Text>}
                    </Form.Item>
                </div>
            ),
        },
        {
            title: 'Chọn Gundam để trao đổi',
            content: (
                <div className="pt-2">
                    <Divider orientation="left">
                        <span className="flex items-center">
                            <RobotOutlined className="mr-2" />
                            Bộ sưu tập Gundam của bạn
                        </span>
                    </Divider>

                    <div className="mb-4">
                        <Text type="secondary">Chọn một hoặc nhiều Gundam từ bộ sưu tập của bạn để trao đổi</Text>
                    </div>

                    <Row gutter={[16, 16]} className="max-h-80 overflow-y-auto">
                        {userGundams.map(gundam => (
                            <Col xs={24} sm={12} lg={8} key={gundam.id}>
                                <Card
                                    hoverable
                                    className={selectedGundams.includes(gundam.id) ? 'border-2 border-blue-500' : ''}
                                    cover={
                                        <div className="relative h-36 bg-gray-100 flex items-center justify-center">
                                            <img
                                                alt={gundam.name}
                                                src={gundam.image}
                                                className="max-h-full object-contain p-2"
                                            />
                                            {selectedGundams.includes(gundam.id) && (
                                                <div className="absolute top-2 right-2">
                                                    <CheckCircleOutlined className="text-blue-500 text-2xl" />
                                                </div>
                                            )}
                                        </div>
                                    }
                                    onClick={() => toggleGundamSelection(gundam.id)}
                                    size="small"
                                >
                                    <Card.Meta
                                        title={gundam.name}
                                        description={
                                            <div>
                                                <div className="text-xs">{gundam.series}</div>
                                                <div className="text-green-600 text-xs">{gundam.condition}</div>
                                            </div>
                                        }
                                    />
                                    <div className="mt-2">
                                        <Checkbox
                                            checked={selectedGundams.includes(gundam.id)}
                                            onChange={() => toggleGundamSelection(gundam.id)}
                                        >
                                            Chọn
                                        </Checkbox>
                                    </div>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {selectedGundams.length === 0 && (
                        <div className="text-center my-4">
                            <Text type="danger">Vui lòng chọn ít nhất một Gundam để trao đổi!</Text>
                        </div>
                    )}

                    <div className="text-right mt-4">
                        <Text type="secondary">
                            Đã chọn: {selectedGundams.length} Gundam
                        </Text>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <div>
            <div className="mb-4">
                <Steps current={currentStep} size="default">
                    <Step title="Bài đăng trao đổi"/>
                    <Step title="Chọn Gundam trao đổi" />
                </Steps>
            </div>

            <Form form={form} layout="vertical">
                {steps[currentStep].content}

                <div className="flex justify-between mt-6">
                    {currentStep > 0 && (
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={prevStep}
                        >
                            Quay lại
                        </Button>
                    )}

                    <div className="ml-auto">
                        {currentStep < steps.length - 1 && (
                            <Button
                                className="bg-blue-500"
                                type="primary"
                                onClick={nextStep}
                            >
                                Tiếp tục <ArrowRightOutlined />
                            </Button>
                        )}

                        {currentStep === steps.length - 1 && (
                            <Button
                                className="bg-blue-500"
                                type="primary"
                                onClick={handleSubmit}
                                loading={isSubmitting}
                                disabled={selectedGundams.length === 0}
                            >
                                Đăng bài trao đổi
                            </Button>
                        )}
                    </div>
                </div>
            </Form>
        </div>
    );
}