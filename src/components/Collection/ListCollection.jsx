import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import {
  ShoppingOutlined,
  UserOutlined,
  BankOutlined,
  WalletOutlined, EditOutlined, SearchOutlined
} from '@ant-design/icons';
import { Card, Row, Col, Button, Input, Select, Tag, Typography, Modal, Form, Dropdown,Menu, Layout  } from 'antd';
import { ShoppingCartOutlined, HeartOutlined, MoreOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { SellingGundam, RestoreGundam } from "../../apis/Sellers/APISeller";
import { GetGundamByID, getUser } from '../../apis/User/APIUser';

import { useCart } from '../../context/CartContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
const { Title } = Typography;
// Thêm component GundamFilters
const GundamFilters = ({ gradeList, activeFilter, filterByGrade }) => {
  return (
    <div className="flex flex-wrap justify-center items-center gap-2 my-6">
      <Button
        type={activeFilter === 'All' ? 'primary' : 'default'}
        className={activeFilter === 'All' ? 'bg-blue-500' : ''}
        onClick={() => filterByGrade('All')}
      >
        Tất cả
      </Button>

      {gradeList.map(grade => (
        <Button
          key={grade}
          type={activeFilter === grade ? 'primary' : 'default'}
          className={activeFilter === grade ? 'bg-blue-500' : ''}
          onClick={() => filterByGrade(grade)}
        >
          {grade}
        </Button>
      ))}
    </div>
  );
};

const gradeList = ['Entry Grade', 'High Grade', 'Master Grade', 'Real Grade', 'Perfect Grade', 'Super Deformed'];

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
    const [userRole, setUserRole] = useState(null);
    const [activeGradeFilter, setActiveGradeFilter] = useState('All'); 
    const [searchTerm, setSearchTerm] = useState('');
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); 

    // Hàm mở modal chi tiết
    const showDetailModal = (product) => {
      setSelectedProduct(product);
      setDetailModalVisible(true);
    };

    // Hàm đóng modal
    const handleDetailCancel = () => {
        setDetailModalVisible(false);
    };
  
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
      getUser(user.id)
        .then((response) => {
          setUserRole(response.data.role);
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
          console.log('Danh sách sản phẩm:', response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy danh sách sản phẩm:", error);
        });
    }, [user.id]);
  
    // Lọc dữ liệu
    // Lọc dữ liệu
useEffect(() => {
  let filtered = gundamList;
  
  // Lọc theo condition
  if (selectedCondition) {
    filtered = filtered.filter((item) => item.condition === selectedCondition);
  }
  
  // Lọc theo grade
  if (selectedGrade && selectedGrade !== 'All') {
    filtered = filtered.filter((item) => item.grade === selectedGrade);
  }

  // Lọc theo từ khóa tìm kiếm
  if (searchTerm) {
    filtered = filtered.filter((item) => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  setFilteredData(filtered);
}, [selectedCondition, selectedGrade, gundamList, searchTerm]); 
  
    // Hàm xử lý filter theo grade
    const filterByGrade = (grade) => {
      setActiveGradeFilter(grade);
      setSelectedGrade(grade === 'All' ? null : grade);
    };
  
    const getGradeColor = (grade) => {
      switch (grade) {
          case 'Entry Grade': return 'cyan';
          case 'High Grade': return 'green';
          case 'Real Grade': return 'purple';
          case 'Master Grade': return 'blue';
          case 'Perfect Grade': return 'gold';
          case 'Super Deformed': return 'magenta';
          default: return 'default';
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
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      {/* Featured Products */}
      <div className="px-[10px]">
        <h2 className="text-[36px] text-center font-bold text-gray-800 ">Bộ Sưu Tập</h2>

        {/* Thêm ô tìm kiếm */}
        <div className="flex justify-center mb-6">
          <Input
            placeholder="Tìm kiếm theo tên..."
            prefix={<SearchOutlined />}
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: 300 }}
          />
        </div>
        
        {/* Thêm component GundamFilters vào đây */}
        <GundamFilters 
          gradeList={gradeList} 
          activeFilter={activeGradeFilter} 
          filterByGrade={filterByGrade} 
        />
        
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
                className="flex justify-center "
            >
                <Card
                
                hoverable
                cover={
                    <div className=" bg-gray-200 flex items-center justify-center overflow-hidden">
                    <img 
                        alt={item.name} 
                        src={item.primary_image_url} 
                        className="object-cover h-[265px] w-[265px]"
                        onClick={() => showDetailModal(item)}
                    />
                    </div>
                }
                
                bodyStyle={{ flex: 1 }}
                >
                <div className="px-1">
                    <div className="flex justify-between items-start mb-2">
                        <Title level={5} className="m-0 text-gray-800 truncate" style={{ maxWidth: '80%' }} onClick={() => showDetailModal(item)}>
                            {item.name}
                        </Title>
                        <Tag color={getGradeColor(item.grade)}>{item.scale}</Tag>
                    </div>
                    <div className="flex justify-between text-black text-[16px] mt-1 mb-3">
                    <Tag color={getGradeColor(item.grade)}>{item.grade}</Tag>                       
                    </div>
                    <div className="flex justify-between text-gray-600 text-sm mt-1">
                        <span>{item.series}</span>                       
                    </div>
                </div>
                </Card>
            </Col>  
            ))}
        </Row>
      </div>


      <Modal
            title="Chi tiết sản phẩm"
            visible={detailModalVisible}
            onCancel={handleDetailCancel}
            footer={[
                <Button key="back" onClick={handleDetailCancel}>
                    Đóng
                </Button>,
            ]}
            width={800}
        >
            {selectedProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <img 
                            src={selectedProduct.primary_image_url} 
                            alt={selectedProduct.name}
                            className="w-full h-64 rounded-lg mt-16"
                        />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold mb-4">{selectedProduct.name}</h2>
                        
                        <div className="space-y-3">
                            <div className="flex">
                                <span className="font-semibold w-1/3">Dòng sản phẩm:</span>
                                <span>{selectedProduct.series}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Hãng sản xuất:</span>
                                <span>{selectedProduct.manufacturer}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Grade:</span>
                                <span>{selectedProduct.grade}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Tỉ lệ:</span>
                                <span>{selectedProduct.scale}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Tình trạng:</span>
                                <span>{selectedProduct.condition === "new" ? "Mới" : "Đã qua sử dụng"}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Số lượng:</span>
                                <span>{selectedProduct.quantity}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Giá:</span>
                                <span>{selectedProduct.price.toLocaleString()} VND</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Năm phát hành:</span>
                                <span>{selectedProduct.release_year}</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Trọng lượng:</span>
                                <span>{selectedProduct.weight}g</span>
                            </div>
                            <div className="flex">
                                <span className="font-semibold w-1/3">Mô tả:</span>
                                <span>{selectedProduct.description || "Không có mô tả"}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    </div>
  );
}

ListCollection.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
};
export default ListCollection;