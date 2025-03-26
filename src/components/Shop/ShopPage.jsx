import {  
    ShoppingOutlined,
    LineChartOutlined,
    BankOutlined,
  } from '@ant-design/icons';
  import {  Menu,Layout, Card } from 'antd';
  import { Outlet, Link } from 'react-router-dom';
  import {  FaBoxOpen } from "react-icons/fa";
  import {   MdOutlineReviews } from "react-icons/md";
import { useEffect, useState } from 'react';
import {GetSellerData, GetSellerStatus } from "../../apis/Product/APIProduct";
import { useSelector } from 'react-redux';

  const { Sider, Content } = Layout; 
  const items = [
    {
      key: '1',
      icon: <LineChartOutlined />,
      label: <Link to="/shop/dashboard">Dashboard</Link>,
    },
    {
      key: '2',
      icon: <ShoppingOutlined />,
      label: <Link to="/shop/management">Quản lý sản phẩm</Link>,
    },
    {
      key: '3',
      label: <Link to="/shop/order-management">Quản lý đơn hàng</Link>,
      icon: <FaBoxOpen/>,
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
    {
      key: '4',
      icon: <BankOutlined className="text-lg text-red-500" />,
      label: <Link to="/shop/auction-management">Quản lý đấu giá</Link>
    },
    {
      key: '6',
      icon: <MdOutlineReviews />,
      label: <Link to="/shop/report-management">Quản lý đánh giá</Link>
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
    const user = useSelector((state) => state.auth.user);
    const [sellerData, setSellerData] = useState([]);
    const [sellerPlan, setSellerPlan] = useState([]);
    useEffect(() => {
      GetSellerStatus(user.id).then((res) => {
        console.log("Seller Status Data: ", res.data);
        setSellerPlan(res.data);
      }).catch((error) => {
        console.error("Error fetching seller status: ", error);
      });

      GetSellerData(user.id).then((res) => {
        console.log("Seller Data: ", res.data);
        setSellerData(res.data);
      }).catch((error) => {
        console.error("Error fetching seller data: ", error);
      });
      }, []);
    return (
      <>
        <br />
        <br />
        <Layout className=" flex">
          <br />
          <Sider className="bg-gray-100 items-center w-64  mt-20 h-fit">
            <Card
              className="w-1/4 mb-3"
              style={{ width: 255 }}
            >
              <p>
                <b>Tên Shop:</b> {sellerData.full_name}
              </p>
              <p>
                <b>Loại gói:</b> {sellerPlan?.plan_name}
              </p>
              <p>
                <b>Sản phẩm đăng bán:</b> {sellerPlan?.listings_used} / {sellerPlan?.max_listings}
              </p>
              <p>
                <b>Đấu giá đang mở:</b> {sellerPlan?.open_auctions_used} / {sellerPlan?.max_open_auctions}
              </p>
            </Card>
            <Menu
              className="h-full w-64"
              defaultSelectedKeys={["1"]}
              defaultOpenKeys={["1"]}
              items={items}
            />
          </Sider>

          <Layout className="flex-1 px-10 py-4 mt-16 ml-10">
            <Content className="bg-white rounded-lg shadow-md p-6 h-full">
              <Outlet />
            </Content>
          </Layout>
        </Layout>
      </>
    );
    
  }
  