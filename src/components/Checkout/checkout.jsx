import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Divider, message, Table } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import { GetCart } from '../../apis/Cart/APICart';
import { getUserAddresses } from '../../apis/User/APIUserProfile';
import Cookies from 'js-cookie';

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
  const [cartItems, setCartItems] = useState([]);
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('GunPay');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(true);

  const userCookie = Cookies.get('user');
  const userData = JSON.parse(decodeURIComponent(userCookie));

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const cartResponse = await GetCart();
        const userId = userData.id; // Lấy id từ user
        const addressResponse = await getUserAddresses(userId);

        setCartItems(cartResponse.data || []);
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

  const totalPrice = cartItems.reduce((acc, item) => acc + item.gundam_price, 0);
  const shippingFee = 0;
  const finalPrice = totalPrice + shippingFee;

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

  // Nhóm sản phẩm theo shop
  const groupedCartItems = groupByShop(cartItems);

  if (loading) return <div className="text-xl">Loading...</div>;

  return (
    <div className="container mx-auto mt-36 mb-14 text-lg">
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
              <ShopOutlined className="text-2xl text-gray-500 mr-2" />
              <p className="font-semibold text-xl">{shopName}</p>
            </div>
            
            <Table dataSource={items} pagination={false} rowKey="cart_item_id">
              <Column
                title="Sản Phẩm"
                key="product"
                render={(text, record) => (
                  <div className="flex items-center">
                    <img src={record.gundam_image_url} alt={record.gundam_name} className="w-16 h-16 object-cover rounded border border-gray-300 mr-4"/>
                    <div>
                      <div className="font-semibold">{record.gundam_name}</div>
                      <div className="text-sm text-gray-500">{record.seller_name}</div>
                    </div>
                  </div>
                )}
              />
              <Column title="Thông tin người bán" dataIndex="seller_name" key="seller_name" />
              <Column title="Đơn Giá" dataIndex="gundam_price" key="gundam_price" render={(price) => `${price.toLocaleString()} VNĐ`} />
            </Table>
          </div>
        ))}
      </Card>

      <Card className="mb-4">
        <div className="flex justify-between items-center">
          <p className="font-semibold text-xl">Phương thức thanh toán</p>
          <Button type="link" className="text-blue-500 text-lg" onClick={() => setShowPaymentOptions(true)}>Thay Đổi</Button>
        </div>
        {!showPaymentOptions ? (
          <p className="text-xl font-semibold">{paymentMethod === 'GunPay' ? 'Ví GunPay' : paymentMethod === 'credit' ? 'Thẻ Tín dụng/Ghi nợ' : 'Thanh toán khi nhận hàng'}</p>
        ) : (
          <Radio.Group value={paymentMethod} onChange={(e) => {
            setPaymentMethod(e.target.value);
            setShowPaymentOptions(false);
          }}>
            <Radio.Button value="GunPay" className="text-lg">Ví GunPay</Radio.Button>
            <Radio.Button value="credit" className="text-lg">Thẻ Tín dụng/Ghi nợ</Radio.Button>
            <Radio.Button value="cod" className="text-lg">Thanh toán khi nhận hàng</Radio.Button>
          </Radio.Group>
        )}
      </Card>
      
      <Card>
        <div className="flex justify-end text-lg mt-5">
          <p className='mr-10'>Tổng tiền hàng</p>
          <p>{totalPrice.toLocaleString()} VNĐ</p>
        </div>
        <div className="flex justify-end text-lg mt-5">
          <p className='mr-10'>Phí vận chuyển</p>
          <p>{shippingFee.toLocaleString()} VNĐ</p>
        </div>
        <Divider />
        <div className="flex justify-between text-2xl font-semibold">
          <p>Tổng thanh toán</p>
          <p className="text-red-500">{finalPrice.toLocaleString()} VNĐ</p>
        </div>
        <Button type="primary" className="w-full mt-4 bg-red-500 border-none text-lg" onClick={handlePlaceOrder}>
          Đặt hàng
        </Button>
      </Card>
    </div>
  );
};

export default Checkout;