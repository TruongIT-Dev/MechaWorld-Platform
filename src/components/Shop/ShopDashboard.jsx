import { Column, Pie } from '@antv/g2plot';
import { each, groupBy } from '@antv/util';
import { useEffect, useRef } from 'react';
import { Button, Card, Col, Row, Statistic } from 'antd';

const data = 
[
    { "city": "Hcm", "type": "Card", "value": 14500 },
    { "city": "Hcm", "type": "Figure", "value": 8500 },
    { "city": "Hcm", "type": "Gundam", "value": 10000 },
    { "city": "Hcm", "type": "Rider Belt", "value": 7000 },
    { "city": "HN", "type": "Card", "value": 9000 },
    { "city": "HN", "type": "Figure", "value": 8500 },
    { "city": "HN", "type": "Gundam", "value": 11000 },
    { "city": "HN", "type": "Rider Belt", "value": 6000 },
    { "city": "HA", "type": "Card", "value": 14000 },
    { "city": "HA", "type": "Figure", "value": 9000 },
    { "city": "HA", "type": "Gundam", "value": 10000 },
    { "city": "HA", "type": "Rider Belt", "value": 9000 },
    { "city": "DN", "type": "Card", "value": 9000 },
    { "city": "DN", "type": "Figure", "value": 8500 },
    { "city": "DN", "type": "Gundam", "value": 10000 },
    { "city": "DN", "type": "Rider Belt", "value": 6000 },
    { "city": "QN", "type": "Card", "value": 18000 },
    { "city": "QN", "type": "Figure", "value": 11000 },
    { "city": "QN", "type": "Gundam", "value": 15000 },
    { "city": "QN", "type": "Rider Belt", "value": 14000 }
  ];
export default function ShopDashboard() {
    
    const container1Ref = useRef(null); 
    const container2Ref = useRef(null); 
    const pieRef = useRef(null);       
    const columnRef = useRef(null);
    
    useEffect(() => {
      if (!data) {
        return null; // Hoặc loading indicator, hoặc placeholder
    }
        let pie, column;
        const pieData = ((originData) => {
          const groupData = groupBy(originData, "type");
          const result = [];
          each(groupData, (values, k) => {
            result.push({
              type: k,
              value: values.reduce((a, b) => a + b.value, 0),
            });
          });
          return result;
        })(data);

    //pie chart 
    pie = new Pie(container1Ref.current, {
        data: pieData,
        colorField: 'type',
        angleField: 'value',
        label: { type: 'inner' },
        tooltip: false,
        state: {
            active: {
                style: {
                    lineWidth: 0,
                },
            },
        },
        interactions: [
            {
                type: 'element-highlight',
                cfg: {
                    showEnable: [{ trigger: 'element:mouseenter', action: 'cursor:pointer' }],
                    end: [
                        { trigger: 'element:mouseleave', action: 'cursor:default' },
                        { trigger: 'element:mouseleave', action: 'element-highlight:reset' },
                    ],
                },
            },
        ],
    });
    //column chart 
    column = new Column(container2Ref.current, {
        data,
        xField: 'city',
        yField: 'value',
        seriesField: 'type',
        isGroup: 'true',
        legend: false,
        columnStyle: {
            radius: [4, 4, 4, 0],
        },
    });

    pie.render();
    console.log('render pie');
    column.render();
    console.log('render column');
    pieRef.current = pie; 
    columnRef.current = column; 
    // change state when mouse on pie
    pie.on('element:mouseover', (evt) => {
      const eventData = evt.data;
      if (eventData?.data) {
        const type = eventData.data.type;
        column.setState('selected', (datum) => datum.type === type);
        column.setState('selected', (datum) => datum.type !== type, false);
      }
    });
    pie.on('element:mouseleave', () => {
      // cancel state selected 
      column.setState('selected', () => true, false);
    });

    pie.on('element:click', (evt) => {
      const eventData = evt.data;
      if (eventData?.data) {
        const type = eventData.data.type;
        pie.chart.changeData(pieData.filter((datum) => datum.type === type));
        column.chart.changeData(data.filter((datum) => datum.type === type));
      }
    });
    // dbclick to return normal state
  pie.on('element:dblclick', () => {
      pie.chart.changeData(pieData);
      column.chart.changeData(data);
    });
    console.log('checking if this show');
    

  return () => {
    if (pieRef.current) {
        pieRef.current.destroy();
    }
    if (columnRef.current) {
        columnRef.current.destroy(); 
    }
    };
    },[]);


  return (
    <div className="flex container mx-auto p-4 gap-4">
      {/* Cột bên trái (3 bảng) */}
      <div className="w-1/2 flex flex-col gap-4">
        {/* Bảng hiển thị số dư */}
        <Card className="p-4 shadow-md">
        <p className="text-2xl font-semibold">THỐNG KÊ</p>
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Số dư tài khoản (VND)" value={112893000} precision={2} />
            </Col>
            <Col span={12}>
             <br/>
             <br/>
              <Button type="primary">Nạp tiền</Button>
            </Col>
          </Row>
        </Card>

        {/* Bảng hiển thị Tổng doanh thu tháng + sản phẩm đã bán */}
        <Card className="p-4 shadow-md">
          <Row gutter={16}>
            <Col span={12}>
              <Statistic title="Tổng doanh thu tháng (VND)" value={5000000} precision={2} />
            </Col>
            <Col span={12}>
              <Statistic title="Sản phẩm đã bán" value={150} />
            </Col>
          </Row>
        </Card>

        {/* Bảng tổng số sản phẩm / sản phẩm đã bán / sản phẩm đã đấu giá */}
        <Card className="p-4 shadow-md">
          <Row gutter={16}>
            <Col span={8}>
              <Statistic title="Tổng sản phẩm" value={500} />
            </Col>
            <Col span={8}>
              <Statistic title="Đã bán" value={150} />
            </Col>
            <Col span={8}>
              <Statistic title="Đấu giá thành công" value={50} />
            </Col>
          </Row>
        </Card>
      </div>

      {/* Cột bên phải (2 biểu đồ) */}
      <div className="w-1/2 flex flex-col gap-4">
        <Card className="p-4 shadow-md">
          <div ref={container1Ref } className="h-60 w-full"></div>
        </Card>
        <Card className="p-4 shadow-md">
          <div ref={container2Ref } className="h-60 w-full"></div>
        </Card>
      </div>
    </div>
  );
}

