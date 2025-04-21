import PropTypes from 'prop-types';
import React  from 'react';
import { useSelector } from "react-redux";
import {
  BankOutlined,
  WalletOutlined, EditOutlined
} from '@ant-design/icons';
import { Menu, Layout  } from 'antd';

import { Outlet, Link } from 'react-router-dom';



const Collection = () => {
  const { Sider, Content } = Layout;
  const user = useSelector((state) => state.auth.user);


  const items = [
    
    {
      key: "/collection",
      icon: <BankOutlined className="text-lg text-red-500" />,
      label: <Link to="/collection/list">Bộ sưu tập</Link>,
    },
    {
      key: "/collection/add",
      icon: <WalletOutlined className="text-lg text-green-500" />,
      label: <Link to="/collection/add">Thêm vào bộ sưu tập</Link>,
    },
  ];

  return (
    
    <Layout className="container">

      {/* Sidebar - Menu */}
      <Sider width={250} className="bg-white shadow-md h-fit rounded-lg p-4 mt-36 mb-4">
        <div className='flex flex-col'>
          <div className="flex items-center py-2 gap-3 border-b">
            <img
              src={user?.avatar_url}
              className="w-10 h-10 bg-gray-100 rounded-full object-contain"
              alt="Avatar"
            />
            <div className='flex flex-col'>
              <p className="font-bold">{user?.full_name}</p>

              <div className='flex items-center space-x-2 text-sm text-gray-400'>
                <EditOutlined className='mt-1' />
                <Link to="/member/profile/user">
                  Sửa hồ sơ
                </Link>
              </div>
            </div>
          </div>
        </div>


        {/* Menu Điều Hướng */}
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]} // Highlight menu dựa trên đường dẫn hiện tại
          defaultOpenKeys={["/collection/list"]} // Mở menu mặc định
          items={items}
        />

      </Sider>

      <Layout className="flex-1 py-4 ml-6 mt-32">
        <Content className="bg-white rounded-lg shadow-md h-full w-full">


          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

Collection.propTypes = {
  setIsCreating: PropTypes.func.isRequired,
};

export default Collection;