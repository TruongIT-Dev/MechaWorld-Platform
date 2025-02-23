import { Form, Input, InputNumber, Space } from "antd";
import { useState } from "react";

const ProductInfoDetail = ({ editorContent, setEditorContent }) => {
  return (
    <>
      <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: "Vui lòng nhập giá bán!" }]}>
        <InputNumber min={0} className="w-full" />
        <small className="text-gray-500">* 400000 == 400.000 vnd</small>
      </Form.Item>
      <Form.Item name="manufacturer" label="Nhà phân phối">
        <Input />
      </Form.Item>
      <Form.Item name="weight" label="Cân nặng (gram)">
        <InputNumber min={0} className="w-full" type="number"/>
        <small className="text-gray-500">* Cần cho việc giao hàng</small>
      </Form.Item>
      <Form.Item label="Kích thước sản phẩm (cm)">
        <Space>
          <Form.Item name="length">
            <InputNumber placeholder="Dài" min={0} type="number"/>
          </Form.Item>
          <Form.Item name="width">
            <InputNumber placeholder="Rộng" min={0} type="number"/>
          </Form.Item>
          <Form.Item name="height">
            <InputNumber placeholder="Cao" min={0} type="number"/>
          </Form.Item>
        </Space>
      </Form.Item>
      <Form.Item label="Chi tiết sản phẩm" name="description">
        <Input  />
      </Form.Item>
    </>
  );
};

export default ProductInfoDetail;
