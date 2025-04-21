import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
  ShoppingOutlined,
  UserOutlined,
  BankOutlined,
  WalletOutlined, EditOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Button, Input, Select, Tag, Typography, Modal, Form, Dropdown,Menu, Layout  } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, MoreOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { SellingGundam, RestoreGundam } from "../../apis/Sellers/APISeller";
import { GetGundamByID, getUser } from '../../apis/User/APIUser';

import { useCart } from '../../context/CartContext';
import { Outlet, Link, useLocation } from 'react-router-dom';

function ListCollection({}) {
    const { Sider, Content } = Layout;
    const user = useSelector((state) => state.auth.user);
    const [gundamList, setGundamList] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedCondition, setSelectedCondition] = useState(null);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [sellModalVisible, setSellModalVisible] = useState(false);
    const [confirmSell, setConfirmSell] = useState(false);
    const [isConfirmedSell, setIsConfirmedSell] = useState(false);
    const [form] = Form.useForm();
    const [userRole, setUserRole] = useState(null); // Thêm state để lưu role
    const { cartItems, addToCart, loading } = useCart();
  
    const items = [
      
      {
        key: "/member/profile/auction-history",
        icon: <BankOutlined className="text-lg text-red-500" />,
        label: <Link to="/collection">Bộ sưu tập</Link>,
      },
      {
        key: "/member/profile/wallet",
        icon: <WalletOutlined className="text-lg text-green-500" />,
        label: <Link to="/collection/add">Thêm vào bộ sưu tập</Link>,
      },
    ];
  
    useEffect(() => {
      // Lấy thông tin người dùng để kiểm tra role
      getUser(user.id)
        .then((response) => {
          setUserRole(response.data.role); // Lưu role vào state
          console.log(response.data.role);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy thông tin người dùng:", error);
        });
  
      GetGundamByID(user.id, "")
        .then((response) => {
          setGundamList(response.data);
          setFilteredData(response.data);
          console.log(user.id);
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
  
    const handleAddToCart = async (id) => {
      try {
          if (!userId) {
              message.error('Bạn cần phải Đăng nhập trước!');
              navigate('/member/login');
              return;
          }
  
          await addToCart({ id }); // Sử dụng hàm addToCart từ context
          setAdded(true);
  
      } catch (error) {
          message.error("Lỗi khi thêm vào giỏ hàng!");
          console.error("Error:", error);
      }
  };
  
    const handleSellProduct = (product) => {
      SellingGundam(user.id, product.gundam_id)
        .then(() => window.location.reload())
        .catch(error => console.error(error));
    };
  
    const handleAuctionProduct = (product) => {
      setSellModalVisible(true);
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
    <div className="container mx-auto px-4 py-8  bg-gray-50 min-h-screen">



    {/* Featured Products */}
    <div className="px-[50px]"> {/* Di chuyển margin ra container cha */}
        <h2 className="text-[36px] font-bold text-gray-800 mb-12">Bộ Sưu Tập</h2>
        <Row gutter={[24, 24]} justify="start">
            {filteredData
            .filter(item => ["published", "in store"].includes(item.status))
            .map((item) => (
            <Col 
                xs={24} 
                sm={12} 
                md={8} 
                lg={6} 
                key={item.gundam_id}
                className="flex justify-center" // Thêm flex để căn giữa
            >
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
                ]}
                className="h-full w-full max-w-[300px] flex flex-col" // Thêm max-width và w-full
                bodyStyle={{ flex: 1 }}
                >
                <Card.Meta
                    title={<span className="font-bold">{item.name}</span>}
                    description={
                    <>
                        <span className="text-gray-600">{item.grade}</span>
                        <div className="mt-2 text-lg font-semibold text-blue-600">
                        {item.price?.toLocaleString()} đ
                        </div>
                    </>
                    }
                />
                </Card>
            </Col>
            ))}
        </Row>
    </div>



    {/* Hàng đang bán */}
    {userRole === 'seller' && (
        <div className="px-[50px]"> {/* Di chuyển margin ra container cha */}
          <h2 className="text-[36px] font-bold text-gray-800 mb-12">Hàng đang bán</h2>
          <Row gutter={[24, 24]} justify="start">
              {filteredData
              .filter(item => ["published"].includes(item.status))
              .map((item) => (
              <Col 
                  xs={24} 
                  sm={12} 
                  md={8} 
                  lg={6} 
                  key={item.gundam_id}
                  className="flex justify-center" // Thêm flex để căn giữa
              >
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
                  ]}
                  className="h-full w-full max-w-[300px] flex flex-col" // Thêm max-width và w-full
                  bodyStyle={{ flex: 1 }}
                  >
                  <Card.Meta
                      title={<span className="font-bold">{item.name}</span>}
                      description={
                          <>
                          <span className="text-gray-600">{item.grade}</span>
                          <div className="mt-2 text-lg font-semibold text-blue-600">
                              {item.price?.toLocaleString()} đ
                          </div>
                          <div className="mt-2 min-h-[80px]"> {/* Thêm min-height cho phần nút */}
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
    )}

    </div>
  );


}
ListCollection.propTypes = {
  // isCreating: PropTypes.bool,
  setIsCreating: PropTypes.func.isRequired,
};
export default ListCollection;
