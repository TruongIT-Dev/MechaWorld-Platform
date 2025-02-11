import { useState } from "react";
import { Steps, Input, Button, Select, Card } from "antd";

const { Step } = Steps;
const { Option } = Select;

export default function Checkout() {
  const [current, setCurrent] = useState(0);
  
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);
  
  return (
    <div className="container  max-w-22xl mx-auto p-4 bg-white shadow-lg rounded-lg m-5 ">
      <Steps current={current} >
        <Step title="Thông tin người bán" />
        <Step title="Cài đặt vận chuyển" />
        <Step title="Điều khoản sử dụng" />
        <Step title="Đăng ký gói bán" />
      </Steps>
      
      {current === 0 && (
        <div className="container mx-auto">
          <label className="block mb-2 mt-5 mb-5">Tên người bán:</label>
          <Input placeholder="Nhập tên người bán" className="mb-4" />
          
          <label className="block mb-2 mt-5 mb-5">Số điện thoại:</label>
          <div className="flex gap-2">
            <Input placeholder="Nhập số điện thoại" />
            <Button type="primary" className="bg-black text-white ">Gửi mã</Button>
          </div>
          
          <Button type="primary" className="mt-6 w-full text-black" onClick={next}>
            Tiếp theo
          </Button>
        </div>
      )}
      
      {current === 1 && (
        <div className="mt-6">
          <label className="block mb-2">Tỉnh/Thành phố:</label>
          <Select className="w-full mb-4" placeholder="Chọn tỉnh/thành phố">
            <Option value="hanoi">Hà Nội</Option>
            <Option value="hcm">Hồ Chí Minh</Option>
          </Select>
          
          <label className="block mb-2">Địa chỉ cụ thể:</label>
          <Input placeholder="Ví dụ: 123/32 Hòa Bình" className="mb-4" />
          
          <div className="flex justify-between">
            <Button onClick={prev}>Quay lại</Button>
            <Button type="primary" onClick={next}>Tiếp theo</Button>
          </div>
        </div>
      )}

    {current === 2 && (
        <div className="mt-6">
          <label className="block mb-2">Tỉnh/Thành phố:</label>
          <Select className="w-full mb-4" placeholder="Chọn tỉnh/thành phố">
            <Option value="hanoi">Hà Nội</Option>
            <Option value="hcm">Hồ Chí Minh</Option>
          </Select>
          
          <label className="block mb-2">Địa chỉ cụ thể:</label>
          <Input placeholder="Ví dụ: 123/32 Hòa Bình" className="mb-4" />
          
          <div className="flex justify-between">
            <Button onClick={prev}>Quay lại</Button>
            <Button type="primary" onClick={next}>Tiếp theo</Button>
          </div>
        </div>
      )}
      
      {current === 3 && (
        <div className="mt-6">
          <h3 className="text-xl font-bold mb-4">Chọn gói đăng ký</h3>
          <div className="grid grid-cols-3 gap-4">
            <Card title="Gói Dùng Thử" className="text-center">
              <p>5 lượt bán</p>
              <Button type="primary" className="mt-4">Bắt đầu</Button>
            </Card>
            <Card title="Gói Nâng Cấp" className="text-center">
              <p>50 lượt bán</p>
              <Button type="primary" className="mt-4">Đăng ký</Button>
            </Card>
            <Card title="Không Giới Hạn" className="text-center">
              <p>Bán không giới hạn</p>
              <Button type="primary" className="mt-4">Đăng ký</Button>
            </Card>
            <Button onClick={prev}>Quay lại</Button>
          </div>
        </div>
      )}
    </div>
  );
}
