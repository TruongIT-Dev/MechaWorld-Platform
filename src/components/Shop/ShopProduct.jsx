import { Table, Row, Button, InputNumber, Select, Space, Input, Modal, Dropdown, Form, Tag } from "antd";
import { useEffect, useState } from "react";
import { GetGundamByID, GetSellerData, GetSellerStatus, SellingGundam } from "../../apis/Product/APIProduct";
import PropTypes from 'prop-types';
import { useSelector } from "react-redux";
import { MoreOutlined } from "@ant-design/icons";
const { Option } = Select;

function ShopProduct({
  // isCreating,
  setIsCreating}) {
  // const user = JSON.parse(Cookies.get("user"));
  const user = useSelector((state) => state.auth.user);
  // console.log("checking user data",user);
  const [gundamList, setGundamList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
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
    GetGundamByID(user.id,"")
      .then((response) => {
        setGundamList(response.data);
        setFilteredData(response.data);
        console.log("Dử liệu lọc: ",filteredData);
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
    SellingGundam(user.id,product.id).catch(response => {
      console.log(response);
    }) 

  };

  const handleAuctionProduct = (product) => {
    setSelectedProduct(product);
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
    GetGundamByID(user.id,values)
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
      title: "Hình ảnh",
      dataIndex: "image_urls",
      render: (images) => (
        <img src={images[0]} alt="Gundam" width={100} height={100} style={{ objectFit: "cover" }} />
      ),
      width: 120,
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: 200 },
    { title: "Phân khúc", dataIndex: "grade", key: "grade", width: 100 },
    { title: "Hãng sản xuất", dataIndex: "manufacturer", key: "manufacturer", width: 100 },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Tình trạng sản phẩm",
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
      title: "Trạng thái",
      key: "status",
      width: 95,
      render: (_, value) => {
        const { status } = value;
    
        if (status === "available") {
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
          auction: { text: "Đang đấu giá", color: "blue" },
          selling: { text: "Đang bán", color: "green" },
          exchange: { text: "Đang trao đổi", color: "cyan" },
        };
    
        const statusTag = statusMap[status];
    
        return statusTag ? (
          <Tag color={statusTag.color} className="w-28 text-sm font-semibold h-6 text-center">
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
      width: 70,
      render: () => {
        const menuItems = [
          { key: "edit", label: "✏️ Chỉnh sửa sản phẩm",  },
          { key: "preview", label: "👁️ Xem trước ", },
          { key: "delete", label: "❌ xóa sản phẩm", },
        ];
        
        return (
          <Dropdown menu={{ items: menuItems }}>
            <Button icon={<MoreOutlined />} />
          </Dropdown>
        );
      },
    },
  ];

  return (
    <div>
      <div className="container-content">
        <Row className="mb-4 flex gap-8">
          <Space >
            <Input.Search placeholder="Tìm kiếm sản phẩm" onSearch={searchGundam} />
          </Space>
          {/* <InputNumber
            placeholder="Giá thấp nhất"
            min={0}
            value={minPrice}
            onChange={setMinPrice}
          />
          <InputNumber
            placeholder="Giá cao nhất"
            min={0}
            value={maxPrice}
            onChange={setMaxPrice}
          /> */}
          <Select placeholder="Lọc tình trạng" allowClear onChange={setSelectedCondition}>
            <Option value="new">Hàng mới</Option>
            <Option value="open box">Đã mở hộp</Option>
            <Option value="used">Đã qua sử dụng</Option>
          </Select>
          <Select placeholder="Lọc phân khúc" allowClear onChange={setSelectedGrade}>
            {[...new Set(gundamList.map((item) => item.grade))].map((grade) => (
              <Option key={grade} value={grade}>
                {grade}
              </Option>
            ))}
          </Select>
          <Button onClick={() => setFilteredData(gundamList)} className="">Xóa bộ lọc</Button>
          <Button
              type="primary"
              className="bg-[#0056b3] hover:bg-[#4a90e2] text-white"
              onClick={() => setIsCreating(true)}
            >
              Thêm sản phẩm
            </Button>
        </Row>
        <Table
                    className={{}}
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                        defaultPageSize: 20,
                    }}
                    scroll={{
                      y: 55 * 10,
                    }}
                  />    
        <Modal
            title="Đấu giá Sản Phẩm"
            open={sellModalVisible}
            onCancel={() => setSellModalVisible(false)}
            footer={null}
        >
          <Form form={form} onFinish={handleFinish}>
            <Form.Item label="giá khởi điểm (đ)" required name='start_price'>
              <Input type="number" formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/[^0-9]/g, "")} />
            </Form.Item>
            <Form.Item label="Bước giá tối thiểu (đ)" required name='step'>
              <Input type="number" formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/[^0-9]/g, "")} />
            </Form.Item>
              <Form.Item label="Mức cọc (đ)" required name='first_bind'>
            <Input type="number" formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/[^0-9]/g, "")} />
              </Form.Item>
            <Form.Item label="Giá mua ngay (đ)" required name='final_price'>
              <Input type="number" formatter={(value) =>`${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")} parser={(value) => value.replace(/[^0-9]/g, "")} />
            </Form.Item>
            <Form.Item label="Thời lượng đấu giá (1-7 Ngày)" required name='duration'>
              <Input type="number" max={7} min={1}/>
            </Form.Item>
            <Form.Item>
              <Button type="submit" className="flex bg-blue-600 hover:bg-blue-400 text-white h-10 ml-36 mt-2">
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
