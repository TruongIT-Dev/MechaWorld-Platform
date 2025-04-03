import { Table, Row, Button, InputNumber, Select, Space, Input, Modal, Dropdown, Form, Tag, Col } from "antd";
import { useEffect, useState } from "react";
import { GetGundamByID, SellingGundam } from "../../apis/Product/APIProduct";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { MoreOutlined, PlusOutlined } from "@ant-design/icons";


const { Option } = Select;

function ShopProduct({
  // isCreating,
  setIsCreating }) {
  // const user = JSON.parse(Cookies.get("user"));
  const user = useSelector((state) => state.auth.user);
  // console.log("checking user data",user);
  const [gundamList, setGundamList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  // const [selectedProduct, setSelectedProduct] = useState(null);
  const [form] = Form.useForm();
  // Bộ lọc giá tiền & phân khúc
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  // const [openMenuId, setOpenMenuId] = useState(null);
  // const toggleMenu = (id) => {
  //   setOpenMenuId(openMenuId === id ? null : id);
  // };
  useEffect(() => {
    GetGundamByID(user.id, "")
      .then((response) => {
        setGundamList(response.data);
        setFilteredData(response.data);
        console.log("Dử liệu lọc: ", filteredData);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      });
  }, []);
  const handleSellProduct = (product) => {
    // setSelectedProduct(product);
    // const data = GetSellerStatus(user.id);
    // console.log(data);
    // console.log("data đã lưu: ",product);
    // const checkDate = GetSellerData(user.id);
    // console.log("Data id: ", checkDate);
    SellingGundam(user.id, product.id).catch(response => {
      console.log(response);
    })
    window.location.reload();
  };

  const handleAuctionProduct = (product) => {
    // setSelectedProduct(product);
    console.log("data đã lưu: ",product);
    setSellModalVisible(true);
  };
  // Lọc dữ liệu khi có thay đổi
  useEffect(() => {
    let filtered = gundamList;

    // Lọc theo giá
    if (minPrice !== null) {
      filtered = filtered.filter((item) => item.price >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter((item) => item.price <= maxPrice);
    }

    // Lọc theo tình trạng
    if (selectedCondition) {
      filtered = filtered.filter((item) => item.condition === selectedCondition);
    }
    // Lọc theo phân khúc (grade)
    if (selectedGrade) {
      filtered = filtered.filter((item) => item.grade === selectedGrade);
    }
    setFilteredData(filtered);
  }, [minPrice, maxPrice, selectedCondition, selectedGrade, gundamList]);

  const handleFinish = (values) => {
    console.log("data input", values);
  }

  const searchGundam = (values) => {
    console.log(values);
    GetGundamByID(user.id, values)
      .then((response) => {
        setGundamList(response.data);
        setFilteredData(response.data);
        console.log("search complete");
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      });
  }
  const columns = [
    {
      title: "Hình Ảnh",
      dataIndex: "image_urls",
      render: (images) => (
        <img src={images[0]} alt="Gundam" width={100} height={100} style={{ objectFit: "cover" }} />
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

        if (status === "in store") {
          return (
            <div className="flex flex-col space-y-2">
              <Button
                type="primary"
                className="bg-green-600 hover:bg-green-500 w-28"
                onClick={() => handleSellProduct(value)}
              >
                Đăng bán
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-400 text-white w-28"
                onClick={() => handleAuctionProduct(value)}
              >
                Đấu giá
              </Button>
            </div>
          );
        }

        // Trạng thái khác -> render tag tương ứng
        const statusMap = {
          auctioning: { text: "Đang đấu giá", color: "blue" },
          published: { text: "Đang bán", color: "green" },
          exchange: { text: "Đang trao đổi", color: "cyan" },
          processing: { text: "Đang trao đổi", color: "yellow" },
          "pending auction approval": { text: "Đang trao đổi", color: "yellow" },
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
      render: () => {
        const menuItems = [
          { key: "edit", label: "✏️ Chỉnh sửa sản phẩm", },
          { key: "preview", label: "👁️ Xem trước ", },
          { key: "delete", label: "❌ xóa sản phẩm", },
        ];

        return (
          <div className="flex items-center justify-center">
            <Dropdown menu={{ items: menuItems }}>
              <Button icon={<MoreOutlined />} />
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
            <Col xs={24} sm={12} md={8}>
              <Input.Search placeholder="Tìm kiếm sản phẩm" onSearch={searchGundam} className="w-full" />
            </Col>

            {/* Fitler Condition */}
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Lọc tình trạng"
                allowClear
                className="w-full"
                onChange={setSelectedCondition}
              >
                <Select.Option value="new">Hàng mới</Select.Option>
                <Select.Option value="open box">Đã mở hộp</Select.Option>
                <Select.Option value="used">Đã qua sử dụng</Select.Option>
              </Select>
            </Col>

            {/* Filter Category */}
            <Col xs={12} sm={6} md={4}>
              <Select
                placeholder="Lọc phân khúc"
                allowClear
                className="w-full"
                onChange={setSelectedGrade}
              >
                {[...new Set(gundamList.map((item) => item.grade))].map((grade) => (
                  <Select.Option key={grade} value={grade}>
                    {grade}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            {/* Earase Filter Button */}
            <Col xs={12} sm={6} md={4}>
              <Button onClick={() => setFilteredData(gundamList)}>Xóa bộ lọc</Button>
            </Col>

            {/* Add More Button */}
            <Col xs={12} sm={6} md={4}>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                className="bg-[#0056b3] hover:bg-[#4a90e2] text-white w-full md:w-auto"
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
  // isCreating: PropTypes.bool,
  setIsCreating: PropTypes.func.isRequired,
};
export default ShopProduct;
