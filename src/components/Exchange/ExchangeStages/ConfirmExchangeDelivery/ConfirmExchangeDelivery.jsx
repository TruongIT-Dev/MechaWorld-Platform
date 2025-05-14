import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { EnvironmentOutlined, HomeOutlined, PhoneOutlined, SwapOutlined, TruckOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Button, Empty, Tag, Typography, Alert, Row, Col } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ConfirmExchangeDelivery = ({ exchangeDetail }) => {
  const [showCurrentUser, setShowCurrentUser] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
      mirror: true,
    });
  }, []);

  // Refresh AOS when view toggles
  useEffect(() => {
    AOS.refresh();
  }, [showCurrentUser]);

  // Extract data from exchangeDetail
  const partner = exchangeDetail?.partner || {};
  const currentUser = exchangeDetail?.current_user || {};

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
        <div data-aos="fade-up">
          <Card className="w-full border border-gray-300 rounded-lg shadow-sm">
            <Empty
              description={isCurrentUser
                ? "Bạn chưa gửi địa chỉ vận chuyển"
                : "Đối tác trao đổi chưa gửi thông tin địa chỉ vận chuyển."
              }
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        </div>
      );
    }

    return (
      <Row gutter={24}>
        <Col span={12}>
          {/* THÔNG TIN ĐỊA CHỈ GIAO HÀNG */}
          <div data-aos="fade-right" data-aos-delay="100" data-aos-duration="1000">
            <Card
              className="w-full rounded-2xl border border-gray-200 shadow-md"
              title={
                <div className="flex items-center gap-3">
                  <HomeOutlined className="text-blue-500 text-xl" />
                  <span className="text-base font-semibold uppercase">
                    {isCurrentUser ? "Thông tin giao hàng" : "Thông tin giao hàng"}
                  </span>
                  {isCurrentUser ? (<Tag color="blue">CỦA BẠN</Tag>) : (<Tag color="cyan">CỦA ĐỐI TÁC</Tag>)}
                </div>
              }
            >
              <div className="flex gap-4">
                {/* Cột icon bên trái */}
                <div className="flex flex-col items-start gap-6 pt-1 text-gray-500">
                  <UserOutlined />
                  <PhoneOutlined />
                  <EnvironmentOutlined />
                </div>

                {/* Cột thông tin bên phải */}
                <div className="flex flex-col gap-4 text-[15px]">
                  <Typography.Text className="text-gray-800 font-medium">
                    {addressData.delivery_full_name}
                  </Typography.Text>
                  <Typography.Text className="text-gray-700">
                    {addressData.delivery_phone_number}
                  </Typography.Text>
                  <Typography.Text className="text-gray-700">
                    {addressData.delivery_address}
                  </Typography.Text>
                </div>
              </div>
            </Card>
          </div>
        </Col>

        <Col span={12}>
          {/* THÔNG TIN ĐỊA CHỈ LẤY HÀNG */}
          <div data-aos="fade-left" data-aos-delay="200" data-aos-duration="1000">
            <Card
              className="w-full rounded-2xl border border-gray-200 shadow-md"
              title={
                <div className="flex items-center gap-3">
                  <TruckOutlined className="text-orange-500 text-xl" />
                  <span className="text-base font-semibold uppercase">
                    {isCurrentUser ? "Thông tin lấy hàng" : "Thông tin lấy hàng"}
                  </span>
                  {isCurrentUser ? (<Tag color="blue">CỦA BẠN</Tag>) : (<Tag color="cyan">CỦA ĐỐI TÁC</Tag>)}
                </div>
              }
            >
              <div className="flex gap-4">
                {/* Cột icon bên trái */}
                <div className="flex flex-col items-start gap-6 pt-1 text-gray-500">
                  <UserOutlined />
                  <PhoneOutlined />
                  <EnvironmentOutlined />
                </div>

                {/* Cột thông tin bên phải */}
                <div className="flex flex-col gap-4 text-[15px]">
                  <Typography.Text className="text-gray-800 font-medium">
                    {addressData.pickup_full_name}
                  </Typography.Text>
                  <Typography.Text className="text-gray-700">
                    {addressData.pickup_phone_number}
                  </Typography.Text>
                  <Typography.Text className="text-gray-700">
                    {addressData.pickup_address}
                  </Typography.Text>
                </div>
              </div>
            </Card>
          </div>
        </Col>
      </Row>
    );
  };

  return (
    <>
      <div data-aos="fade-down" data-aos-duration="800">
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

      <div data-aos="fade-up" data-aos-duration="600" className="flex items-center justify-end gap-2 my-4">
        <Typography.Text className='text-sm font-medium'>Xem thông tin vận chuyển:</Typography.Text>
        <Button
          type="primary"
          icon={<SwapOutlined className='mt-1 text-base text-white' />}
          onClick={toggleAddressView}
          className="bg-blue-500"
        >
          {showCurrentUser
            ? "Thông tin địa chỉ của đối tác"
            : "Thông tin địa chỉ của bạn"}
        </Button>
      </div>

      <div className="transition-all duration-500 ease-in-out">
        {showCurrentUser
          ? renderAddressCard(currentUserAddress, true)
          : renderAddressCard(partnerAddress, false)
        }
      </div>
    </>
  );
};

ConfirmExchangeDelivery.propTypes = {
  exchangeDetail: PropTypes.shape({
    current_user: PropTypes.shape({
      id: PropTypes.string,
      full_name: PropTypes.string,
      avatar_url: PropTypes.string,
      from_address: PropTypes.shape({
        id: PropTypes.number,
        full_name: PropTypes.string,
        phone_number: PropTypes.string,
        detail: PropTypes.string,
        province_name: PropTypes.string,
        district_name: PropTypes.string,
        ward_name: PropTypes.string,
        is_primary: PropTypes.bool,
        is_pickup_address: PropTypes.bool,
        ghn_district_id: PropTypes.number,
        ghn_ward_code: PropTypes.string,
      }),
      to_address: PropTypes.shape({
        id: PropTypes.number,
        full_name: PropTypes.string,
        phone_number: PropTypes.string,
        detail: PropTypes.string.isRequired,
        province_name: PropTypes.string,
        district_name: PropTypes.string,
        ward_name: PropTypes.string,
        is_primary: PropTypes.bool,
        is_pickup_address: PropTypes.bool,
        ghn_district_id: PropTypes.number,
        ghn_ward_code: PropTypes.string,
      }),
    }),
    partner: PropTypes.shape({
      id: PropTypes.string,
      full_name: PropTypes.string,
      avatar_url: PropTypes.string,
      from_address: PropTypes.shape({
        id: PropTypes.any,
        full_name: PropTypes.string,
        phone_number: PropTypes.string,
        detail: PropTypes.string,
        province_name: PropTypes.string,
        district_name: PropTypes.string,
        ward_name: PropTypes.string,
        is_primary: PropTypes.bool,
        is_pickup_address: PropTypes.bool,
        ghn_district_id: PropTypes.number,
        ghn_ward_code: PropTypes.string,
      }),
      to_address: PropTypes.shape({
        id: PropTypes.any,
        full_name: PropTypes.string,
        phone_number: PropTypes.string,
        detail: PropTypes.string,
        province_name: PropTypes.string,
        district_name: PropTypes.string,
        ward_name: PropTypes.string,
        is_primary: PropTypes.bool,
        is_pickup_address: PropTypes.bool,
        ghn_district_id: PropTypes.number,
        ghn_ward_code: PropTypes.string,
      }),
    })
  }).isRequired
};

export default ConfirmExchangeDelivery;