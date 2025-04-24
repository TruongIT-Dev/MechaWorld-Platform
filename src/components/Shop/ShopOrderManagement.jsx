import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Table, Row, Tag, Button, Dropdown, Modal, message, Upload, Space, Tooltip, Input, Select } from "antd";
import { StopOutlined, EllipsisOutlined, UserOutlined, DollarOutlined, WalletOutlined, BankOutlined, MobileOutlined, CreditCardOutlined, ClockCircleOutlined, CheckCircleOutlined, GiftOutlined, CarOutlined, FileTextOutlined, CheckOutlined, CloseCircleOutlined, QuestionCircleOutlined, MessageOutlined, EyeOutlined } from "@ant-design/icons";

import { GetOrder, ConfirmOrder } from "../../apis/Sellers/APISeller";
import { PackagingOrder } from '../../apis/Orders/APIOrder';

// Trạng thái đơn hàng với màu sắc tương ứng
const orderStatusColors = {
  pending: "orange",
  packaging: "blue",
  delivering: "purple",
  delivered: "green",
  completed: "green",
  failed: "red",
  canceled: "red",
};

// Định dạng số tiền với đơn vị VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

function ShopOrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const userId = useSelector((state) => state.auth.user?.id);
  const [isModalPackageVisible, setIsModalPackageVisible] = useState(false);
  const [isModalPackageCheckVisible, setIsModalPackageCheckVisible] = useState(false);
  const [packagingImages, setPackagingImages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrderImage, setSelectedOrderImage] = useState([]);

  // Xử lý thay đổi trạng thái đơn hàng
  const handleAction = async (record, actionKey) => {
    if (actionKey === "accept") {
      try {
        setLoading(true);
        const response = await ConfirmOrder(record.seller_id, record.id);
        if (response.status === 200) {
          message.success("Đơn hàng đã được xác nhận thành công!");
          fetchOrders(); // Tải lại danh sách đơn hàng
        } else {
          message.error("Không thể xác nhận đơn hàng!");
        }
      } catch (error) {
        console.error("Error confirming order:", error);
        message.error("Đã xảy ra lỗi khi xác nhận đơn hàng!");
      } finally {
        setLoading(false);
      }
    } else if (actionKey === "cancel") {
      Modal.confirm({
        title: 'Xác nhận hủy đơn hàng',
        content: `Bạn có chắc chắn muốn hủy đơn hàng ${record.code} không?`,
        okText: 'Xác nhận hủy',
        cancelText: 'Hủy',
        okButtonProps: { danger: true },
        onOk: () => {
          message.success("Đã gửi yêu cầu hủy đơn hàng thành công!");
          // Implement API call to cancel order
        }
      });
    }
  };

  const handleModal = (record) => {
    setSelectedOrder(record);
    setPackagingImages([]);
    setIsModalPackageVisible(true);
  };

  const handleModalCheck = (record) => {
    setSelectedOrderImage(record.packaging_image_urls || []);
    setIsModalPackageCheckVisible(true);
  };

  const fetchOrders = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await GetOrder(userId);

      if (response && response.data) {
        // Chuyển đổi dữ liệu từ API sang định dạng phù hợp với Table
        const formattedOrders = response.data.map((item, index) => {
          const order = item.order;
          const orderItems = item.order_items || [];

          // Thêm key cho mỗi đơn hàng để Ant Design Table nhận dạng
          return {
            key: index,
            ...order,
            buyer_name: `Khách hàng #${order.buyer_id.substring(0, 8)}`,
            items: orderItems,
            order_items: orderItems,
          };
        });

        setOrders(formattedOrders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      message.error("Không thể tải danh sách đơn hàng!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const handlePackagingConfirm = async () => {
    if (!selectedOrder || packagingImages.length === 0) {
      message.warning("Vui lòng tải lên ít nhất một hình ảnh đóng gói!");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();

      packagingImages.forEach((file) => {
        formData.append("package_images", file.originFileObj);
      });

      const response = await PackagingOrder(selectedOrder.seller_id, selectedOrder.id, formData);

      if (response.status === 200) {
        message.success("Xác nhận đóng gói thành công!");
        setIsModalPackageVisible(false);
        fetchOrders(); // Tải lại danh sách đơn hàng
      } else {
        message.error("Xác nhận đóng gói thất bại!");
      }
    } catch (error) {
      console.error("Error while packaging order:", error);
      message.error("Đã xảy ra lỗi khi xác nhận đóng gói!");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = ({ fileList }) => {
    // Giới hạn số lượng hình ảnh tối đa là 5
    if (fileList.length > 5) {
      message.warning("Chỉ có thể tải lên tối đa 5 ảnh!");
      return;
    }
    setPackagingImages(fileList);
  };

  // Lọc đơn hàng theo tìm kiếm và trạng thái
  const filteredOrders = orders.filter(order => {
    const codeMatch = order.code.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = statusFilter ? order.status === statusFilter : true;
    return codeMatch && statusMatch;
  });

  // Cột dữ liệu của bảng
  const columns = [
    {
      title: "Mã đơn hàng",
      dataIndex: "code",
      width: 150,
      render: (code) => <span className="font-semibold">{code}</span>,
    },
    // {
    //   title: "Khách hàng",
    //   dataIndex: "buyer_name",
    //   width: 150,
    //   render: (buyerName) => (
    //     <div className="flex items-center">
    //       <UserOutlined className="mr-2 text-blue-500" />
    //       <span>{buyerName}</span>
    //     </div>
    //   ),
    // },
    {
      title: "Sản phẩm",
      dataIndex: "items",
      width: 200,
      render: (_, record) => {
        const items = record.order_items || [];
        return (
          <div>
            {items.map((item, index) => (
              <div key={index} className="flex items-center mb-1">
                {item.image_url && (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-10 h-10 mr-2 object-cover rounded"
                  />
                )}
                <Tooltip title={`${item.name} (${item.quantity}x)`}>
                  <span className="truncate">{item.name}</span>
                </Tooltip>
              </div>
            ))}
          </div>
        );
      }
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_amount",
      width: 140,
      render: (total) => <span className="text-red-500 font-semibold">{formatCurrency(total)} đ</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "created_at",
      width: 130,
      render: (date) => {
        const orderDate = new Date(date);
        return (
          <span>
            {orderDate.toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </span>
        );
      },
    },
    {
      title: "Thanh toán",
      dataIndex: "payment_method",
      width: 130,
      render: (method) => {
        const paymentIcons = {
          'cod': <DollarOutlined className="text-green-500 mr-1" />,
          'wallet': <WalletOutlined className="text-blue-500 mr-1" />,
          'bank': <BankOutlined className="text-purple-500 mr-1" />,
          'momo': <MobileOutlined className="text-pink-500 mr-1" />
        };

        const paymentLabels = {
          'cod': 'Tiền mặt',
          'wallet': 'Ví điện tử',
          'bank': 'Ngân hàng',
          'momo': 'MoMo'
        };

        return (
          <div className="flex items-center">
            {paymentIcons[method] || <CreditCardOutlined className="mr-1" />}
            <span>{paymentLabels[method] || method}</span>
          </div>
        );
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (status) => {
        const statusConfig = {
          'pending': { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xử lý' },
          'packaging': { color: 'purple', icon: <GiftOutlined />, text: 'Đang đóng gói' },
          'delivering': { color: 'blue', icon: <CarOutlined />, text: 'Đang vận chuyển' },
          'delivered': { color: 'cyan', icon: <CheckOutlined />, text: 'Đã giao hàng' },
          'completed': { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã hoàn thành' },
          'failed': { color: 'red', icon: <CloseCircleOutlined />, text: 'Giao hàng thất bại' },
          'canceled': { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' }
        };

        const config = statusConfig[status] || { color: 'default', icon: <QuestionCircleOutlined />, text: status };

        return (
          <Tag color={config.color} icon={config.icon} className="px-2 py-1">
            {config.text}
          </Tag>
        );
      }
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      width: 150,
      render: (note) => (
        note && note.trim() ?
          <Tooltip title={note}>
            <div className="truncate max-w-xs cursor-help">
              <MessageOutlined className="mr-1 text-gray-500" />{note}
            </div>
          </Tooltip>
          :
          <span className="text-gray-400">Không có</span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: 'right',
      width: 100,
      render: (_, record) => {
        const menuItems = [];

        if (record.status === "pending") {
          menuItems.push({
            key: "accept",
            label: "Xác nhận đơn",
            icon: <CheckOutlined className="text-green-500" />,
            onClick: () => handleAction(record, "accept")
          });
        }

        if (record.is_packaged) {
          menuItems.push({
            key: "viewPackage",
            label: "Xem đóng gói",
            icon: <EyeOutlined className="text-blue-500" />,
            onClick: () => handleModalCheck(record)
          });
        }

        if (record.status === "packaging" && !record.is_packaged) {
          menuItems.push({
            key: "packaged",
            label: "Đã đóng gói",
            icon: <GiftOutlined className="text-purple-500" />,
            onClick: () => handleModal(record)
          });
        }

        menuItems.push({
          key: "detail",
          label: "Chi tiết",
          icon: <FileTextOutlined className="text-blue-500" />
        });

        if (["pending", "confirmed", "packaging"].includes(record.status)) {
          menuItems.push({
            key: "cancel",
            label: "Hủy đơn",
            icon: <StopOutlined className="text-red-500" />,
            danger: true,
            onClick: () => handleAction(record, "cancel")
          });
        }

        return (
          <Space size="small">
            <Dropdown menu={{ items: menuItems }} placement="bottomRight" trigger={['click']}>
              <Button type="text" icon={<EllipsisOutlined />} className="flex items-center justify-center" />
            </Dropdown>
          </Space>
        );
      },
    },
  ];

  return (
    <div className="p-4">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-semibold mb-6">Quản lý đơn hàng</h2>

      {/* Thanh công cụ */}
      <Row className="mb-4 flex items-center gap-4">
        {/* Tìm kiếm sản phẩm */}
        <Input.Search
          placeholder="Tìm kiếm theo mã đơn hàng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          allowClear
          className="w-1/3"
        />

        {/* Bộ lọc trạng thái */}
        <Select
          placeholder="Lọc theo trạng thái"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          allowClear
          style={{ width: 180 }}
          options={[
            { value: "", label: "Tất cả trạng thái" },
            ...Object.keys(orderStatusColors).map(status => ({
              value: status,
              label: (() => {
                const statusLabels = {
                  'pending': 'Chờ xử lý',
                  'packaging': 'Đang đóng gói',
                  'delivering': 'Đang vận chuyển',
                  'delivered': 'Đã giao hàng',
                  'completed': 'Đã hoàn thành',
                  'failed': 'Giao hàng thất bại',
                  'canceled': 'Đã hủy'
                };
                return statusLabels[status] || status;
              })()
            }))
          ]}
        />

        {/* Nút tải lại */}
        <Button
          type="primary"
          onClick={fetchOrders}
          loading={loading}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Tải lại
        </Button>
      </Row>

      {/* Bảng hiển thị đơn hàng */}
      <Table
        columns={columns}
        dataSource={filteredOrders}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ x: 1300, y: 550 }}
        loading={loading}
        locale={{ emptyText: "Không có đơn hàng nào" }}
      />

      {/* Modal đóng gói sản phẩm */}
      <Modal
        title="Xác nhận đóng gói sản phẩm"
        open={isModalPackageVisible}
        onCancel={() => setIsModalPackageVisible(false)}
        footer={[
          <Button key="back" onClick={() => setIsModalPackageVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handlePackagingConfirm}
            loading={loading}
            className="bg-blue-500 hover:bg-blue-600"
          >
            Xác nhận đóng gói
          </Button>
        ]}
      >
        <div className="mb-4">
          <p className="font-medium mb-2">Mã đơn hàng: {selectedOrder?.code}</p>
          <p className="text-red-500 font-medium">
            Yêu cầu shop gửi ảnh xác thực đã đóng gói sản phẩm. Sau khi xác thực, bên vận chuyển sẽ bắt đầu lấy hàng. Nếu mặt hàng không khớp với hình ảnh đã xác thực, Shop sẽ chịu trách nhiệm bồi thường.
          </p>
        </div>
        <div className="mt-6">
          <label className="font-bold">
            <span className="text-red-500">*</span> Ảnh xác thực đóng gói (tối đa 5 ảnh)
          </label>
          <br />
          <Upload
            multiple
            listType="picture-card"
            fileList={packagingImages}
            onChange={handleImageUpload}
            beforeUpload={() => false} // Không tự động upload lên server
            maxCount={5}
          >
            {packagingImages.length < 5 && "+ Thêm ảnh"}
          </Upload>
        </div>
      </Modal>

      {/* Modal xem ảnh đóng gói */}
      <Modal
        title="Hình ảnh đóng gói sản phẩm"
        open={isModalPackageCheckVisible}
        onCancel={() => setIsModalPackageCheckVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalPackageCheckVisible(false)}>
            Đóng
          </Button>
        ]}
        width={800}
      >
        {selectedOrderImage && selectedOrderImage.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {Array.isArray(selectedOrderImage) && selectedOrderImage.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt={`Đóng gói ${index + 1}`}
                  className="w-full h-auto rounded shadow"
                />
                <div className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  Ảnh {index + 1}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">Không có hình ảnh đóng gói nào</p>
        )}
      </Modal>
    </div>
  );
}

export default ShopOrderManagement;