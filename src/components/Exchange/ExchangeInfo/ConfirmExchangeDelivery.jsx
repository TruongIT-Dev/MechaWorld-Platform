import { useState } from 'react';
import { Card, Button, Avatar, Divider, Empty, Tag } from 'antd';
import { ArrowLeftRight, House, MapPinIcon, PhoneIcon, UserIcon } from 'lucide-react';
import PropTypes from 'prop-types';

const ConfirmExchangeDelivery = ({ exchangeDetail }) => {
  const [showCurrentUser, setShowCurrentUser] = useState(true);
  
  // Extract data from exchangeDetail
  const currentUser = exchangeDetail?.current_user || {};
  const partner = exchangeDetail?.partner || {};
  console.log("exchangeDetail", exchangeDetail)
  // Format address function
  const formatAddress = (user) => {
    if (!user || !user.from_address) {
      return null;
    }
    
    return {
        delivery_full_name: user.from_address.full_name,
        pickup_full_name: user.to_address.full_name,
        avatar_url: user.avatar_url,
        delivery_address: user.from_address.detail + ', ' + 
                        user.from_address.ward_name + ', ' + 
                        user.from_address.district_name + ', ' + 
                        user.from_address.province_name,
        pickup_address: user.to_address.detail + ', ' + 
                        user.to_address.ward_name + ', ' + 
                        user.to_address.district_name + ', ' + 
                        user.to_address.province_name,
        delivery_phone_number: user.from_address.phone_number,
        pickup_phone_number: user.to_address.phone_number
    };
  };
  
  const currentUserAddress = formatAddress(currentUser);
  const partnerAddress = formatAddress(partner);
  
  // Toggle view function
  const toggleAddressView = () => {
    setShowCurrentUser(!showCurrentUser);
  };
  
  // Render address card
  const renderAddressCard = (addressData, isCurrentUser) => {
    if (!addressData) {
      return (
        <Card className="w-full border border-gray-300 rounded-lg shadow-sm">
          <Empty 
            description={
              isCurrentUser 
                ? "Bạn chưa nhập địa chỉ giao hàng" 
                : "Đối phương chưa nhập địa chỉ giao hàng"
            }
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }
    
    return (
    <>  
      <Card 
        className="w-full border border-gray-300 rounded-lg shadow-sm"
        title={
          <div className="flex items-center space-x-3">
            <House size={20} className="text-blue-500" />
            <span className="font-semibold text-lg">
              {isCurrentUser ? "Địa chỉ giao hàng của bạn" : "Địa chỉ giao hàng của đối tác"}
            </span>
            {isCurrentUser && <Tag color="blue">Của bạn</Tag>}
          </div>
        }
      >
        <div className="flex items-start space-x-4">
          {/* <Avatar 
            src={addressData.avatar_url} 
            size={64} 
            className="flex-shrink-0"
            icon={!addressData.avatar_url && <UserIcon />}
          /> */}
          
          <div className="flex-grow space-y-3">
            <div className="flex items-center space-x-2">
              <UserIcon size={16} className="text-gray-500" />
              <span className="font-medium text-lg">{addressData.delivery_full_name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <PhoneIcon size={16} className="text-gray-500" />
              <span>{addressData.delivery_phone_number}</span>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPinIcon size={16} className="text-gray-500 mt-1" />
              <span className="text-gray-700">{addressData.delivery_address}</span>
            </div>
          </div>
        </div>
      </Card>
      <Card 
        className="w-full border border-gray-300 rounded-lg shadow-sm"
        title={
          <div className="flex items-center space-x-3">
            <House size={20} className="text-blue-500" />
            <span className="font-semibold text-lg">
              {isCurrentUser ? "Địa chỉ nhận hàng của bạn" : "Địa chỉ giao nhận của đối tác"}
            </span>
            {isCurrentUser && <Tag color="blue">Của bạn</Tag>}
          </div>
        }
      >
        <div className="flex items-start space-x-4">
          {/* <Avatar 
            src={addressData.avatar_url} 
            size={64} 
            className="flex-shrink-0"
            icon={!addressData.avatar_url && <UserIcon />}
          /> */}
          
          <div className="flex-grow space-y-3">
            <div className="flex items-center space-x-2">
              <UserIcon size={16} className="text-gray-500" />
              <span className="font-medium text-lg">{addressData.pickup_full_name}</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <PhoneIcon size={16} className="text-gray-500" />
              <span>{addressData.pickup_phone_number}</span>
            </div>
            
            <div className="flex items-start space-x-2">
              <MapPinIcon size={16} className="text-gray-500 mt-1" />
              <span className="text-gray-700">{addressData.pickup_address}</span>
            </div>
          </div>
        </div>
      </Card>
    </>
    );
  };
  
  return (
    <div className="w-full mt-6 mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Xác nhận thông tin giao hàng</h2>
        <Button 
          type="default"
          icon={<ArrowLeftRight />}
          onClick={toggleAddressView}
          className="flex items-center"
        >
          {showCurrentUser 
            ? "Xem địa chỉ của đối tác" 
            : "Xem địa chỉ của bạn"}
        </Button>
      </div>
      <Divider className="my-4" />
      
      <div className="transition-all duration-300 ease-in-out">
        {showCurrentUser 
          ? renderAddressCard(currentUserAddress, true)
          : renderAddressCard(partnerAddress, false)
        }
      </div>
      
      <div className="mt-6 text-sm text-gray-500">
        <p className="flex items-start space-x-2">
          <span className="text-red-500 font-bold">*</span>
          <span>
            Vui lòng kiểm tra kỹ thông tin địa chỉ giao hàng. Sau khi xác nhận, địa chỉ này sẽ được 
            sử dụng cho việc vận chuyển và không thể thay đổi trong quá trình giao dịch.
          </span>
        </p>
      </div>
    </div>
  );
};

ConfirmExchangeDelivery.propTypes = {
  exchangeDetail: PropTypes.shape({
    current_user: PropTypes.shape({
      id: PropTypes.string,
      full_name: PropTypes.string,
      avatar_url: PropTypes.string,
      from_address: PropTypes.shape({
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
      to_address: PropTypes.shape({
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
    }),
    partner: PropTypes.shape({
      id: PropTypes.string,
      full_name: PropTypes.string,
      avatar_url: PropTypes.string,
      from_address: PropTypes.shape({
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
      to_address: PropTypes.shape({
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
      
    })
  }).isRequired
};

export default ConfirmExchangeDelivery;