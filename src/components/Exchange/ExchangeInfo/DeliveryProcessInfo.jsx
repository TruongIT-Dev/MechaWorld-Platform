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
  SearchOutlined
} from "@ant-design/icons";
import TimerCountdown from "./TimerCountdown";
import { checkDeliverySatus } from "../../../apis/GHN/APIGHN";
import { GetOrderDetail, PackagingOrder, ConfirmOrderDelivered } from "../../../apis/Orders/APIOrder";

const { Title, Text, Paragraph } = Typography;
const { Step } = Steps;
const { Dragger } = Upload;
const { TextArea } = Input;
const { confirm } = Modal;

const DeliveryProcessInfo = ({ 
  exchangeDetails, 
  fetchExchangeDetails,
  setIsLoading
}) => {
  // State management
  const [isShowingSendOrder, setIsShowingSendOrder] = useState(false);
  const [packagingModalVisible, setPackagingModalVisible] = useState(false);
  const [complaintModalVisible, setComplaintModalVisible] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [complaintForm] = Form.useForm();
  const [orderDetail, setOrderDetail] = useState(null);
  const [ghnDetail, setghnDetail] = useState(null);
  const [isOrderDetailModalVisible, setIsOrderDetailModalVisible] = useState(false);
  
  // Determine which orders to display based on current view
  const currentOrder = isShowingSendOrder 
    ? exchangeDetails?.partner?.order
    : exchangeDetails?.current_user?.order;
    

  // Toggle between send and receive orders
  const toggleOrderView = () => {
    setIsShowingSendOrder(!isShowingSendOrder);
  };


  // Mock function to fetch delivery status - would be replaced with actual API call
  const fetchDeliveryStatus = async (trackingCode) => {
    console.log("Fetching delivery status for:", trackingCode);
    // This would be the actual API call to GHN
    // For now, we'll simulate a response
      await checkDeliverySatus(trackingCode).then( (res) => {
        if (res.status === 200){
         setghnDetail(res.data.data);
          console.log(res.data.data);
        }
      })
  };
  const fetchOrderDetail = async (orderId) => {
    console.log("Fetching order detail for:", orderId);
    await GetOrderDetail(orderId).then((res)=> {
      if (res.status === 200){
        setOrderDetail(res.data);
        console.log(res.data);
      }
    })
  }

  useEffect(() => {
    console.log(exchangeDetails);
    console.log('current order', currentOrder);
  
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
  
  useEffect(() => {
    if (orderDetail?.order_delivery?.delivery_tracking_code) {
      fetchDeliveryStatus(orderDetail.order_delivery.delivery_tracking_code);
    }
  }, [orderDetail]);
  
  useEffect(() => {
    if (orderDetail?.order_delivery?.delivery_tracking_code) {
      fetchDeliveryStatus(orderDetail.order_delivery.delivery_tracking_code);
    }
  }, [orderDetail]);
  
  // Handle packaging image upload
  const handlePackagingUpload = ({ fileList }) => {
    setFileList(fileList);
  };

  
  // Submit package confirmation
  const handlePackagingConfirm = () => {
    if (fileList.length === 0) {
      message.error("Vui lòng tải lên ít nhất một hình ảnh đóng gói");
      return;
    }
    
    setIsLoading(true);
    console.log("Submitting packaging confirmation with images:", fileList);
    const formData = new FormData();

    fileList.forEach((file) => {
        formData.append("package_images", file.originFileObj);
    });
    


    // Simulate API call with timeout
    setTimeout(async () => {
      await PackagingOrder(currentOrder.id, formData).then((res)=> {
        if( res.status ===200) {
          message.success("Xác nhận đóng gói thành công");
          setPackagingModalVisible(false);
          setFileList([]);
          fetchExchangeDetails();
        }
      }).finally(
        setIsLoading(false)
      );
      
        }, 1000);
  };
  
  // Submit complaint
  const handleComplaintSubmit = (values) => {
    setIsLoading(true);
    
    // In a real implementation, this would be an API call
    console.log("Submitting complaint:", values);
    
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
      icon: <CheckCircleOutlined />,
      content: 'Bạn xác nhận đã nhận được hàng và kiểm tra không có vấn đề gì? Hành động này không thể hoàn tác.',
      okText: 'Xác nhận',
      okType: 'primary',
      cancelText: 'Hủy',
      onOk() {
        setIsLoading(true);
        
        // In a real implementation, this would be an API call
        console.log("Confirming delivery completion");
        
        // Simulate API call with timeout
        setTimeout(async () => {
          await ConfirmOrderDelivered(currentOrder.id).then((res)=> {
            if( res.status ===200) {
              message.success("Xác nhận đã nhận hàng thành công");
            }
          }).finally(
            setIsLoading(false)
          );
          // setIsLoading(false);

          // Call fetchExchangeDetails() to refresh data
          fetchExchangeDetails()
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
    
    return (
      <Steps 
        current={currentStep}
        size="small"
        className="my-4"
      >
        <Step title="Chờ lấy hàng" />
        <Step title="Đã lấy hàng" />
        <Step title="Trung chuyển" />
        <Step title="Đang giao" />
        <Step title="Đã giao" />
      </Steps>
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
  
  // Render the main content based on order status
  const renderMainContent = () => {
    // If no order exists yet
    if (!currentOrder) {
      return (
        <Empty 
          description="Chưa có thông tin đơn hàng" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      );
    }
    
    // If order exists but packaging not completed (for sender)
    if (isShowingSendOrder && !currentOrder.is_packaged) {
      return (
        <div className="p-4 border rounded-md bg-blue-50">
          <div className="flex flex-col xl:flex-row items-center justify-between gap-2 mb-4">
            <Title level={4} className="m-0">TIẾN HÀNH ĐÓNG GÓI</Title>
            
            <Space>
              <Text className="text-gray-600">Thời hạn:</Text>
              <Tag color="orange" className="text-base">72 giờ</Tag>
              <Text className="text-gray-600">Còn lại:</Text>
              <TimerCountdown
                targetDate={new Date(new Date(currentOrder?.created_at).getTime() + 72 * 60 * 60 * 1000)}
                // targetDate={currentOrder?.created_at}

              />
            </Space>
          </div>
          
          <Paragraph className="text-gray-600 mb-4">
            Vui lòng đóng gói sản phẩm của bạn và tải lên hình ảnh đóng gói để xác nhận.
            Đơn vị vận chuyển sẽ liên hệ với bạn để lấy hàng sau khi xác nhận đóng gói.
          </Paragraph>
          <div className="items-center">
            <Button 
              type="primary" 
              className="bg-blue-500 "
              icon={<InboxOutlined />}
              onClick={() => setPackagingModalVisible(true)}
            >
              Xác nhận đóng gói
            </Button>
            <Button 
              type="default" 
              className="ml-2"
              onClick={() => setIsOrderDetailModalVisible(true)}
            >
              Thông tin đơn hàng
            </Button>
          </div>
          <Modal
            title="Thông tin đơn hàng"
            open={isOrderDetailModalVisible}
            onCancel={() => setIsOrderDetailModalVisible(false)}
            footer={[
              <Button key="close" onClick={() => setIsOrderDetailModalVisible(false)}>
                Đóng
              </Button>,
            ]}
          >
            {orderDetail ? (
              <div>
                <p><strong>Mã đơn:</strong> {orderDetail?.order?.code || "Không có"}</p>
                <p><strong>Phí giao hàng:</strong> {orderDetail?.order?.delivery_fee?.toLocaleString("vi-VN")} VND</p>
                <p><strong>Tổng tiền:</strong> {orderDetail?.order?.total_amount?.toLocaleString("vi-VN")} VND</p>
                <p><strong>Ghi chú:</strong> {orderDetail?.order?.note || "Không có ghi chú"}</p>
              </div>
            ) : (
              <p>Không có thông tin đơn hàng.</p>
            )}
          </Modal>
        </div>
      );
    }
    
    // If order exists and has tracking code
    if (isShowingSendOrder && orderDetail?.order_delivery.delivery_tracking_code !== null) {
      return (
        <div className="p-4 border rounded-md">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag color="blue" className="text-base">Mã vận đơn</Tag>
                <Text copyable strong className="text-lg">{orderDetail?.order_delivery.delivery_tracking_code}</Text>
              </div>
              
              {ghnDetail && (
                <div className="flex flex-col gap-1">
                  <Text className="text-gray-600">
                    <CheckCircleOutlined className="mr-2" />
                    Trạng thái: {renderDeliverySteps(ghnDetail)}
                  </Text>
                  
                  <Text className="text-gray-600">
                    <ClockCircleOutlined className="mr-2" />
                    Thời gian dự kiến: {formatDate(ghnDetail.leadtime)}
                  </Text>
                </div>
              )}
            </div>
            
            <Space>
              <Button
                icon={<SearchOutlined />}
                onClick={() => 
                  window.open(
                    `https://tracking.ghn.dev/?order_code=${orderDetail?.order_delivery.delivery_tracking_code}`,
                    "_blank"
                  )
                }
              >
                Theo dõi giao hàng
              </Button>
              
              {!isShowingSendOrder && currentOrder.status === "delivered" && (
                <Button 
                  type="primary"
                  className="bg-green-500"
                  icon={<CheckCircleOutlined />}
                  onClick={showDeliveryConfirmation}
                >
                  Xác nhận đã nhận hàng
                </Button>
              )}
              
              {!isShowingSendOrder && currentOrder.status === "delivered" &&(
                <Button 
                  danger
                  icon={<ExclamationCircleOutlined />}
                  onClick={() => setComplaintModalVisible(true)}
                >
                  Gửi khiếu nại
                </Button>
              )}
            </Space>
          </div>
          
          {/* {ghnDetail && renderDeliverySteps()} */}
          
          {currentOrder.is_packaged ===true && (
            <div className="mt-4">
              <Text strong>Hình ảnh đóng gói:</Text>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOrder.packaging_image_urls?.map((url, index) => (
                  <div key={index} className="w-24 h-24 relative">
                    <img 
                      src={url} 
                      alt={`Packaging ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                    />
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
      <div className="p-4 border rounded-md">
          <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Tag color="blue" className="text-base">Mã vận đơn</Tag>
                <Text copyable strong className="text-lg">{orderDetail?.order_delivery.delivery_tracking_code}</Text>
              </div>
              
              {ghnDetail && (
                <div className="flex flex-col gap-1">
                  <Text className="text-gray-600">
                    <CheckCircleOutlined className="mr-2" />
                    Trạng thái: {renderDeliverySteps(ghnDetail)}
                  </Text>
                  
                  <Text className="text-gray-600">
                    <ClockCircleOutlined className="mr-2" />
                    Thời gian dự kiến: {formatDate(ghnDetail.leadtime)}
                  </Text>
                </div>
              )}
            </div>
            
            <Space>
              <Button
                icon={<SearchOutlined />}
                onClick={() => 
                  window.open(
                    `https://tracking.ghn.dev/?order_code=${orderDetail?.order_delivery.delivery_tracking_code}`,
                    "_blank"
                  )
                }
              >
                Theo dõi giao hàng
              </Button>
              
              {!isShowingSendOrder && currentOrder.status === "delivered" && (
                <Button 
                  type="primary"
                  className="bg-green-500"
                  icon={<CheckCircleOutlined />}
                  onClick={showDeliveryConfirmation}
                >
                  Xác nhận đã nhận hàng
                </Button>
              )}
              
              {!isShowingSendOrder && currentOrder.status === "delivered" &&(
                <Button 
                  danger
                  icon={<ExclamationCircleOutlined />}
                  onClick={() => setComplaintModalVisible(true)}
                >
                  Gửi khiếu nại
                </Button>
              )}
            </Space>
          </div>
          
          {/* {ghnDetail && renderDeliverySteps()} */}
          
          {currentOrder.is_packaged ===true && (
            <div className="mt-4">
              <Text strong>Hình ảnh đóng gói:</Text>
              <div className="flex flex-wrap gap-2 mt-2">
                {currentOrder.packaging_image_urls?.map((url, index) => (
                  <div key={index} className="w-24 h-24 relative">
                    <img 
                      src={url} 
                      alt={`Packaging ${index + 1}`} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
    );
  };
  
  // Render sender/recipient information
  const renderAddressInfo = (title, user, isSender = true) => {
    const addressInfo = isSender 
      ? user?.from_address 
      : user?.to_address;
    
    if (!addressInfo) return null;
    
    return (
      <div className="mb-4">
        <Text strong className="text-base">{title}</Text>
        <Card className="mt-2 border-gray-200">
          <div className="flex items-start gap-3">
            <div>
              <UserOutlined className="text-xl bg-gray-100 p-2 rounded-full" />
            </div>
            <div>
              <Text strong>{addressInfo.full_name}</Text>
              <div className="flex items-center gap-1 text-gray-600">
                <PhoneOutlined />
                <Text>{addressInfo.phone_number}</Text>
              </div>
            </div>
          </div>
          
          <div className="mt-3 pl-8">
            <div className="flex items-start gap-2 text-gray-600">
              <EnvironmentOutlined className="mt-1" />
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
    <div className="w-full">
      {/* Header with toggle button */}
      <div className="flex justify-between items-center mb-4">
        <Title level={3} className="m-0">
          {isShowingSendOrder ? "Thông tin đơn gửi hàng" : "Thông tin đơn nhận hàng"}
        </Title>
        
        <Button 
          icon={<SwapOutlined />} 
          onClick={toggleOrderView}
        >
          Xem đơn {isShowingSendOrder ? "nhận" : "gửi"}
        </Button>
      </div>
      
      <Divider />
      
      {/* Shipping addresses information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
      
      {/* Packaging confirmation modal */}
      <Modal
        title="Xác nhận đóng gói"
        open={packagingModalVisible}
        onCancel={() => setPackagingModalVisible(false)}
        onOk={handlePackagingConfirm}
        okText="Xác nhận"
        cancelText="Hủy"
        okButtonProps={{ className: 'bg-blue-500' }}
      >
        <Paragraph className="mb-4">
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
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Nhấn hoặc kéo thả hình ảnh vào khu vực này</p>
          <p className="ant-upload-hint">Hỗ trợ tải lên một hoặc nhiều hình ảnh (tối đa 5 hình)</p>
        </Dragger>
        
        {fileList.length > 0 && (
          <div className="mt-3">
            <Text strong>Đã chọn {fileList.length} hình ảnh</Text>
          </div>
        )}
      </Modal>
      
      {/* Complaint modal */}
      <Modal
        title="Gửi khiếu nại"
        open={complaintModalVisible}
        onCancel={() => setComplaintModalVisible(false)}
        footer={null}
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
            <select className="w-full p-2 border border-gray-300 rounded">
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
            <TextArea rows={4} placeholder="Mô tả chi tiết vấn đề bạn gặp phải..." />
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
              <Button onClick={() => setComplaintModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit" className="bg-blue-500">
                Gửi khiếu nại
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

DeliveryProcessInfo.propTypes = {
  firstUser: PropTypes.object,
  secondUser: PropTypes.object,
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