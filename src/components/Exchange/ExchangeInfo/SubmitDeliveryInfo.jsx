import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Checkbox, Form, Input, message, Modal, Select } from "antd";
import { deleteAddress, getUserAddresses, postUserAddresses, updateAddress } from "../../../apis/User/APIUser";
import { useSelector } from "react-redux";
import axios from "axios";
import { InfoCircleOutlined } from '@ant-design/icons';
// import AddressForm from "../../AddressForm";

const { Option } = Select;
const SubmitDeliveryInfo = ({
  selectedAddress,
  selectedPickupAddress,
  addresses,
  setAddresses,
  fetchUserAddress,
}) => {
  const  user = useSelector((state) => state.auth.user);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isPickupAddress, setIsPickupAddress] = useState(false);
  const [isPrimary, setIsPrimary] = useState(true);

  // GHN API setup
  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';
  const api = axios.create({
      baseURL: ghn_api,
      headers: {
          'Content-Type': 'application/json',
          'token': import.meta.env.VITE_GHN_TOKEN_API
      }
  });
  
  const PhoneSplitter = (x) => {
    if (!x) {
      return "Không có số điện thoại"; // Giá trị mặc định nếu x là undefined hoặc null
    }
    return x.substring(0, 4) + " " + x.substring(4, 7) + " " + x.substring(7, x.length);
  };
  useEffect(() => {
    const fetchAddress = async () => {
      const response = await fetchUserAddress();
      if (response) {
        setAddresses(response);
      }
    };
    fetchProvinces();
    fetchAddress();
    console.log("address chọn: ",selectedAddress);
    console.log("address pickup chọn: ",selectedPickupAddress);
    // console.log("address lưu: ",addresses);
  }
  , [fetchUserAddress, setAddresses, selectedAddress, selectedPickupAddress]);

  const fetchUserAddresses = async () => {
          try {
              setLoading(true);
              const response = await getUserAddresses(user?.id);
              // setAddresses(response?.data);
              const pickupAddresses = response?.data?.filter(addr => addr.is_pickup_address === true);
              // console.log(pickupAddresses);
              setAddresses(pickupAddresses);
              console.log("Fetched User Addresses:", response);
          } catch (error) {
              console.error('Lỗi khi lấy danh sách địa chỉ:', error);
              message.error('Không thể tải thông tin địa chỉ');
          } finally {
              setLoading(false);
          }
      };
  const handleDeleteAddress = async (address) => {
      setLoading(true);
      console.log("Địa chỉ:", address);
      deleteAddress(user.id, address.id);
      fetchUserAddress();
      setLoading(false);
  }
  const setPrimaryAddress = async (addressID) => {
    try {

      await updateAddress(user.id, addressID, { is_primary: true });
      message.success("Đã cập nhật địa chỉ mặc định!");
      fetchUserAddress();
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ mặc định!");
      console.error(error);
    }
  };
  const setPickupAddress = async (addressID) => {
    try {

      await updateAddress(user.id, addressID, { is_pickup_address: true });
      message.success("Đã cập nhật địa chỉ giao hàng!");
      fetchUserAddress();
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ giao hàng!");
      console.error(error);
    }
  };
  const handleAdding =() =>  {
    setIsAdding(!isAdding);
    setModalVisible(!modalVisible);
    console.log(isAdding);
  }
  const fetchProvinces = async () => {
    try {
        const response = await api.get('province');
        let data = response.data.data;
        // Filter out province with ID 286 (if needed)
        data = data.filter(province => province.ProvinceID !== 286 && province.ProvinceID !== 290 && province.ProvinceID !== 298 && province.ProvinceID !== 2002);
        setCities(data);
    } catch (error) {
        console.error('Lỗi khi fetch thành phố:', error);
    }
};

// Fetch districts based on selected city
const fetchDistricts = async (province_id) => {
    try {
        const response = await api.post('district', { province_id });
        setDistricts(response.data.data);
    } catch (error) {
        console.error('Lỗi khi fetch quận:', error);
    }
};

// Fetch wards based on selected district
const fetchWards = async (district_id) => {
    try {
        const response = await api.post('ward', { district_id });
        setWards(response.data.data);
    } catch (error) {
        console.error('Lỗi khi fetch phường/xã:', error);
    }
};
  const handleCityChange = (value) => {
    setSelectedCity(value);
    setDistricts([]);
    setWards([]);
    form.setFieldsValue({ district: undefined, ward: undefined });
    fetchDistricts(value);
};

// Handle district selection
const handleDistrictChange = (value) => {
    setSelectedDistrict(value);
    setWards([]);
    form.setFieldsValue({ ward: undefined });
    fetchWards(value);
};
  const handleEdit = async (address) => {
    setIsAdding(!isAdding);
    setModalVisible(true);
    setIsUpdate(!isUpdate);
    // setModalVisible(!modalVisible);
    form.setFieldsValue({
        full_name: address.full_name,
        phone_number: address.phone_number,
        detail: address.detail,
    });

    try {
        const filteredCities = cities.filter((city) => city.ProvinceName === address.province_name);
        if (filteredCities.length > 0) {
          const selectedCityId = filteredCities[0].ProvinceID;
          setSelectedCity(selectedCityId);
          console.log("Data city: ",filteredCities);
            
          const districtRes = await api.post(`district`, { province_id: selectedCityId });
          const districtsData = districtRes.data.data;
          setDistricts(districtsData);
          
            
          const foundDistrict = districtsData.find((d) => d.DistrictName === address.district_name);
          console.log("Data district: ",foundDistrict);
          if (foundDistrict) {
            const selectedDistrictId = foundDistrict.DistrictID;
            setSelectedDistrict(selectedDistrictId);
            
            const wardRes = await api.post(`ward`, { district_id: selectedDistrictId });
            const wardsData = wardRes.data.data;
            setWards(wardsData);
            
    
            const foundWard = wardsData.find((w) => w.WardName === address.ward_name);
            console.log("Data ward: ", foundWard);
            form.setFieldsValue({
              province_name: filteredCities ? filteredCities.ProvinceName : undefined,
              city: selectedCityId,
              district_name: foundDistrict ? foundDistrict.DistrictName : undefined,                    
              district: selectedDistrictId,
              ward_name: foundWard ? foundWard.WardName : undefined,
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
  const handleUpdateAddress = async (values, addresses) => {
    console.log("Data load: ",values);
    console.log("Data addresses load: ",addresses);
    const city = cities.find(city => city.ProvinceID === values.city);
    const district = districts.find(district => district.DistrictID === values.district);
    const ward = wards.find(ward => ward.WardCode === values.ward);
    const addressData = {
      full_name: values.full_name && values.full_name.trim() !== "" ? values.full_name : addresses.full_name,
      phone_number: values.phone_number && values.phone_number.trim() !== "" ? values.phone_number : addresses.phone_number,
      detail: values.detail,
      ghn_ward_code: values.ward,
      ghn_district_id: values.district,
      ward_name: ward ? ward.WardName : "",
      province_name: city ? city.ProvinceName : "",
      district_name: district ? district.DistrictName : "",
      is_pickup_address: isPickupAddress,
      is_primary: isPrimary
    };
    try {
      await updateAddress(user.id, addresses[0].id, addressData);
      message.success("Cập nhật địa chỉ thành công!");
      setModalVisible(false);
      setIsPickupAddress(false);
      setIsPrimary(false);
      setIsAdding(!isAdding);
      setIsUpdate(false);
      fetchUserAddresses();
    } catch (error) {
      message.error("Lỗi khi cập nhật địa chỉ!");
      console.error(error);
    }
};
// Handle form submission for new address
const handleAddNewAddress = async (values) => {
    const city = cities.find(city => city.ProvinceID === values.city);
    const district = districts.find(district => district.DistrictID === values.district);
    const ward = wards.find(ward => ward.WardCode === values.ward);

    const addressData = {
      full_name: values.full_name && values.full_name.trim() !== "" ? values.full_name : user.full_name,
      phone_number: values.phone_number && values.phone_number.trim() !== "" ? values.phone_number : user.phone_number,
        detail: values.detail,
        ghn_ward_code: values.ward,
        ghn_district_id: values.district,
        ward_name: ward ? ward.WardName : "",
        province_name: city ? city.ProvinceName : "",
        district_name: district ? district.DistrictName : "",
        is_pickup_address: isPickupAddress,
        is_primary: isPrimary
    };

    try {
        setLoading(true);
        await postUserAddresses(user?.id, addressData);
        message.success("Thêm địa chỉ thành công!");
        form.resetFields();
        setIsPickupAddress(false);
        setIsPrimary(false);
        setModalVisible(false);
        fetchUserAddresses(); // Refresh addresses list
    } catch (error) {
        message.error("Lỗi khi thêm địa chỉ!");
        console.error(error);
    } finally {
      setIsAdding(!isAdding);
        setLoading(false);
    }
};
return (
  <div>
      <Button type="primary" onClick={() => setIsModalVisible(true)} style={{ marginBottom: 16 }} className='bg-blue-500 mt-2 p-4 text-white hover:bg-blue-600 transition-colors'>
          {selectedAddress ? "Thay đổi" : "Thêm địa chỉ giao hàng"}
      </Button>

      

      
      <div className="flex flex-col w-full mt-3">
      {selectedAddress ? (
        <>
          <div>
          {" "}<h2 className="font-bold">THÔNG TIN NHẬN HÀNG</h2>
            <div className="flex flex-row w-full gap-5 items-center">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z"
                  fill="#000"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z"
                  fill="#000"
                />
              </svg>
              <div className="flex flex-row gap-3">
                <h3 className="font-semibold">{selectedAddress?.full_name}</h3>
                <h3>|</h3>
                <h3 className="font-light">
                  {PhoneSplitter(selectedAddress?.phone_number)}
                </h3>
              </div>
            </div>
            <div className="flex flex-row gap-5 mt-2 items-center">
              <svg
                width="30px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-row gap-1">
                <h2 className="font-bold"> {selectedAddress?.province_name}, {selectedAddress?.district_name}, {selectedAddress?.ward_name}</h2>
                <h3>-</h3>
                <h3 className="font-light">{selectedAddress?.detail}</h3>
              </div>
            </div>
          </div>
          <br />
          <div> {" "}
          <h2 className="font-bold">THÔNG TIN GIAO HÀNG</h2>
            <div className="flex flex-row w-full gap-5 items-center">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z"
                  fill="#000"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z"
                  fill="#000"
                />
              </svg>
              <div className="flex flex-row gap-3">
                <h3 className="font-semibold">{selectedPickupAddress?.full_name}</h3>
                <h3>|</h3>
                <h3 className="font-light">
                  {PhoneSplitter(selectedPickupAddress?.phone_number)}
                </h3>
              </div>
            </div>
            <div className="flex flex-row gap-5 mt-2 items-center">
              <svg
                width="30px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-row gap-1">
                <h2 className="font-bold"> {selectedPickupAddress?.province_name}, {selectedPickupAddress?.district_name}, {selectedPickupAddress?.ward_name}</h2>
                <h3>-</h3>
                <h3 className="font-light">{selectedPickupAddress?.detail}</h3>
              </div>
            </div>
          </div>
        </>

      ) : (
        <p className="text-xs font-light text-red-500">
          Vui lòng thêm địa chỉ giao hàng
        </p>
      )}
      <Modal
        title={isAdding !== true  ? "Chọn địa chỉ giao hàng" : "Thêm / sửa địa chỉ"}
        open={isModalVisible}
        footer={null}
        onCancel={() => {setIsModalVisible(false); setIsAdding(false); form.resetFields();}}
        width={800}
        className="modal-address">
          {isAdding ? (
            <div>
                <Modal
                title={isUpdate !== true  ? "Thêm mới địa chỉ" : "Cập nhập địa chỉ"}
                open={modalVisible}
                onCancel={() => {
                    setModalVisible(false);
                    setIsUpdate(false);
                    setIsAdding(false);
                    form.resetFields();
                }}
                footer={[
                    <Button key="cancel" onClick={() => {
                        setModalVisible(false);
                        setIsUpdate(false);
                        setIsAdding(false);
                        form.resetFields();
                    }}>
                        Hủy
                    </Button>,
                    <Button
                        key="submit"
                        type="primary"
                        loading={loading}
                        className="bg-blue-500"
                        onClick={async () => {
                            try {
                                const values = await form.validateFields();
                                if (isUpdate == true ) {
                                    console.log("Dữ liệu address ht: ", addresses);
                                    console.log("Dữ liệu form: ", values);
                                    handleUpdateAddress(values, addresses);
                                } else {
                                    console.log("Dữ liệu form: ", values);
                                    handleAddNewAddress(values);
                                }
                                
                            } catch (error) {
                                console.error("Validation Error:", error);
                            }
                        }}
                    >
                        {isUpdate !== true  ? "Lưu" : "Cập nhập"}
                    </Button>,
                ]}
            >
                <Form
                    form={form}
                    layout="horizontal"
                    labelCol={{ span: 6 }}
                    wrapperCol={{ span: 16 }}
                >
                    {/* Chọn Thành phố */}
                    <Form.Item label="Tỉnh/Thành phố" name="city" rules={[{ required: true, message: 'Vui lòng chọn Tỉnh/Thành phố' }]}>
                        <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                            {cities.map((city) => (
                                <Option key={city.ProvinceID} value={city.ProvinceID}>
                                    {city.ProvinceName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Chọn Quận/huyện */}
                    <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true, message: 'Vui lòng chọn Quận/Huyện' }]}>
                        <Select
                            onChange={handleDistrictChange}
                            placeholder="Chọn quận/huyện"
                            disabled={!selectedCity}
                            loading={selectedCity && districts.length === 0}
                        >
                            {districts.map((district) => (
                                <Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Chọn Phường/xã */}
                    <Form.Item label="Phường/Xã" name="ward" rules={[{ required: true, message: 'Vui lòng chọn Phường/Xã' }]}>
                        <Select
                            placeholder="Chọn phường/xã"
                            disabled={!selectedDistrict}
                            loading={selectedDistrict && wards.length === 0}
                        >
                            {wards.map((ward) => (
                                <Option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Nhập địa chỉ cụ thể */}
                    <Form.Item label="Địa chỉ cụ thể" name="detail" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}>
                        <Input.TextArea
                            placeholder="Ví dụ: 15 Nguyễn Trãi, Tòa nhà ABC, Lầu 10"
                            rows={3}
                        />
                    </Form.Item>
                    <Form.Item label="Người giao dịch" name="full_name" rules={[{ required: true }]} tooltip={{
                      title: 'Tên người sẽ giao/nhận sản phẩm. Để trống sẽ mặc định lấy tên của người dùng.',
                      icon: <InfoCircleOutlined />,
                    }}>
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>
                    <Form.Item label="Số điện thoại" name="phone_number" rules={[{ required: true }]} tooltip={{
                      title: 'Số điện thoại dùng để xác nhận bên vận chuyển khi giao hàng. Để trống sẽ mặc định lấy sđt của người dùng.',
                      icon: <InfoCircleOutlined />,
                    }}>
                      <Input placeholder="Nhập số điện thoại" />
                    </Form.Item>

                    <Form.Item>
                      <Checkbox checked={isPrimary} onChange={(e) => setIsPrimary(e.target.checked)}>
                        Đặt làm địa chỉ nhận hàng
                      </Checkbox>
                    </Form.Item>
                    <Form.Item>
                      <Checkbox checked={isPickupAddress} onChange={(e) => setIsPickupAddress(e.target.checked)}>
                        Đặt làm địa chỉ giao hàng
                      </Checkbox>
                    </Form.Item>

                </Form>
            </Modal>
            </div>
          ) : (
            <div className="flex flex-col gap-2 mt-3">

            {addresses.map((addr) => (
              <div key={addr.id} className="border-b pb-4 mb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-lg">{addr.full_name} <span className="text-gray-500">{addr.phone_number} - {addr.province_name}</span></p>
                    <p className="text-gray-600">{addr.detail}, {addr.ward_name}, {addr.district_name}</p>
                  </div>
                  <div>
                  <Button
                                    type="primary"
                                    onClick={() => handleEdit(addr)}
                                    className="bg-blue-500"
                                >
                                    Cập nhật địa chỉ
                                </Button>
                                {!addr.is_primary && <Button type="link" danger onClick={() => handleDeleteAddress(addr)}> Xóa</Button>}
                  </div>
                </div>
  
                <div className="mt-2 flex items-center space-x-2">
                  {addr.is_primary ? (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-500 rounded">Địa chỉ nhận hàng mặc định</span>
                  ) : ( 
                    <div className="gap-2">
                      <Button size="small" onClick={() => setPrimaryAddress(addr.id)}>
                        Đặt làm địa chỉ nhận hàng
                      </Button>
                    </div>
                  )}
                  {addr.is_pickup_address ? (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded">Địa chỉ giao hàng mặc định</span>
                  ) : ( 
                    <div className="gap-2">
                      <Button size="small" onClick={() => setPickupAddress(addr.id)}>
                        Đặt làm địa chỉ giao hàng 
                      </Button>
                    </div>
                  )}
                </div>

              </div>
            ))}
            
            
          </div>
          )}
        <div className="flex justify-end mt-4">
                <Button type="primary" onClick={() => handleAdding()} className="bg-blue-500 hover:bg-blue-600 transition-colors mr-5">
                  {isAdding !== true  ? "Thêm mới" : "Danh sách có sẵn"}
                </Button>
  
                <Button type="primary" onClick={() => setIsModalVisible(false)} className="bg-red-600 hover:bg-red-400">
                  Đóng
                </Button>
            </div>
      </Modal>
    </div>
  </div>
)}

export default SubmitDeliveryInfo

SubmitDeliveryInfo.propTypes = {
  selectedAddress: PropTypes.shape({
    id: PropTypes.any.isRequired,
    full_name: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    province_name: PropTypes.string.isRequired,
    district_name: PropTypes.string.isRequired,
    ward_name: PropTypes.string.isRequired,
    is_primary: PropTypes.bool.isRequired,
    is_pickup_address: PropTypes.bool.isRequired,
    ghn_district_id: PropTypes.number.isRequired,
    ghn_ward_code: PropTypes.string.isRequired,
  }),
  setSelectedAddress: PropTypes.func.isRequired,
  selectedPickupAddress: PropTypes.shape({
    id: PropTypes.any.isRequired,
    full_name: PropTypes.string.isRequired,
    phone_number: PropTypes.string.isRequired,
    detail: PropTypes.string.isRequired,
    province_name: PropTypes.string.isRequired,
    district_name: PropTypes.string.isRequired,
    ward_name: PropTypes.string.isRequired,
    is_primary: PropTypes.bool.isRequired,
    is_pickup_address: PropTypes.bool.isRequired,
    ghn_district_id: PropTypes.number.isRequired,
    ghn_ward_code: PropTypes.string.isRequired,
  }),
  setSelectedPickupAddress: PropTypes.func,
  addresses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.any.isRequired,
      full_name: PropTypes.string.isRequired,
      phone_number: PropTypes.string.isRequired,
      detail: PropTypes.string.isRequired,
      province_name: PropTypes.string.isRequired,
      district_name: PropTypes.string.isRequired,
      ward_name: PropTypes.string.isRequired,
      is_primary: PropTypes.bool.isRequired,
      is_pickup_address: PropTypes.bool.isRequired,
      ghn_district_id: PropTypes.number.isRequired,
      ghn_ward_code: PropTypes.string.isRequired,
    })
  ).isRequired,
  setAddresses: PropTypes.func.isRequired,
  fetchUserAddress: PropTypes.func.isRequired,
};
