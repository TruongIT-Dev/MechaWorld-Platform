import axios from "axios";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { EditOutlined, EnvironmentOutlined, HomeOutlined, InfoCircleOutlined, PhoneOutlined, PlusOutlined, TruckOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Checkbox, Descriptions, Empty, Form, Input, message, Modal, Select, Space, Tabs, Typography } from "antd";

import { deleteAddress, getUserAddresses, postUserAddresses, updateAddress } from "../../../../apis/User/APIUser";
// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

const { Option } = Select;

const SubmitDeliveryInfo = ({
  selectedAddress,
  selectedPickupAddress,
  addresses,
  setAddresses,
  fetchUserAddress,
}) => {

  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [isPickupAddress, setIsPickupAddress] = useState(false);
  const [isPrimary, setIsPrimary] = useState(true);

  const [userAddress, setUserAddress] = useState(null);
  const [activeTab, setActiveTab] = useState("1");
  const [currentAddressId, setCurrentAddressId] = useState(null);

  // GHN API setup
  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';
  const api = axios.create({
    baseURL: ghn_api,
    headers: {
      'Content-Type': 'application/json',
      'token': import.meta.env.VITE_GHN_TOKEN_API
    }
  });

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
      easing: 'ease-in-out',
    });
  }, []);

  const PhoneSplitter = (x) => {
    if (!x) {
      return "Không có số điện thoại"; // Giá trị mặc định nếu x là undefined hoặc null
    }
    return x.substring(0, 4) + " " + x.substring(4, 7) + " " + x.substring(7, x.length);
  };

  // Add this effect to update selected addresses when addresses change
  useEffect(() => {
    // If the selected address is deleted or changed, update it
    if (selectedAddress && !addresses.some(addr => addr.id === selectedAddress.id)) {
      // Find a new primary address or the first address
      const newSelected = addresses.find(addr => addr.is_primary) || addresses[0];
      setIsPrimary(newSelected);
    }

    // If the selected pickup address is deleted or changed, update it
    if (selectedPickupAddress && !addresses.some(addr => addr.id === selectedPickupAddress.id)) {
      // Find a new pickup address or the first address
      const newPickup = addresses.find(addr => addr.is_pickup_address) || addresses[0];
      setIsPickupAddress(newPickup);
    }
  }, [addresses, selectedAddress, selectedPickupAddress, setIsPrimary, setIsPickupAddress]);

  useEffect(() => {
    const fetchAddress = async () => {
      // Chỉ gọi API khi component mount hoặc khi dependency thay đổi
      if (addresses.length === 0) {  // Chỉ fetch khi không có địa chỉ
        const response = await fetchUserAddresses();
        if (response) {
          setAddresses(response);
        }
      }
    };

    fetchProvinces();
    fetchAddress();
  }, [fetchUserAddress]);


  // Hàm Fech Địa Chỉ của user
  const fetchUserAddresses = async () => {
    try {
      setLoading(true);
      const response = await getUserAddresses(user?.id);

      if (response?.data) {
        // Lọc địa chỉ theo yêu cầu nếu cần
        const filteredAddresses = response.data.filter(addr => addr.is_pickup_address === true);
        setAddresses(filteredAddresses);
        return filteredAddresses; // Trả về địa chỉ đã lọc
      }
      return [];
    } catch (error) {
      console.error('Lỗi khi lấy danh sách địa chỉ:', error);
      message.error('Không thể tải thông tin địa chỉ');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Hàm handle Xóa Địa Chỉ
  const handleDeleteAddress = async (address) => {
    setLoading(true);
    try {
      await deleteAddress(user.id, address.id);

      // Remove the address from local state
      setAddresses(prevAddresses =>
        prevAddresses.filter(addr => addr.id !== address.id)
      );

      message.success("Xóa địa chỉ thành công!");
    } catch (error) {
      message.error("Lỗi khi xóa địa chỉ!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm Đặt làm Đia chỉ Giao hàng mặc định
  const setPrimaryAddress = async (addressID) => {
    try {
      await updateAddress(user.id, addressID, { is_primary: true });

      // Update local state to reflect changes
      setAddresses(prevAddresses =>
        prevAddresses.map(addr => ({
          ...addr,
          is_primary: addr.id === addressID
        }))
      );

      // Sau đó gọi API
      await updateAddress(user.id, addressID, { is_primary: true });
      message.success("Đã cập nhật địa chỉ mặc định!");

    } catch (error) {
      // Nếu API lỗi, khôi phục lại state cũ
      message.error("Lỗi khi cập nhật địa chỉ mặc định!");
      fetchUserAddress(); // Lấy lại dữ liệu ban đầu nếu API lỗi
      console.error(error);
    }
  };


  // Hàm Đặt làm Địa chỉ Nhận hàng mặc định
  const setPickupAddress = async (addressID) => {
    try {
      await updateAddress(user.id, addressID, { is_pickup_address: true });

      // Update local state to reflect changes
      setAddresses(prevAddresses =>
        prevAddresses.map(addr => ({
          ...addr,
          is_pickup_address: addr.id === addressID
        }))
      );

      // Sau đó gọi API
      await updateAddress(user.id, addressID, { is_pickup_address: true });
      message.success("Đã cập nhật địa chỉ giao hàng!");

    } catch (error) {
      // Nếu API lỗi, khôi phục lại state cũ
      message.error("Lỗi khi cập nhật địa chỉ mặc định!");
      fetchUserAddress(); // Lấy lại dữ liệu ban đầu nếu API lỗi
      console.error(error);
    }
  };


  // Hàm handle Thêm Địa chỉ mới
  const handleAdding = async (values) => {
    if (!values) {
      // Nếu không có values (khi chỉ nhấn nút "Thêm mới"), chỉ chuyển tab
      setIsAdding(true);
      setActiveTab("2");
      return;
    }

    try {
      setLoading(true);

      // Nếu đang ở mode cập nhật
      if (isUpdate) {
        console.log("Cập nhật địa chỉ ID:", currentAddressId);
        console.log("Dữ liệu form:", values);

        // Tìm địa chỉ đang cập nhật
        const addressToUpdate = addresses.find(addr => addr.id === currentAddressId);
        if (addressToUpdate) {
          await handleUpdateAddress(values, [addressToUpdate]);
        }
      } else {
        // Thêm mới địa chỉ
        console.log("Thêm mới địa chỉ:", values);
        await handleAddNewAddress(values);
      }

      // Reset form và chuyển về tab địa chỉ đã lưu
      form.resetFields();
      setActiveTab("1");
      setIsUpdate(false);
      setCurrentAddressId(null);
    } catch (error) {
      console.error("Lỗi khi xử lý địa chỉ:", error);
    } finally {
      setLoading(false);
    }
  };


  // Hàm để Chỉnh sửa Địa chỉ user
  const handleEditAddress = async (address) => {
    setCurrentAddressId(address.id);
    setIsUpdate(true);
    setActiveTab("2");

    try {
      // Tìm city từ province_name
      const filteredCities = cities.filter((city) => city.ProvinceName === address.province_name);
      if (filteredCities.length > 0) {
        const selectedCityId = filteredCities[0].ProvinceID;
        setSelectedCity(selectedCityId);

        // Lấy districts từ city
        const districtRes = await api.post(`district`, { province_id: selectedCityId });
        const districtsData = districtRes.data.data;
        setDistricts(districtsData);

        // Tìm district từ district_name
        const foundDistrict = districtsData.find((d) => d.DistrictName === address.district_name);
        if (foundDistrict) {
          const selectedDistrictId = foundDistrict.DistrictID;
          setSelectedDistrict(selectedDistrictId);

          // Lấy wards từ district
          const wardRes = await api.post(`ward`, { district_id: selectedDistrictId });
          const wardsData = wardRes.data.data;
          setWards(wardsData);

          // Tìm ward từ ward_name
          const foundWard = wardsData.find((w) => w.WardName === address.ward_name);

          // Set giá trị form
          form.setFieldsValue({
            city: selectedCityId,
            district: selectedDistrictId,
            ward: foundWard ? foundWard.WardCode : undefined,
            detail: address.detail,
            phone_number: address.phone_number,
            full_name: address.full_name
          });

          // Set trạng thái checkbox
          setIsPrimary(address.is_primary);
          setIsPickupAddress(address.is_pickup_address);
        }
      }
    } catch (error) {
      console.error("Lỗi khi load dữ liệu địa chỉ:", error);
    }
  };


  // Hàm để Cập Nhật Địa chỉ user
  const handleUpdateAddress = async (values, addressesToUpdate) => {
    if (!addressesToUpdate || addressesToUpdate.length === 0) return;

    const addressToUpdate = addressesToUpdate[0];
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
      const response = await updateAddress(user.id, addressToUpdate.id, addressData);

      // Update the address in the local state
      const updatedAddress = response.data;
      setAddresses(prevAddresses =>
        prevAddresses.map(addr =>
          addr.id === updatedAddress.id ? updatedAddress : addr
        )
      );

      message.success("Cập nhật địa chỉ thành công!");
      setIsUpdate(false);
      setCurrentAddressId(null);
      setActiveTab("1");
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
      const response = await postUserAddresses(user?.id, addressData);

      // Lấy address mới từ response
      const newAddress = response.data;

      // Cập nhật state addresses ngay lập tức với địa chỉ mới
      setAddresses(prevAddresses => [...prevAddresses, newAddress]);

      message.success("Thêm địa chỉ thành công!");
      form.resetFields();
      setIsPickupAddress(false);
      setIsPrimary(false);
      setActiveTab("1");
    } catch (error) {
      message.error("Lỗi khi thêm địa chỉ!");
      console.error(error);
    } finally {
      setIsAdding(false);
      setLoading(false);
    }
  };


  // Fetch Thành phố
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


  // Fetch Quận based on selected city
  const fetchDistricts = async (province_id) => {
    try {
      const response = await api.post('district', { province_id });
      setDistricts(response.data.data);
    } catch (error) {
      console.error('Lỗi khi fetch quận:', error);
    }
  };


  // Fetch Phường based on selected district
  const fetchWards = async (district_id) => {
    try {
      const response = await api.post('ward', { district_id });
      setWards(response.data.data);
    } catch (error) {
      console.error('Lỗi khi fetch phường/xã:', error);
    }
  };


  // Handle City selection
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

  return (
    <>
      <div data-aos="fade-up" data-aos-duration="800">
        <Alert
          type="info"
          showIcon
          message="Vui lòng kiểm tra kỹ thông tin vận chuyển"
          description={
            <div className="text-gray-700 text-sm space-y-3 mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Địa chỉ giao hàng:</strong> là nơi người nhận sẽ nhận được đơn hàng. Đây là địa điểm mà khách hàng mong muốn nhận hàng.
                </li>
                <li>
                  <strong>Địa chỉ lấy hàng:</strong> là nơi bạn muốn đơn vị vận chuyển đến để nhận hàng từ bạn. Đây là địa điểm để đơn vị vận chuyển đến lấy hàng.
                </li>
                <li>
                  <strong>Lưu ý:</strong> Hãy đảm bảo bạn đã cung cấp thông tin địa chỉ đầy đủ và chính xác để tránh sai sót khi vận chuyển.
                </li>
              </ul>
            </div>
          }
        />
      </div>

      <div className="flex flex-col w-full">
        {selectedAddress ? (
          <div className="mt-4">

            {/* THÔNG TIN GIAO HÀNG */}
            <div data-aos="fade-right" data-aos-delay="100">
              <Card className="shadow-md border-blue-200 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <Typography.Title level={4} className="m-0">
                    <Space>
                      <HomeOutlined className="text-blue-500 animate-pulse" />
                      THÔNG TIN GIAO HÀNG
                    </Space>
                  </Typography.Title>
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    className="hover:scale-105 transition-transform"
                  >
                    Thay đổi
                  </Button>
                </div>

                <Descriptions bordered size="small" column={1} className="bg-green-50 rounded-md">
                  {/* Tên người nhận hàng */}
                  <Descriptions.Item
                    label={
                      <Space>
                        <UserOutlined className="text-green-600" />
                        <span>Người nhận hàng</span>
                      </Space>
                    }
                  >
                    <Typography.Text>{selectedPickupAddress?.full_name}</Typography.Text>
                  </Descriptions.Item>

                  {/* Số điện thoại người nhận */}
                  <Descriptions.Item
                    label={
                      <Space>
                        <PhoneOutlined className="text-green-600" />
                        <span>Số điện thoại</span>
                      </Space>
                    }
                  >
                    <Typography.Text>{PhoneSplitter(selectedPickupAddress?.phone_number)}</Typography.Text>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <Space>
                        <EnvironmentOutlined className="text-green-600" />
                        <span>Địa chỉ</span>
                      </Space>
                    }
                  >
                    <Typography.Text>
                      {selectedPickupAddress?.detail}, {selectedPickupAddress?.ward_name}, {selectedPickupAddress?.district_name}, {selectedPickupAddress?.province_name}
                    </Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>

            {/* Animation giữa 2 cards - Truck Movement */}
            <div data-aos="zoom-in" data-aos-delay="300" className="flex justify-center py-4">
              <div className="delivery-animation">
                <div className="truck-container">
                  <TruckOutlined className="text-3xl text-blue-600 truck-icon" />
                  <div className="road"></div>
                </div>
              </div>
            </div>

            {/* THÔNG TIN LẤY HÀNG */}
            <div data-aos="fade-left" data-aos-delay="200">
              <Card className="mb-4 shadow-md border-orange-200 overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                  <Typography.Title level={4} className="m-0">
                    <Space>
                      <TruckOutlined className="text-orange-500" />
                      THÔNG TIN LẤY HÀNG
                    </Space>
                  </Typography.Title>
                  <Button
                    type="primary"
                    ghost
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => setIsModalVisible(true)}
                    className="hover:scale-105 transition-transform"
                  >
                    Thay đổi
                  </Button>
                </div>

                <Descriptions bordered size="small" column={1} className="bg-blue-50 rounded-md">
                  {/* Tên Người nhận */}
                  <Descriptions.Item
                    label={
                      <Space>
                        <UserOutlined className="text-blue-600" />
                        <span>Người giao hàng</span>
                      </Space>
                    }
                  >
                    <Typography.Text>{selectedAddress?.full_name}</Typography.Text>
                  </Descriptions.Item>

                  {/* Số điện thoại */}
                  <Descriptions.Item
                    label={
                      <Space>
                        <PhoneOutlined className="text-blue-600" />
                        <span>Số điện thoại</span>
                      </Space>
                    }
                  >
                    <Typography.Text>{PhoneSplitter(selectedAddress?.phone_number)}</Typography.Text>
                  </Descriptions.Item>

                  <Descriptions.Item
                    label={
                      <Space>
                        <EnvironmentOutlined className="text-blue-600" />
                        <span>Địa chỉ</span>
                      </Space>
                    }
                  >
                    <Typography.Text >
                      {selectedAddress?.detail}, {selectedAddress?.ward_name}, {selectedAddress?.district_name}, {selectedAddress?.province_name}
                    </Typography.Text>
                  </Descriptions.Item>
                </Descriptions>
              </Card>
            </div>
          </div>
        ) : (
          <>
            <div
              data-aos="zoom-in"
              data-aos-duration="1000"
              className="border border-dashed border-gray-300 rounded-lg p-8 mt-4 bg-gray-50 hover:shadow-md transition-all"
            >
              <div className="flex flex-col items-center justify-center text-center">
                <div className="text-5xl text-gray-300 mb-4 animate-bounce">
                  <EnvironmentOutlined className="text-6xl text-gray-400" />
                </div>
                <Typography.Text className="text-lg font-medium mb-2">Chưa có địa chỉ giao hàng & nhận hàng</Typography.Text>
                <Typography.Text className="text-gray-500 mb-6">Bạn cần cung cấp địa chỉ Giao Hàng và địa chỉ Nhận Hàng cho việc trao đổi.</Typography.Text>
                <Button
                  type="primary"
                  onClick={() => setIsModalVisible(true)}
                  className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transform transition-all duration-300"
                  size="large"
                  icon={<PlusOutlined />}
                >
                  Thêm mới địa chỉ
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Modal Chọn & Thêm Địa Chỉ Giao & Nhận Gundam */}
        <Modal
          title={<h2 className="text-xl font-bold text-blue-600">THÔNG TIN ĐỊA CHỈ</h2>}
          open={isModalVisible}
          onCancel={() => {
            setIsModalVisible(false);
            setIsAdding(false);
            setIsUpdate(false);
            setCurrentAddressId(null);
            form.resetFields();
          }}
          footer={null}
          width={600}
          centered
        >
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <Tabs.TabPane tab="Địa chỉ đã lưu" key="1">
              {addresses.length > 0 ? (
                <div className="grid gap-3">
                  {addresses.map((addr, index) => (
                    <div
                      key={addr.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      onClick={() => {
                        setUserAddress(addr);

                        // Update parent component states
                        if (addr.is_primary) {
                          isPrimary(addr);
                        }
                        if (addr.is_pickup_address) {
                          isPickupAddress(addr);
                        }
                      }}
                      className={`transition-all duration-200 rounded-lg border cursor-pointer p-4 hover:shadow-md ${userAddress?.id === addr.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 bg-white'
                        }`}
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <p className="font-semibold text-gray-800">
                            {addr.full_name} ({addr.phone_number})
                          </p>
                          <p className="text-gray-600 text-sm mt-1">
                            {addr.detail}, {addr.ward_name}, {addr.district_name}, {addr.province_name}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(addr);
                            }}
                            className="text-sm hover:scale-105 transition-transform"
                          >
                            Chỉnh sửa
                          </Button>
                          {!addr.is_primary && (
                            <Button
                              size="small"
                              danger
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr);
                              }}
                              className="text-sm hover:scale-105 transition-transform"
                            >
                              Xóa
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center space-x-2">
                        {addr.is_primary ? (
                          <span className="px-2 py-0.5 text-xs font-medium text-white bg-red-500 rounded shadow animate-pulse">
                            Địa chỉ giao hàng
                          </span>
                        ) : (
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPrimaryAddress(addr.id);
                            }}
                            className="text-sm hover:bg-red-50 hover:text-red-500"
                          >
                            Đặt làm địa chỉ giao hàng
                          </Button>
                        )}

                        {addr.is_pickup_address ? (
                          <span className="px-2 py-1 text-xs font-semibold text-white bg-blue-500 rounded animate-pulse">
                            Địa chỉ lấy hàng
                          </span>
                        ) : (
                          <Button
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              setPickupAddress(addr.id);
                            }}
                            className="hover:bg-blue-50 hover:text-blue-500"
                          >
                            Đặt làm địa chỉ lấy hàng
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div data-aos="fade-in" data-aos-duration="800">
                  <Empty
                    description="Bạn chưa có địa chỉ nào"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    className="my-8"
                  />
                </div>
              )}

              <div className="mt-4 text-right" data-aos="fade-up">
                <Button
                  type="primary"
                  onClick={() => handleAdding()}
                  className="bg-blue-500 hover:scale-105 transition-all duration-300"
                >
                  Thêm địa chỉ mới
                </Button>
              </div>
            </Tabs.TabPane>

            <Tabs.TabPane tab={isUpdate ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"} key="2">
              <Form
                form={form}
                layout="vertical"
                onFinish={handleAdding}
                className="gap-4 mt-4"
              >
                <div data-aos="fade-right" data-aos-duration="600">
                  <Form.Item
                    label="Thành phố"
                    name="city"
                    rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
                    className="col-span-1"
                  >
                    <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                      {cities.map((city) => (
                        <Option key={city.ProvinceID} value={city.ProvinceID}>
                          {city.ProvinceName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </div>

                <div data-aos="fade-right" data-aos-duration="600" data-aos-delay="100">
                  <Form.Item
                    label="Quận/Huyện"
                    name="district"
                    rules={[{ required: true, message: 'Vui lòng chọn quận/huyện' }]}
                    className="col-span-1"
                  >
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
                </div>

                <div data-aos="fade-right" data-aos-duration="600" data-aos-delay="200">
                  <Form.Item
                    label="Phường/Xã"
                    name="ward"
                    rules={[{ required: true, message: 'Vui lòng chọn phường/xã' }]}
                    className="col-span-1"
                  >
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
                </div>

                <div data-aos="fade-left" data-aos-duration="600" data-aos-delay="100">
                  <Form.Item
                    label="Địa chỉ cụ thể"
                    name="detail"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]}
                    className="col-span-1"
                  >
                    <Input placeholder="Ví dụ: Số nhà, tên đường..." />
                  </Form.Item>
                </div>

                <div data-aos="fade-left" data-aos-duration="600" data-aos-delay="200">
                  <Form.Item
                    label="Số điện thoại"
                    name="phone_number"
                    rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
                    tooltip={{
                      title: 'Số điện thoại dùng để xác nhận bên vận chuyển khi giao hàng. Để trống sẽ mặc định lấy sđt của người dùng.',
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input placeholder="Nhập số điện thoại" />
                  </Form.Item>
                </div>

                <div data-aos="fade-left" data-aos-duration="600" data-aos-delay="300">
                  <Form.Item
                    label="Người nhận"
                    name="full_name"
                    tooltip={{
                      title: 'Tên người sẽ giao/nhận sản phẩm. Để trống sẽ mặc định lấy tên của người dùng.',
                      icon: <InfoCircleOutlined />,
                    }}
                  >
                    <Input placeholder="Nhập tên người nhận..." />
                  </Form.Item>
                </div>

                <div data-aos="zoom-in" data-aos-duration="600" data-aos-delay="400">
                  <Form.Item className="col-span-2 -mt-2">
                    <Checkbox
                      checked={isPrimary}
                      onChange={(e) => setIsPrimary(e.target.checked)}
                      className="text-sm"
                    >
                      Đặt làm địa chỉ nhận hàng mặc định
                    </Checkbox>
                  </Form.Item>

                  <Form.Item>
                    <Checkbox
                      checked={isPickupAddress}
                      onChange={(e) => setIsPickupAddress(e.target.checked)}
                    >
                      Đặt làm địa chỉ giao hàng mặc định
                    </Checkbox>
                  </Form.Item>
                </div>

                <Form.Item className="col-span-full flex justify-end gap-2" data-aos="fade-up" data-aos-duration="800">
                  <Button
                    onClick={() => {
                      setActiveTab("1");
                      setIsUpdate(false);
                      setCurrentAddressId(null);
                      form.resetFields();
                    }}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="bg-blue-500 hover:bg-blue-600 hover:scale-105 transition-all duration-300"
                    loading={loading}
                  >
                    {isUpdate ? "Cập nhật" : "Lưu địa chỉ"}
                  </Button>
                </Form.Item>
              </Form>
            </Tabs.TabPane>
          </Tabs>
        </Modal>
      </div>
    </>
  )
}

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