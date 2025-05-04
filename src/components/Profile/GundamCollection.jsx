import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Card, Row, Col, Button, Input, Select, Tag, Typography, Modal, Form, Dropdown } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, MoreOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { SellingGundam, RestoreGundam } from "../../apis/Sellers/APISeller";
import { GetGundamByID } from '../../apis/User/APIUser';

const GundamCollection = ({ setIsCreating }) => {
  const user = useSelector((state) => state.auth.user);
  const [gundamList, setGundamList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [sellModalVisible, setSellModalVisible] = useState(false);
  const [confirmSell, setConfirmSell] = useState(false);
  const [isConfirmedSell, setIsConfirmedSell] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    GetGundamByID(user.id, "")
      .then((response) => {
        setGundamList(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      });
  }, [user.id]);

  // Lọc dữ liệu
  useEffect(() => {
    let filtered = gundamList;
    if (selectedCondition) {
      filtered = filtered.filter((item) => item.condition === selectedCondition);
    }
    if (selectedGrade) {
      filtered = filtered.filter((item) => item.grade === selectedGrade);
    }
    setFilteredData(filtered);
  }, [selectedCondition, selectedGrade, gundamList]);

  const handleSellProduct = (product) => {
    SellingGundam(user.id, product.gundam_id)
      .then(() => window.location.reload())
      .catch(error => console.error(error));
  };

  const handleAuctionProduct = (product) => {
    setSellModalVisible(true);
  };

  const handleMenuClick = (key, record) => {
    switch (key) {
      case "unsell":
        RestoreGundam(user.id, record.gundam_id)
          .then(() => window.location.reload())
          .catch(error => console.error(error));
        break;
      default:
        console.log(key, record);
    }
  };

  const searchGundam = (value) => {
    GetGundamByID(user.id, value)
      .then((response) => {
        setGundamList(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      });
  };

  const renderStatusButton = (product) => {
    const { status } = product;
    const { Text } = Typography;

    if (status === "in store") {
      return (
        <>
          <Button
            type="primary"
            className="bg-green-600 hover:bg-green-500 w-full mb-2"
            onClick={() => setConfirmSell(true)}
          >
            Đăng bán
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-400 text-white w-full"
            onClick={() => handleAuctionProduct(product)}
          >
            Đấu giá
          </Button>

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
                onClick={() => {
                  setIsConfirmedSell(true);
                  handleSellProduct(product);
                }}
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

    const statusMap = {
      auctioning: { text: "Đang đấu giá", color: "blue" },
      published: { text: "Đang bán", color: "green" },
      exchange: { text: "Đang trao đổi", color: "cyan" },
      processing: { text: "Đang xử lý", color: "yellow" },
      "pending auction approval": { text: "Chờ duyệt đấu giá", color: "yellow" },
    };

    const statusTag = statusMap[status];
    return statusTag ? (
      <Tag color={statusTag.color} className="w-full text-sm font-semibold text-center">
        {statusTag.text.toUpperCase()}
      </Tag>
    ) : (
      <Tag color="default">Không rõ</Tag>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">GUNDAM COLLECTION</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover our latest Gundam merchandise drop this week! Premium quality items for fans and collectors,
          designed to showcase your love for the Universal Century.
        </p>
        <div className="mt-6">
          <span className="text-sm font-medium text-gray-500">{filteredData.length} Products Available</span>
        </div>
      </div>

      {/* Search & Filter Section */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} md={8}>
          <Input.Search 
            placeholder="Tìm kiếm sản phẩm" 
            onSearch={searchGundam} 
            className="w-full" 
          />
        </Col>
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
        <Col xs={12} sm={6} md={4}>
          <Button onClick={() => {
            setSelectedCondition(null);
            setSelectedGrade(null);
            setFilteredData(gundamList);
          }}>Xóa bộ lọc</Button>
        </Col>
        <Col xs={12} sm={6} md={4}>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            className="bg-blue-500 hover:bg-[#4a90e2] text-white w-full"
            onClick={() => setIsCreating(true)}
          >
            Thêm sản phẩm
          </Button>
        </Col>
      </Row>



      {/* Featured Products */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">FEATURED ITEMS</h2>
        <Row gutter={[24, 24]}>
          {filteredData.map((item) => (
            <Col xs={24} sm={12} md={8} lg={6} key={item.gundam_id}>
              <Card
                hoverable
                cover={
                  <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                      alt={item.name} 
                      src={item.primary_image_url} 
                      className="object-cover w-full h-full"
                    />
                  </div>
                }
                actions={[
                  <HeartOutlined key="wishlist" className="text-red-500" />,
                  <ShoppingCartOutlined key="cart" />,
                  <Dropdown
                    menu={{
                      items: [
                        ...(item.status === "published" ? [
                          { key: "unsell", label: "🚫 Hủy bán sản phẩm" }
                        ] : []),
                        { key: "preview", label: "👁️ Xem trước" }
                      ],
                      onClick: ({ key }) => handleMenuClick(key, item),
                    }}
                  >
                    <MoreOutlined key="more" />
                  </Dropdown>
                ]}
              >
                <Card.Meta
                  title={<span className="font-bold">{item.name}</span>}
                  description={
                    <>
                      <span className="text-gray-600">{item.grade}</span>
                      <div className="mt-2 text-lg font-semibold text-blue-600">
                        {item.price?.toLocaleString()} đ
                      </div>
                      <div className="mt-2">
                        {renderStatusButton(item)}
                      </div>
                    </>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* New Arrivals Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">NEW ARRIVALS</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredData.slice(0, 4).map((item) => (
            <div key={`new-${item.gundam_id}`} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-48 bg-gray-200">
                <img src={item.primary_image_url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1">{item.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{item.grade}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-blue-600">{item.price?.toLocaleString()} đ</span>
                  <Button type="primary" size="small">Add to Cart</Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Auction Modal */}
      <Modal
        title="Đấu giá Sản Phẩm"
        open={sellModalVisible}
        onCancel={() => setSellModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical">
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
  );
};

GundamCollection.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
};

export default GundamCollection;