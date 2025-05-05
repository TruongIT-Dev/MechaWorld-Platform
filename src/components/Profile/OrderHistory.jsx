import { useState, useEffect } from "react";
import { Tabs, Input, Card, Button, Tag, Avatar, Spin, message, Image, Empty, notification, Space, Modal } from "antd";
import {
  SearchOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  GiftOutlined,
  CarOutlined,
  CheckOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined,
  EyeOutlined
} from "@ant-design/icons";

import { GetListOrderHistory, GetOrderDetail, ConfirmOrderDelivered } from "../../apis/Orders/APIOrder";
import { GetShopInfoById } from "../../apis/Seller Profile/APISellerProfile";
import OrderHistoryDetail from "./OrderHistoryDetail";

const { Search } = Input;

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // State cho modal trong component OrderHistory
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingOrderDetail, setLoadingOrderDetail] = useState(false);

  // State cho modal xác nhận đã giao hàng
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmingOrderId, setConfirmingOrderId] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Status object định nghĩa icon, màu và text cho từng trạng thái
  const statusConfig = {
    'pending': { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xử lý' },
    'packaging': { color: 'purple', icon: <GiftOutlined />, text: 'Đang đóng gói' },
    'delivering': { color: 'blue', icon: <CarOutlined />, text: 'Đang vận chuyển' },
    'delivered': { color: 'cyan', icon: <CheckOutlined />, text: 'Đã giao hàng' },
    'completed': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã hoàn thành' },
    'failed': { color: 'red', icon: <CloseCircleOutlined />, text: 'Giao hàng thất bại' },
    'canceled': { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchShopInfo = async (sellerId) => {
    try {
      const res = await GetShopInfoById(sellerId);
      return res.data;
    } catch (err) {
      console.error("Failed to fetch shop info", err);
      return {
        full_name: `Shop ${sellerId.slice(0, 4)}...`,
        avatar_url: "https://source.unsplash.com/40x40/?shop"
      };
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await GetListOrderHistory();
      const ordersData = response.data;

      // Lấy danh sách seller_id duy nhất
      const sellerIds = [...new Set(ordersData.map(item => item.order.seller_id))];

      // Gọi API lấy thông tin shop
      const sellerInfoMap = {};
      await Promise.all(sellerIds.map(async (id) => {
        const info = await fetchShopInfo(id);
        sellerInfoMap[id] = info;
      }));

      // Xử lý dữ liệu đơn hàng
      const processedOrders = ordersData.map(item => {
        const { order, order_items } = item;
        const shopInfo = sellerInfoMap[order.seller_id] || {};
        const status = order.status;
        const statusInfo = statusConfig[status] || {
          color: 'default',
          icon: <ClockCircleOutlined />,
          text: convertStatus(status)
        };

        return {
          id: order.id,
          code: order.code,
          shopId: order.seller_id,
          shopName: shopInfo.shop_name || `Shop ${order.seller_id.slice(0, 4)}...`,
          shopAvatar: shopInfo.avatar_url,
          status: status,
          statusText: statusInfo.text || convertStatus(status),
          statusColor: statusInfo.color || getStatusColor(status),
          statusIcon: statusInfo.icon,
          subtotal: order.items_subtotal,
          deliveryFee: order.delivery_fee,
          totalAmount: order.total_amount,
          formattedTotal: formatCurrency(order.total_amount),
          paymentMethod: formatPaymentMethod(order.payment_method),
          createdAt: new Date(order.created_at).toLocaleDateString('vi-VN'),
          items: order_items.map(item => ({
            id: item.id,
            name: item.name,
            grade: item.grade,
            scale: item.scale,
            quantity: item.quantity,
            price: item.price,
            formattedPrice: formatCurrency(item.price),
            imageUrl: item.image_url
          }))
        };
      });

      setOrders(processedOrders);
    } catch (error) {
      console.error("Fetch error", error);
      message.error("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const convertStatus = (status) => {
    const map = {
      pending: "Chờ xác nhận",
      packaging: "Đang đóng gói",
      delivering: "Đang giao hàng",
      delivered: "Đã giao",
      completed: "Hoàn tất",
      cancelled: "Đã hủy",
      failed: "Thất bại",
    };
    return map[status] || "Không xác định";
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: "orange",
      packaging: "purple",
      delivering: "blue",
      delivered: "cyan",
      completed: "green",
      failed: "red",
      canceled: "red",
    };
    return colorMap[status] || "default";
  };

  const formatPaymentMethod = (method) => {
    const methods = {
      wallet: "Ví điện tử",
      cod: "Thanh toán khi nhận hàng",
      bank: "Chuyển khoản ngân hàng"
    };
    return methods[method] || method;
  };

  const formatCurrency = (number) =>
    new Intl.NumberFormat("vi-VN").format(number) + "đ";

  const tabItems = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xác nhận" },
    { key: "packaging", label: "Đang đóng gói" },
    { key: "delivering", label: "Đang giao hàng" },
    { key: "delivered", label: "Đã giao thành công" },
    { key: "completed", label: "Hoàn tất" },
    { key: "cancelled", label: "Đã hủy" },
    { key: "failed", label: "Thất bại" },
  ];

  // Lọc đơn theo tab (status) và tìm kiếm
  const filteredOrders = orders
    .filter(order => activeTab === "all" || order.status === activeTab)
    .filter(order => {
      if (!searchText) return true;
      const searchLower = searchText.toLowerCase();
      return (
        order.code.toLowerCase().includes(searchLower) ||
        order.shopName.toLowerCase().includes(searchLower) ||
        order.items.some(item => item.name.toLowerCase().includes(searchLower))
      );
    });


  const showConfirmDeliveredModal = (id) => {
    // Chỉ cho phép xác nhận nếu trạng thái đơn hàng là "delivered"
    const order = orders.find(order => order.id === id);
    if (order && order.status !== 'delivered') {
      notification.warning({
        message: 'Không thể xác nhận',
        description: 'Chỉ đơn hàng đang giao mới có thể xác nhận đã giao.'
      });
      return;
    }

    setConfirmingOrderId(id);
    setConfirmModalVisible(true);
  };

  // Hàm xử lý xác nhận đã giao hàng
  const handleConfirmDelivery = async () => {
    if (!confirmingOrderId) return;

    setConfirmLoading(true);
    try {
      await ConfirmOrderDelivered(confirmingOrderId);

      // Cập nhật lại trạng thái đơn hàng trong state
      const updatedOrders = orders.map(order => {
        if (order.id === confirmingOrderId) {
          // Cập nhật trạng thái thành "completed"
          const newStatus = 'completed';
          const statusInfo = statusConfig[newStatus];

          return {
            ...order,
            status: newStatus,
            statusText: statusInfo.text,
            statusColor: statusInfo.color,
            statusIcon: statusInfo.icon
          };
        }
        return order;
      });

      setOrders(updatedOrders);
      message.success('Đã xác nhận nhận hàng thành công!');

      // Đóng modal xác nhận
      setConfirmModalVisible(false);
    } catch (error) {
      console.error('Error confirming delivery:', error);
      notification.error({
        message: 'Không thể xác nhận đã giao hàng',
        description: 'Đã xảy ra lỗi khi xác nhận. Vui lòng thử lại sau.'
      });
    } finally {
      setConfirmLoading(false);
    }
  };

  // Hàm hủy xác nhận
  const handleCancelConfirm = () => {
    setConfirmModalVisible(false);
    setConfirmingOrderId(null);
  };

  // Hàm mở modal chi tiết đơn hàng
  const showOrderDetail = async (id) => {
    try {
      setLoadingOrderDetail(true);
      // Hiển thị thông báo đang tải
      const loadingMessage = message.loading({
        content: "Đang tải thông tin chi tiết...",
        duration: 0,
      });

      // Fetch chi tiết đơn hàng từ API
      const response = await GetOrderDetail(id);

      // Đóng thông báo đang tải
      loadingMessage();

      // Cập nhật dữ liệu và hiển thị modal
      setSelectedOrder(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      notification.error({
        message: 'Không thể tải thông tin đơn hàng',
        description: 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.'
      });
    } finally {
      setLoadingOrderDetail(false);
    }
  };

  // Xử lý đóng modal
  const handleCloseModal = () => {
    setDetailModalVisible(false);
  };

  // Kiểm tra xem button xác nhận giao hàng có nên hiển thị không (chỉ hiện với đơn đã giao)
  const shouldShowConfirmButton = (status) => {
    return status === 'delivered';
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {tabItems.map((tab) => (
          <Tabs.TabPane tab={<span className="text-base font-medium">{tab.label}</span>} key={tab.key} />
        ))}
      </Tabs>

      <Search
        placeholder="Tìm kiếm theo tên sản phẩm, người bán, mã đơn hàng..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        className="mb-6 w-full bg-blue-500 rounded-lg"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="text-center py-10">
          <Empty description="Chưa có đơn mua cho mục này" />
        </div>
      ) : (
        filteredOrders.map((order) => (
          <Card key={order.id} className="border rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="flex items-center gap-3">
                <Avatar size={30} src={order.shopAvatar} icon={<ShopOutlined />} />
                <span className="font-semibold text-base">{order.shopName}</span>
              </div>
              <Tag color={order.statusColor} icon={order.statusIcon}>
                {order.statusText}
              </Tag>
            </div>

            <div className="space-y-4 border-b pb-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4">
                  <Image
                    width={60}
                    height={60}
                    src={item.imageUrl}
                    alt={item.name}
                    fallback="https://source.unsplash.com/60x60/?product"
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-gray-500">{item.grade} {item.scale}</p>
                  </div>
                  <p className="text-red-500 font-semibold">{formatCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <div className="mt-3 text-gray-500 text-sm">
              <p>Mã đơn hàng: {order.code} | Ngày đặt: {order.createdAt}</p>
            </div>

            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-gray-500">Phí vận chuyển: {formatCurrency(order.deliveryFee)}</p>
                <p className="text-lg font-semibold text-red-500">Thành tiền: {order.formattedTotal}</p>
              </div>
              <div className="flex gap-3">
                {shouldShowConfirmButton(order.status) && (
                  <Button
                    type="primary" danger
                    onClick={() => showConfirmDeliveredModal(order.id)}
                    icon={<CheckCircleOutlined />}
                  >
                    Xác nhận đã nhận hàng
                  </Button>
                )}
                <Button
                  type="primary"
                  className="bg-blue-500"
                  onClick={() => showOrderDetail(order.id)}
                  loading={loadingOrderDetail}
                  icon={<EyeOutlined />}
                >
                  Xem chi tiết đơn mua
                </Button>
              </div>
            </div>
          </Card>
        ))
      )}

      {/* Modal xác nhận đơn hàng đã giao */}
      <Modal
        title={
          <div className="flex items-center gap-2 text-base uppercase font-bold text-red-600">
            <QuestionCircleOutlined className="text-red-500" />
            Xác nhận đã nhận hàng
          </div>
        }
        open={confirmModalVisible}
        onCancel={handleCancelConfirm}
        confirmLoading={confirmLoading}
        centered
        footer={[
          <Button key="cancel" onClick={handleCancelConfirm}>
            Hủy
          </Button>,
          <Button
            key="confirm"
            type="primary"
            danger
            onClick={handleConfirmDelivery}
            loading={confirmLoading}
          >
            Xác nhận đã nhận hàng
          </Button>,
        ]}
      >
        <div className="py-4">
          <p className="text-base mb-3">
            Bạn xác nhận đã nhận được hàng và kiểm tra hàng hóa đầy đủ?
          </p>
          <p className="text-gray-500">
            Lưu ý: Sau khi xác nhận, bạn sẽ không thể khiếu nại về tình trạng đơn hàng. Vui lòng kiểm tra kỹ trước khi tiếp tục.
          </p>
        </div>
      </Modal>


      {/* Modal chi tiết đơn hàng */}
      {selectedOrder && (
        <OrderHistoryDetail
          visible={detailModalVisible}
          onClose={handleCloseModal}
          orderData={selectedOrder}
        />
      )}
    </div>
  );
};

export default OrderHistory;