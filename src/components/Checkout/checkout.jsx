import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Divider, message, Table } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import { getUserAddresses } from '../../apis/User/APIUserProfile';
import { useCart } from '../../context/CartContext';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';


import footerLogo from "../../assets/image/icon/iconwallet.png";
const { Column } = Table;

const groupByShop = (items) => {
  return items.reduce((acc, item) => {
    const shopName = item.seller_name; // hoặc item.shop_id
    if (!acc[shopName]) {
      acc[shopName] = [];
    }
    acc[shopName].push(item);
    return acc;
  }, {});
};

const Checkout = () => {
  const location = useLocation();
  const { cartItems } = useCart(); // Sử dụng hàm addToCart từ Context
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('GunPay');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  const userCookie = Cookies.get('user');
  const userData = JSON.parse(decodeURIComponent(userCookie));

  // Lấy danh sách sản phẩm đã chọn từ state của location
  const selectedItems = location.state?.selectedItems || cartItems;
  console.log("Selected Items (Checkout):", selectedItems);
  console.log("Location State:", location.state);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const userId = userData.id; // Lấy id từ user
        const addressResponse = await getUserAddresses(userId);
        
        setUserAddress(addressResponse.data[0] || null);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  // Tính tổng tiền dựa trên selectedItems
  const totalPrice = selectedItems.reduce((acc, item) => acc + item.gundam_price, 0);
  const shippingFee = 40000; // Phí vận chuyển cố định
  const finalPrice = totalPrice + shippingFee;

  // Nhóm sản phẩm theo shop
  const groupedCartItems = groupByShop(selectedItems);

  if (loading) return <div className="text-xl">Loading...</div>;

  return (
    <div className="container mx-auto mt-36 mb-14 text-lg grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-3">
          <Card className="mb-4">
          <div className="flex items-center">
            <EnvironmentOutlined className="text-2xl text-red-500 mr-2" />
            {userAddress ? (
              <div className="flex">
                <p className="font-semibold text-xl mr-5">{userAddress.full_name} ({userAddress.phone_number})</p>
                <p className="text-lg">{userAddress.detail}, {userAddress.ward_name}, {userAddress.district_name}, {userAddress.province_name}</p>
              </div>
            ) : (
              <p className="text-lg">Chưa có địa chỉ nhận hàng</p>
            )}
            <Button type="link" className="ml-auto text-blue-500 text-lg">Thay Đổi</Button>
          </div>
        </Card>
        
        <Card className="mb-4">
          <div className="flex items-center">
            <ShoppingCartOutlined className="text-2xl text-gray-500 mr-2" />
            <p className="font-semibold text-xl">Giỏ hàng</p>
          </div>

          {Object.entries(groupedCartItems).map(([shopName, items]) => (
        <div key={shopName}>
          <div className="flex items-center mt-5 mb-5">
            <ShopOutlined className="text-xl text-gray-500 mr-2" />
            <p className="font-semibold text-lg">{shopName}</p>
          </div>
          <Table dataSource={items} pagination={false} rowKey="cart_item_id">
            <Table.Column
              title="Sản phẩm"
              key="product"
              render={(text, record) => (
                <div className="flex items-center">
                  <img src={record.gundam_image_url} alt={record.gundam_name} className="w-14 h-14 object-cover rounded border border-gray-300 mr-3" />
                  <div>
                    <p className="font-semibold text-sm">{record.gundam_name}</p>
                    <p className="text-xs text-gray-500">{record.seller_name}</p>
                  </div>
                </div>
              )}
            />
            <Table.Column
              title="Thành tiền"
              dataIndex="gundam_price"
              key="gundam_price"
              render={(price) => `${price.toLocaleString()} đ`}
            />
          </Table>
        </div>
      ))}

      {/* Ghi chú và vận chuyển */}
      <Card className="mb-4 border-none">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-base mb-2">Ghi chú</p>
            <input type="text" placeholder="Nhập ghi chú..." className="w-full p-2 border rounded" />
          </div>
          <div>
            <p className="font-semibold text-base mb-2">Thông tin vận chuyển</p>
            <p className="flex justify-between text-sm text-gray-600 ">Dự kiến nhận hàng: <span className="font-semibold">Thứ 4, ngày 5 tháng 3 năm 2025</span></p>
            <p className="flex justify-between text-sm text-gray-600">Phí giao hàng: <span className="font-semibold">{shippingFee.toLocaleString()} VNĐ</span></p>
            <p className="flex justify-between font-semibold text-lg mt-2">Tổng tiền: <span className="font-semibold">{finalPrice.toLocaleString()} VNĐ</span></p>
          </div>
        </div>
      </Card>
      </Card>
      {/* Phương thức thanh toán */}
      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-base">Phương thức thanh toán</p>
          <Button type="link" className="text-blue-500 text-sm" onClick={() => setShowPaymentOptions(true)}>Thay đổi</Button>
        </div>
        {!showPaymentOptions ? (
          <div className="p-3 border rounded flex items-center justify-between">
            <div className="flex items-center">
              <img src={footerLogo} alt="wallet" className="max-w-[50px]" />
              <p className="text-sm font-semibold">{paymentMethod === 'GunPay' ? 'Thanh toán bằng ví ComZone' : 'Thanh toán khi nhận hàng'}</p>
            </div>
            {paymentMethod === 'GunPay' && <p className="text-red-500 text-xs">Số dư không đủ. <span className="text-blue-500 cursor-pointer">Nạp thêm</span></p>}
          </div>
        ) : (
          <Radio.Group value={paymentMethod} onChange={(e) => {
            setPaymentMethod(e.target.value);
            setShowPaymentOptions(false);
          }}>
            <Radio.Button value="GunPay" className="text-sm">Ví ComZone</Radio.Button>
            <Radio.Button value="cod" className="text-sm">Thanh toán khi nhận hàng</Radio.Button>
          </Radio.Group>
        )}
      </Card>

      </div>
      
      <div className="col-span-1">
  <Card className="">
    {/* Tiêu đề và link quay lại */}
    <div className="flex justify-between items-center">
      <p className="text-xl font-bold">ĐƠN HÀNG</p>
      <a href="/cart" className="text-blue-500 text-sm">Quay lại giỏ hàng</a>
    </div>

    <p className="text-gray-500 mt-2">1 sản phẩm</p>

    <Divider />

    {/* Tổng tiền hàng */}
    <div className="flex justify-between text-lg mt-2">
      <p className="text-gray-600">Tổng tiền hàng:</p>
      <p className="font-semibold">{totalPrice.toLocaleString()} đ</p>
    </div>

    {/* Phí vận chuyển */}
    <div className="flex justify-between text-lg mt-2">
      <p className="text-gray-600">Tổng tiền giao hàng:</p>
      <p className="font-semibold">{shippingFee.toLocaleString()} đ</p>
    </div>

    <Divider />

    {/* Tổng thanh toán */}
    <div className="flex justify-between text-lg font-bold">
      <p className="text-black">Tổng tiền thanh toán:</p>
      <p className="text-red-500">{finalPrice.toLocaleString()} đ</p>
    </div>

    {/* Điều khoản */}
    <p className="text-sm text-gray-500 mt-2">
      Nhấn <span className="font-semibold">"Đặt hàng"</span> đồng nghĩa với việc bạn đã đồng ý với  
      <a href="#" className="text-blue-500"> Điều khoản của MechWorld</a>
    </p>

    {/* Nút đặt hàng  */}
    <Button 
      type="primary" 
      className="w-full mt-4 bg-red-300 text-lg border-none cursor" 
    >
      ĐẶT HÀNG
    </Button>
  </Card>
</div>

      
    </div>
  );
};

export default Checkout;