import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Divider, message } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { GetCart } from '../../apis/Cart/APICart';
// import { GetUserAddress } from '../apis/User/APIUser';
// import { PlaceOrder } from '../apis/Order/APIOrder';

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('GunPay');
  const [loading, setLoading] = useState(true);

  // Fetch cart & address from API
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const cartResponse = await GetCart();
        // const addressResponse = await GetUserAddress();

        setCartItems(cartResponse.data || []);
        setUserAddress(addressResponse.data || null);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, []);

  // Tổng tiền hàng
  const totalPrice = cartItems.reduce((acc, item) => acc + item.gundam_price, 0);
  const shippingFee = 5100;
  const finalPrice = totalPrice + shippingFee;

  // Xử lý đặt hàng
  const handlePlaceOrder = async () => {
    try {
      const orderData = {
        cartItems: cartItems.map(item => ({ id: item.cart_item_id, price: item.gundam_price })),
        paymentMethod: paymentMethod,
        address: userAddress,
        total: finalPrice
      };

      // await PlaceOrder(orderData);
      message.success("Đặt hàng thành công!");
    } catch (error) {
      message.error("Lỗi khi đặt hàng!");
      console.error(error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Địa chỉ nhận hàng */}
      <Card className="mb-4">
        <div className="flex items-center">
          <EnvironmentOutlined className="text-xl text-red-500 mr-2" />
          {userAddress ? (
            <div>
              <p className="font-semibold">{userAddress.name} ({userAddress.phone})</p>
              <p>{userAddress.address}</p>
            </div>
          ) : (
            <p>Chưa có địa chỉ nhận hàng</p>
          )}
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
          <div key={item.cart_item_id} className="flex justify-between mt-2">
            <img src={item.gundam_image_url} alt={item.gundam_name} className="w-16 h-16 object-cover" />
            <p>{item.gundam_name}</p>
            <p className="font-semibold">{item.gundam_price.toLocaleString()} VNĐ</p>
          </div>
        ))}
      </Card>

      {/* Phương thức thanh toán */}
      <Card className="mb-4">
        <p className="font-semibold">Phương thức thanh toán</p>
        <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <Radio.Button value="GunPay">Ví GunPay</Radio.Button>
          <Radio.Button value="credit">Thẻ Tín dụng/Ghi nợ</Radio.Button>
          <Radio.Button value="cod">Thanh toán khi nhận hàng</Radio.Button>
        </Radio.Group>
      </Card>
      
      {/* Tổng tiền */}
      <Card>
        <div className="flex justify-between">
          <p>Tổng tiền hàng</p>
          <p>{totalPrice.toLocaleString()} VNĐ</p>
        </div>
        <div className="flex justify-between">
          <p>Phí vận chuyển</p>
          <p>{shippingFee.toLocaleString()} VNĐ</p>
        </div>
        <Divider />
        <div className="flex justify-between text-lg font-semibold">
          <p>Tổng thanh toán</p>
          <p className="text-red-500">{finalPrice.toLocaleString()} VNĐ</p>
        </div>
        <Button type="primary" className="w-full mt-4 bg-red-500 border-none" onClick={handlePlaceOrder}>
          Đặt hàng
        </Button>
      </Card>
    </div>
  );
};

export default Checkout;
