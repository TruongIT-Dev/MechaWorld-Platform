import Img1 from "../../assets/image/gun1.jpg";
import Img2 from "../../assets/image/gun2.jpg";

import React, { useState } from 'react';
import { Table, Button, InputNumber, Checkbox } from 'antd';
import { Link } from "react-router-dom";

const { Column } = Table;

const initialData = [
  {
    key: '1',
    product: 'Sản Phẩm 1',
    price: 4165000,
    quantity: 1,
    total: 4165000,
    image: Img1,
    description: 'Mô tả sản phẩm 1',
  },
  {
    key: '2',
    product: 'Sản Phẩm 2',
    price: 5000000,
    quantity: 1,
    total: 5000000,
    image: Img2,
    description: 'Mô tả sản phẩm 2',
  },
];

const Carts = () => {
  const [data, setData] = useState(initialData);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedRowKeys(checked ? data.map(item => item.key) : []);
  };

   // Hàm xử lý thay đổi số lượng
   const handleQuantityChange = (key, value) => {
    const newData = data.map(item => {
      if (item.key === key) {
        const quantity = value < 1 ? 1 : value;
        const total = item.price * quantity;
        return { ...item, quantity, total };
      }
      return item;
    });
    setData(newData);
  };

  const onSelectChange = (selectedKeys) => {
    setSelectedRowKeys(selectedKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const totalPrice =  () => {
    return data
      .filter(item => selectedRowKeys.includes(item.key))
      .reduce((sum, item) => sum + item.total, 0);
  };
  return (
    <div className="p-4">
      <Table dataSource={data} pagination={true} rowSelection={rowSelection}>
      <Column
          title="Sản Phẩm"
          key="product"
          render={(text, record) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={record.image}
                alt={record.product}
                style={{ width: 50, height: 50, marginRight: 10 }}
              />
              <div>
                <div>{record.product}</div>
                <div style={{ fontSize: '0.8em', color: 'gray' }}>{record.description}</div>
              </div>
            </div>
          )}
        />
        <Column title="Đơn Giá" dataIndex="price" key="price" render={(price) => `${price.toLocaleString()} VNĐ`} />
        <Column
          title="Số Lượng"
          key="quantity"
          render={(text, record) => (
            <InputNumber
              min={1}
              value={record.quantity}
              onChange={(value) => handleQuantityChange(record.key, value)}
            />
          )}
        />
        <Column title="Số Tiền" dataIndex="total" key="total" render={(total) => `${total.toLocaleString()} VNĐ`} />
      </Table>
      
        <div className="flex justify-between items-center p-4 bg-gray-100 shadow-md rounded-lg">
          <Checkbox checked={selectAll} onChange={handleSelectAll}>Chọn tất cả</Checkbox>
          <p className="font-semibold">Tổng thanh toán: <span className="text-red-500 text-lg">₫{totalPrice().toLocaleString()}</span></p>
          <Link to="/checkout">  
            <Button type="primary" size="large" className="bg-red-500 border-none" disabled={selectedRowKeys.length === 0} to={'/checkout'} >Mua Hàng</Button>
          </Link>
        </div>
      
      
    </div>
  );
};

export default Carts;