import { useState } from "react";
import { Tabs, Input, Card, Button, Tag, Avatar } from "antd";
import { SearchOutlined, ShopOutlined, MessageOutlined } from "@ant-design/icons";

const { Search } = Input;

const OrderHistory = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Fake đơn hàng theo từng cửa hàng
  const [ordersByShop] = useState([
    {
      shopName: "Gundam Store VN",
      shopIcon: "https://source.unsplash.com/40x40/?store",
      status: "Đã Hủy",
      statusColor: "red",
      orders: [
        {
          id: "001",
          productName: "HG 1/144 Gundam Barbatos",
          image: "https://source.unsplash.com/100x100/?gundam",
          quantity: 1,
          price: "950.000",
        },
        {
          id: "002",
          productName: "RG 1/100 Astray Red",
          image: "https://source.unsplash.com/100x100/?gundam",
          quantity: 1,
          price: "1.000.000",
        },
      ],
      totalPrice: "1.950.000",
    },
    {
      shopName: "Mecha Hobby",
      shopIcon: "https://source.unsplash.com/40x40/?toyshop",
      status: "Hoàn Tất",
      statusColor: "green",
      orders: [
        {
          id: "002",
          productName: "RG 1/144 Gundam Wing Zero",
          image: "https://source.unsplash.com/100x100/?robot",
          quantity: 2,
          price: "2.400.000",
        },
      ],
      totalPrice: "2.400.000",
    },
  ]);

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

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Tabs */}
      <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
        {tabItems.map((tab) => (
          <Tabs.TabPane tab={<span className="text-lg font-medium">{tab.label}</span>} key={tab.key} />
        ))}
      </Tabs>

      {/* Search Input */}
      <Search
        placeholder="Tìm kiếm theo tên sản phẩm, người bán, mã đơn hàng..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        className="mb-6 w-full bg-blue-500 rounded-lg"
      />

      {/* Hiển thị danh sách đơn hàng theo từng cửa hàng */}
      {ordersByShop.map((shop, index) => (
        <Card key={index} className="border rounded-lg shadow-sm mb-4">
          
          {/* Header - Tên cửa hàng + Nút Chat / Xem Shop */}
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

          {/* Danh sách sản phẩm */}
          <div className="space-y-4 border-b pb-4">
            {shop.orders.map((order) => (
              <div key={order.id} className="flex items-center gap-4">
                <Avatar shape="square" size={40} src={order.image} />
                <div className="flex-1">
                  <p className="font-semibold">{order.productName}</p>
                </div>
                <p className="text-red-500 font-semibold">{order.price}đ</p>
              </div>
            ))}
          </div>

          {/* Footer - Tổng tiền & Nút hành động */}
          <div className="flex justify-between items-center mt-4">
            <p className="text-lg font-semibold text-red-500">Thành tiền: {shop.totalPrice}đ</p>
            <Button type="primary" className="bg-blue-500">Xem chi tiết</Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default OrderHistory;
