import { useState } from "react";
import { Steps, Input, Button, Select, Card, Checkbox } from "antd";
import {  ClockCircleOutlined,InboxOutlined ,StarOutlined,CrownOutlined,RobotOutlined} from '@ant-design/icons';

const { Step } = Steps;
const { Option } = Select;


export default function SellerRegister() {
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
          
          <div className="flex justify-end w-full">
          <Button type="primary" className="mt-6 mb-5 w-max bg-black text-white pr-10 pl-10" onClick={next}>
            Tiếp theo
          </Button>
          </div>
        </div>
      )}
      
      {current === 1 && (
        <div className="container mt-6">
          <label className="block mb-2">Tỉnh/Thành phố:</label>
          <Select className="w-full mb-4" placeholder="Chọn tỉnh/thành phố">
            <Option value="hanoi">Hà Nội</Option>
            <Option value="hcm">Hồ Chí Minh</Option>
          </Select>
          
          <label className="block mb-2">Địa chỉ cụ thể:</label>
          <Input placeholder="Ví dụ: 123/32 abc" className="mb-4" />
          
          <div className="flex justify-end w-full">
            <Button onClick={prev} className="mt-6 mb-5 bg-black text-white pr-10 pl-10 mr-2">Quay lại</Button>
            <Button type="primary" className="mt-6 mb-5 w-max bg-black text-white pr-10 pl-10" onClick={next}>
            Tiếp theo
          </Button>
          </div>
        </div>
      )}

      {current === 2 && (
        <div className="container mt-6">
          <h3 className="text-xl font-bold mb-4">Điều khoản sử dụng</h3>
          <p className="mb-4">Bằng cách tiếp tục, bạn đồng ý với các điều khoản và điều kiện của chúng tôi.</p>
          <Checkbox className="mb-4">Tôi đã đọc và chấp nhận điều khoản sử dụng.</Checkbox>
          <div className="flex justify-end w-full">
            <Button onClick={prev} className="mt-6 mb-5 bg-black text-white pr-10 pl-10 mr-2">Quay lại</Button>
            <Button type="primary" className="mt-6 mb-5 w-max bg-black text-white pr-10 pl-10" onClick={next}>
            Tiếp theo
          </Button>
          </div>
        </div>
      )}
      
      {current === 3 && (
        <div className="mt-6">
          <h3 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-gray-800 to-gray-600 text-white py-2 rounded-lg">
          <RobotOutlined /> GÓI ĐĂNG KÝ CHO NGƯỜI BÁN GUNDAM 
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <Card className=" p-6 shadow-lg rounded-lg bg-white border-gray-300 border">
              <div className="text-center">
                <ClockCircleOutlined className="text-4xl" />
                <h3 className="font-bold text-lg">GÓI DÙNG THỬ</h3>
                <p className="text-gray-600 mb-4">Bắt đầu trải nghiệm</p>
              </div>
              <div className=" justify-start h-full">                
                <p className="flex items-center gap-2"><InboxOutlined /> Số lượt bán: <strong>5</strong></p>
                <p className="flex items-center gap-2"> Số lượt mở đấu giá: <strong>1</strong></p>
                <p><ClockCircleOutlined  /> Thời hạn: <strong>30 ngày</strong></p>
              </div>
              
              <Button type="primary" className="mt-10 w-full bg-gray-800 text-white rounded-lg py-2 flex flex-col h-full">
                Bắt đầu dùng thử
              </Button>
            </Card>
            <Card className=" p-6 shadow-lg rounded-lg bg-gray-300 border-gray-500 border">
                <div className="text-center">
                    <StarOutlined className="text-4xl"/>
                    <h3 className="font-bold text-lg">GÓI NÂNG CẤP</h3>
                    <p className="text-gray-700 mb-4">Nâng tầm cuộc chơi</p>
                </div>
                
              <div className=" justify-start h-300">
                <p><InboxOutlined /> Số lượt bán: <strong>50</strong></p>
                <p> Số lượt mở đấu giá: <strong>30</strong></p>
                <p><ClockCircleOutlined  />Thời hạn: <strong>90 ngày</strong></p>
              </div>
              
              

              <Button type="primary" className="mt-10 w-full bg-gray-700 text-white rounded-lg py-2 flex flex-col h-full">
                359.000 đ
              </Button>
            </Card>
            <Card className="text-center p-6 shadow-lg rounded-lg bg-black text-white border-gray-800 border">
                <CrownOutlined className="text-4xl"/>
              <h3 className="font-bold text-lg"> KHÔNG GIỚI HẠN</h3>
              <p className="text-gray-400 mb-4">Bứt phá giới hạn</p>
              <p>♾️ Bán & Đấu giá không giới hạn</p>
              <p><ClockCircleOutlined  /> Thời hạn: <strong>180 ngày</strong></p>
              <Button type="primary" className="mt-10 w-full bg-white text-black rounded-lg py-2 flex flex-col h-full">
                1.049.000 đ
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
