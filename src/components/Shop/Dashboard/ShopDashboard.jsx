import { Tabs, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { BarChartOutlined, ShopOutlined } from '@ant-design/icons';

import { getUserAddresses } from '../../../apis/User/APIUser';

// Import components
import DashboardTab from './DashboardTab';
import ShopInfoTab from './ShopInfoTab';

import { updateShopInfo } from '../../../features/user/userSlice';
import { GetShopInfoById, UpdateShopName } from '../../../apis/Seller Profile/APISellerProfile';
import ShopUpgradePlan from './ShopUpgradePlan';

const { TabPane } = Tabs;

const ShopDashboard = () => {
  // State management
  const [shopInfo, setShopInfo] = useState({});
  const [originalShopName, setOriginalShopName] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [formattedShopData, setFormattedShopData] = useState({});

  // const userId = useSelector((state) => state.auth.user.id);
  const user = useSelector((state) => state.auth.user);
  const sellerPlan = useSelector((state) => state.user.sellerPlan);
  const dispatch = useDispatch()


  // Mock shop data for charts
  const shopData = [
    { city: 'Hcm', type: 'Card', value: 14500 },
    { city: 'Hcm', type: 'Figure', value: 8500 },
    { city: 'Hcm', type: 'Gundam', value: 10000 },
    { city: 'Hcm', type: 'Rider Belt', value: 7000 },
    { city: 'HN', type: 'Card', value: 9000 },
    { city: 'HN', type: 'Figure', value: 8500 },
    { city: 'HN', type: 'Gundam', value: 11000 },
    { city: 'HN', type: 'Rider Belt', value: 6000 },
    { city: 'HA', type: 'Card', value: 14000 },
    { city: 'HA', type: 'Figure', value: 9000 },
    { city: 'HA', type: 'Gundam', value: 10000 },
    { city: 'HA', type: 'Rider Belt', value: 9000 },
    { city: 'DN', type: 'Card', value: 9000 },
    { city: 'DN', type: 'Figure', value: 8500 },
    { city: 'DN', type: 'Gundam', value: 10000 },
    { city: 'DN', type: 'Rider Belt', value: 6000 },
    { city: 'QN', type: 'Card', value: 18000 },
    { city: 'QN', type: 'Figure', value: 11000 },
    { city: 'QN', type: 'Gundam', value: 15000 },
    { city: 'QN', type: 'Rider Belt', value: 14000 },
  ];

  // Fetch initial data
  useEffect(() => {
    console.log(sellerPlan);
    // Get InfoShop
    GetShopInfoById(user.id)
      .then((res) => {
        setShopInfo(res.data.seller_profile.shop_name);
        setOriginalShopName(res.data.seller_profile.shop_name);
        // console.log("res info", res);

      })
      .catch((error) => {
        console.error("Error fetching shopInfo: ", error);
      });

    // Get user addresses
    getUserAddresses(user.id)
      .then((res) => {
        setAddresses(res.data);
      })
      .catch((error) => {
        console.error("Error fetching seller address status: ", error);
      });
  }, [user.id]);


  // Combine shop info and address data
  useEffect(() => {
    if (Object.keys(shopInfo).length > 0 && addresses.length > 0) {
      // Dò tìm address Nhận hàng (is_pickup_address)
      const pickupAddress = addresses.find(addr => addr.is_pickup_address === true) || addresses[0];

      // Format Address để hiển thị
      const formattedAddress = pickupAddress ?
        `${pickupAddress.detail}, ${pickupAddress.ward_name}, ${pickupAddress.district_name}, ${pickupAddress.province_name}` :
        "Chưa thiết lập địa chỉ lấy hàng";

      // Combine shop info with address
      const combinedData = {
        ...shopInfo,
        pickup_address: formattedAddress
      };

      setFormattedShopData(combinedData);
    }
  }, [shopInfo, addresses]);


  // HÀM CẬP NHẬT SHOP NAME
  const handleShopInfoUpdate = async (values) => {
    try {
      // Giả sử values là một đối tượng có thuộc tính shop_name
      const newShopName = values.shop_name || values;

      // Gọi API để cập nhật tên shop
      await UpdateShopName(newShopName, user.id);
      // console.log("res update shop_name", res);

      // console.log("shopInfo trigger", shopInfo);

      // Cập nhật state shopInfo
      const updatedShopInfo = {
        ...shopInfo,
        shop_name: newShopName
      };

      // console.log("Update ShopInfo into state", updatedShopInfo);

      // Cập nhật state và Redux
      setShopInfo(updatedShopInfo);
      setOriginalShopName(newShopName);
      dispatch(updateShopInfo(updatedShopInfo));

      // Cập nhật formattedShopData
      setFormattedShopData(prev => ({
        ...prev,
        shop_name: newShopName
      }));

      message.success('Cập nhật thông tin shop thành công!');
    } catch (error) {
      console.log("Error update ShopInfo:", error);
      message.error('Cập nhật thông tin shop thất bại!');
    }
  };

  return (
    <div>
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Dashboard
            </span>
          }
          key="1"
        >
          <DashboardTab shopData={shopData} />
        </TabPane>

        <TabPane
          tab={
            <span>
              <ShopOutlined />
              Thông tin Shop
            </span>
          }
          key="2"
        >
          <ShopInfoTab
            shopInfo={formattedShopData}
            originalShopName={originalShopName}
            onUpdateShopInfo={handleShopInfoUpdate}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <ShopOutlined />
              Gói dịch vụ
            </span>
          }
          key="3"
        >
          <ShopUpgradePlan
            shopInfo={formattedShopData}
            sellerPlan={sellerPlan}
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;