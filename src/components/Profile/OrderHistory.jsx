import { useState, useEffect } from "react";
import { Tabs, Input, Card, Button, Tag, Avatar, Spin, message, Image, Empty, notification } from "antd";
import { SearchOutlined, ShopOutlined, MessageOutlined } from "@ant-design/icons";

import { GetListOrderHistory, GetOrderDetail } from "../../apis/Orders/APIOrder";
import { GetShopInfoById } from "../../apis/Seller Profile/APISellerProfile";
import OrderHistoryDetail from "./OrderHistoryDetail";

const { Search } = Input;

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Thêm state cho modal trong component OrderHistory
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

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

        return {
          id: order.id,
          code: order.code,
          shopId: order.seller_id,
          shopName: shopInfo.shop_name || `Shop ${order.seller_id.slice(0, 4)}...`,
          shopAvatar: shopInfo.avatar_url,
          status: order.status,
          statusText: convertStatus(order.status),
          statusColor: getStatusColor(order.status),
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
      packaging: "blue",
      delivering: "cyan",
      delivered: "lime",
      completed: "green",
      cancelled: "red",
      failed: "volcano",
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


  // Hàm mở modal chi tiết đơn hàng
  const showOrderDetail = async (id) => {
    try {
      // Fetch chi tiết đơn hàng từ API
      const response = await GetOrderDetail(id);
      console.log(response);

      setSelectedOrder(response.data);
      setDetailModalVisible(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      notification.error({
        message: 'Không thể tải thông tin đơn hàng',
        description: 'Đã xảy ra lỗi khi tải chi tiết đơn hàng.'
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        {tabItems.map((tab) => (
          <Tabs.TabPane tab={<span className="text-lg font-medium">{tab.label}</span>} key={tab.key} />
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
              <Tag color={order.statusColor}>{order.statusText}</Tag>
              {/* <div className="flex gap-2">
                <Button icon={<MessageOutlined />} size="small">Chat</Button>
                <Button size="small">Xem Shop</Button>
              </div> */}
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
              {/* <p>Phương thức thanh toán: {order.paymentMethod}</p> */}
            </div>

            <div className="flex justify-between items-center mt-3">
              <div>
                <p className="text-gray-500">Phí vận chuyển: {formatCurrency(order.deliveryFee)}</p>
                <p className="text-lg font-semibold text-red-500">Thành tiền: {order.formattedTotal}</p>
              </div>
              <Button
                type="primary"
                className="bg-blue-500"
                onClick={() => showOrderDetail(order.id)}
              >
                Xem chi tiết
              </Button>
            </div>

            {/* Thêm Modal chi tiết đơn hàng */}
            <OrderHistoryDetail
              visible={detailModalVisible}
              onClose={() => setDetailModalVisible(false)}
              orderData={selectedOrder}
            />
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderHistory;