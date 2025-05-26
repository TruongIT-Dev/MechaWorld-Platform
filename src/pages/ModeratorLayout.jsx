import { Layout, Menu } from 'antd';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { logout } from "../features/auth/authSlice";
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';


const { Content, Sider } = Layout;

const ModeratorLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // Lấy key đang chọn dựa trên pathname
  const selectedKey = location.pathname.startsWith('/moderator/mod-')
    ? location.pathname.replace('/moderator/', '')
    : 'mod-users'; // Mặc định vào 'mod-users'

      const handleLogout = () => {
          dispatch(logout());
          Cookies.remove("access_token");
          Cookies.remove("user");
  
          setTimeout(() => {
              // navigate('/');
              window.location.href = "/";
          }, 50);
      };
  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Sidebar Menu */}
      <Sider width={250} style={{ background: '#1abfe8', padding: '20px' }}>
      <div
          style={{
            padding: 20,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Moderator Panel
        </div>
        <Menu
          mode="vertical"
          selectedKeys={[selectedKey]} // Chọn menu theo URL
          style={{ borderRadius: 10, overflow: 'hidden', border: 'none',background: '#1abfe8' }}
          onClick={(e) => {
            if (e.key === 'logout') {
              handleLogout(); // Thực hiện logout
            } else {
              navigate(`/moderator/${e.key}`);
            }
          }}
          
        >
          <Menu.Item key="mod-users">👤 Quản lý Người dùng</Menu.Item>
          <Menu.Item key="mod-feedbacks">📩 Quản lý Phản hồi</Menu.Item>
          <Menu.Item key="mod-auctions">🔨 Quản lý Đấu giá</Menu.Item>
          <Menu.Item key="mod-orders">📦 Quản lý Đơn hàng</Menu.Item>
          <Menu.Item key="mod-transactions">💰 Quản lý Giao dịch</Menu.Item>
          <Menu.Item key="mod-refunds">💵 Quản lý Hoàn tiền</Menu.Item>
          <Menu.Item key="mod-gundams">🤖 Quản lý Gundam</Menu.Item>
          <Menu.Item key="mod-exchanges">🔄 Quản lý Trao đổi</Menu.Item>
          <Menu.Item key="logout" style={{ color: 'red' }}>🚪 Đăng xuất</Menu.Item>
        </Menu>
      </Sider>

      {/* Nội dung chính */}
      <Layout >
        <Content
          style={{
            padding: 20,
            background: '#fff',
            borderRadius: 8,
            minHeight: '80vh',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default ModeratorLayout;
