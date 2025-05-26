import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { CheckCircleOutlined, MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Row, Button, Select, Input, Modal, Dropdown, Form, Tag, Col, Typography, message, Alert, Card } from "antd";

import { SellingGundam, RestoreGundam } from "../../../apis/Sellers/APISeller";
import { GetGundamByID } from '../../../apis/User/APIUser';
import { GetSellerStatus } from "../../../apis/Sellers/APISeller";
import { incrementListingsUsed, decrementListingsUsed, updateSellerPlan } from '../../../features/user/userSlice';


function ShopProduct({ isCreating, setIsCreating }) {

  // console.log("setIsCreating", setIsCreating);


  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const user = useSelector((state) => state.auth.user);

  const [gundamList, setGundamList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [loading, setLoading] = useState(false);

  // Modal Xác nhận Đăng bán Sản phẩm
  const [confirmSell, setConfirmSell] = useState(false);
  const [isConfirmedSell, setIsConfirmedSell] = useState(false);

  // Modal Xác nhận Hủy Đăng bán - Trao đổi - Đấu giá 1 sản phẩm
  const [confirmInActiveProduct, setConfirmInActiveProduct] = useState({
    visible: false,
    type: '',
    record: null,
    title: '',
    content: '',
    okText: '',
    cancelText: 'Hủy'
  });

  // Hàm để cập nhật seller status từ API
  const updateSellerStatus = async () => {
    try {
      const res = await GetSellerStatus(user.id);
      dispatch(updateSellerPlan(res.data));
      return res.data;
    } catch (err) {
      console.error("Error updating seller status", err);
      return null;
    }
  };

  const fetchGundamList = async (searchTerm = "") => {
    try {
      const response = await GetGundamByID(user.id, searchTerm);
      setGundamList(response.data);
      setFilteredData(response.data);
      // console.log("Dử liệu gundam: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchGundamList();
  }, []);

  const handleSellProduct = async (product) => {
    setLoading(true);
    try {
      // Gọi API đăng bán
      await SellingGundam(user.id, product.gundam_id);

      // Cập nhật trạng thái sản phẩm trong danh sách local
      const updatedList = gundamList.map(item => {
        if (item.gundam_id === product.gundam_id) {
          return { ...item, status: "published" };
        }
        return item;
      });

      setGundamList(updatedList);
      applyFilters(updatedList); // Áp dụng lại bộ lọc với danh sách mới

      // Cập nhật bộ đếm số lượng sản phẩm đăng bán trong Redux
      dispatch(incrementListingsUsed());

      // Hoặc có thể cập nhật toàn bộ thông tin seller từ API (đảm bảo chính xác)
      await updateSellerStatus();

      return true;
    } catch (error) {
      console.error("Lỗi khi đăng bán sản phẩm:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreProduct = async (product) => {
    setLoading(true);
    try {
      // Gọi API hủy đăng bán
      await RestoreGundam(user.id, product.gundam_id);

      // Cập nhật trạng thái sản phẩm trong danh sách local
      const updatedList = gundamList.map(item => {
        if (item.gundam_id === product.gundam_id) {
          return { ...item, status: "in store" };
        }
        return item;
      });

      setGundamList(updatedList);
      applyFilters(updatedList); // Áp dụng lại bộ lọc với danh sách mới

      // Cập nhật bộ đếm số lượng sản phẩm đăng bán trong Redux
      dispatch(decrementListingsUsed());

      // Hoặc có thể cập nhật toàn bộ thông tin seller từ API (đảm bảo chính xác)
      await updateSellerStatus();

      return true;
    } catch (error) {
      console.error("Lỗi khi hủy bán sản phẩm:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleAuctionProduct = (product) => {
    setSelectedProduct(product);
    setSellModalVisible(true);
  };

  // Hàm xử lý menu click với modal cảnh báo
  const handleMenuClick = async (key, record) => {
    switch (key) {
      case "edit":
        console.log("📝 Chỉnh sửa sản phẩm:", record);
        // Không cần modal cảnh báo cho edit
        break;

      case "delete":
        setConfirmInActiveProduct({
          visible: true,
          type: 'delete',
          record: record,
          title: 'Xác nhận xóa sản phẩm',
          content: `Bạn có chắc chắn muốn xóa sản phẩm "${record.name}"? Hành động này không thể hoàn tác.`,
          okText: 'Xóa sản phẩm',
          cancelText: 'Hủy'
        });
        break;

      case "unsell":
        setConfirmInActiveProduct({
          visible: true,
          type: 'unsell',
          record: record,
          title: 'Xác nhận hủy bán sản phẩm',
          content: `Bạn có chắc chắn muốn hủy bán sản phẩm "${record.name}"? Sản phẩm sẽ không còn hiển thị trên cửa hàng.`,
          okText: 'Hủy bán',
          cancelText: 'Không'
        });
        break;

      default:
        console.log("⚠️ Không có hành động nào được chọn!");
    }
  };


  // Hàm xử lý xác nhận modal
  const handleConfirmAction = async () => {
    const { type, record } = confirmInActiveProduct;

    try {
      switch (type) {
        case 'delete':
          console.log("❌ Xóa sản phẩm:", record);
          // Thực hiện xóa sản phẩm
          // await deleteProduct(record);
          message.success('Đã xóa sản phẩm thành công!');
          break;

        case 'unsell':
          console.log("🚫 Hủy bán sản phẩm:", record);
          await handleRestoreProduct(record);
          message.success('Đã hủy bán sản phẩm thành công!');
          break;
      }
    } catch (error) {
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setConfirmInActiveProduct({
        visible: false,
        type: '',
        record: null,
        title: '',
        content: '',
        okText: '',
        cancelText: 'Hủy'
      });
    }
  };

  // Hàm áp dụng bộ lọc vào danh sách sản phẩm
  const applyFilters = (dataList) => {
    let filtered = dataList;

    // Lọc theo tình trạng
    if (selectedCondition) {
      filtered = filtered.filter((item) => item.condition === selectedCondition);
    }

    // Lọc theo phân khúc (grade)
    if (selectedGrade) {
      filtered = filtered.filter((item) => item.grade === selectedGrade);
    }

    setFilteredData(filtered);
  };

  // Lọc dữ liệu khi có thay đổi bộ lọc
  useEffect(() => {
    applyFilters(gundamList);
  }, [selectedCondition, selectedGrade, gundamList]);

  const handleFinish = (values) => {
    console.log("data input", values);
    // Xử lý gửi yêu cầu đấu giá và đóng modal
    setSellModalVisible(false);
  }

  const searchGundam = (values) => {
    fetchGundamList(values);
  }

  const resetFilters = () => {
    setSelectedCondition(null);
    setSelectedGrade(null);
    setFilteredData(gundamList);
  }

  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "primary_image_url",
      render: (images) => (
        <img src={images} alt="Gundam" width={100} height={100} style={{ objectFit: "cover" }} />
      ),
      width: 100,
    },
    { title: "Tên Sản Phẩm", dataIndex: "name", key: "name", width: 150 },
    { title: "Phân Khúc", dataIndex: "grade", key: "grade", width: 100 },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${price.toLocaleString()} đ`,
    },
    {
      title: "Tình Trạng",
      dataIndex: "condition",
      key: "condition",
      width: 110,
      filters: [
        { text: "Hàng mới", value: "new" },
        { text: "Đã mở hộp", value: "open box" },
        { text: "Đã qua sử dụng", value: "used" },
      ],
      onFilter: (value, record) => record.condition === value,
      render: (condition) => {
        const conditionMap = {
          new: "Hàng mới",
          "open box": "Đã mở hộp",
          "used": "Đã qua sử dụng",
        };
        return conditionMap[condition] || condition;
      },
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: 180,
      render: (_, value) => {
        const { status } = value;
        const { Text } = Typography;

        const showConfirmModal = () => {
          setConfirmSell(true);
          setSelectedProduct(value);
        };

        const handleConfirmSellProduct = async () => {
          setIsConfirmedSell(true);
          try {
            const success = await handleSellProduct(selectedProduct);
            if (success) {
              setConfirmSell(false);
            }
          } finally {
            setIsConfirmedSell(false);
            setSelectedProduct(null);
          }
        };

        // Giả định hàm xử lý khi người dùng bấm nút đấu giá
        const handleAuctionButtonClick = () => {
          handleAuctionProduct(value);
        };

        if (status === "in store") {
          return (
            <>
              <div className="flex flex-col space-y-2">
                <Button
                  type="primary"
                  color='green'
                  className="bg-green-500 hover:bg-green-300 w-28"
                  onClick={showConfirmModal}
                  loading={loading && selectedProduct?.gundam_id === value.gundam_id}
                >
                  Đăng bán
                </Button>
                <Button
                  type='primary'
                  danger
                  className="text-white w-28 bg-red-500"
                  onClick={handleAuctionButtonClick}
                >
                  Đấu giá
                </Button>
              </div>

              {/* Modal Confirm Đăng bán Sản phẩm */}
              <Modal
                title="Xác nhận đăng bán sản phẩm"
                open={confirmSell}
                onCancel={() => setConfirmSell(false)}
                onOk={handleConfirmSellProduct}
                okText="Xác nhận đăng bán"
                cancelText="Hủy"
                okType="primary"
                confirmLoading={isConfirmedSell}
                width={540}
                className="sell-product-modal"
                okButtonProps={{
                  icon: <CheckCircleOutlined />,
                  disabled: isConfirmedSell,
                  className: 'bg-blue-500'
                }}
                cancelButtonProps={{
                  disabled: isConfirmedSell
                }}
              >
                <div className="space-y-4">
                  <Alert
                    message={
                      <div className="font-bold uppercase">
                        đăng bán sản phẩm
                      </div>
                    }
                    description={
                      <div className="mt-2">
                        <Text className="text-gray-700">
                          Bạn chắc chắn muốn đăng bán sản phẩm này? <br />
                          Sản phẩm sẽ được bày bán và người mua có thể xem & đặt hàng.
                        </Text>
                      </div>
                    }
                    type="info"
                    showIcon
                    className="border-0 bg-opacity-10"
                  />
                </div>
              </Modal>
            </>
          );
        }

        // Trạng thái khác -> render tag tương ứng
        const statusMap = {
          published: { text: "Đang đăng bán", color: "green" },
          processing: { text: "Đang xử lý đơn hàng", color: "orange" },
          "pending auction approval": { text: "Chờ duyệt đấu giá", color: "yellow" },
          auctioning: { text: "Đang đấu giá", color: "blue" },
          // "for exchange": { text: "", color: "" },
          exchanging: { text: "Đang trao đổi", color: "cyan" },
        };

        const statusTag = statusMap[status];

        return statusTag ? (
          <Tag color={statusTag.color} className="w-full text-sm uppercase font-bold text-center">
            {statusTag.text}
          </Tag>
        ) : (
          <Tag color="red">Không rõ</Tag>
        );
      },
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      width: 100,
      render: (_, record) => {
        const menuItems = [
          { key: "edit", label: "✏️ Chỉnh sửa sản phẩm", },
        ];
        if (record.status === "in store") {
          menuItems.push({ key: "delete", label: "❌ xóa sản phẩm" });
        }
        if (record.status === "published") {
          menuItems.push({ key: "unsell", label: "🚫 Hủy bán sản phẩm" });
        }

        return (
          <>
            <div className="flex items-center justify-center">
              <Dropdown
                menu={{
                  items: menuItems,
                  onClick: ({ key }) => handleMenuClick(key, record),
                }}
              >
                <Button icon={<MoreOutlined />} loading={loading && selectedProduct?.gundam_id === record.gundam_id} />
              </Dropdown>
            </div>


            <Modal
              title={confirmInActiveProduct.title}
              open={confirmInActiveProduct.visible}
              onOk={handleConfirmAction}
              onCancel={() => setConfirmInActiveProduct({ ...confirmInActiveProduct, visible: false })}
              okText={confirmInActiveProduct.okText}
              cancelText={confirmInActiveProduct.cancelText}
              okType={confirmInActiveProduct.type === 'delete' ? 'danger' : 'primary'}
              confirmLoading={loading}
              width={500}
              okButtonProps={{
                icon: <CheckCircleOutlined />,
                className: 'bg-red-500 hover:bg-red-300'
              }}
              className="confirm-action-modal"
            >
              <div className="space-y-4">
                <Alert
                  message={
                    <div className="text-red-500 font-bold text-base">
                      {confirmInActiveProduct.type === 'delete' && 'XÓA SẢN PHẨM'}
                      {confirmInActiveProduct.type === 'unsell' && 'HỦY BÁN SẢN PHẨM'}
                    </div>
                  }
                  description={
                    <div className="mt-2">
                      <Typography.Text className="text-gray-700">{confirmInActiveProduct.content}</Typography.Text>
                    </div>
                  }
                  type={confirmInActiveProduct.type === 'delete' ? 'error' : 'warning'}
                  showIcon
                  className="border-0 bg-opacity-10"
                />
              </div>
            </Modal>
          </>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* Tiêu đề */}
      <h2 className="text-2xl font-bold uppercase">Quản lý sản phẩm</h2>

      <div className="content">
        <div className="filters">
          {/* Search & Filter Section */}
          <Row gutter={[16, 16]} className="mb-4 flex flex-wrap justify-center md:justify-between">
            {/* Search */}
            <Col xs={12} sm={8} md={8}>
              <Input.Search placeholder="Tìm kiếm sản phẩm" onSearch={searchGundam} className="w-full" />
            </Col>

            {/* Filter Condition */}
            <Col xs={12} sm={4} md={4}>
              <Select
                placeholder="Lọc tình trạng"
                allowClear
                className="w-full"
                onChange={setSelectedCondition}
                value={selectedCondition}
              >
                <Select.Option value="new">Hàng mới</Select.Option>
                <Select.Option value="open box">Đã mở hộp</Select.Option>
                <Select.Option value="used">Đã qua sử dụng</Select.Option>
              </Select>
            </Col>

            {/* Filter Category */}
            <Col xs={12} sm={4} md={4}>
              <Select
                placeholder="Lọc phân khúc"
                allowClear
                className="w-full"
                onChange={setSelectedGrade}
                value={selectedGrade}
              >
                {[...new Set(gundamList.map((item) => item.grade))].map((grade) => (
                  <Select.Option key={grade} value={grade}>
                    {grade}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            {/* Earase Filter Button */}
            <Col xs={12} sm={4} md={4}>
              <Button onClick={resetFilters}>Xóa bộ lọc</Button>
            </Col>

            {/* Add More Button */}
            <Col xs={12} sm={4} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-blue-500 hover:bg-[#4a90e2] text-white w-full md:w-auto"
                onClick={() => setIsCreating(true)}
              >
                Thêm sản phẩm
              </Button>
            </Col>
          </Row>
        </div>

        {/* Table Section */}
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ defaultPageSize: 10 }}
          scroll={{ y: 55 * 10 }}
          loading={loading}
          rowKey="gundam_id"
        />

        {/* Auction Modal */}
        <Modal
          title="Đấu giá Sản Phẩm"
          open={sellModalVisible}
          onCancel={() => setSellModalVisible(false)}
          footer={null}
        >
          <Form form={form} onFinish={handleFinish} layout="vertical">
            {[
              { label: "Giá khởi điểm (đ)", name: "start_price" },
              { label: "Bước giá tối thiểu (đ)", name: "step" },
              { label: "Mức cọc (đ)", name: "first_bind" },
              { label: "Giá mua ngay (đ)", name: "final_price" },
            ].map((item) => (
              <Form.Item key={item.name} label={item.label} name={item.name} rules={[{ required: true }]}>
                <Input type="number" className="w-full" />
              </Form.Item>
            ))}

            <Form.Item label="Thời lượng đấu giá (1-7 Ngày)" name="duration" rules={[{ required: true }]}>
              <Input type="number" max={7} min={1} className="w-full" />
            </Form.Item>

            <Form.Item className="flex justify-center">
              <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-400 text-white">
                Gửi yêu cầu đấu giá
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
}

ShopProduct.propTypes = {
  isCreating: PropTypes.bool,
  setIsCreating: PropTypes.func.isRequired,
};


export default ShopProduct;