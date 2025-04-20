import axios from 'axios';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Form, Select, Input, Button, message, Modal, Checkbox } from 'antd';

import { postUserAddresses, getUserAddresses, updateAddress, deleteAddress } from '../../apis/User/APIUser';

const { Option } = Select;

const SettingAddress = () => {
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPickupAddress, setIsPickupAddress] = useState(false);
  const [isPrimary, setIsPrimary] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const user = useSelector((state) => state.auth.user);
  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';

  console.log("addresses", addresses);


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
  const setPrimaryAddress = async (addressID) => {
    try {

      await updateAddress(user.id, addressID, { is_primary: true });
      message.success("Đã cập nhật địa chỉ mặc định!");
      fetchUserAddresses();
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ mặc định!");
      console.error(error);
    }
  };
  const handleDeleteAddress = async (address) => {
    setLoading(true);
    console.log("Địa chỉ:", address);
    deleteAddress(user.id, address.id);
    fetchUserAddresses();
    setLoading(false);
  }
  // const handleEditAddress = async (address) => {
  //   console.log("📌 Đang chỉnh sửa địa chỉ:", address);

  //   setIsEditing(true);
  //   setEditingAddress(address);
  //   setIsPrimary(address.is_primary);

  //   // Gán dữ liệu cơ bản trước
  //   form.setFieldsValue({
  //     full_name: address.full_name,
  //     phone_number: address.phone_number,
  //     detail: address.detail,
  //   });

  //   setIsModalVisible(true);

  //   try {
  //     // 🟢 1. Lọc thành phố có tên trùng với `province_name`
  //     const filteredCities = cities.filter((city) => city.ProvinceName === address.province_name);
  //     console.log("✅ Thành phố tìm thấy:", filteredCities);

  //     if (filteredCities.length > 0) {
  //       const selectedCityId = filteredCities[0].ProvinceID;
  //       setSelectedCity(selectedCityId);
  //       await fetchDistricts(selectedCityId); // 🟢 Load quận/huyện dựa vào thành phố

  //       // 🟢 2. Đợi `districts` cập nhật xong mới tiếp tục
  //       setTimeout(async () => {
  //         console.log("📌 Danh sách Quận/Huyện sau khi fetch:", districts);
  //         console.log("Địa chỉ đang tìm kiếm: ",address.district_name);
  //         const district = districts.find((d) => d.DistrictName === address.district_name);
  //         console.log("✅ Quận/Huyện tìm thấy:", district);

  //         if (district) {
  //           const selectedDistrictId = district.DistrictID;
  //           setSelectedDistrict(selectedDistrictId);
  //           await fetchWards(selectedDistrictId); // 🟢 Load danh sách phường/xã dựa vào quận/huyện

  //           // 🟢 3. Đợi `wards` cập nhật xong mới tiếp tục
  //           setTimeout(() => {
  //             console.log("📌 Danh sách Phường/Xã sau khi fetch:", wards);
  //             const ward = wards.find((w) => w.WardName === address.ward_name);
  //             console.log("✅ Phường/Xã tìm thấy:", ward);

  //             // Gán giá trị vào form
  //             form.setFieldsValue({
  //               city: selectedCityId,
  //               district: district ? selectedDistrictId : undefined,
  //               ward: ward ? ward.WardCode : undefined,
  //             });
  //           }, 200);
  //         } else {
  //           console.warn("⚠️ Không tìm thấy Quận/Huyện phù hợp");
  //         }
  //       }, 200);
  //     } else {
  //       console.warn("⚠️ Không tìm thấy Thành phố phù hợp");
  //     }
  //   } catch (error) {
  //     console.error("❌ Lỗi khi load dữ liệu địa chỉ:", error);
  //   }
  // };

  const handleEditAddress = async (address) => {
    console.log("📌 Đang chỉnh sửa địa chỉ:", address);

    setIsEditing(true);
    setEditingAddress(address);
    setIsPrimary(address.is_primary);
    form.setFieldsValue({
      full_name: address.full_name,
      phone_number: address.phone_number,
      detail: address.detail,
    });

    setIsModalVisible(true);

    try {
      const filteredCities = cities.filter((city) => city.ProvinceName === address.province_name);
      if (filteredCities.length > 0) {
        const selectedCityId = filteredCities[0].ProvinceID;
        setSelectedCity(selectedCityId);

        const districtRes = await api.post(`district`, { province_id: selectedCityId });
        const districtsData = districtRes.data.data;
        setDistricts(districtsData);

        const foundDistrict = districtsData.find((d) => d.DistrictName === address.district_name);
        if (foundDistrict) {
          const selectedDistrictId = foundDistrict.DistrictID;
          setSelectedDistrict(selectedDistrictId);

          const wardRes = await api.post(`ward`, { district_id: selectedDistrictId });
          const wardsData = wardRes.data.data;
          setWards(wardsData);

          const foundWard = wardsData.find((w) => w.WardName === address.ward_name);

          form.setFieldsValue({
            city: selectedCityId,
            district: selectedDistrictId,
            ward: foundWard ? foundWard.WardCode : undefined,
          });
        } else {
          console.warn("⚠️ Không tìm thấy quận/huyện phù hợp.");
        }
      } else {
        console.warn("⚠️ Không tìm thấy thành phố phù hợp.");
      }
    } catch (error) {
      console.error("❌ Lỗi khi load địa chỉ:", error);
    }
  };


  const handleUpdateAddress = async (values) => {
    if (!editingAddress) return;
    try {
      await updateAddress(user.id, editingAddress.id, values);
      message.success("Cập nhật địa chỉ thành công!");
      setIsModalVisible(false);
      fetchUserAddresses();
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ!");
      console.error(error);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await api.get(`province`);
      let data = response.data.data;
      data = data.filter(province => province.ProvinceID !== 286 && province.ProvinceID !== 290);
      setCities(data);
    } catch (error) {
      console.error('Lỗi khi fetch thành phố:', error);
    }
  };

  const fetchDistricts = async (province_id) => {
    try {
      console.log("chạy qua rồi");
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
    setLoading(true);
    const city = cities.find(city => city.ProvinceID === values.city);
    const district = districts.find(district => district.DistrictID === values.district);
    const ward = wards.find(ward => ward.WardCode === values.ward);

    const addressData = {
      full_name: user.full_name,
      detail: values.detail,
      province_name: city ? city.ProvinceName : "",
      district_name: district ? district.DistrictName : "",
      ward_name: ward ? ward.WardName : "",
      ghn_district_id: values.district,
      ghn_ward_code: values.ward,
      phone_number: values.phone_number || user.phone_number,
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
  const handleCancelModal = () => {
    setIsModalVisible(false);
    setIsEditing(false);
    setEditingAddress(null);
    setSelectedCity(null);
    setSelectedDistrict(null);
    form.resetFields();
  };


  // const columns = [
  //   { title: 'Tên tỉnh/thành', dataIndex: 'province_name', key: 'province_name' },
  //   { title: 'Tên quận/huyện', dataIndex: 'district_name', key: 'district_name' },
  //   { title: 'Tên phường/xã', dataIndex: 'ward_name', key: 'ward_name' },
  //   { title: 'Địa chỉ', dataIndex: 'detail', key: 'detail' },
  //   { title: 'Số điện thoại', dataIndex: 'phone_number', key: 'phone_number' },
  //   { title: 'Nhận đồ?', dataIndex: 'is_pickup_address', key: 'is_pickup_address', render: (text) => (text ? "Có" : "Không") },
  //   { title: 'Mặc định?', dataIndex: 'is_primary', key: 'is_primary', render: (text) => (text ? "Có" : "Không") },
  // ];

  // const setDefaultAddress = (id) => {
  //   setAddresses(addresses.map((addr) => ({
  //     ...addr,
  //     isDefault: addr.id === id,
  //   })));
  // };

  return (
    <>
      <div className="container p-10">
        <div className="flex justify-between pb-4 border-b items-center mb-4">
          <h2 className="text-2xl font-semibold">Địa chỉ của tôi</h2>
          <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }} className='bg-blue-500 p-4 text-white hover:bg-red-600 transition-colors'>
            Thêm địa chỉ mới
          </Button>
        </div>

        {addresses.map((addr) => (
          <div key={addr.id} className="border-b pb-4 mb-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold text-lg">{addr.full_name} <span className="text-gray-500">{addr.phone_number} - {addr.province_name}</span></p>
                <p className="text-gray-600">{addr.detail}, {addr.ward_name}, {addr.district_name}</p>
              </div>
              <div className="space-x-2">
                <Button type="link" onClick={() => handleEditAddress(addr)}>Cập nhật</Button>
                {!addr.is_primary && <Button type="link" danger onClick={() => handleDeleteAddress(addr)}> Xóa</Button>}
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-2">
              {addr.is_primary ? (
                <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Mặc định</span>
              ) : (
                // <Button size="small" onClick={() => setDefaultAddress(addr.id)}>
                <Button size="small" onClick={() => setPrimaryAddress(addr.id)}>
                  Thiết lập mặc định
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div>
        <Modal
          title={isEditing ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          open={isModalVisible}
          onCancel={handleCancelModal}
          footer={null}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={isEditing ? handleUpdateAddress : onFinish}
          >
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

            <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true }]} tooltip={{
              title: 'Số điện thoại dùng để xác nhận bên vận chuyển khi giao hàng. Để trống sẽ mặc định lấy sđt của người dùng.',
              icon: <InfoCircleOutlined />,
            }}>
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item>
              <Checkbox checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)}>
                Đặt làm địa chỉ mặc định
              </Checkbox>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" className="bg-[#0056b3] hover:bg-[#4a90e2]">
                {isEditing ? "Cập nhật địa chỉ" : "Lưu địa chỉ"}
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
