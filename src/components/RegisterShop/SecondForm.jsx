import { Button, Form, Input, message, Modal, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";
import { getUserAddresses, postUserAddresses } from "../../apis/User/APIUserProfile";

const { Option } = Select;

const SecondForm = ({ user, setUser }) => {

    const [form] = Form.useForm();

    useEffect(() => {
        console.log("User info Second Form:", user);
    }, [])

    const [loading, setLoading] = useState(false);
    const [addresses, setAddresses] = useState([]);

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);

    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);

    const [isPickupAddress, setIsPickupAddress] = useState(false);
    const [isPrimary, setIsPrimary] = useState(true);

    // const user = useSelector((state) => state.auth.user);
    const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';

    const api = axios.create({
        baseURL: ghn_api,
        headers: {
            'Content-Type': 'application/json',
            'token': import.meta.env.VITE_GHN_TOKEN_API
        }
    });


    useEffect(() => {
        const fetchUserAddresses = async () => {
            try {
                // setLoading(true);
                const response = await getUserAddresses(user?.id);
                setAddresses(response?.data);

                console.log("Fetch User Address:", response);

            } catch (error) {
                console.error('Lỗi khi lấy danh sách địa chỉ:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserAddresses();
    }, [])


    // Hàm Submit thêm Địa chỉ mới
    const handleAddNewAddress = async (values) => {

        console.log("Submit Form:", values);


        const city = cities.find(city => city.ProvinceID === values.city);
        const district = districts.find(district => district.DistrictID === values.district);
        const ward = wards.find(ward => ward.WardCode === values.ward);

        const addressData = {
            full_name: user.full_name,
            phone_number: user.phone_number,
            
            detail: values.address,
            ghn_ward_code: values.ward,
            ghn_district_id: values.district,

            ward_name: ward ? ward.WardName : "",
            province_name: city ? city.ProvinceName : "",
            district_name: district ? district.DistrictName : "",
            
            
            is_pickup_address: isPickupAddress,
            is_primary: isPrimary
        };

        try {
            await postUserAddresses(user?.id, addressData);

            // console.log("Submit New address:", response);

            message.success("Thêm địa chỉ thành công!");
            // fetchUserAddresses();
            // setIsModalVisible(false);
            form.resetFields();
            setIsPickupAddress(false);
            setIsPrimary(true);
        } catch (error) {
            message.error("Lỗi khi thêm địa chỉ!");
            console.error(error);
        }
    };

    // Fetch List tất cả Thành phố khi khởi chạy Component
    useEffect(() => {
        fetchProvinces();
    }, []);


    // Fetch API List Thành Phố
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


    // Fetch API List Quận/huyện
    const fetchDistricts = async (province_id) => {
        try {
            const response = await api.post(`district`, { province_id });
            setDistricts(response.data.data);
        } catch (error) {
            console.error('Lỗi khi fetch quận:', error);
        }
    };


    // Fetch API List Phường/xã
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


    return (
        <>
            <div className="max-w-2xl mx-auto">
                <h2 className="text-xl font-bold">THÔNG TIN ĐỊA CHỈ LẤY HÀNG</h2>
                <p className="text-gray-500">
                    Chúng tôi có địa chỉ lấy hàng của bạn để thực hiện việc vận chuyển dễ dàng hơn.
                </p>
                <p className="text-red-500 italic text-sm">
                    Lưu ý: Chỉ ghi nhận 1 địa chỉ duy nhất.
                </p>

                {user?.address ? (
                    <div className="border p-4 rounded bg-gray-100 mt-4">
                        <p className="font-semibold">Địa chỉ của bạn:</p>
                        <p>{user.address}, {user.ward}, {user.district}, {user.city}</p>
                        <Button type="link" onClick={() => setModalVisible(true)}>Chỉnh sửa</Button>
                    </div>
                ) : (
                    <>
                        <div className="mt-4">
                            <p className="font-semibold">Bạn chưa có địa chỉ</p>
                        </div>

                        <Button type="primary" className="mt-4 bg-blue-500" onClick={() => setModalVisible(true)}>
                            + Thêm mới địa chỉ
                        </Button>
                    </>

                )}

                {/* Modal nhập địa chỉ */}
                <Modal
                    title="Thêm địa chỉ mới"
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisible(false)}>Hủy</Button>,
                        <Button
                            key="submit"
                            className="bg-blue-500"
                            type="primary"
                            onClick={async () => {
                                try {
                                    const values = await form.validateFields();
                                    console.log("📌 Dữ liệu từ Form:", values); // ✅ Kiểm tra dữ liệu trước khi gọi API
                                    handleAddNewAddress(values);
                                } catch (error) {
                                    console.error("❌ Validation Error:", error);
                                }
                            }}

                        >Lưu</Button>,
                    ]}
                >
                    <Form
                        form={form}
                        layout="horizontal"
                        labelCol={{
                            span: 6,
                        }}
                        wrapperCol={{
                            span: 16,
                        }}
                    >
                        {/* Chọn Thành phố */}
                        <Form.Item label="Tỉnh/Thành phố" name="city" rules={[{ required: true }]}>
                            <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                                {cities.map((city) => (
                                    <Option key={city.ProvinceID} value={city.ProvinceID}>
                                        {city.ProvinceName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Chọn Quận/huyện */}
                        <Form.Item label="Quận/Huyện" name="district" rules={[{ required: true }]}>
                            <Select onChange={handleDistrictChange} placeholder="Chọn quận/huyện" disabled={!selectedCity}>
                                {districts.map((district) => (
                                    <Option key={district.DistrictID} value={district.DistrictID}>
                                        {district.DistrictName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Chọn Phường/xã */}
                        <Form.Item label="Phường/Xã" name="ward" rules={[{ required: true }]}>
                            <Select placeholder="Chọn phường/xã" disabled={!selectedDistrict}>
                                {wards.map((ward) => (
                                    <Option key={ward.WardCode} value={ward.WardCode}>
                                        {ward.WardName}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        {/* Nhập địa chỉ cụ thể */}
                        <Form.Item label="Địa chỉ cụ thể" name="address" rules={[{ required: true }]}>
                            <Input placeholder="Nhập số nhà, tên đường" />
                        </Form.Item>
                    </Form>
                </Modal>
            </div>


            {/* <div className="max-w-2xl mx-auto">
                <div className="second-form-header">
                    <h2 className="text-xl font-bold">NHẬP THÔNG TIN LẤY HÀNG</h2>
                    <p className="text-gray-500">
                        Địa chỉ nơi thuận tiện nhất của bạn để dịch vụ giao hàng của chúng tôi có thể đến lấy hàng và tiến hành giao hàng.
                    </p>
                    <p className="text-red-500 italic text-sm">Lưu ý: Chỉ ghi nhận 1 địa chỉ duy nhất.</p>
                </div>

               
                <div className="grid grid-cols-3 gap-4 mt-4">
                  
                    <Form.Item
                        label={<span className="font-semibold">Tỉnh/Thành phố</span>}
                        name="city"
                        rules={[{ required: true }]}>
                        <Select onChange={handleCityChange} placeholder="Chọn thành phố">
                            {cities.map((city) => (
                                <Option key={city.ProvinceID} value={city.ProvinceID}>
                                    {city.ProvinceName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                   
                    <Form.Item
                        label={<span className="font-semibold">Quận/Huyện</span>}
                        name="district"
                        rules={[{ required: true }]}>
                        <Select onChange={handleDistrictChange} placeholder="Chọn quận/huyện" disabled={!selectedCity}>
                            {districts.map((district) => (
                                <Option key={district.DistrictID} value={district.DistrictID}>
                                    {district.DistrictName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>

                  
                    <Form.Item
                        label={<span className="font-semibold">Phường/Xã</span>}
                        name="ward"
                        rules={[{ required: true }]}>
                        <Select placeholder="Chọn phường/xã" disabled={!selectedDistrict}>
                            {wards.map((ward) => (
                                <Option key={ward.WardCode} value={ward.WardCode}>
                                    {ward.WardName}
                                </Option>
                            ))}
                        </Select>
                    </Form.Item>
                </div>

             
                <Form.Item
                    label={<span className="font-semibold">Địa chỉ cụ thể (Số nhà, tên đường)</span>}
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
                >
                    <Input placeholder="Ví dụ: 123/32 Hòa Bình" />
                </Form.Item>
            </div> */}
        </>
    );
};

export default SecondForm;
