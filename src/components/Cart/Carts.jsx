import React, { useState } from 'react';
import { Table, Button, Checkbox, message } from 'antd';
import { Link } from "react-router-dom";
import { useCart } from '../../context/CartContext';

const { Column } = Table;

const Carts = () => {
  const { cartItems, removeFromCart, loading } = useCart(); // Sử dụng cartItems và removeFromCart từ Context
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

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
      <Table dataSource={cartItems} pagination={false} rowSelection={rowSelection} rowKey="cart_item_id">
        <Column
          title="Sản Phẩm"
          key="product"
          render={(text, record) => (
            <div className="flex items-center">
              <img src={record.gundam_image_url} alt={record.gundam_name} className="w-16 h-16 object-cover rounded border border-gray-300 mr-4"/>
              <div>
                <div className="font-semibold">{record.gundam_name}</div>
              </div>
            </div>
          )}
        />

        <Column
          title="Thông tin người bán"
          key="seller_name"
          render={(text, record) => (
            <div className="flex items-center">
              <img src={record.seller_avatar_url} alt={record.gundam_name} className="w-16 h-16 object-cover rounded border border-gray-300 mr-4"/>
              <div>
                <div className="font-semibold">{record.seller_name}</div>
              </div>
            </div>
          )}
        />
        
        <Column title="Đơn Giá" dataIndex="gundam_price" key="gundam_price" render={(price) => `${price.toLocaleString()} VNĐ`} />

        <Column
          title="Hành động"
          key="actions"
          render={(text, record) => (
            <Button danger onClick={() => removeFromCart(record.cart_item_id)}>Xóa</Button>
          )}
        />
      </Table>

      {/* Thanh điều khiển dưới cùng */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md rounded-lg mt-4">
        <Checkbox checked={selectAll} onChange={handleSelectAll}>Chọn tất cả</Checkbox>
        <p className="font-semibold">Tổng thanh toán: <span className="text-red-500 text-lg">₫{totalPrice().toLocaleString()}</span></p>
        <Link
          to={{
            pathname: "/checkout",
            state: {
              selectedItems: cartItems.filter(item => selectedRowKeys.includes(item.cart_item_id)),
            },
          }}
        >
          <Button type="primary" size="large" className="bg-red-500 border-none" disabled={selectedRowKeys.length === 0}>
            Mua Hàng
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Carts;