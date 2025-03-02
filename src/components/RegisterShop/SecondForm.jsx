import { Form, Input, Select } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

const { Option } = Select;

const SecondForm = () => {

    const [cities, setCities] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedCity, setSelectedCity] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    // const [addresses, setAddresses] = useState([]);

    // const [loading, setLoading] = useState(false);

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
        fetchProvinces();
        // fetchUserAddresses();
    }, []);


    // const fetchUserAddresses = async () => {
    //     try {
    //       setLoading(true);
    //       const response = await getUserAddresses(user.id);
    //       setAddresses(response.data);
    //     } catch (error) {
    //       console.error('Lỗi khi lấy danh sách địa chỉ:', error);
    //     } finally {
    //       setLoading(false);
    //     }
    //   };

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


    return (
        <>

            <div className="max-w-2xl mx-auto">
                <div className="second-form-header">
                    <h2 className="text-xl font-bold">NHẬP THÔNG TIN GIAO HÀNG</h2>
                    <p className="text-gray-500">
                        Địa chỉ nơi thuận tiện nhất của bạn để dịch vụ giao hàng của chúng tôi có thể đến lấy hàng và tiến hành giao hàng.
                    </p>
                    <p className="text-red-500 italic text-sm">Lưu ý: Chỉ ghi nhận 1 địa chỉ duy nhất.</p>
                </div>

                {/* Row chứa 3 Select: Tỉnh/Thành phố - Quận/Huyện - Phường/Xã */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                    {/* Tỉnh/Thành phố */}
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

                    {/* Quận/Huyện */}
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

                    {/* Phường/Xã */}
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

                {/* Địa chỉ cụ thể */}
                <Form.Item
                    label={<span className="font-semibold">Địa chỉ cụ thể (Số nhà, tên đường)</span>}
                    name="address"
                    rules={[{ required: true, message: "Vui lòng nhập địa chỉ cụ thể!" }]}
                >
                    <Input placeholder="Ví dụ: 123/32 Hòa Bình" />
                </Form.Item>
            </div>
        </>
    );
};

export default SecondForm;
