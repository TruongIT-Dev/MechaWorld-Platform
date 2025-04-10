import { useEffect, useState } from "react";
import { Table, Row, Input, Tag, Button, Dropdown,Modal, message, Upload } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import { getOrder,confirmOrder,packagingOrder } from "../../apis/Order/APIOrder";
import { useSelector } from "react-redux";

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

// Cột dữ liệu của bảng
const columns = (handleAction, handleModal, handleModalCheck) => [
  {
    title: "Mã đơn hàng",
    dataIndex: "code",
    width: 150,
  },
  // {
  //   title: "Tên sản phẩm",
  //   dataIndex: "name",
  //   width: 250,
  // },
  {
    title: "Người mua",
    dataIndex: "buyer_id",
    width: 100,
  },
  {
    title: "Giá trị đơn hàng",
    dataIndex: "items_subtotal",
    width: 150,
    render: (price) => <span className="text-red-500 font-semibold">{price.toLocaleString()} đ</span>,
  },
  {
    title: "Phương thức thanh toán",
    dataIndex: "payment_method",
    width: 110,
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
    title: "Note",
    dataIndex: "note",
    width: 150,
  },
  {
    title: "Hành động",
    dataIndex: "action",
    key: "action",
    width: 150,
    render: (_, record) => {
      const menuItems = [];

      if (record.status === "pending") {
        menuItems.push({ key: "accept", label: "✅ Chấp nhận đơn hàng", onClick: () => handleAction(record, "accept") });
      }

      if (record.is_packaged) {
        menuItems.push({ key: "viewPackage", label: "📦 Xem chi tiết đóng gói" ,onClick: () => handleModalCheck(record)});
      }

      if (record.status === "packaging" && !record.is_packaged) {
        menuItems.push({ key: "packaged", label: "📦 Đã đóng gói sản phẩm", onClick: () => handleModal(record) });
      }

      menuItems.push({ key: "cancel", label: "❌ Hủy đơn hàng", onClick: () => handleAction(record, "cancel") });
      menuItems.push({ key: "detail", label: "Chi tiết đơn hàng" });

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
  items_subtotal: 320000 + i * 10000,
  buyer_id: `Huy ${i}`,
  status: i % 3 === 0 ? "pending" : "packaging",
  payment_method: "Ví điện tử",
  note: "Đơn hàng mẫu",
  is_packaged: i % 2 === 0,
  seller_id: "userId",
}));

function ShopOrderManagement() {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [OrderData, setOrderData] = useState([]);
  const userId = useSelector((state) => state.auth.user.id);
  const [isModalPackageVisible, setIsModalPackageVisible] = useState(false);
  // const [isModalDetailVisible, setIsModalDetailVisible] = useState(false);
  const [isModalPackageCheckVisible, setIsModalPackageCheckVisible] = useState(false);
  const [packagingImages, setPackagingImages] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [selectedOrderImage, setSelectedOrderImage] = useState([]);

  // Xử lý thay đổi trạng thái đơn hàng
  const handleAction = async (record, actionKey) => {
    if (actionKey === "accept") {
      try {
        const response = await confirmOrder(record.seller_id, record.id);
        if (response.status === 200) {
          message.success("Đơn hàng đã được chấp nhận!");
          setOrders((prevOrders) =>
            prevOrders.map((order) =>
              order.key === record.key ? { ...order, status: "Accepted" } : order
            )
          );
        } else {
          message.error("Không thể chấp nhận đơn hàng!");
        }
      } catch (error) {
        console.error("Error confirming order:", error);
        message.error("Đã xảy ra lỗi khi chấp nhận đơn hàng!");
      }
    } else if (actionKey === "cancel") {
      console.log("Xác nhận hủy đơn hàng:", record);
    }
  };
  const handleModal = (record) => {
    setSelectedOrder(record);
    console.log(selectedOrder);
    setIsModalPackageVisible(true);
    console.log(isModalPackageVisible);
  }

  // Lọc đơn hàng theo trạng thái và tìm kiếm sản phẩm
  // const filteredOrders = orders.filter(
  //   (order) =>
  //     order.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
  //     (statusFilter ? order.status === statusFilter : true)
  // );
  
  useEffect(() => {
    const fetchOrders = async () => {
      // Giả lập gọi API để lấy dữ liệu đơn hàng
      
      const response = await getOrder(userId);
      console.log("Orders: ", response.data);
      setOrderData(response.data);
    };

    fetchOrders();
  }
  , []);
  const handlePackagingConfirm = async (sellerId, orderId, packagingImages) => {
    try {
      console.log(packagingImages);
      const formData = new FormData();

      packagingImages.forEach((file) => {
        formData.append("package_images", file.originFileObj);
      });
  
      const response = await packagingOrder(sellerId, orderId, formData);

      console.log("Packaging response: ", response.data);
      if (response.status === 200) {
        message.success("Đóng gói thành công!");
        setIsModalPackageVisible(false);
        setTimeout(() => {
          window.location.reload();
        }, 800);
        
      } else {
        console.error("Đóng gói thất bại!");
      }
    } catch (error) {
      console.error("Error while packaging order:", error);
    }
  
  }
  const handleModalCheck = (record) => {
    // setSelectedOrderImage(record);
    setSelectedOrderImage(record.packaging_images || []);
    setIsModalPackageCheckVisible(true);
    console.log("checking data",record);
    console.log("checking data2",selectedOrderImage);

  }

  const handleSecondaryUpload = ({ fileList }) => {
    // Lọc danh sách ảnh mới chưa có trong packagingImages
    const newFiles = fileList.filter(
      (file) => !packagingImages.some((img) => img.uid === file.uid)
    );
    // Nếu tổng số ảnh mới + ảnh hiện tại > 5 thì báo lỗi
    if (packagingImages.length + newFiles.length > 5) {
      message.error("Chỉ có thể tải lên tối đa 5 ảnh phụ!");
      return;
    }
    console.log("File list sau khi thay đổi:", fileList);
    // Cập nhật state chỉ với ảnh mới
    // setSecondaryImages([...packagingImages, ...newFiles]);
    setPackagingImages(fileList);
  };
  
  // Xử lý khi xóa ảnh
  const handleRemoveImage = (file) => {
    setPackagingImages((prevImages) => prevImages.filter((img) => img.uid !== file.uid));
    console.log("đã xóa");
  };


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
        columns={columns(handleAction, handleModal, handleModalCheck)}
        dataSource={OrderData}
        pagination={{ defaultPageSize: 10 }}
        scroll={{ y: 550 }}
      />
      {/* Modal đóng gói sản phẩm */}
      <Modal
        title="Xác thực dữ liệu"
        open={isModalPackageVisible}
        onCancel={() => setIsModalPackageVisible(false)}
        footer={null}

      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // const formData = new FormData(e.target);
            // const packagingImages = formData.getAll("packaging_images");
            handlePackagingConfirm(selectedOrder.seller_id, selectedOrder.id, packagingImages);
          }}
        >
          <p className="text-red-500 font-semibold">
            Yêu cầu shop gửi ảnh xác thực đã đóng gói sản phẩm. Sau khi xác thực bên vận chuyển sẽ bắt đầu lấy hàng nếu mặt hàng không khớp với hình ảnh đã xác thực thì Shop sẽ chịu trách nhiệm bồi thường.
          </p>
          <div className="mt-6">
            <label className="font-bold">
              <span className="text-red-500">*</span> Ảnh xác thực
            </label>
            <br />
            <Upload
              multiple
              listType="picture-card"
              fileList={packagingImages}
              onChange={handleSecondaryUpload}
              onRemove={handleRemoveImage}
              beforeUpload={() => false} // Không tự động upload lên server
              maxCount={5} // Giới hạn tối đa 5 ảnh
            >
              {packagingImages.length < 5 && "+ Thêm ảnh"}
            </Upload>
          </div>
          <div className="text-right  ">
            <Button type="primary" htmlType="submit" className="bg-blue-400 hover:bg-blue-700">
              Xác thực giao hàng
            </Button>
          </div>
        </form>
      </Modal>
      <Modal
        title="Chi tiết đơn hàng"
        open={isModalPackageCheckVisible}
        onCancel={() => setIsModalPackageCheckVisible(false)}
        footer={null}
      >
        <p>Hình ảnh sản phẩm đóng gói:</p>
        <br />
        <div className="grid grid-cols-2 gap-4">
          {Array.isArray(selectedOrderImage) && selectedOrderImage.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Đóng gói ${index + 1}`}
              className="w-full h-auto rounded shadow"
            />
          ))}

        </div>
      </Modal>
    </div>
  );
}

export default ShopOrderManagement;
