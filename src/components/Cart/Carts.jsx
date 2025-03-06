import React, { useState } from 'react';
import { Table, Button, Checkbox, message } from 'antd';
import { Link } from "react-router-dom";
import { useCart } from '../../context/CartContext';

const { Column } = Table;

const Carts = () => {
  const { cartItems, removeFromCart, loading } = useCart(); // Sử dụng cartItems và removeFromCart từ Context
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  // Nhóm sản phẩm theo seller_name
  const groupedCartItems = groupCartItemsBySeller(cartItems);

  // Xử lý chọn tất cả
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRowKeys(checked ? cartItems.map(item => item.cart_item_id) : []);
  };

  // Tính tổng tiền
  const totalPrice = () => {
    return cartItems
      .filter(item => selectedRowKeys.includes(item.cart_item_id))
      .reduce((sum, item) => sum + item.gundam_price, 0);
  };

  // Xử lý chọn dòng trong bảng
  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto mt-44 mb-14">
      {/* Duyệt qua từng seller và hiển thị bảng tương ứng */}
      {Object.entries(groupedCartItems).map(([sellerName, items]) => (
        <div key={sellerName} className="mb-8">
          <h2 className="text-xl font-semibold mb-4"> {sellerName}</h2>
          <Table
            dataSource={items}
            pagination={false}
            rowSelection={rowSelection}
            rowKey="cart_item_id"
            style={{ width: '100%' }}
          >
            <Column
              title="Sản Phẩm"
              key="product"
              render={(text, record) => (
                <div className="flex items-center">
                  <img
                    src={record.gundam_image_url}
                    alt={record.gundam_name}
                    className="w-16 h-16 object-cover rounded border border-gray-300 mr-4"
                  />
                  <div>
                    <div className="font-semibold">{record.gundam_name}</div>
                  </div>
                </div>
              )}
              width="33.33%"
            />

            

            <Column
              title="Đơn Giá"
              dataIndex="gundam_price"
              key="gundam_price"
              render={(price) => `${price.toLocaleString()} VNĐ`}
              width="43.33%"
            />

            <Column
              title="Hành động"
              key="actions"
              render={(text, record) => (
                <Button danger onClick={() => removeFromCart(record.cart_item_id)}>
                  Xóa
                </Button>
              )}
              width="20%"
            />
          </Table>
        </div>
      ))}

      {/* Thanh điều khiển dưới cùng */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md rounded-lg mt-4">
        <Checkbox checked={selectAll} onChange={handleSelectAll}>
          Chọn tất cả
        </Checkbox>
        <p className="font-semibold">
          Tổng thanh toán: <span className="text-red-500 text-lg">₫{totalPrice().toLocaleString()}</span>
        </p>
        <Link
          to={{
            pathname: "/checkout",
            state: {
              selectedItems: cartItems.filter(item => selectedRowKeys.includes(item.cart_item_id)),
            },
          }}
        >
          <Button
            type="primary"
            size="large"
            className="bg-red-500 border-none"
            disabled={selectedRowKeys.length === 0}
          >
            Mua Hàng
          </Button>
        </Link>
      </div>
    </div>
  );
};

// Hàm nhóm sản phẩm theo seller_name
const groupCartItemsBySeller = (cartItems) => {
  return cartItems.reduce((acc, item) => {
    const sellerName = item.seller_name;
    if (!acc[sellerName]) {
      acc[sellerName] = [];
    }
    acc[sellerName].push(item);
    return acc;
  }, {});
};

export default Carts;