import  { useEffect, useRef } from 'react';
import { Card, Row, Col, Statistic, Button } from 'antd';
import { Pie, Column } from '@antv/g2plot';
import { groupBy } from '@antv/util';

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
  const pieRef = useRef(null);
  const columnRef = useRef(null);
  const pieChart = useRef(null);
  const columnChart = useRef(null);

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
      radius: 1,
      innerRadius: 0.6,
      label: {
        type: 'spider',
        content: '{name}\n{percentage}',
      },
      interactions: [{ type: 'element-active' }],
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
      legend: { position: 'top' },
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
    });

    // Double click Pie -> Reset Column
    pieChart.current.on('element:dblclick', () => {
      columnChart.current.changeData(shopData);
    });

    return () => {
      pieChart.current && pieChart.current.destroy();
      columnChart.current && columnChart.current.destroy();
    };
  }, []);

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col span={8}>
          <Card className=''>
            <div className=' flex justify-around'>
              <Statistic title="Số dư tài khoản (VND)" value={112893000}/>
              <Button type="primary" className='mt-4 bg-blue-500 hover:bg-blue-400'>Nạp tiền</Button>
            </div>
          </Card>
          
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng doanh thu tháng (VND)" value={5000000} />
            <Statistic title="Sản phẩm đã bán" value={150} style={{ marginTop: 16 }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Row gutter={16}>
              <Col span={8}><Statistic title="Tổng sản phẩm" value={500} /></Col>
              <Col span={8}><Statistic title="Đã bán" value={150} /></Col>
              <Col span={8}><Statistic title="Đấu giá thành công" value={50} /></Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Card title="Tỷ lệ doanh thu theo loại sản phẩm">
            <div ref={pieRef} style={{ height: 360 }} />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Doanh thu theo thành phố và sản phẩm">
            <div ref={columnRef} style={{ height: 360 }} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ShopDashboard;
