import { useState, useEffect } from 'react';
import { Form, Select, Input, Button, message, Table, Modal, Checkbox } from 'antd';
import axios from 'axios';
import { postUserAddresses, getUserAddresses } from '../../apis/User/APIUserProfile';
import { useSelector } from 'react-redux';

const { Option } = Select;

const SettingAddress = () => {
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  // const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPickupAddress, setIsPickupAddress] = useState(false);
  const [isPrimary, setIsPrimary] = useState(true);


  const [addresses, setAddresses] = useState([
    {
      id: 1,
      name: "trần tuấn",
      phone: "(+84) 394 211 201",
      address: "23 văn đại, Xã Bảo Sơn, Huyện Lục Nam, Bắc Giang",
      isDefault: true,
    },
    {
      id: 2,
      name: "Nguyễn Hữu Đăng Trường",
      phone: "(+84) 385 145 207",
      address: "169/27, Đường Số 11, Phường Bình Hưng Hòa, Quận Bình Tân, TP. Hồ Chí Minh",
      isDefault: false,
    },
  ]);

  const user = useSelector((state) => state.auth.user);
  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';

  const api = axios.create({
    baseURL: ghn_api,
    headers: {
      'Content-Type': 'application/json',
      'token': import.meta.env.VITE_GHN_TOKEN_API
    }
  });

  useEffect(() => {
    fetchProvinces();
    fetchUserAddresses();
  }, []);

  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const response = await getUserAddresses(user.id);
      setAddresses(response.data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const onFinish = async (values) => {
    const city = cities.find(city => city.ProvinceID === values.city);
    const district = districts.find(district => district.DistrictID === values.district);
    const ward = wards.find(ward => ward.WardCode === values.ward);

    const addressData = {
      full_name: user.full_name,
      detail: values.address,
      province_name: city ? city.ProvinceName : "",
      district_name: district ? district.DistrictName : "",
      ward_name: ward ? ward.WardName : "",
      ghn_district_id: values.district,
      ghn_ward_code: values.ward,
      phone_number: values.phone_number,
      is_pickup_address: isPickupAddress,
      is_primary: isPrimary
    };

    try {
      await postUserAddresses(user.id, addressData);
      message.success("Thêm địa chỉ thành công!");
      fetchUserAddresses();
      setIsModalVisible(false);
      form.resetFields();
      setIsPickupAddress(false);
      setIsPrimary(true);
    } catch (error) {
      message.error("Lỗi khi thêm địa chỉ!");
      console.error(error);
    }
  };

  const columns = [
    { title: 'Tên tỉnh/thành', dataIndex: 'province_name', key: 'province_name' },
    { title: 'Tên quận/huyện', dataIndex: 'district_name', key: 'district_name' },
    { title: 'Tên phường/xã', dataIndex: 'ward_name', key: 'ward_name' },
    { title: 'Địa chỉ', dataIndex: 'detail', key: 'detail' },
    { title: 'Số điện thoại', dataIndex: 'phone_number', key: 'phone_number' },
    { title: 'Nhận đồ?', dataIndex: 'is_pickup_address', key: 'is_pickup_address', render: (text) => (text ? "Có" : "Không") },
    { title: 'Mặc định?', dataIndex: 'is_primary', key: 'is_primary', render: (text) => (text ? "Có" : "Không") },
  ];

  const setDefaultAddress = (id) => {
    setAddresses(addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === id,
    })));
  };

  return (
    <>
      <div className="container p-10">
        <div className="flex justify-between pb-4 border-b items-center mb-4">
          <h2 className="text-2xl font-semibold">Địa chỉ của tôi</h2>
          <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }} className='bg-red-500 p-4 text-white hover:bg-red-600 transition-colors'>
            Thêm địa chỉ mới
          </Button>
        </div>

        {addresses.map((addr) => (
          <div key={addr.id} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-base">{addr.name} <span className="text-gray-500">{addr.phone}</span></p>
                <p className="text-gray-600">{addr.address}</p>
              </div>
              <div className="space-x-2">
                <Button type="link">Cập nhật</Button>
                {!addr.isDefault && <Button type="link" danger>Xóa</Button>}
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              {addr.isDefault ? (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Mặc định</span>
              ) : (
                <Button size="small" onClick={() => setDefaultAddress(addr.id)}>
                  Thiết lập mặc định
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <Modal
          title="Thêm địa chỉ mới"
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
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
              <Select onChange={handleDistrictChange} placeholder="Chọn quận/huyện" disabled={!selectedCity}>
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
            <Form.Item label="Địa chỉ cụ thể" name="address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true }]}>
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item>
              <Checkbox checked={isPickupAddress} onChange={(e) => setIsPickupAddress(e.target.checked)}>
                Có phải địa chỉ nhận đồ không?
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Checkbox checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)}>
                Đặt làm địa chỉ mặc định
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className='bg-[#0056b3] hover:bg-[#4a90e2]'>
                Lưu địa chỉ
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        {/* <Table dataSource={addresses} columns={columns} rowKey="id" loading={loading} /> */}
      </div>
    </>
  );
};

export default SettingAddress;
