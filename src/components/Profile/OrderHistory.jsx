// import React from 'react';
import { Space, Table, Tag } from 'antd';
const columns = [
  {
    title: 'Tên sản phẩm',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
    key: 'quantity',
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'seller',
    key: 'seller',
  },
  {
    title: 'Mã đơn hàng',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 3 ? 'geekblue' : 'green';
          if (tag === 'XC-1262U') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Trạng thái',
    key: 'action',
    render: () => (
      <Space size="middle">
        <a>Already Taken</a>
      </Space>
    ),
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    quantity: 32,
    seller: '100,000 vnd',
    tags: ['Scj-143',],
  },
  {
    key: '2',
    name: 'Jim Green',
    quantity: 42,
    seller: '100,000 vnd',
    tags: ['XC-1262U'],
  },
  {
    key: '3',
    name: 'Joe Black',
    quantity: 32,
    seller: '100,000 vnd',
    tags: ['C01-108U'],
  },
];
export default function OrderHistory() {
  return (
    <Table columns={columns} dataSource={data} />
  )
}

