import PropTypes from 'prop-types';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Table, Row, Button, Select, Input, Modal, Dropdown, Form, Tag, Col, Typography,DatePicker,message   } from "antd";

import { SellingGundam, RestoreGundam } from "../../../apis/Sellers/APISeller";
import { GetGundamByID } from '../../../apis/User/APIUser';
import { GetSellerStatus } from "../../../apis/Sellers/APISeller";
import { incrementListingsUsed, decrementListingsUsed, updateSellerPlan } from '../../../features/user/userSlice';
import { CreateAuctionRequest } from '../../../apis/Auction/APIAuction';
import moment from 'moment';

function ShopProduct({ isCreating, setIsCreating }) {

  console.log("setIsCreating", setIsCreating);
  

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const [gundamList, setGundamList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [form] = Form.useForm();
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [loading, setLoading] = useState(false);

    // Modal Xác nhận Đăng bán Sản phẩm
    const [confirmSell, setConfirmSell] = useState(false);
    const [isConfirmedSell, setIsConfirmedSell] = useState(false);

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
        console.log("Dử liệu gundam: ", response.data);
        return response.data;
      } catch (error) {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        return [];
      }
    };

    useEffect(() => {
      fetchGundamList();
    }, []);

const handleFinish = async (values) => {
  try {
    setLoading(true);
    
    // Validate and convert time
    const startTime = values.start_time?.isValid()
      ? values.start_time.startOf('day').toISOString()
      : null;
    
    const endTime = values.end_time?.isValid()
      ? values.end_time.startOf('day').toISOString()
      : null;
    
    if (!startTime || !endTime) {
      throw new Error("Thời gian không hợp lệ");
    }
    
    // Prepare data
    const auctionRequestData = {
      bid_increment: Number(values.step),
      buy_now_price: Number(values.final_price),
      end_time: endTime,
      gundam_id: selectedProduct.gundam_id,
      start_time: startTime,
      starting_price: Number(values.start_price),
    };
    
    console.log("Dữ liệu gửi đi:", auctionRequestData);
    
    // Call API
    const response = await CreateAuctionRequest(user.id, auctionRequestData);
    
    // 1. Tắt modal
    setSellModalVisible(false);
    
    // 2. Hiển thị thông báo thành công
    message.success("Tạo yêu cầu đấu giá thành công!");
    
    // 3. Cập nhật state ngay lập tức mà không cần reload
    // Giả sử bạn có một state gundamList chứa danh sách sản phẩm
    // Bạn cần cập nhật status của sản phẩm vừa được đấu giá
    setGundamList(prevList => 
      prevList.map(item => 
        item.gundam_id === selectedProduct.gundam_id 
          ? { ...item, status: 'pending' } // hoặc status mới tùy API trả về
          : item
      )
    );
    
    // Hoặc nếu bạn sử dụng fetchGundamList để lấy dữ liệu mới
    await fetchGundamList(); // Đảm bảo hàm này cập nhật state đúng cách
    
    // 4. Reset form
    form.resetFields();
    
  } catch (error) {
    console.error("Lỗi khi tạo yêu cầu đấu giá:", error);
    message.error(error.message || "Có lỗi xảy ra khi gửi yêu cầu đấu giá");
  } finally {
    setLoading(false);
  }
};

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

    const handleMenuClick = async (key, record) => {
      switch (key) {
        case "edit":
          console.log("📝 Chỉnh sửa sản phẩm:", record);
          break;

        case "preview":
          console.log("👁️ Xem trước sản phẩm:", record);
          break;

        case "delete":
          console.log("❌ Xóa sản phẩm:", record);
          break;

        case "unsell":
          console.log("🚫 Hủy bán sản phẩm:", record);
          await handleRestoreProduct(record);
          break;

        default:
          console.log("⚠️ Không có hành động nào được chọn!");
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
        width: 100,
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
                    className="bg-green-600 hover:bg-green-500 w-28"
                    onClick={showConfirmModal}
                    loading={loading && selectedProduct?.gundam_id === value.gundam_id}
                  >
                    Đăng bán
                  </Button>
                  <Button
                    className="bg-red-600 hover:bg-red-400 text-white w-28"
                    onClick={handleAuctionButtonClick}
                  >
                    Đấu giá
                  </Button>
                </div>

                {/* Modal Confirm Đăng bán Sản phẩm */}
                <Modal
                  width={500}
                  title="Xác nhận đăng bán sản phẩm"
                  open={confirmSell}
                  onCancel={() => setConfirmSell(false)}
                  footer={[
                    <Button key="cancel" onClick={() => setConfirmSell(false)} disabled={isConfirmedSell}>
                      Hủy
                    </Button>,
                    <Button
                      key="submit"
                      type="primary"
                      onClick={handleConfirmSellProduct}
                      loading={isConfirmedSell}
                      danger
                    >
                      Xác nhận đăng bán
                    </Button>
                  ]}
                  centered
                >
                  <div className="flex flex-col items-center text-center py-4">
                    <ExclamationCircleOutlined className="text-blue-500 text-5xl mb-4" />
                    <Text>
                      Bạn chắc chắn muốn đăng bán sản phẩm này chứ? <br />
                      Sản phẩm sẽ được bày bán và người mua có thể xem & đặt hàng.
                    </Text>
                  </div>
                </Modal>
              </>
            );
          }

          // Trạng thái khác -> render tag tương ứng
          const statusMap = {
            auctioning: { text: "Đang đấu giá", color: "blue" },
            published: { text: "Đang bán", color: "green" },
            exchange: { text: "Đang trao đổi", color: "cyan" },
            processing: { text: "Đang xử lý", color: "yellow" },
            pending_auction_approval: { text: "Chờ duyệt đấu giá", color: "yellow" },
          };

          const statusTag = statusMap[status];

          return statusTag ? (
            <Tag color={statusTag.color} className="w-full text-sm font-semibold text-center">
              {statusTag.text.toUpperCase()}
            </Tag>
          ) : (
            <Tag color="default">Không rõ</Tag>
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
            { key: "preview", label: "👁️ Xem trước ", },
          ];
          if (record.status === "in store") {
            menuItems.push({ key: "delete", label: "❌ xóa sản phẩm" });
          }
          if (record.status === "published") {
            menuItems.push({ key: "unsell", label: "🚫 Hủy bán sản phẩm" });
          }

          return (
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
            title="Tạo yêu cầu đấu giá"
            open={sellModalVisible}
            onCancel={() => setSellModalVisible(false)}
            footer={null}
            width={600}
          >
            {selectedProduct && (
              <div className="mb-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center space-x-4">
                  <img 
                    src={selectedProduct.primary_image_url} 
                    alt={selectedProduct.name} 
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-semibold">{selectedProduct.name}</h3>
                    <p>Phân khúc: {selectedProduct.grade}</p>
                    <p>Tình trạng: {selectedProduct.condition === 'new' ? 'Hàng mới' : 
                                    selectedProduct.condition === 'open box' ? 'Đã mở hộp' : 'Đã qua sử dụng'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Form form={form} onFinish={handleFinish} layout="vertical">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="Giá khởi điểm (đ)" 
                    name="start_price" 
                    rules={[
                      { required: true, message: 'Vui lòng nhập giá khởi điểm' },
                      { 
                        pattern: /^[1-9]\d*$/, 
                        message: 'Giá phải là số nguyên dương' 
                      }
                    ]}
                  >
                    <Input 
                      type="number" 
                      className="w-full" 
                      min={1}
                      addonAfter="đ"
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Bước giá tối thiểu (đ)"
                    name="step"
                    rules={[
                      { required: true, message: 'Vui lòng nhập bước giá' },
                      {
                        validator: (_, value) => {
                          const startingPrice = form.getFieldValue('start_price');
                          if (!value || !startingPrice) {
                            return Promise.resolve();
                          }

                          const minStep = Math.max(Math.ceil(startingPrice * 0.03), 10000); // lấy giá trị lớn hơn giữa 3% và 10,000
                          const maxStep = Math.floor(startingPrice * 0.1); // 10%

                          if (value >= minStep && value <= maxStep) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error(`Bước giá phải nằm trong khoảng từ ${minStep.toLocaleString()} đến ${maxStep.toLocaleString()} đ`)
                          );
                        },
                      },
                    ]}
                  >

                    <Input
                      type="number"
                      className="w-full"
                      min={1}
                      addonAfter="đ"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item 
                    label="Giá mua ngay (đ)" 
                    name="final_price" 
                    rules={[
                      { required: true, message: 'Vui lòng nhập giá mua ngay' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('start_price') < value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Giá mua ngay phải lớn hơn giá khởi điểm'));
                        },
                      }),
                    ]}
                  >
                    <Input 
                      type="number" 
                      className="w-full" 
                      min={1}
                      addonAfter="đ"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Thời gian bắt đầu"
                    name="start_time"
                    rules={[
                      { 
                        required: true, 
                        message: 'Vui lòng chọn ngày bắt đầu' 
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (value && value.isValid()) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian không hợp lệ'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"  // Chỉ hiển thị ngày
                      className="w-full"
                      disabledDate={(current) => current && current < moment().startOf('day')}
                      onChange={(date) => {
                        const dateWithTime = date ? date.startOf('day') : null;
                        console.log(dateWithTime?.format("YYYY-MM-DD HH:mm:ss")); // 00:00:00
                      }}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Thời gian kết thúc"
                    name="end_time"
                    rules={[
                      { required: true, message: 'Vui lòng chọn ngày kết thúc' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || !getFieldValue('start_time') || new Date(value) > new Date(getFieldValue('start_time'))) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Thời gian kết thúc phải sau thời gian bắt đầu'));
                        },
                      }),
                    ]}
                  >
                    <DatePicker
                      format="YYYY-MM-DD"  // Chỉ hiển thị ngày
                      className="w-full"
                      disabledDate={(current) => current && current < moment().startOf('day')}
                      onChange={(date) => {
                        const dateWithTime = date ? date.startOf('day') : null;
                        console.log(dateWithTime?.format("YYYY-MM-DD HH:mm:ss")); // 00:00:00
                      }}
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item className="flex justify-center mt-4">
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  className="bg-blue-600 hover:bg-blue-500 text-white w-full"
                  size="large"
                  loading={loading}
                >
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