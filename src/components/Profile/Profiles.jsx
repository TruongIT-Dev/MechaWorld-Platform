// import { useState } from 'react';
import {
  HeartOutlined,
  UserSwitchOutlined,
  ShoppingOutlined,
  UserOutlined,
  SettingOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
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
    label: <Link to="/profile/shop-register">Đăng ký thành Shop</Link>,
    icon: <ShoppingCartOutlined />,
  },
  {
    key: '6',
    label: 'Cài đặt tài khoản',
    icon: <SettingOutlined />,
    children: [
      {
        key: '7',
        label: <Link to="/profile/setting">Mật khẩu và bảo mật</Link>,
      },
      {
        key: '8',
        label: <Link to="/profile/setting">Thiết lập giao dịch</Link>,
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
      <div className="container mt-32 mb-12">
        <Layout>
          <Content
            style={{
              padding: '0 48px',
            }}
          >
            <Layout
              style={{
                padding: '24px 0',
              }}
            >
              <Sider width={200}
              >
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{
                    height: '100%',
                  }}
                  items={items}
                />
              </Sider>
              <Content className='bg-white border rounded' >
                <Outlet></Outlet>
              </Content>
            </Layout>
          </Content>
        </Layout>
      </div>
    </>
  );

}
