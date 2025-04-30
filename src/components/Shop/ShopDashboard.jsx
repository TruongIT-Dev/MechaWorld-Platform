import { groupBy } from '@antv/util';
import { Pie, Column } from '@antv/g2plot';
import { useEffect, useRef, useState } from 'react';
import {
  Card, Row, Col, Statistic, Button, message, Input, Typography,
  Tabs, Divider, Badge, Space, Tag, Form, Avatar
} from 'antd';
import {
  ShopOutlined, SaveOutlined, PhoneOutlined,
  DollarOutlined, RiseOutlined, BarChartOutlined,
  FileTextOutlined, TrophyOutlined, ShoppingOutlined,
  MailOutlined, HomeOutlined, UserOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { checkWallet } from '../../apis/User/APIUser';
// import { getShopInfo, updateShopInfo } from '../../apis/Shop/APIShop'; // Giả định API

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Item } = Form;

const shopData = [
  { city: 'Hcm', type: 'Card', value: 14500 },
  { city: 'Hcm', type: 'Figure', value: 8500 },
  { city: 'Hcm', type: 'Gundam', value: 10000 },
  { city: 'Hcm', type: 'Rider Belt', value: 7000 },
  { city: 'HN', type: 'Card', value: 9000 },
  { city: 'HN', type: 'Figure', value: 8500 },
  { city: 'HN', type: 'Gundam', value: 11000 },
  { city: 'HN', type: 'Rider Belt', value: 6000 },
  { city: 'HA', type: 'Card', value: 14000 },
  { city: 'HA', type: 'Figure', value: 9000 },
  { city: 'HA', type: 'Gundam', value: 10000 },
  { city: 'HA', type: 'Rider Belt', value: 9000 },
  { city: 'DN', type: 'Card', value: 9000 },
  { city: 'DN', type: 'Figure', value: 8500 },
  { city: 'DN', type: 'Gundam', value: 10000 },
  { city: 'DN', type: 'Rider Belt', value: 6000 },
  { city: 'QN', type: 'Card', value: 18000 },
  { city: 'QN', type: 'Figure', value: 11000 },
  { city: 'QN', type: 'Gundam', value: 15000 },
  { city: 'QN', type: 'Rider Belt', value: 14000 },
];

const ShopDashboard = () => {
  // Refs for charts
  const pieRef = useRef(null);
  const columnRef = useRef(null);
  const pieChart = useRef(null);
  const columnChart = useRef(null);

  // State management
  const [balance, setBalance] = useState(0);
  const [shopInfo, setShopInfo] = useState({
    shopName: 'Shop Gundam HCM',
    phone: '0987654321',
    email: 'shop.gundam@example.com',
    address: '123 Nguyễn Văn A, Quận 1, TP. HCM'
  });
  const [originalShopInfo, setOriginalShopInfo] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const userId = useSelector((state) => state.auth.user.id);

  // Fetch initial data
  useEffect(() => {
    // Lấy thông tin ví
    checkWallet(userId)
      .then((response) => {
        console.log('Wallet API Response:', response.data);
        setBalance(response.data.balance);
      })
      .catch((error) => {
        console.error('Lỗi API Wallet:', {
          message: error.message,
          response: error.response?.data,
          config: error.config
        });
        message.error('Lỗi khi lấy thông tin ví. Vui lòng thử lại sau.');
      });

    // Lấy thông tin shop
    // getShopInfo(userId)
    //   .then((response) => {
    //     console.log('Shop API Response:', response.data);
    //     setShopInfo(response.data);
    //     setOriginalShopInfo({...response.data});
    //     form.setFieldsValue({...response.data});
    //   })
    //   .catch((error) => {
    //     console.error('Lỗi API Shop:', {
    //       message: error.message,
    //       response: error.response?.data,
    //       config: error.config
    //     });
    //     message.error('Lỗi khi lấy thông tin shop. Vui lòng thử lại sau.');
    //   });

    // Mock data
    const mockShopInfo = {
      shopName: 'Shop Gundam HCM',
      phone: '0987654321',
      email: 'shop.gundam@example.com',
      address: '123 Nguyễn Văn A, Quận 1, TP. HCM'
    };
    setShopInfo(mockShopInfo);
    setOriginalShopInfo({ ...mockShopInfo });
    form.setFieldsValue({ ...mockShopInfo });

  }, [userId, form]);

  // Initialize charts
  useEffect(() => {
    // Tổng hợp dữ liệu Pie Chart
    const pieData = Object.entries(groupBy(shopData, 'type')).map(([type, list]) => ({
      type,
      value: list.reduce((acc, item) => acc + item.value, 0),
    }));

    // Render Pie Chart
    pieChart.current = new Pie(pieRef.current, {
      data: pieData,
      angleField: 'value',
      colorField: 'type',
      radius: 0.8,
      innerRadius: 0.6,
      label: {
        type: 'spider',
        content: '{name}\n{percentage}',
      },
      legend: { position: 'bottom' },
      interactions: [{ type: 'element-active' }],
      animation: {
        appear: {
          animation: 'wave-in',
          duration: 1000,
        },
      },
    });

    pieChart.current.render();

    // Render Column Chart
    columnChart.current = new Column(columnRef.current, {
      data: shopData,
      isGroup: true,
      xField: 'city',
      yField: 'value',
      seriesField: 'type',
      columnStyle: { radius: [4, 4, 0, 0] },
      legend: { position: 'top-right' },
      animation: {
        appear: {
          animation: 'fade-in',
          duration: 800,
        },
      },
    });

    columnChart.current.render();

    // Tương tác: Hover Pie -> Highlight Column
    pieChart.current.on('element:mouseenter', (evt) => {
      const type = evt.data?.data?.type;
      columnChart.current.setState('active', (item) => item.type === type);
    });

    pieChart.current.on('element:mouseleave', () => {
      columnChart.current.setState('active', () => false);
    });

    // Click Pie -> Lọc dữ liệu Column
    pieChart.current.on('element:click', (evt) => {
      const type = evt.data?.data?.type;
      const filtered = shopData.filter((item) => item.type === type);
      columnChart.current.changeData(filtered);
      message.info(`Đang hiển thị dữ liệu cho loại sản phẩm: ${type}`);
    });

    // Double click Pie -> Reset Column
    pieChart.current.on('element:dblclick', () => {
      columnChart.current.changeData(shopData);
      message.info('Đã khôi phục tất cả dữ liệu');
    });

    return () => {
      pieChart.current && pieChart.current.destroy();
      columnChart.current && columnChart.current.destroy();
    };
  }, []);

  // Handle shop info update
  const handleShopInfoUpdate = (values) => {
    if (!values.shopName.trim()) {
      message.error('Tên shop không được để trống!');
      return;
    }

    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setShopInfo(values);
      setOriginalShopInfo({ ...values });
      setIsEditing(false);
      message.success('Cập nhật thông tin shop thành công!');
      setLoading(false);
    }, 1000);

    // Actual API call - Uncomment when API is ready
    // updateShopInfo(userId, values)
    //   .then((response) => {
    //     console.log('Update Shop API Response:', response.data);
    //     message.success('Cập nhật thông tin shop thành công!');
    //     setOriginalShopInfo({...values});
    //     setIsEditing(false);
    //   })
    //   .catch((error) => {
    //     console.error('Lỗi API Update Shop:', {
    //       message: error.message,
    //       response: error.response?.data,
    //       config: error.config
    //     });
    //     message.error('Lỗi khi cập nhật thông tin shop. Vui lòng thử lại sau.');
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };

  // Handle form values change
  const handleFormValuesChange = (changedValues, allValues) => {
    const isChanged = JSON.stringify(allValues) !== JSON.stringify(originalShopInfo);
    setIsEditing(isChanged);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      {/* Shop Header - Just for wallet info */}
      <Card className="mb-6 shadow-md">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <ShopOutlined className="text-2xl mr-3 text-blue-600" />
            <div>
              <Text className="text-sm text-gray-500">Thông tin cửa hàng</Text>
              <Title level={4} className="mb-0 mt-1">{shopInfo.shopName}</Title>
            </div>
          </div>
          <div className="flex items-center">
            <Statistic
              title={<span className="text-gray-600">Số dư tài khoản</span>}
              value={balance}
              suffix="VND"
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
            />
            <Button type="primary" className="ml-4 bg-blue-500 hover:bg-blue-400">
              Nạp tiền
            </Button>
          </div>
        </div>
      </Card>

      {/* Dashboard Tabs */}
      <Tabs defaultActiveKey="1" className="bg-white p-4 rounded-lg shadow-md">
        <TabPane
          tab={
            <span>
              <BarChartOutlined />
              Dashboard
            </span>
          }
          key="1"
        >
          {/* Product Stats Cards */}
          <Row gutter={16} className="mb-6">
            <Col xs={24} md={12} lg={6}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Gundam đã đăng</span>}
                  value={210}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Gundam đã bán</span>}
                  value={85}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Figure đã đăng</span>}
                  value={150}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <Statistic
                  title={<span className="text-gray-600">Figure đã bán</span>}
                  value={42}
                  valueStyle={{ color: '#eb2f96' }}
                />
              </Card>
            </Col>
          </Row>

          {/* Charts */}
          <Row gutter={16}>
            <Col xs={24} lg={12}>
              <Card
                title={<Title level={5}><BarChartOutlined /> Tỷ lệ doanh thu theo loại sản phẩm</Title>}
                className="shadow-sm hover:shadow-md transition-shadow"
                extra={<Text type="secondary">Nhấp đúp để xem tất cả dữ liệu</Text>}
              >
                <div ref={pieRef} style={{ height: 360 }} />
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card
                title={<Title level={5}><BarChartOutlined /> Doanh thu theo thành phố và sản phẩm</Title>}
                className="shadow-sm hover:shadow-md transition-shadow"
              >
                <div ref={columnRef} style={{ height: 360 }} />
              </Card>
            </Col>
          </Row>
        </TabPane>

        <TabPane
          tab={
            <span>
              <ShopOutlined />
              Thông tin Shop
            </span>
          }
          key="2"
        >
          <Card className="shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <Title level={4}>Thông tin cửa hàng</Title>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                loading={loading}
                disabled={!isEditing}
                onClick={() => form.submit()}
                className="bg-blue-500 hover:bg-blue-400"
              >
                Cập nhật
              </Button>
            </div>
            <Divider />

            <div className="flex mb-6">
              <div className="mr-8">
                <Avatar size={100} icon={<UserOutlined />} className="bg-blue-500" />
              </div>
              <div className="flex-1">
                <Form
                  form={form}
                  layout="vertical"
                  onFinish={handleShopInfoUpdate}
                  onValuesChange={handleFormValuesChange}
                  initialValues={shopInfo}
                >
                  <Row gutter={24}>
                    <Col span={12}>
                      <Item
                        name="shopName"
                        label="Tên cửa hàng"
                        rules={[{ required: true, message: 'Vui lòng nhập tên cửa hàng!' }]}
                      >
                        <Input placeholder="Nhập tên cửa hàng" prefix={<ShopOutlined className="text-gray-400" />} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item name="phone" label="Số điện thoại">
                        <Input
                          placeholder="Nhập số điện thoại"
                          prefix={<PhoneOutlined className="text-gray-400" />}
                          suffix={<Tag color="green"><CheckCircleOutlined /> Đã xác thực</Tag>}
                          disabled
                        />
                      </Item>
                    </Col>
                  </Row>

                  <Row gutter={24}>
                    <Col span={12}>
                      <Item name="email" label="Email">
                        <Input placeholder="Nhập email" prefix={<MailOutlined className="text-gray-400" />} />
                      </Item>
                    </Col>
                    <Col span={12}>
                      <Item name="address" label="Địa chỉ lấy hàng">
                        <Input placeholder="Nhập địa chỉ lấy hàng" prefix={<HomeOutlined className="text-gray-400" />} />
                      </Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            </div>

            <Divider />

            <Title level={5}>Thông tin thêm</Title>
            <Row gutter={24} className="mt-4">
              <Col span={8}>
                <Card size="small" className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic title="Ngày tham gia" value="01/01/2023" />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic title="Đánh giá" value={4.8} suffix="/ 5" />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small" className="text-center shadow-sm hover:shadow-md transition-shadow">
                  <Statistic title="Lượt theo dõi" value={250} />
                </Card>
              </Col>
            </Row>
          </Card>
        </TabPane>

        <TabPane
          tab={
            <span>
              <DollarOutlined />
              Tài chính
            </span>
          }
          key="3"
        >
          <Card className="shadow-sm">
            <Title level={4}>Thông tin tài chính</Title>
            <Divider />
            <p>Thông tin chi tiết về lịch sử giao dịch, thu chi sẽ hiển thị tại đây.</p>
          </Card>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ShopDashboard;