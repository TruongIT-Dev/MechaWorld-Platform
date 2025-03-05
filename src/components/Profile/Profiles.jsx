import {
  UserSwitchOutlined,
  ShoppingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Menu, Layout } from 'antd';
import { Outlet, Link } from 'react-router-dom';
import logoRegisterShop from '../../assets/image/logo2.png';


const { Sider, Content } = Layout;


// Danh sách Menu
const items = [
  {
    key: "menu1",
    icon: <UserOutlined className="text-lg text-blue-500" />,
    label: "Tài khoản Của Tôi",
    children: [
      { key: "1", label: <Link to="/profile/user">Hồ sơ</Link> },
      { key: "2", label: <Link to="/profile/address-setting">Địa chỉ</Link> },
    ],
  },
  {
    key: "3",
    icon: <ShoppingOutlined className="text-lg text-red-500" />,
    label: "Quản lý đơn hàng",
    children: [
      { key: "4", label: <Link to="/profile/orderhistory">Đơn mua</Link> },
      { key: "5", label: <Link to="#">Đơn đấu giá</Link> },
      { key: "6", label: <Link to="#">Đơn trao đổi</Link> },
    ],
  },

  {
    key: "menu2",
    icon: <UserSwitchOutlined className="text-lg text-green-500" />,
    label: "Số dư & Giao dịch",
    children: [
      { key: "7", label: <Link to="#">Số dư ví</Link> },
      { key: "8", label: <Link to="#">Lịch sử giao dịch</Link> },
    ],
  },
  {
    key: "9",
    icon: <UserOutlined className="text-lg text-blue-500" />,
    label: "Rút tiền",
  },
];

export default function Profile() {

  return (
    <>
      <br />
      <br />
      <Layout className="container">
        {/* Sidebar - Menu */}
        <Sider width={250} className="bg-white shadow-md h-fit rounded-lg p-4 mt-20">
          <div className="flex items-center space-x-4 pb-6 border-b">
            <img src={logoRegisterShop} className="w-20 h-20 bg-gray-100 rounded-full object-contain" alt="Avatar" />
            <div>
              <p className="font-semibold">Bạn có muốn trở thành Shop?</p>
              <Link to="/registe-shop" className="text-sm text-blue-500 hover:underline">Tham gia ngay</Link>
            </div>
          </div>

          {/* Menu Điều Hướng */}
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["menu1"]}
            selectedKeys={[location.pathname]} // Chọn menu theo URL hiện tại
            items={items}
          />
        </Sider>


        <Layout className="flex-1 py-4 ml-6 mt-16">
          <Content className="bg-white rounded-lg shadow-md h-full w-full">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );

}
