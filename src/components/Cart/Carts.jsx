import React, { useState, useEffect } from 'react';
import { Table, Button, InputNumber, Checkbox, message } from 'antd';
import { Link } from "react-router-dom";
import { GetCart, DeleteCart } from '../../apis/Cart/APICart';

const { Column } = Table;

const Carts = () => {
  const [cartItems, setCartItems] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch Cart Items
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await GetCart();
        console.log("API response:", response.data);
        
        if (Array.isArray(response.data)) {
          setCartItems(response.data);
        } else {
          console.error("Unexpected data format:", response.data);
          setCartItems([]);
        }
      } catch (err) {
        console.error("Error fetching cart:", err);
        message.error("Lỗi khi tải giỏ hàng!");
      } finally {
        setLoading(false);
      }
    };
    
    fetchCartItems();
  }, []);

  // Xử lý chọn tất cả
  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRowKeys(checked ? cartItems.map(item => item.cart_item_id) : []);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId) => {
    try {
      await DeleteCart(itemId);
      setCartItems(cartItems.filter(item => item.cart_item_id !== itemId));
      setSelectedRowKeys(selectedRowKeys.filter(id => id !== itemId));
      message.success("Đã xóa sản phẩm khỏi giỏ hàng!");
    } catch (err) {
      message.error("Lỗi khi xóa sản phẩm!");
    }
  };

  // Tính tổng tiền (vì quantity luôn là 1, nên chỉ cần tính tổng giá)
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
    <div className="container mx-auto mt-36 mb-14">
      <Table dataSource={cartItems} pagination={false} rowSelection={rowSelection} rowKey="cart_item_id">
        <Column
          title="Sản Phẩm"
          key="product"
          render={(text, record) => (
            <div className="flex items-center">
              <img src={record.gundam_image_url} alt={record.gundam_name} className="w-16 h-16 object-cover rounded border border-gray-300 mr-4"/>
              <div>
                <div className="font-semibold">{record.gundam_name}</div>
                <div className="text-sm text-gray-500">{record.seller_name}</div>
              </div>
            </div>
          )}
        />
        <Column title="Đơn Giá" dataIndex="gundam_price" key="gundam_price" render={(price) => `${price.toLocaleString()} VNĐ`} />
        <Column title="Số Lượng" key="quantity" render={() => <span>1</span>} />
        <Column title="Tổng Tiền" dataIndex="gundam_price" key="gundam_price" render={(price) => `${price.toLocaleString()} VNĐ`} />
        <Column
          title="Hành động"
          key="actions"
          render={(text, record) => (
            <Button danger onClick={() => handleRemoveItem(record.cart_item_id)}>Xóa</Button>
          )}
        />
      </Table>

      {/* Thanh điều khiển dưới cùng */}
      <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md rounded-lg mt-4">
        <Checkbox checked={selectAll} onChange={handleSelectAll}>Chọn tất cả</Checkbox>
        <p className="font-semibold">Tổng thanh toán: <span className="text-red-500 text-lg">₫{totalPrice().toLocaleString()}</span></p>
        <Link to="/checkout">
          <Button type="primary" size="large" className="bg-red-500 border-none" disabled={selectedRowKeys.length === 0}>Mua Hàng</Button>
        </Link>
      </div>
    </div>
  );
};

export default Carts;
