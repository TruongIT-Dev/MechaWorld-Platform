import { useState } from "react";
import { Table, Row, Input, Tag, Button, Dropdown } from "antd";
import { MoreOutlined } from "@ant-design/icons";

// Trạng thái đơn hàng với màu sắc tương ứng
const orderStatusColors = {
  Pending: "orange",
  Accepted: "blue",
  Sold: "green",
  Cancel: "red",
};

// Cột dữ liệu của bảng
const columns = (handleAction) => [
  {
    title: "Mã đơn hàng",
    dataIndex: "code",
    width: 150,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    width: 450,
  },
  {
    title: "Người mua",
    dataIndex: "buyer",
    width: 100,
  },
  {
    title: "Giá bán",
    dataIndex: "price",
    width: 150,
    render: (price) => <span className="text-red-500 font-semibold">{price.toLocaleString()} đ</span>,
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status) => (
      <Tag color={orderStatusColors[status] || "volcano"}>{status.toUpperCase()}</Tag>
    ),
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "action",
    width: 60,
    render: (_, record) => {
      const menuItems = [
        { key: "accept", label: "✅ Chấp nhận đơn hàng", onClick: () => handleAction(record, "Accepted") },
        { key: "cancel", label: "❌ Hủy đơn hàng", onClick: () => handleAction(record, "Cancel") },
        { key: "detail", label: "Chi tiết đơn hàng", },
      ];
      
      return (
        <Dropdown menu={{ items: menuItems }}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      );
    },
  },
];

// Dữ liệu đơn hàng mẫu
const initialOrders = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  code: `BUY-GD-${i + 1}`,
  name: `BANDAI MG 1/100 Gundam ${i}`,
  price: 320000 + i * 10000,
  buyer: `Huy ${i}`,
  status: i % 3 === 0 ? "Pending" : "Sold",
}));

function ShopOrderManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Xử lý thay đổi trạng thái đơn hàng
  const handleAction = (record, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.key === record.key ? { ...order, status: newStatus } : order
      )
    );
  };

  // Lọc đơn hàng theo trạng thái và tìm kiếm sản phẩm
  const filteredOrders = orders.filter(
    (order) =>
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (statusFilter ? order.status === statusFilter : true)
  );

  return (
    <div>
      {/* Tiêu đề */}
      <h2 className="text-2xl font-semibold mb-6">Quản lý đơn hàng</h2>

      {/* Thanh công cụ */}
      <Row className="mb-4 flex gap-4">
        {/* Tìm kiếm sản phẩm */}
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className="w-1/3"
        />

        {/* Bộ lọc trạng thái */}
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          {Object.keys(orderStatusColors).map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </Row>

      {/* Bảng hiển thị đơn hàng */}
      <Table
        columns={columns(handleAction)}
        dataSource={filteredOrders}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ y: 550 }}
      />
    </div>
  );
}

export default ShopOrderManagement;
