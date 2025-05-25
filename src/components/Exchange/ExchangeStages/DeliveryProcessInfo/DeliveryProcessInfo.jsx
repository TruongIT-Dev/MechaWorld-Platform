import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Card,
  Button,
  Tag,
  Space,
  Typography,
  Modal,
  Form,
  Input,
  Upload,
  Divider,
  Steps,
  message,
  Empty,
  Tooltip,
  Badge,
  Avatar,
  Timeline,
  Alert
} from "antd";
import {
  SwapOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  UserOutlined,
  UploadOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
  ShoppingOutlined,
  FileImageOutlined,
  InfoCircleOutlined,
  RightCircleOutlined,
  LeftCircleOutlined,
  SendOutlined,
  HomeOutlined
} from "@ant-design/icons";
import TimerCountdown from "../../ExchangeInfo/TimerCountdown";
import { checkDeliverySatus } from "../../../../apis/GHN/APIGHN";
import { GetOrderDetail, PackagingOrder, ConfirmOrderDelivered } from "../../../../apis/Orders/APIOrder";

// Import AOS
import AOS from 'aos';
import 'aos/dist/aos.css';

const { Title, Text, Paragraph } = Typography;
const { Dragger } = Upload;
const { TextArea } = Input;
const { confirm } = Modal;

const DeliveryProcessInfo = ({
  exchangeDetails,
  fetchExchangeDetails,
  setIsLoading
}) => {

  // Khởi tạo AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: true,
      easing: 'ease-in-out',
    });
  }, []);

  // State management
  const [isShowingSendOrder, setIsShowingSendOrder] = useState(true);
  const [packagingModalVisible, setPackagingModalVisible] = useState(false);
  const [complaintModalVisible, setComplaintModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [complaintForm] = Form.useForm();
  const [orderDetail, setOrderDetail] = useState(null);
  const [ghnDetail, setghnDetail] = useState(null);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);
  const [imagePreviewVisible, setImagePreviewVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState('');

  // console.log("orderDetail", orderDetail);


  // Determine which orders to display based on current view
  const currentOrder = isShowingSendOrder
    ? exchangeDetails?.partner?.order
    : exchangeDetails?.current_user?.order;

  // Toggle between send and receive orders
  const toggleOrderView = () => {
    setIsShowingSendOrder(!isShowingSendOrder);
  };

  // Fetch delivery status from GHN
  const fetchDeliveryStatus = async (trackingCode) => {
    // console.log("Fetching delivery status for:", trackingCode);
    await checkDeliverySatus(trackingCode).then((res) => {
      if (res.status === 200) {
        setghnDetail(res.data.data);
        console.log(res.data.data);
      }
    });
  };

  // Fetch order details
  const fetchOrderDetail = async (orderId) => {
    try {
      // console.log("Fetching order detail for:", orderId);

      const res = await GetOrderDetail(orderId);
      // console.log("Res GetOrderDetail", res);

      if (res.status === 200) {
        // Kiểm tra cấu trúc response để lấy đúng dữ liệu
        if (res.data) {
          // Nếu dữ liệu nằm trong res.data
          setOrderDetail(res.data);
          // console.log("Order detail data:", res.data);
        } else {
          // Nếu dữ liệu nằm trực tiếp trong res
          setOrderDetail(res);
          // console.log("Order detail data:", res);
        }

        return res.data || res; // Trả về dữ liệu để có thể sử dụng ngay
      } else {
        console.error("Failed to fetch order detail:", res);
        return null;
      }
    } catch (error) {
      console.error("Error fetching order detail:", error);
      return null;
    }
  };

  useEffect(() => {
    // console.log("exchangeDetails", exchangeDetails);
    // console.log('current order', currentOrder);

    if (currentOrder?.id) {
      fetchOrderDetail(currentOrder.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOrder, isShowingSendOrder]);

  useEffect(() => {
    if (orderDetail?.order_delivery?.delivery_tracking_code) {
      fetchDeliveryStatus(orderDetail.order_delivery.delivery_tracking_code);
    }
  }, [orderDetail]);

  // Handle packaging image upload
  const handlePackagingUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  // Show image preview
  const showImagePreview = (url) => {
    setCurrentImage(url);
    setImagePreviewVisible(true);
  };

  // Submit package confirmation
  const handlePackagingConfirm = () => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh đóng gói");
      return;
    }

    setIsLoading(true);
    // console.log("Submitting packaging confirmation with images:", fileList);
    const formData = new FormData();

    fileList.forEach((file) => {
      formData.append("package_images", file.originFileObj);
    });

    // Simulate API call with timeout
    setTimeout(async () => {
      await PackagingOrder(currentOrder.id, formData).then((res) => {
        if (res.status === 200) {
          message.success("Xác nhận đóng gói thành công");
          setPackagingModalVisible(false);
          setFileList([]);
          fetchExchangeDetails();
        }
      }).finally(() => {
        setIsLoading(false);
      });
    }, 1000);
  };

  // Submit complaint
  const handleComplaintSubmit = (values) => {
    setIsLoading(true);

    // In a real implementation, this would be an API call
    // console.log("Submitting complaint:", values);

    // Simulate API call with timeout
    setTimeout(() => {
      message.success("Gửi khiếu nại thành công");
      setComplaintModalVisible(false);
      fetchExchangeDetails();
      complaintForm.resetFields();
      setIsLoading(false);
    }, 1000);
  };

  // Confirm delivery completion
  const showDeliveryConfirmation = () => {
    confirm({
      title: 'Xác nhận đã nhận hàng',
      icon: <CheckCircleOutlined className="text-green-500" />,
      content: 'Bạn xác nhận đã nhận được hàng và kiểm tra không có vấn đề gì? Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Hủy',
      okButtonProps: {
        className: 'bg-green-500 hover:bg-green-600'
      },
      onOk() {
        setIsLoading(true);

        // In a real implementation, this would be an API call
        console.log("Confirming delivery completion");

        // Simulate API call with timeout
        setTimeout(async () => {
          await ConfirmOrderDelivered(currentOrder.id).then((res) => {
            if (res.status === 200) {
              message.success("Xác nhận đã nhận hàng thành công");
              fetchExchangeDetails();
            }
          }).finally(() => {
            setIsLoading(false);
          });
        }, 1000);
      }
    });
  };

  // Render delivery status steps
  const renderDeliverySteps = (values) => {
    // Define order status mapping to steps
    const statusMap = {
      "ready_to_pick": 0,
      "picking": 1,
      "picked": 1,
      "storing": 2,
      "delivering": 3,
      "delivered": 4,
      "delivery_failed": 3,
      "return": 2,
      "return_storing": 2,
      "returned": 1,
      "cancel": 0,
      "waiting_to_return": 3
    };

    const currentStep = statusMap[values?.status] || 0;

    const statusItems = [
      {
        title: "Chờ lấy hàng",
        icon: currentStep >= 0 ? <CheckCircleOutlined className="text-green-500" /> : <ClockCircleOutlined className="text-gray-400" />
      },
      {
        title: "Đã lấy hàng",
        icon: currentStep >= 1 ? <CheckCircleOutlined className="text-green-500" /> : <ClockCircleOutlined className="text-gray-400" />
      },
      {
        title: "Trung chuyển",
        icon: currentStep >= 2 ? <CheckCircleOutlined className="text-green-500" /> : <ClockCircleOutlined className="text-gray-400" />
      },
      {
        title: "Đang giao",
        icon: currentStep >= 3 ? <CheckCircleOutlined className="text-green-500" /> : <ClockCircleOutlined className="text-gray-400" />
      },
      {
        title: "Đã giao",
        icon: currentStep >= 4 ? <CheckCircleOutlined className="text-green-500" /> : <ClockCircleOutlined className="text-gray-400" />
      }
    ];

    return (
      <Steps
        current={currentStep}
        size="small"
        className="my-4"
        items={statusItems}
        progressDot
      />
    );
  };

  // Format date from ISO string to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Render delivery timeline
  const renderDeliveryTimeline = () => {
    if (!ghnDetail || !ghnDetail.status_histories || ghnDetail.status_histories.length === 0) {
      return null;
    }

    return (
      <div className="mt-6 p-4 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="300">
        <Title level={5} className="mb-4 flex items-center">
          <ClockCircleOutlined className="mr-2 text-blue-500" />
          Lịch sử vận chuyển
        </Title>
        <Timeline
          mode="left"
          items={ghnDetail.status_histories.slice(0, 5).map((history, index) => ({
            color: index === 0 ? 'green' : 'blue',
            children: (
              <div className="pb-2">
                <div className="font-medium">{history.status_text}</div>
                <div className="text-xs text-gray-500">{formatDate(history.timestamp)}</div>
              </div>
            ),
          }))}
        />
      </div>
    );
  };

  // Render the main content based on order status
  const renderMainContent = () => {
    // If no order exists yet
    if (!currentOrder) {
      return (
        <Empty
          description="Chưa có thông tin đơn hàng"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-8"
          data-aos="fade-up"
        />
      );
    }

    // If order exists but packaging not completed (for sender)
    if (isShowingSendOrder && !currentOrder.is_packaged) {
      return (
        <div className="p-6 border rounded-lg shadow-sm bg-gradient-to-r from-blue-50 to-blue-100" data-aos="fade-up">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-4 mb-4">
            <Title level={4} className="m-0 flex items-center">
              <Badge status="processing" className="mr-2" />
              TIẾN HÀNH ĐÓNG GÓI
            </Title>

            <Space className="bg-white px-4 py-2 rounded-full shadow-sm">
              <Text className="text-gray-600">Thời hạn:</Text>
              <Tag color="orange" className="text-base">72 giờ</Tag>
              <Text className="text-gray-600 font-medium">Còn lại:</Text>
              <TimerCountdown
                targetDate={new Date(new Date(currentOrder?.created_at).getTime() + 72 * 60 * 60 * 1000)}
                className="text-red-500 font-bold"
              />
            </Space>
          </div>

          <Paragraph className="text-gray-600 mb-6 max-w-3xl">
            Vui lòng đóng gói sản phẩm của bạn và tải lên hình ảnh đóng gói để xác nhận.
            Đơn vị vận chuyển sẽ liên hệ với bạn để lấy hàng sau khi xác nhận đóng gói.
          </Paragraph>
          <div className="flex flex-wrap items-center gap-3" data-aos="fade-up" data-aos-delay="200">
            <Button
              type="primary"
              size="large"
              className="bg-blue-500 hover:bg-blue-600"
              icon={<InboxOutlined />}
              onClick={() => setPackagingModalVisible(true)}
            >
              Xác nhận đóng gói
            </Button>
            <Button
              type="default"
              size="large"
              icon={<InfoCircleOutlined />}
              className="border-gray-300 hover:bg-gray-50"
              onClick={() => setIsOrderDetailModalVisible(true)}
            >
              Thông tin đơn hàng
            </Button>
          </div>
          <Modal
            title={
              <div className="flex items-center">
                <ShoppingOutlined className="text-xl mr-2 text-blue-500" />
                <span>Thông tin đơn hàng</span>
              </div>
            }
            open={isOrderDetailModalVisible}
            onCancel={() => setIsOrderDetailModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsOrderDetailModalVisible(false)}>
                Đóng
              </Button>,
            ]}
            className="rounded-lg"
          >
            {orderDetail ? (
              <div className="space-y-3">
                <div className="flex p-3 bg-gray-50 rounded-lg">
                  <div className="w-1/2 font-medium">Mã đơn:</div>
                  <div className="w-1/2">{orderDetail?.order?.code || "Không có"}</div>
                </div>
                <div className="flex p-3 bg-gray-50 rounded-lg">
                  <div className="w-1/2 font-medium">Phí giao hàng:</div>
                  <div className="w-1/2 text-green-600 font-medium">{orderDetail?.order?.delivery_fee?.toLocaleString("vi-VN")} VND</div>
                </div>
                <div className="flex p-3 bg-gray-50 rounded-lg">
                  <div className="w-1/2 font-medium">Tổng tiền:</div>
                  <div className="w-1/2 text-red-600 font-medium">{orderDetail?.order?.total_amount?.toLocaleString("vi-VN")} VND</div>
                </div>
                <div className="flex p-3 bg-gray-50 rounded-lg">
                  <div className="w-1/2 font-medium">Ghi chú:</div>
                  <div className="w-1/2 italic">{orderDetail?.order?.note || "Không có ghi chú"}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Empty description="Không có thông tin đơn hàng" />
              </div>
            )}
          </Modal>
        </div>
      );
    }

    // If order exists and has tracking code
    if (orderDetail?.order_delivery?.delivery_tracking_code !== null) {
      return (
        <div className="p-6 border rounded-lg shadow-sm bg-white" data-aos="fade-up">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Tag color="blue" className="text-base px-3 py-1 flex items-center">
                  <span className="mr-1">Mã vận đơn</span>
                </Tag>
                <Text copyable={{ tooltips: ['Sao chép', 'Đã sao chép!'] }} strong className="text-lg bg-gray-50 px-3 py-1 rounded-lg">
                  {orderDetail?.order_delivery.delivery_tracking_code}
                </Text>
              </div>

              {ghnDetail && (
                <div className="flex flex-col gap-3 ml-2" data-aos="fade-right" data-aos-delay="100">
                  <Text className="text-gray-700 flex items-center">
                    <Badge status={ghnDetail.status === "delivered" ? "success" : "processing"} className="mr-2" />
                    <span className="font-medium">Trạng thái vận chuyển:</span>
                  </Text>

                  {renderDeliverySteps(ghnDetail)}

                  <Text className="text-gray-700 flex items-center mt-2">
                    <ClockCircleOutlined className="mr-2 text-orange-500" />
                    <span className="font-medium">Thời gian dự kiến giao hàng:</span>
                    <span className="ml-2 text-orange-500 font-medium">{formatDate(ghnDetail.leadtime)}</span>
                  </Text>
                </div>
              )}
            </div>

            <Space className="flex flex-wrap gap-2" data-aos="fade-left" data-aos-delay="200">
              <Tooltip title="Theo dõi đơn hàng trên trang GHN">
                <Button
                  icon={<SearchOutlined />}
                  size="large"
                  className="flex items-center"
                  onClick={() =>
                    window.open(
                      `https://tracking.ghn.dev/?order_code=${orderDetail?.order_delivery.delivery_tracking_code}`,
                      "_blank"
                    )
                  }
                >
                  Theo dõi giao hàng
                </Button>
              </Tooltip>

              {!isShowingSendOrder && ghnDetail?.status === "delivered" && (
                <Tooltip title="Xác nhận khi bạn đã nhận được hàng và kiểm tra không có vấn đề">
                  <Button
                    type="primary"
                    size="large"
                    className="bg-green-500 hover:bg-green-600"
                    icon={<CheckCircleOutlined />}
                    onClick={showDeliveryConfirmation}
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                </Tooltip>
               )}

              {!isShowingSendOrder && ghnDetail?.status === "delivered" && (
                <Tooltip title="Gửi khiếu nại nếu có vấn đề với đơn hàng">
                  <Button
                    danger
                    size="large"
                    icon={<ExclamationCircleOutlined />}
                    onClick={() => setComplaintModalVisible(true)}
                  >
                    Gửi khiếu nại
                  </Button>
                </Tooltip>
              )}
            </Space>
          </div>

          {renderDeliveryTimeline()}

          {currentOrder.is_packaged === true && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg" data-aos="fade-up" data-aos-delay="300">
              <Text strong className="text-base flex items-center mb-4">
                <FileImageOutlined className="mr-2 text-blue-500" />
                Hình ảnh đóng gói:
              </Text>
              <div className="flex flex-wrap gap-3 mt-2">
                {currentOrder.packaging_image_urls?.map((url, index) => (
                  <div
                    key={index}
                    className="w-24 h-24 overflow-hidden rounded-lg shadow-sm relative cursor-pointer transform hover:scale-105 transition-transform duration-200"
                    onClick={() => showImagePreview(url)}
                    data-aos="zoom-in"
                    data-aos-delay={100 + index * 50}
                  >
                    <img
                      src={url}
                      alt={`Packaging ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <SearchOutlined className="text-white text-lg opacity-0 hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Default state - waiting for action from the other party
    return (
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        description="Đang chờ người gửi xác nhận đóng gói"
        className="my-8 py-12 border rounded-lg"
        data-aos="fade-up"
      />
    );
  };

  // Render sender/recipient information
  const renderAddressInfo = (title, user, isSender = true) => {
    const addressInfo = isSender
      ? user?.from_address
      : user?.to_address;

    if (!addressInfo) return null;

    return (
      <div className="mb-4" data-aos="fade-up" data-aos-delay={isSender ? "100" : "200"}>
        <div className="flex items-center mb-2 gap-2">
          {isSender ? (<SendOutlined className="text-lg text-blue-500" />) : (<HomeOutlined className="text-lg text-green-500" />)}
          <Text strong className="text-base">{title}</Text>
        </div>
        <Card
          className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
        >
          <div className="flex items-start gap-3">
            <Avatar
              icon={<UserOutlined />}
              className={`text-xl ${isSender ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}
              size={40}
            />
            <div>
              <Text strong className="text-base">{addressInfo.full_name}</Text>
              <div className="flex items-center gap-1 text-gray-600">
                <PhoneOutlined />
                <Text>{addressInfo.phone_number}</Text>
              </div>
            </div>
          </div>

          <div className="mt-3 pl-10">
            <div className="flex items-start gap-2 text-gray-600">
              <EnvironmentOutlined className="mt-1 text-red-500" />
              <Text>
                {addressInfo.detail}, {addressInfo.ward_name}, {addressInfo.district_name}, {addressInfo.province_name}
              </Text>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="w-full mx-auto">

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

      <div className="bg-white px-4 py-2 my-4 rounded-lg shadow-md">
        {/* Header with toggle button */}
        <div className="flex justify-between items-center my-6" data-aos="fade-down">
          <Title level={3} className="m-0 flex items-center">
            {/* <div className={`w-3 h-3 rounded-full mr-3 ${isShowingSendOrder ? 'bg-blue-500' : 'bg-green-500'}`}></div> */}
            {isShowingSendOrder ? "CHI TIẾT ĐƠN GỬI HÀNG" : "CHI TIẾT ĐƠN NHẬN HÀNG"}
          </Title>

          <Button
            icon={<SwapOutlined />}
            onClick={toggleOrderView}
            size="large"
            className="flex items-center rounded-full border-gray-300 px-4 hover:bg-gray-50"
          >
            Xem đơn {isShowingSendOrder ? "nhận" : "gửi"}
            {isShowingSendOrder ? <RightCircleOutlined className="ml-1" /> : <LeftCircleOutlined className="ml-1" />}
          </Button>
        </div>

        <Divider className="my-6" />

        {/* Shipping addresses information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {renderAddressInfo(
            isShowingSendOrder ? "Người gửi (Bạn)" : "Người gửi",
            isShowingSendOrder ? exchangeDetails?.current_user : exchangeDetails?.partner,
            true
          )}


          {renderAddressInfo(
            isShowingSendOrder ? "Người nhận" : "Người nhận (Bạn)",
            isShowingSendOrder ? exchangeDetails?.partner : exchangeDetails?.current_user,
            false
          )}
        </div>

        {/* Main order content */}
        {renderMainContent()}
      </div>

      {/* Packaging confirmation modal */}
      <Modal
        title={
          <div className="flex items-center">
            <InboxOutlined className="text-xl mr-2 text-blue-500" />
            <span>Xác nhận đóng gói</span>
          </div>
        }
        open={packagingModalVisible}
        onCancel={() => setPackagingModalVisible(false)}
        onOk={handlePackagingConfirm}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-blue-500 hover:bg-blue-600' }}
        width={600}
        className="rounded-lg"
      >
        <Paragraph className="mb-6 text-gray-600">
          Vui lòng tải lên ít nhất một hình ảnh của sản phẩm đã được đóng gói để xác nhận.
          Điều này giúp đảm bảo tính minh bạch trong quá trình trao đổi.
        </Paragraph>

        <Dragger
          fileList={fileList}
          onChange={handlePackagingUpload}
          beforeUpload={() => false}
          multiple
          maxCount={5}
          accept="image/*"
          className="bg-gray-50 border-dashed border-gray-300 hover:border-blue-400 transition-colors duration-300"
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined className="text-blue-500 text-4xl" />
          </p>
          <p className="ant-upload-text">Nhấn hoặc kéo thả hình ảnh vào khu vực này</p>
          <p className="ant-upload-hint text-gray-500">Hỗ trợ tải lên một hoặc nhiều hình ảnh (tối đa 5 hình)</p>
        </Dragger>

        {fileList.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <Text strong className="flex items-center">
              <CheckCircleOutlined className="text-green-500 mr-2" />
              Đã chọn {fileList.length} hình ảnh
            </Text>
          </div>
        )}
      </Modal>

      {/* Complaint modal */}
      <Modal
        title={
          <div className="flex items-center">
            <ExclamationCircleOutlined className="text-xl mr-2 text-red-500" />
            <span>Gửi khiếu nại</span>
          </div>
        }
        open={complaintModalVisible}
        onCancel={() => setComplaintModalVisible(false)}
        footer={null}
        width={600}
        className="rounded-lg"
      >
        <Form
          form={complaintForm}
          layout="vertical"
          onFinish={handleComplaintSubmit}
        >
          <Form.Item
            name="complaintType"
            label="Loại khiếu nại"
            rules={[{ required: true, message: 'Vui lòng chọn loại khiếu nại' }]}
          >
            <select className="w-full p-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none">
              <option value="">-- Chọn loại khiếu nại --</option>
              <option value="damaged">Sản phẩm bị hư hại</option>
              <option value="wrong_item">Sản phẩm không đúng mô tả</option>
              <option value="delivery_issue">Vấn đề về vận chuyển</option>
              <option value="other">Khác</option>
            </select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
            rules={[{ required: true, message: 'Vui lòng mô tả chi tiết vấn đề' }]}
          >
            <TextArea
              rows={4}
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
              className="rounded-lg border-gray-300 focus:border-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="photos"
            label="Hình ảnh minh chứng (không bắt buộc)"
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              maxCount={3}
              accept="image/*"
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </div>
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 flex justify-end">
            <Space>
              <Button onClick={() => setComplaintModalVisible(false)} className="rounded-lg">
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue-500 hover:bg-blue-600 rounded-lg"
              >
                Gửi khiếu nại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Image preview modal */}
      <Modal
        open={imagePreviewVisible}
        footer={null}
        onCancel={() => setImagePreviewVisible(false)}
        width={800}
        className="image-preview-modal"
        centered
      >
        <img
          src={currentImage}
          alt="Package Preview"
          className="w-full h-auto rounded-lg"
        />
      </Modal>
    </div>
  );
};

DeliveryProcessInfo.propTypes = {
  exchangeDetails: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
    expiredAt: PropTypes.string,
    current_user: PropTypes.shape({
      id: PropTypes.string,
      full_name: PropTypes.string,
      avatar_url: PropTypes.string,
      from_address: PropTypes.object,
      to_address: PropTypes.object,
      order: PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        delivery_tracking_code: PropTypes.string,
        is_packaged: PropTypes.bool,
        packaging_image_urls: PropTypes.arrayOf(PropTypes.string)
      })
    }),
    partner: PropTypes.shape({
      id: PropTypes.string,
      full_name: PropTypes.string,
      avatar_url: PropTypes.string,
      from_address: PropTypes.object,
      to_address: PropTypes.object,
      order: PropTypes.shape({
        id: PropTypes.string,
        status: PropTypes.string,
        delivery_tracking_code: PropTypes.string,
        is_packaged: PropTypes.bool,
        packaging_image_urls: PropTypes.arrayOf(PropTypes.string)
      })
    })
  }),
  fetchExchangeDetails: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired
};

export default DeliveryProcessInfo;