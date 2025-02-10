import { useState, useEffect } from 'react';
import { Form, Select, Input, Button } from 'antd';
import axios from 'axios';

const { Option } = Select;

const SettingAddress = () => {
  const [form] = Form.useForm();
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const ghn_api = 'https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/';
  useEffect(() => {
    fetchProvinces();
  }, []);
  const api = axios.create({
    baseUR: ghn_api,
    headers: {
      'Content-Type': 'application/json',
      'token': import.meta.env.VITE_GHN_TOKEN_API
    }
  })

  const fetchProvinces = async () => {
    try {
      const response = await api.post(`${ghn_api}`+`province`);
      const data = response.data.data;
      console.log(data.data);
      setCities(data);
    } catch (error) {
      console.error('Lỗi khi fetch thành phố:', error);
    }
  };
  
  const fetchDistricts = async (province_id) => {
    try {
      const response = await api.get(`${ghn_api}`+`district`,{
        headers: {
          'province_id': province_id
        }
      }); 
      const data = response.data.data;
      setDistricts(data);
      const filteredDistricts = data.filter(district => district.ProvinceID === province_id);
      console.log(filteredDistricts);
      setDistricts(filteredDistricts);
    } catch (error) {
      console.error('Lỗi khi fetch quận:', error);
    }
  };
  
  const fetchWards = async (DistrictID) => {
    try {
      const response = await api.get(`${ghn_api}`+`ward?district_id=`+`${DistrictID}`);
      // const response = await api.get(`https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=`+`${DistrictID}`);
      const data = response.data.data;
      setWards(data);
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

  const onFinish = (values) => {
    console.log('Thông tin địa chỉ:', values);
    // Handle Address (ví dụ: gửi API, cập nhật state, ...)
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Lỗi validation:', errorInfo);
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
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

      <Form.Item label="Địa chỉ cụ thể" name="address" rules={[{ required: true }]}>
        <Input />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit"style={{backgroundColor:'palevioletred'}}>
          Lưu địa chỉ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default SettingAddress;