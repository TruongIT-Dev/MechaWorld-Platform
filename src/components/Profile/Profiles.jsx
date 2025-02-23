// import { useState } from 'react';
import {  HeartOutlined,
  UserSwitchOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,} from '@ant-design/icons';
import {  Menu,Layout } from 'antd';
import { Outlet, Link } from 'react-router-dom';

const { Sider, Content } = Layout; 
const items = [
  {
    key: '1',
    icon: <UserOutlined />,
    label: <Link to="/profile/user">Tài khoản</Link>,
  },
  {
    key: '2',
    icon: <ShoppingOutlined />,
    label: <Link to="/profile/orderhistory">Lịch sử đơn hàng</Link>,
  },
  {
    key: '3',
    label: <Link to="/profile/tradehistory">Lịch sử giao dịch</Link>,
    icon: <UserSwitchOutlined />,
  },
  {
    key: '4',
    label: <Link to="/profile/collection">Sản phẩm yêu thích</Link>,
    icon: <HeartOutlined />,
  },
  {
    key: '5',
    label: 'Cài đặt tài khoản',
    icon: <SettingOutlined />,
    children: [
      {
        key: '7',
        label: <Link to="/profile/address-setting">Địa chỉ giao dịch</Link>,
      },
      {
        key: '8',
        label:<Link to="/profile/advanced-setting">Thiết lập nâng cao</Link>,
      }
    ],
  }, {
    key: '9',
    label: <Link to="/profile/seller">Đăng ký bán hàng</Link>,
    icon: <ShoppingCartOutlined />,
  },
];


export default function Profile() {

  return (
    <>

      <br />
      <br />
      <Layout className=" flex">
        <Sider
        className="bg-gray-100 items-center w-64 ml-5 mt-20"
        >
        <Menu
        className='h-full w-64'
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['1']}
        items={items}
      />
        </Sider>
       

        <Layout className="flex-1 px-10 py-4 ml-6 mt-16">
          <Content className="bg-white rounded-lg shadow-md p-16 h-full">
            <Outlet/>
          </Content>
        </Layout>
      </Layout>
    </>
  );
  
}
