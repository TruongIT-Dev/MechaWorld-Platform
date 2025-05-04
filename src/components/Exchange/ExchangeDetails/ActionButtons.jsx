import { useEffect, useState } from 'react';
import { Button, Modal, Alert, Space, notification } from 'antd';
import { MonitorCheck, House,CreditCardIcon, PackageCheck } from 'lucide-react';
import PropTypes from 'prop-types';
import { addressExchange } from '../../../apis/Exchange/APIExchange';
import { useDispatch } from 'react-redux';
import { updateDeliveryFee, updateExchangeData } from '../../../features/exchange/exchangeSlice';
import { checkDeliveryFee } from '../../../apis/GHN/APIGHN';

const ActionButtons = ({ 
  exchangeDetail, 
  currentStage, 
  oppositeCurrentStage,
  setSecondCurrentStage,
  setFirstCurrentStage, 
  selectedAddress,
  selectedPickupAddress,
}) => {
  const [isAddressModalVisible, setIsAddressModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [stageButton, setStageButton] = useState();
  const dispatch = useDispatch();
  // Function to update the stage
  const moveToNextStage = () => {
    setFirstCurrentStage(stageButton + 1);
  };
  // const cacheDeliveryFee = (userId, exchangeId, fee) => {
  //   const key = `${userId}_${exchangeId}`;
  //   localStorage.setItem(key, JSON.stringify(fee));
  //   sessionStorage.setItem(key, JSON.stringify(fee));
  // };
  const handleDeliverFee = () => {
    console.log("111");
    // dispatch(updateExchangeData(exchangeDetail))
        const deliverData ={
          service_type_id:2,
          from_district_id:exchangeDetail.partner.from_address.ghn_district_id,
          from_ward_code: exchangeDetail.partner.from_address.ghn_ward_code,
          to_district_id:exchangeDetail.current_user.to_address.ghn_district_id,
          to_ward_code:exchangeDetail.current_user.to_address.ghn_ward_code,
          length:30,
          width:40,
          height:20,
          weight:exchangeDetail.partner.items[0].weight,
          insurance_value:0,
          coupon: null
        }
        checkDeliveryFee(deliverData).then((res) => {
            if (res.status === 200) {
            const deliveryData = {
              deliveryFee: res.data.data,
              userID: exchangeDetail.current_user.id,
              exchange_id: exchangeDetail.id,
            };
            dispatch(updateDeliveryFee(deliveryData));
            console.log("nhập phí vận chuyển",res.data.data);
            moveToNextStage();
            setIsAddressModalVisible(false);
          } else {
            console.log("xảy ra lỗi");
          }
        })
  }
  // Handler for stage 1 - Confirm transaction
  const handleConfirmTransaction = () => {
    console.log("Confirming transaction...");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // addressExchange(selectedPickupAddress.id,selectedAddress.id).then((res) => {
      //   if (res.status === 200) {
      //     moveToNextStage();
      //     notification.success({
      //       message: "Xác nhận cung cấp thông tin giao hàng",
      //       description: "Vui lòng "
      //     });
      //   }
      // })
      
    }, 500);
  };

  // Handler for stage 2 - Show address confirmation modal
  const showAddressConfirmationModal = () => {
    if (!selectedAddress) {
      notification.error({
        message: "Không tìm thấy địa chỉ",
        description: "Vui lòng chọn địa chỉ nhận hàng trước khi tiếp tục"
      });
      return;
    }
    if (!selectedPickupAddress) {
      notification.error({
        message: "Không tìm thấy địa chỉ",
        description: "Vui lòng chọn địa chỉ giao hàng trước khi tiếp tục"
      });
      return;
    }
    setIsAddressModalVisible(true);
  };

  // Handler for stage 2 - Submit address confirmation
  const handleAddressConfirmation = () => {
    console.log("Confirming delivery address:", selectedAddress);
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      addressExchange(exchangeDetail.id,selectedAddress.id,selectedPickupAddress.id).then((res) => {
        if (res.status === 200) {
          moveToNextStage();
          notification.success({
            message: "Xác nhận địa chỉ thành công",
            description: "Vui lòng tiến hành thanh toán để hoàn tất giao dịch"
          });
        }
      })
      setIsAddressModalVisible(false);
      
    }, 1000);
  };

  // Handler for stage 3 - Process payment
  const handlePayment = () => {
    console.log("Processing payment...");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      moveToNextStage();
      notification.success({
        message: "Thanh toán thành công",
        description: "Thanh toán đã được xử lý, bạn có thể tiếp tục theo dõi đơn hàng"
      });
    }, 1500);
  };
  useEffect(() => {
    setStageButton(currentStage);
  },[currentStage])
  // Handler for stage 4 - Confirm delivery
  const handleConfirmDelivery = () => {
    console.log("Confirming delivery...");
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      moveToNextStage();
      notification.success({
        message: "Xác nhận nhận hàng thành công",
        description: "Trao đổi đã được hoàn tất"
      });
    }, 1000);
  };

  // Render button based on current stage
  const renderActionButton = () => {
    if (stageButton > 5) {
      return null; // No action buttons for completed exchanges
    }

    // If current user is waiting for partner
    if (exchangeDetail && oppositeCurrentStage < stageButton) {
      return (
        <Button 
          disabled 
          block 
          className="bg-gray-200 text-gray-500"
        >
          Đang chờ người đối diện thực hiện...
        </Button>
      );
    }

    switch (stageButton) {
      case 1:
        return (
          <Button 
            type="primary" 
            icon={<MonitorCheck />} 
            size="large" 
            onClick={handleAddressConfirmation} 
            loading={isLoading}
            block
            className="bg-blue-500 hover:bg-blue-600"
          >
            Xác nhận địa chỉ giao hàng
          </Button>
        );
      
      case 2:
        return (
          <Button 
            type="primary" 
            icon={<House />} 
            size="large" 
            onClick={showAddressConfirmationModal} 
            loading={isLoading}
            block
            className="bg-blue-500 hover:bg-blue-600"
          >
            Xác nhận thông tin giao - nhận hàng
          </Button>
        );
      
      case 3:
        return (
          <Button 
            type="primary" 
            icon={<CreditCardIcon />} 
            size="large" 
            onClick={handlePayment} 
            loading={isLoading}
            block
            className="bg-blue-500 hover:bg-blue-600"
          >
            Thanh toán
          </Button>
        );
      case 4:
        return (
          <Button 
            type="primary" 
            icon={<PackageCheck />} 
            size="large" 
            onClick={handleConfirmDelivery} 
            loading={isLoading}
            block
            className="bg-blue-500 hover:bg-blue-600"
          >
            Xác nhận đã nhận hàng
          </Button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full mt-6 mb-8">
      {renderActionButton()}

      {/* Address Confirmation Modal */}
      <Modal
        title="Xác nhận địa chỉ giao hàng"
        open={isAddressModalVisible}
        onCancel={() => setIsAddressModalVisible(false)}
        footer={null}
      >
        <div className="py-4">
          <Alert
            type="warning"
            showIcon
            message="Lưu ý quan trọng"
            description="Sau khi chấp nhận, hệ thống sẽ ghi nhận địa chỉ giao hàng của bạn và bạn không thể thay đổi địa chỉ này."
            className="mb-4"
          />

          {/* {selectedAddress && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Thông tin địa chỉ nhận hàng</h3>
              <p><strong>Họ tên:</strong> {selectedAddress.full_name}</p>
              <p><strong>Số điện thoại:</strong> {selectedAddress.phone_number}</p>
              <p><strong>Địa chỉ:</strong> {selectedAddress.detail}, {selectedAddress.ward_name}, {selectedAddress.district_name}, {selectedAddress.province_name}</p>
            </div>
          )}
          {selectedPickupAddress && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h3 className="font-medium mb-2">Thông tin địa chỉ giao hàng</h3>
              <p><strong>Họ tên:</strong> {selectedPickupAddress.full_name}</p>
              <p><strong>Số điện thoại:</strong> {selectedPickupAddress.phone_number}</p>
              <p><strong>Địa chỉ:</strong> {selectedPickupAddress.detail}, {selectedPickupAddress.ward_name}, {selectedPickupAddress.district_name}, {selectedPickupAddress.province_name}</p>
            </div>
          )} */}

          <Space className="w-full justify-end">
            <Button onClick={() => setIsAddressModalVisible(false)}>
              Hủy
            </Button>
            <Button 
              type="primary" 
              onClick={handleDeliverFee}
              loading={isLoading}
              className="bg-blue-500"
            >
              Xác nhận
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
};

ActionButtons.propTypes = {
  exchangeDetail: PropTypes.object.isRequired,
  currentStage: PropTypes.number.isRequired,
  oppositeCurrentStage: PropTypes.number.isRequired,
  setFirstCurrentStage: PropTypes.func,
  setSecondCurrentStage: PropTypes.func,
  selectedAddress: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string,
    phone_number: PropTypes.string,
    detail: PropTypes.string,
    ward_name: PropTypes.string,
    district_name: PropTypes.string,
    province_name: PropTypes.string
  }),
  selectedPickupAddress: PropTypes.shape({
    id: PropTypes.number.isRequired,
    full_name: PropTypes.string,
    phone_number: PropTypes.string,
    detail: PropTypes.string,
    ward_name: PropTypes.string,
    district_name: PropTypes.string,
    province_name: PropTypes.string
  }),
};

export default ActionButtons;