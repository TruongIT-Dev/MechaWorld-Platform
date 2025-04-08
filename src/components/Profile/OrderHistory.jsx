import { useState, useEffect } from "react";
import { Tabs, Input, Card, Button, Tag, Avatar, Spin, message } from "antd";
import { SearchOutlined, ShopOutlined, MessageOutlined } from "@ant-design/icons";
import { GetListOrderHistory, GetShopInfoById } from "../../apis/Get";

const { Search } = Input;

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [ordersByShop, setOrdersByShop] = useState([]);
  const [loading, setLoading] = useState(false);


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
        shop_name: `Shop ${sellerId.slice(0, 4)}...`,
        shop_avatar: "https://source.unsplash.com/40x40/?shop"
      };
    }
  };


  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await GetListOrderHistory();
      const rawOrders = response.data;

      // Lấy danh sách seller_id duy nhất
      const sellerIds = [...new Set(rawOrders.map(o => o.seller_id))];

      // Gọi song song API lấy thông tin shop
      const sellerInfoMap = {};
      await Promise.all(sellerIds.map(async (id) => {
        const info = await fetchShopInfo(id);
        console.log("fetchShopInfo", info);

        sellerInfoMap[id] = info;
      }));

      // Gom đơn theo shop
      const grouped = rawOrders.reduce((acc, order) => {
        const sellerId = order.seller_id;
        if (!acc[sellerId]) {
          const shopInfo = sellerInfoMap[sellerId];
          acc[sellerId] = {
            shopName: shopInfo.full_name,
            shopIcon: shopInfo.avatar_url,
            status: convertStatus(order.status),
            statusColor: getStatusColor(order.status),
            orders: [],
            totalPrice: formatCurrency(order.total_amount),
          };
        }

        acc[sellerId].orders.push({
          id: order.id,
          productName: `Đơn hàng #${order.code}`,
          image: "https://source.unsplash.com/100x100/?package",
          quantity: 1,
          price: formatCurrency(order.total_amount),
        });

        return acc;
      }, {});

      setOrdersByShop(Object.values(grouped));
    } catch (error) {
      console.error("Fetch error", error);
      message.error("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const convertStatus = (status) => {
    const map = {
      pending: "Chờ xử lý",
      packing: "Đang đóng gói",
      shipping: "Đang giao hàng",
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
      packing: "blue",
      shipping: "cyan",
      delivered: "lime",
      completed: "green",
      cancelled: "red",
      failed: "volcano",
    };
    return colorMap[status] || "default";
  };

  const formatCurrency = (number) =>
    new Intl.NumberFormat("vi-VN").format(number) + "đ";

  const tabItems = [
    { key: "all", label: "Tất cả" },
    { key: "pending", label: "Chờ xử lý" },
    { key: "packing", label: "Đang đóng gói" },
    { key: "shipping", label: "Đang giao hàng" },
    { key: "delivered", label: "Đã giao thành công" },
    { key: "completed", label: "Hoàn tất" },
    { key: "cancelled", label: "Bị hủy" },
    { key: "failed", label: "Thất bại" },
  ];

  // Lọc đơn theo tab (status)
  const filteredOrders =
    activeTab === "all"
      ? ordersByShop
      : ordersByShop.filter((shop) => shop.status === convertStatus(activeTab));

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
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
      />

      {loading ? (
        <div className="text-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        filteredOrders.map((shop, index) => (
          <Card key={index} className="border rounded-lg shadow-sm mb-4">
            <div className="flex justify-between items-center border-b pb-2 mb-4">
              <div className="flex items-center gap-3">
                <Avatar size={30} src={shop.shopIcon} icon={<ShopOutlined />} />
                <span className="font-semibold text-base">{shop.shopName}</span>
                <Tag color={shop.statusColor}>{shop.status}</Tag>
              </div>
              <div className="flex gap-2">
                <Button icon={<MessageOutlined />} size="small">Chat</Button>
                <Button size="small">Xem Shop</Button>
              </div>
            </div>

            <div className="space-y-4 border-b pb-4">
              {shop.orders.map((order) => (
                <div key={order.id} className="flex items-center gap-4">
                  <Avatar shape="square" size={40} src={order.image} />
                  <div className="flex-1">
                    <p className="font-semibold">{order.productName}</p>
                  </div>
                  <p className="text-red-500 font-semibold">{order.price}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center mt-4">
              <p className="text-lg font-semibold text-red-500">Thành tiền: {shop.totalPrice}</p>
              <Button type="primary" className="bg-blue-500">Xem chi tiết</Button>
            </div>
          </Card>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
