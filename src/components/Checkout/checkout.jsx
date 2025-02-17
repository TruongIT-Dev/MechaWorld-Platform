
import Img1 from "../../assets/image/gun1.jpg";
import { Card, Input, Button, Radio, Divider } from 'antd';
import { useState } from 'react';
import { ShoppingCartOutlined, EnvironmentOutlined } from '@ant-design/icons';

const cartItems = [
  { id: 1, name: "GunDam1", price: 15.99, quantity: 1, image: Img1 },
];

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState('cod');

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Địa chỉ nhận hàng */}
      <Card className="mb-4">
        <div className="flex items-center">
          <EnvironmentOutlined className="text-xl text-red-500 mr-2" />
          <div>
            <p className="font-semibold">Đoàn Xuân Thiện Tâm (+84) 931427116</p>
            <p>150/3c Man Thiện, Phường Tăng Nhơn Phú A, TP. Thủ Đức, TP. Hồ Chí Minh</p>
          </div>
          <Button type="link" className="ml-auto text-blue-500">Thay Đổi</Button>
        </div>
      </Card>
      
      {/* Sản phẩm */}
      <Card className="mb-4">
        <div className="flex items-center">
          <ShoppingCartOutlined className="text-xl text-orange-500 mr-2" />
          <p className="font-semibold">Giỏ hàng</p>
        </div>
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between mt-2">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-cover" />
            <p>{item.name}</p>
            <p className="font-semibold">${item.price.toFixed(2)}</p>
          </div>
        ))}
      </Card>

      {/* Phương thức thanh toán */}
      <Card className="mb-4">
        <p className="font-semibold">Phương thức thanh toán</p>
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Radio.Button value="shopeepay">Ví ShopeePay</Radio.Button>
          <Radio.Button value="credit">Thẻ Tín dụng/Ghi nợ</Radio.Button>
          <Radio.Button value="cod">Thanh toán khi nhận hàng</Radio.Button>
        </Radio.Group>
      </Card>
      
      {/* Tổng tiền */}
      <Card>
        <div className="flex justify-between">
          <p>Tổng tiền hàng</p>
          <p>${cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2)}</p>
        </div>
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>$5.100</p>
        </div>
        <Divider />
        <div className="flex justify-between text-lg font-semibold">
          <p>Tổng thanh toán</p>
          <p className="text-red-500">${(cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 5.100).toFixed(2)}</p>
        </div>
        <Button type="primary" className="w-full mt-4 bg-red-500 border-none">Đặt hàng</Button>
      </Card>
    </div>
  );
};

export default Checkout;
