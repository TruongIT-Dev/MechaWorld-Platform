import {  
    UserSwitchOutlined,
    ShoppingOutlined,
    UserOutlined,
  } from '@ant-design/icons';
  import {  Menu,Layout } from 'antd';
  import { Outlet, Link } from 'react-router-dom';


  const { Sider, Content } = Layout; 
  const items = [
    {
      key: '1',
      icon: <UserOutlined />,
      label: <Link to="/shop/dashboard">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: <Link to="/shop/management">Quản lý sản phẩm</Link>,
    },
    {
      key: '3',
      label: <Link to="/shop/transition">Quản lý giao dịch</Link>,
      icon: <UserSwitchOutlined />,
    //   children: [
    //     {
    //         key: '4',
    //         label: <Link to="/shop/"> </Link>,
    //       },
    //       {
    //         key: '5',
    //         label:<Link to="/shop/"></Link>,
    //       }
    //   ]
    },
    // {
    //   key: '6',
    //   label: 'Cài đặt tài khoản',
    //   icon: <SettingOutlined />,
    //   children: [
    //     {
    //       key: '7',
    //       label: <Link to="/shop/setting">Mật khẩu và bảo mật</Link>,
    //     },
    //     {
    //       key: '8',
    //       label:<Link to="/shop/setting">Thiết lập giao dịch</Link>,
    //     }
    //   ],
    // },
  ];
  
  
  export default function ShopPage() {
  
    return (
      <>
  
        <br />
        <br />
        <Layout className=" flex">
          <Sider
          className="bg-gray-100 items-center w-64 ml-5" 
          >
          <Menu
          className='h-full w-64'
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['1']}
          items={items}
        />
          </Sider>
         
  
          <Layout className="flex-1 px-10 py-4">
            <Content className="bg-white rounded-lg shadow-md p-16 h-full">
              <Outlet/>
            </Content>
          </Layout>
        </Layout>
      </>
    );
    
  }
  