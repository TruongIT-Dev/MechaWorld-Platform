import React, { useState, useEffect } from 'react';
import { Card, Button, Radio, Divider, message, Table, Modal, Form, Select, Input, Checkbox } from 'antd';
import { ShoppingCartOutlined, EnvironmentOutlined, ShopOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { getUserAddresses, postUserAddresses, updateAddress } from '../../apis/User/APIUserProfile';
import { CheckoutCart } from '../../apis/Cart/APICart'; 
import { useCart } from '../../context/CartContext';
import { useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import axios from 'axios';
import footerLogo from "../../assets/image/icon/iconwallet.png";

const { Column } = Table;
const { Option } = Select;

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
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isPrimary, setIsPrimary] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [form] = Form.useForm();
  const [shippingFee, setShippingFee] = useState(0);
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState('');
  const [isCalculatingShipping, setIsCalculatingShipping] = useState(false);

  const userCookie = Cookies.get('user');
  const userData = JSON.parse(decodeURIComponent(userCookie));
  const selectedItems = location.state?.selectedItems || cartItems;

  const totalPrice = selectedItems.reduce((acc, item) => acc + item.gundam_price, 0);

  const finalPrice = totalPrice + shippingFee;

  const groupedCartItems = groupByShop(selectedItems);

  const calculateShippingFee = async () => {
    if (!userAddress || !selectedItems.length) return;
  
    setIsCalculatingShipping(true);
    
    try {
      const shopAddress = {
        district_id: 1454, 
        ward_code: "21012" 
      };
  
      const response = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee',
        {
          from_district_id: shopAddress.district_id,
          from_ward_code: shopAddress.ward_code,
          to_district_id: userAddress.ghn_district_id,
          to_ward_code: userAddress.ghn_ward_code,
          service_id: 0, 
          service_type_id: 2, 
          weight: selectedItems.length * 200, 
          insurance_value: totalPrice,
          coupon: null
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_GHN_TOKEN_API,
            'shop_id': import.meta.env.VITE_GHN_SHOP_ID // 
          }
        }
      );
  
      const feeData = response.data.data;
      setShippingFee(feeData.total);
      
      // Tính toán ngày dự kiến giao hàng
      const leadTimeResponse = await axios.post(
        'https://dev-online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/leadtime',
        {
          from_district_id: shopAddress.district_id,
          from_ward_code: shopAddress.ward_code,
          to_district_id: userAddress.ghn_district_id,
          to_ward_code: userAddress.ghn_ward_code,
          service_id: feeData.service_id
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_GHN_TOKEN_API
          }
        }
      );
  
      const leadTimeData = leadTimeResponse.data.data;
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + leadTimeData.leadtime);
      setExpectedDeliveryDate(formatDeliveryDate(deliveryDate));
      
    } catch (error) {
      console.error('Lỗi khi tính phí vận chuyển:', error);
      message.error('Không thể tính phí vận chuyển. Vui lòng thử lại sau.');
      const fallbackDate = new Date();
      fallbackDate.setDate(fallbackDate.getDate() + 3);
      setExpectedDeliveryDate(formatDeliveryDate(fallbackDate));
    } finally {
      setIsCalculatingShipping(false);
    }
  };
  
  const formatDeliveryDate = (date) => {
    const days = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${dayName}, ngày ${day} tháng ${month} năm ${year}`;
  };

  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';
  const api = axios.create({
    baseURL: ghn_api,
    headers: {
      'Content-Type': 'application/json',
      'token': import.meta.env.VITE_GHN_TOKEN_API
    }
  });

  useEffect(() => {
    if (userAddress && selectedItems.length > 0) {
      calculateShippingFee();
    }
  }, [userAddress, selectedItems]);

  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        const userId = userData.id;
        const addressResponse = await getUserAddresses(userId);
        setAddresses(addressResponse.data);
        const primaryAddress = addressResponse.data.find(addr => addr.is_primary) || addressResponse.data[0] || null;
        setUserAddress(primaryAddress);
      } catch (error) {
        message.error("Lỗi khi tải dữ liệu!");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutData();
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      const response = await api.get(`province`);
      let data = response.data.data;
      data = data.filter(province => province.ProvinceID !== 286);
      setCities(data);
    } catch (error) {
      console.error('Lỗi khi fetch thành phố:', error);
    }
  };

  const fetchDistricts = async (province_id) => {
    try {
      const response = await api.post(`district`, { province_id });
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Lỗi khi fetch quận:', error);
    }
  };

  const fetchWards = async (district_id) => {
    try {
      const response = await api.post(`ward`, { district_id });
      setWards(response.data.data);
    } catch (error) {
      console.error('Lỗi khi fetch phường/xã:', error);
    }
  };

  const handleCityChange = (value) => {
    setSelectedCity(value);
    setDistricts([]);
    setWards([]);
    fetchDistricts(value);
  };

  const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setWards([]);
    fetchWards(value);
  };

  const onFinishAddress = async (values) => {
    setLoading(true);
    const city = cities.find(city => city.ProvinceID === values.city);
    const district = districts.find(district => district.DistrictID === values.district);
    const ward = wards.find(ward => ward.WardCode === values.ward);

    const addressData = {
      full_name: values.full_name,
      detail: values.detail,
      province_name: city ? city.ProvinceName : "",
      district_name: district ? district.DistrictName : "",
      ward_name: ward ? ward.WardName : "",
      ghn_district_id: values.district,
      ghn_ward_code: values.ward,
      phone_number: values.phone_number,
      is_primary: isPrimary
    };

    try {
      const response = await postUserAddresses(userData.id, addressData);
      const newAddress = response.data;
      setAddresses([...addresses, newAddress]);
      if (isPrimary) {
        setUserAddress(newAddress);
      }
      message.success("Thêm địa chỉ thành công!");
      setIsAddressModalVisible(false);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi thêm địa chỉ!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimaryAddress = async (address) => {
    try {
      await updateAddress(userData.id, address.id, { is_primary: true });
      setUserAddress(address);
      setAddresses(addresses.map(addr => ({
        ...addr,
        is_primary: addr.id === address.id
      })));
      message.success("Đã cập nhật địa chỉ mặc định!");
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ mặc định!");
      console.error(error);
    }
  };

  const handleCheckout = async () => {
    if (!userAddress) {
      message.error("Vui lòng chọn địa chỉ giao hàng.");
      return;
    }
  
    if (isCalculatingShipping) {
      message.warning("Vui lòng đợi hệ thống tính toán phí vận chuyển");
      return;
    }
  
    const orderPayload = {
      buyer_address_id: userAddress.id,
      delivery_fee: shippingFee,
      expected_delivery_time: expectedDeliveryDate,
      gundam_ids: selectedItems.map(item => item.gundam_id),
      items_subtotal: totalPrice,
      note: note,
      payment_method: paymentMethod,
      seller_id: selectedItems[0].seller_id,
      total_amount: totalPrice + shippingFee,
      completed_at: null
    };
  
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
              <div className="flex flex-col w-full">
                <div className="flex items-center">
                  <p className="font-semibold text-xl mr-5">{userAddress.full_name} ({userAddress.phone_number})</p>
                  {userAddress.is_primary && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Mặc định</span>
                  )}
                </div>
                <p className="text-lg">{userAddress.detail}, {userAddress.ward_name}, {userAddress.district_name}, {userAddress.province_name}</p>
              </div>
            ) : <p className="text-lg">Chưa có địa chỉ nhận hàng</p>}
            <Button 
              type="link" 
              className="ml-auto text-blue-500 text-lg"
              onClick={() => setIsAddressModalVisible(true)}
            >
              Thay Đổi
            </Button>
          </div>
        </Card>

        {/* Address Selection Modal */}
        <Modal
          title="Chọn địa chỉ giao hàng"
          open={isAddressModalVisible}
          onCancel={() => setIsAddressModalVisible(false)}
          footer={null}
          width={800}
        >
          <div className="mb-4">
            <h3 className="font-semibold mb-2">Địa chỉ đã lưu</h3>
            {addresses.length > 0 ? (
              <div className="space-y-3">
                {addresses.map(address => (
                  <div 
                    key={address.id} 
                    className={`p-3 border rounded cursor-pointer ${userAddress?.id === address.id ? 'border-blue-500 bg-blue-50' : ''}`}
                    onClick={() => {
                      setUserAddress(address);
                      setIsAddressModalVisible(false);
                    }}
                  >
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">{address.full_name} ({address.phone_number})</p>
                        <p>{address.detail}, {address.ward_name}, {address.district_name}, {address.province_name}</p>
                      </div>
                      {address.is_primary ? (
                        <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded h-fit">Mặc định</span>
                      ) : (
                        <Button 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetPrimaryAddress(address);
                          }}
                        >
                          Đặt mặc định
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>Bạn chưa có địa chỉ nào</p>
            )}
          </div>

          <Divider>Hoặc thêm địa chỉ mới</Divider>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinishAddress}
          >
            <Form.Item label="Họ và tên" name="full_name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item label="Thành phố" name="city" rules={[{ required: true }]}>
              <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                {cities.map((city) => (
                  <Option key={city.ProvinceID} value={city.ProvinceID}>
                    {city.ProvinceName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true }]}>
              <Select
                onChange={handleDistrictChange}
                placeholder="Chọn quận/huyện"
                disabled={!selectedCity}
              >
                {districts.map((district) => (
                  <Option key={district.DistrictID} value={district.DistrictID}>
                    {district.DistrictName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Phường/Xã" name="ward" rules={[{ required: true }]}>
              <Select placeholder="Chọn phường/xã" disabled={!selectedDistrict}>
                {wards.map((ward) => (
                  <Option key={ward.WardCode} value={ward.WardCode}>
                    {ward.WardName}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item label="Địa chỉ cụ thể" name="detail" rules={[{ required: true }]}>
              <Input />
            </Form.Item>

            <Form.Item>
              <Checkbox checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)}>
                Đặt làm địa chỉ mặc định
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="bg-blue-500">
                Lưu địa chỉ
              </Button>
            </Form.Item>
          </Form>
        </Modal>

        {/* Rest of your checkout page remains the same */}
        {/* Giỏ hàng */}
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

                <Table.Column
                  title="Phí vận chuyển"
                  dataIndex=""
                  key=""
                  render={() => isCalculatingShipping ? 'Đang tính...' : `${Math.round(shippingFee / selectedItems.length).toLocaleString()} đ`}
                />
              </Table>
            </div>
          ))}

          {/* Ghi chú và vận chuyển */}
          <Card className="mb-4 border-none">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold text-base mb-2">Ghi chú</p>
                <input
                  type="text"
                  placeholder="Nhập ghi chú..."
                  className="w-full p-2 border rounded"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div>
                <p className="font-semibold text-base mb-2">Thông tin vận chuyển</p>
                <p className="flex justify-between text-sm text-gray-600">
                  Dự kiến nhận hàng: 
                  <span className="font-semibold">
                    {isCalculatingShipping ? 'Đang tính toán...' : expectedDeliveryDate}
                  </span>
                </p>
                <p className="flex justify-between text-sm text-gray-600">
                  Phí giao hàng: 
                  <span className="font-semibold">
                    {isCalculatingShipping ? 'Đang tính toán...' : `${shippingFee.toLocaleString()} VNĐ`}
                  </span>
                </p>
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
                <img src={footerLogo} alt="wallet" className="max-w-[50px] mr-2" />
                <p className="text-sm font-semibold">{paymentMethod === 'wallet' ? 'Thanh toán bằng ví ComZone' : 'Thanh toán khi nhận hàng'}</p>
              </div>
              {paymentMethod === 'wallet' && <p className="text-red-500 text-xs">Số dư không đủ. <span className="text-blue-500 cursor-pointer">Nạp thêm</span></p>}
            </div>
          ) : (
            <Radio.Group value={paymentMethod} onChange={(e) => {
              setPaymentMethod(e.target.value);
              setShowPaymentOptions(false);
            }}>
              <Radio.Button value="wallet" className="text-sm">Ví ComZone</Radio.Button>
              <Radio.Button value="cod" className="text-sm">Thanh toán khi nhận hàng</Radio.Button>
            </Radio.Group>
          )}
        </Card>
      </div>

      {/* Sidebar */}
      <div className="col-span-1">
        <Card>
          <div className="flex justify-between items-center">
            <p className="text-xl font-bold">ĐƠN HÀNG</p>
            <a href="/cart" className="text-blue-500 text-sm">Quay lại giỏ hàng</a>
          </div>
          <p className="text-gray-500 mt-2">{selectedItems.length} sản phẩm</p>
          <Divider />
          <div className="flex justify-between text-lg mt-2">
            <p className="text-gray-600">Tổng tiền hàng:</p>
            <p className="font-semibold">{totalPrice.toLocaleString()} đ</p>
          </div>
          <div className="flex justify-between text-lg mt-2">
            <p className="text-gray-600">Tổng tiền giao hàng:</p>
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
            className="w-full mt-4 bg-red-500 text-lg border-none cursor pb-4 pt-4"
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