import { useState } from "react";
import { Steps, Input, Button, Select, Radio } from "antd";
import {  ShoppingOutlined, ProfileOutlined, CreditCardOutlined, CheckCircleOutlined, TagOutlined } from "@ant-design/icons";


import Img1 from "../../assets/image/gun1.jpg";
const { Step } = Steps;
const { Option } = Select;

export default function Checkout() {
  const [current, setCurrent] = useState(0);

  const cartItems = [
          { id: 1, name: "Mens Casual Slim Fit", price: 15.99, quantity: 1,image: Img1 },
          { id: 2, name: "BIYLACLESEN Women's Jacket", price: 56.99, quantity: 1,image: Img1  },
          { id: 3, name: "BIYLACLESEN Women's Jacket", price: 56.99, quantity: 1,image: Img1  },
          { id: 4, name: "BIYLACLESEN Women's Jacket", price: 56.99, quantity: 1,image: Img1  },
      ];

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const next = () => setCurrent(current + 1);
  const prev = () => setCurrent(current - 1);
  
  return (
    <div className="container max-w-xl mx-auto p-4 bg-white shadow-lg rounded-lg m-5 ">
      <Steps current={current} className="bg-gray-100 p-4 rounded-lg" size="small" labelPlacement="vertical">
        <Step title="Giỏ hàng" icon={<ShoppingOutlined />} />
        <Step title="Thông tin đặt hàng" icon={<ProfileOutlined />} />
        <Step title="Thanh toán" icon={<CreditCardOutlined />} />
        <Step title="Hoàn tất" icon={<CheckCircleOutlined />} />
      </Steps>
      
      {current === 0 && (
        <div className="container mx-auto">
          <div>
              <div className="p-4">

                              <ul className="flex flex-col gap-y-2 h-[520px] lg:h-[640px] overflow-y-auto
                               overflow-x-hidden border-b">
                                  {cartItems.map((item) => (
                                      <li key={item.id} className="flex items-center py-4">
                                          <img
                                              src={item.image}
                                              alt={item.name}
                                              className="w-12 h-12 object-cover rounded"
                                          />
                                          <div className="ml-4 flex-1">
                                              <h3 className="text-sm font-medium">{item.name}</h3>
                                              <div className="text-gray-500 text-sm">
                                                  {item.quantity} x ${item.price.toFixed(2)}
                                              </div>
                                          </div>
                                          <div className="text-gray-800 font-medium">
                                              ${(item.price * item.quantity).toFixed(2)}
                                          </div>
                                      </li>
                                  ))}
                              </ul>
          
                              
                              <div className=' flex flex-col gap-y-3 py-4'>
                                  <div className=' flex w-full justify-between items-center'>
                                  {/* total */}
                                      <div className='uppercase font-semibold'>
                                          <span className='mr-2'> Total: </span>${total.toFixed(2)}
                                      </div>
                          
                                  </div>
            
                              </div>
          
                          </div>
                      </div>
          
          <div className="flex justify-end w-full">
            <Button type="primary" className="mt-6 mb-5 w-max bg-black text-white pr-10 pl-10" onClick={next}>
              Tiếp theo
            </Button>
          </div>
        </div>
      )}
      
      {current === 1 && (
        <div className="mt-6">
          <label className="block mb-2">Nhập họ tên:</label>
          <Input placeholder="Ví dụ:  Hòa Bình" className="mb-4" />

          <label className="block mb-2">Nhập số điện thoại:</label>
          <Input placeholder="Ví dụ: 123/32 Hòa Bình" className="mb-4" />

          <label className="block mb-2">Tỉnh/Thành phố:</label>
          <Select className="w-full mb-4" placeholder="Chọn tỉnh/thành phố">
            <Option value="hanoi">Hà Nội</Option>
            <Option value="hcm">Hồ Chí Minh</Option>
          </Select>
          
          <label className="block mb-2">Địa chỉ cụ thể:</label>
          <Input placeholder="Ví dụ: 123/32 Hòa Bình" className="mb-4" />
          
          <div className="flex justify-end w-full">
            <Button onClick={prev} className="mt-6 mb-5 bg-black text-white pr-10 pl-10 mr-2">Quay lại</Button>
            <Button type="primary" className="mt-6 mb-5 w-max bg-black text-white pr-10 pl-10" onClick={next}>
            Tiếp theo
          </Button>
          </div>
        </div>
      )}

      {current === 2 && (
        <div className="mt-6 p-4 bg-white shadow rounded-lg">
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Thông tin đặt hàng</h3>
          <div className="mb-4">
            <p><strong>Khách hàng:</strong> Nguyễn Văn Bá</p>
            <p><strong>Số điện thoại:</strong> 0931427116</p>
            <p><strong>Địa chỉ nhận hàng:</strong> 13 Man Thien, Phường An Phú, Thị xã An Khê, Gia Lai</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-red-500 font-bold"> <span className='mr-2'> Tạm tính: </span>${total.toFixed(2)}</p>
            <p className="text-red-500 font-bold"><span className='mr-2'> Tổng tiền:  </span>${total.toFixed(2)}</p>
          </div>
          <div className="mb-4">
            <Button icon={<TagOutlined />} className="mb-2">Sử dụng mã giảm giá</Button>
            <div className="flex gap-2">
              <Input placeholder="Nhập mã giảm giá/Phiếu mua hàng" className="flex-1" />
              <Button type="primary">Áp dụng</Button>
            </div>
          </div>
          <h3 className="text-lg font-bold border-b pb-2 mb-4">Chọn hình thức thanh toán</h3>
          <Radio.Group className="mb-4 w-full">
            <Radio value="cod" className="flex items-center gap-2">
              <span role="img" aria-label="cod">📦</span> Thanh toán khi giao hàng (COD)
            </Radio>
          </Radio.Group>
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p>Phí vận chuyển: <strong>0</strong></p>
            <p className="text-red-500 font-bold"><span className='mr-2'> Tổng tiền:  </span>${total.toFixed(2)}</p>
          </div>
          <Button type="primary" className="w-full bg-red-500 text-white py-2"onClick={next}>THANH TOÁN NGAY</Button>
          
        </div>
      )}
      

      {current === 3 && (
        <div className="mt-6 text-center">
          <CheckCircleOutlined className="text-green-500 text-6xl mb-4" />
          <h3 className="text-2xl font-bold mb-4">Thanh toán thành công!</h3>
          <p className="text-gray-700 mb-6">Cảm ơn bạn đã đăng ký. Hãy kiểm tra email của bạn để biết thêm chi tiết.</p>
          <Button type="primary" className="mt-6 mb-5 w-max bg-black text-white pr-10 pl-10" onClick={() => setCurrent(0)}>Về trang chủ</Button>
          
        </div>
      )}
    </div>
  );
}
