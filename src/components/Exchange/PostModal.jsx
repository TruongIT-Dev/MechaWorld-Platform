import { useState } from "react";
import { Input, Button, Upload, Form, Tooltip } from "antd";
import { PlusOutlined, InfoCircleOutlined } from "@ant-design/icons";

export default function PostModal() {
    const [fileList, setFileList] = useState([]);

    const handleUpload = ({ fileList }) => {
        if (fileList.length > 5) {
            return;
        }
        setFileList(fileList);
    };

    const handleSubmit = () => {
        console.log({ fileList });
    };
    return (
        <div className="p-4">
            <Form layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    name="topic"
                    label="Tên chủ đề"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                    <Input
                        placeholder=""
                        rows={4}
                        className="shadow-sm text-lg"
                    />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung bài viết"
                    rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
                >
                    <Input.TextArea
                        placeholder="Viết nội dung bài viết tại đây..."
                        rows={4}
                        className="shadow-sm text-lg"
                    />
                </Form.Item>

                <Form.Item label={
                    <span>
                        * Thêm ảnh cho bài viết
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
                    {fileList.length >= 5 && <p className="text-red-500">Bạn chỉ có thể tải lên tối đa 5 ảnh.</p>}
                </Form.Item>


                <Form.Item>
                    <Button type="primary" htmlType="submit" className="bg-blue-500 w-full">
                        Đăng bài
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}
