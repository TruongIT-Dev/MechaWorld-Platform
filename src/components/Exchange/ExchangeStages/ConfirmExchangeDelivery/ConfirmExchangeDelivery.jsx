import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { EnvironmentOutlined, HomeOutlined, PhoneOutlined, ArrowRightOutlined, TruckOutlined, UserOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Card, Empty, Tag, Typography, Alert, Row, Col, Divider, Spin } from 'antd';
import AOS from 'aos';
import 'aos/dist/aos.css';

const ConfirmExchangeDelivery = ({ exchangeDetail }) => {
  const [isDataReady, setIsDataReady] = useState(false);
  const [localExchangeDetail, setLocalExchangeDetail] = useState(null);

  // console.log("Check ExchangeDetail in Stage 2", exchangeDetail);

  // Force component to re-render when exchangeDetail changes
  useEffect(() => {
    console.log("ExchangeDetail changed:", exchangeDetail);
    if (exchangeDetail && Object.keys(exchangeDetail).length > 0) {
      setLocalExchangeDetail(exchangeDetail);
      setIsDataReady(true);
    } else {
      setIsDataReady(false);
    }
  }, [exchangeDetail]);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: true,
    });
  }, []);

  // Refresh AOS when data is ready
  useEffect(() => {
    if (isDataReady) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        AOS.refresh();
      }, 100);
    }
  }, [isDataReady]);

  // Extract data from localExchangeDetail with fallback
  const partner = localExchangeDetail?.partner || exchangeDetail?.partner || {};
  const currentUser = localExchangeDetail?.current_user || exchangeDetail?.current_user || {};

  // Show loading if data is not ready
  if (!isDataReady || (!partner.from_address && !currentUser.from_address)) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
        <Typography.Text className="ml-3 text-gray-600">
          Đang tải thông tin trao đổi...
        </Typography.Text>
      </div>
    );
  }

  // Format address function
  const formatAddress = (user) => {
    if (!user || !user.from_address || !user.to_address) {
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

  // Render address card
  const renderAddressCard = (addressData, title, tagColor, tagText, iconColor, isPickup = false) => {
    if (!addressData) {
      return (
        <Card className="w-full border border-gray-300 rounded-lg shadow-sm h-full">
          <Empty
            description={`${title} chưa có thông tin địa chỉ`}
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }

    const displayData = isPickup ? {
      full_name: addressData.pickup_full_name,
      phone_number: addressData.pickup_phone_number,
      address: addressData.pickup_address
    } : {
      full_name: addressData.delivery_full_name,
      phone_number: addressData.delivery_phone_number,
      address: addressData.delivery_address
    };

    return (
      <Card
        className="w-full rounded-2xl border border-gray-200 shadow-md h-full"
        title={
          <div className="flex items-center gap-3">
            {isPickup ? (
              <TruckOutlined className={`${iconColor} text-xl`} />
            ) : (
              <HomeOutlined className={`${iconColor} text-xl`} />
            )}
            <span className="text-base font-semibold uppercase">
              {title}
            </span>
            <Tag color={tagColor}>{tagText}</Tag>
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
          <div className="flex flex-col gap-4 text-sm">
            <Typography.Text className="text-gray-800 font-medium">
              {displayData.full_name}
            </Typography.Text>
            <Typography.Text className="text-gray-700">
              {displayData.phone_number}
            </Typography.Text>
            <Typography.Text className="text-gray-700">
              {displayData.address}
            </Typography.Text>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <>
      <div data-aos="fade-down" data-aos-duration="800">
        <Alert
          type="info"
          showIcon
          message="Vui lòng kiểm tra và xác nhận thông tin vận chuyển"
          description={
            <div className="text-gray-700 text-sm space-y-3 mt-2">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  <strong>Thông tin giao hàng:</strong> là nơi người nhận sẽ nhận được đơn hàng. Đây là địa điểm mà khách hàng mong muốn nhận hàng.
                </li>
                <li>
                  <strong>Thông tin lấy hàng:</strong> là nơi bạn muốn đơn vị vận chuyển đến để nhận hàng từ bạn. Đây là địa điểm để đơn vị vận chuyển đến lấy hàng.
                </li>
                <li>
                  <strong>Lưu ý:</strong> Hãy đảm bảo bạn đã cung cấp thông tin địa chỉ đầy đủ và chính xác để tránh sai sót khi vận chuyển.
                </li>
              </ul>
            </div>
          }
        />
      </div>

      {/* LUỒNG TRAO ĐỒI CỦA BẠN */}
      <div data-aos="fade-up" data-aos-delay="200" className="mt-6">

        <Row gutter={[24, 16]} align="middle">
          <Col span={11}>
            {renderAddressCard(
              currentUserAddress,
              "Thông tin lấy hàng",
              "blue",
              "CỦA BẠN",
              "text-orange-500",
              true
            )}
          </Col>

          <Col span={2} className="text-center">
            <div className="flex flex-col items-center gap-2">
              <ArrowRightOutlined className="text-2xl text-blue-500" />
              <Typography.Text className="text-xs text-gray-500 font-medium">
                GIAO TỚI
              </Typography.Text>
            </div>
          </Col>

          <Col span={11}>
            {renderAddressCard(
              partnerAddress,
              "Thông tin giao hàng",
              "cyan",
              "CỦA ĐỐI TÁC",
              "text-green-500",
              false
            )}
          </Col>
        </Row>
      </div>

      <Divider className="" />

      {/* LUỒNG TRAO ĐỒI CỦA ĐỐI TÁC */}
      <div data-aos="fade-up" data-aos-delay="400" className="">

        <Row gutter={[24, 16]} align="middle">
          <Col span={11}>
            {renderAddressCard(
              currentUserAddress,
              "Thông tin giao hàng",
              "blue",
              "CỦA BẠN",
              "text-green-500",
              false
            )}
          </Col>

          <Col span={2} className="text-center">
            <div className="flex flex-col items-center">
              <ArrowLeftOutlined className="text-2xl text-cyan-500" />
              <Typography.Text className="text-xs text-gray-500 font-medium">
                GIAO TỚI
              </Typography.Text>
            </div>
          </Col>

          <Col span={11}>
            {renderAddressCard(
              partnerAddress,
              "Thông tin lấy hàng",
              "cyan",
              "CỦA ĐỐI TÁC",
              "text-orange-500",
              true
            )}
          </Col>
        </Row>
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