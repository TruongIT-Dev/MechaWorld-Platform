import { useState, useEffect } from 'react';
import { Card, Button, Radio, Divider, message, Table } from 'antd';
import { MoneyCollectOutlined, EnvironmentOutlined, ShopOutlined } from '@ant-design/icons';
import { getUserAddresses } from '../../apis/User/APIUserProfile';
import { CheckoutCart } from '../../apis/Cart/APICart';
import { useCart } from '../../context/CartContext';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import footerLogo from "../../assets/image/icon/iconwallet.png";

const groupByShop = (items) => {
  return items.reduce((acc, item) => {
    const shopName = item.seller_name;
    if (!acc[shopName]) acc[shopName] = [];
    acc[shopName].push(item);
    return acc;
  }, {});
};

const Checkout = () => {
  const location = useLocation();
  const { cartItems } = useCart();
  const [userAddress, setUserAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('wallet');
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [note, setNote] = useState('');

  const userCookie = Cookies.get('user');
  const userData = JSON.parse(decodeURIComponent(userCookie));
  const selectedItems = location.state?.selectedItems || cartItems;

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.gundam_price, 0);
  const shippingFee = 40000;
  const finalPrice = totalPrice + shippingFee;

  const groupedCartItems = groupByShop(selectedItems);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const userId = userData.id;
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

  const handleCheckout = async () => {
    if (!userAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }

    const orderPayload = {
      buyer_address_id: userAddress.id,
      delivery_fee: shippingFee,
      expected_delivery_time: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(), // Thêm 3 ngày từ hôm nay và chuyển sang ISO format
      gundam_ids: selectedItems.map(item => item.gundam_id),
      items_subtotal: totalPrice,
      note: note,
      payment_method: paymentMethod,
      seller_id: selectedItems[0].seller_id,
      total_amount: finalPrice,
      completed_at: null
    };
    console.log("Order payload:", orderPayload);
    try {
      const res = await CheckoutCart(orderPayload);
      message.success("Đặt hàng thành công!");
      console.log("Order response:", res.data);
    } catch (error) {
      console.error("Checkout error:", error);
      message.error("Đặt hàng thất bại!");
    }
  };

  if (loading) return <div className="text-xl">Loading...</div>;

  return (
    <div className="container mx-auto mt-36 mb-14 text-lg grid grid-cols-1 md:grid-cols-4 gap-8">
      <div className="col-span-3">
        {/* Địa chỉ */}
        <Card className="mb-4">
          <div className="flex items-center">
            <EnvironmentOutlined className="text-2xl text-red-500 mr-2" />
            {userAddress ? (
              <div className="flex">
                <p className="font-semibold text-xl mr-5">{userAddress.full_name} ({userAddress.phone_number})</p>
                <p className="text-lg">{userAddress.detail}, {userAddress.ward_name}, {userAddress.district_name}, {userAddress.province_name}</p>
              </div>
            ) : <p className="text-lg">Chưa có địa chỉ nhận hàng</p>}
            <Button type="link" className="ml-auto text-blue-300 hover:text-blue-900 text-base underline">Thay Đổi</Button>
          </div>
        </Card>

        {/* Giỏ hàng */}
        <Card className="mb-4">
          {Object.entries(groupedCartItems).map(([shopName, items]) => (
            <div key={shopName}>
              <div className="flex items-center mb-5">
                <ShopOutlined className="text-xl text-gray-500 mr-2" />
                <p className="font-semibold text-lg">{shopName}</p>
              </div>
              <Table dataSource={items} pagination={false} rowKey="cart_item_id">
                <Table.Column
                  title="Sản phẩm"
                  key="product"
                  render={(text, record) => (
                    <div className="flex items-center">
                      <img src={record.gundam_image_url} alt={record.gundam_name} className="w-16 h-16 object-cover rounded border border-gray-300 mr-3" />
                      <div>
                        <p className="text-base">{record.gundam_name}</p>
                        {/* <p className="text-xs text-gray-500">{record.seller_name}</p> */}
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
            <div className='border-b-2 py-2 space-y-2'>
              <p className="text-xl font-bold mb-2">Thông tin vận chuyển</p>
              <p className="flex justify-between text-sm text-gray-600">Dự kiến nhận hàng: <span className="font-semibold">Thứ 4, ngày 5 tháng 3 năm 2025</span></p>
              <p className="flex justify-between text-sm text-gray-600">Phí giao hàng: <span className="font-semibold">{shippingFee.toLocaleString()} VNĐ</span></p>
            </div>

            <p className="flex justify-between font-semibold text-lg mt-4">Tạm tính: <span className="font-semibold">{finalPrice.toLocaleString()} VNĐ</span></p>
          </Card>
        </Card>

        {/* Phương thức thanh toán */}
        <Card
          title={<div className="font-bold text-lg">Phương thức thanh toán</div>}
          className="mb-4"
        >
          <Radio.Group
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full"
          >
            <div className="flex items-center justify-between">
              <Radio value="GunPay">
                <div className="flex items-center justify-between w-full p-2 border border-transparent hover:border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <img src={footerLogo} alt="wallet" className="max-w-[50px] mr-3" />
                    <div>
                      <p className="font-medium text-base">Thanh toán bằng ví ComZone</p>
                      {paymentMethod === 'GunPay' && (
                        <p className="text-red-500 text-xs mt-1">
                          Số dư không đủ. <span className="text-blue-500 cursor-pointer">Nạp thêm</span>
                        </p>
                      )}
                    </div>
                  </div>
                  {paymentMethod === 'GunPay' && (
                    <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                      Đã chọn
                    </div>
                  )}
                </div>
              </Radio>

              <Radio value="cod">
                <div className="flex items-center justify-between w-full p-2 border border-transparent hover:border-gray-200 rounded-md">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center w-[40px] h-[40px] bg-gray-100 rounded-md mr-3">
                      <MoneyCollectOutlined className="text-xl text-gray-500" />
                    </div>
                    <p className="font-medium text-base">Thanh toán khi nhận hàng</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded-md text-xs font-medium">
                      Đã chọn
                    </div>
                  )}
                </div>
              </Radio>
            </div>
          </Radio.Group>
        </Card>
      </div>

      {/* Sidebar */}
      <div className="col-span-1">
        <Card>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">ĐƠN HÀNG</p>
            <a href="/cart" className="text-blue-300 text-sm">Quay lại giỏ hàng</a>
          </div>
          <p className="text-gray-500 mt-2">{selectedItems.length} sản phẩm</p>
          <Divider />
          <div className="flex justify-between text-lg mt-2">
            <p className="text-dark">Tổng đơn hàng:</p>
            <p className="font-semibold">{totalPrice.toLocaleString()} đ</p>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <p className="text-dark">Phí giao hàng:</p>
            <p className="font-semibold">{shippingFee.toLocaleString()} đ</p>
          </div>
          <Divider />
          <div className="flex justify-between text-lg font-bold">
            <p className="text-black">Tổng tiền thanh toán:</p>
            <p className="text-red-500">{finalPrice.toLocaleString()} đ</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Nhấn <span className="font-semibold">"Đặt hàng"</span> đồng nghĩa với việc bạn đã đồng ý với
            <a href="#" className="text-blue-500"> Điều khoản của MechWorld</a>
          </p>
          <Button
            type="primary"
            danger
            className="w-full mt-4 text-lg border-none cursor pb-4 pt-4"
            onClick={handleCheckout}
          >
            ĐẶT HÀNG
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
