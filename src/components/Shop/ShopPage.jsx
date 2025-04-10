import {
  ShoppingOutlined,
  PieChartOutlined,
  BankOutlined,
  ShopOutlined,
  InboxOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, Layout, Card, Avatar, Tag } from 'antd';
import { GetSellerData, GetSellerStatus } from "../../apis/Product/APIProduct";



const { Sider, Content } = Layout;


const items = [
  {
    key: '1',
    icon: <PieChartOutlined />,
    label: <Link to="/shop/dashboard">Dashboard</Link>,
  },
  {
    key: '2',
    icon: <InboxOutlined />,
    label: <Link to="/shop/management">Quản lý sản phẩm</Link>,
  },
  {
    key: '3',
    icon: <ShoppingOutlined />,
    label: <Link to="/shop/order-management">Quản lý đơn hàng</Link>,
  },
  {
    key: '4',
    icon: <BankOutlined className="text-lg text-red-500" />,
    label: <Link to="/shop/auction-management">Quản lý đấu giá</Link>
  },
  {
    key: '6',
    icon: <SolutionOutlined />,
    label: <Link to="/shop/report-management">Quản lý đánh giá</Link>
  },
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
      <Layout className="flex container">
        <Sider width={300} className="bg-white shadow-md h-fit rounded-lg p-4 mt-36">
          <Card className="mb-4">
            {/* Shop Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5">
                <Avatar className='p-5 bg-blue-500' icon={<ShopOutlined />} size="large" />
                <div>
                  <p className="font-bold text-base">{sellerData.full_name}</p>
                  <Tag color="blue" className="text-xs">{sellerPlan?.plan_name}</Tag>
                </div>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {/* Lượt bán sản phẩm */}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lượt đăng bán:</span>
                <span className="font-semibold">{sellerPlan?.listings_used} / {sellerPlan?.max_listings}</span>
              </div>

              {/* Lượt đấu giá */}
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Lượt đấu giá:</span>
                <span className="font-semibold">{sellerPlan?.open_auctions_used} / {sellerPlan?.max_open_auctions}</span>
              </div>
            </div>
          </Card>

          <Menu mode="inline" defaultSelectedKeys={["1"]} defaultOpenKeys={["1"]} items={items} />
        </Sider>

        <Layout className="flex-1 py-4 ml-6 mt-32">
          <Content className="bg-white rounded-lg shadow-md p-6 h-full min-w-full max-w-fix">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );

}
