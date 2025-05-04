import { Card, Typography } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import { useEffect, useRef } from 'react';
import { Column } from '@antv/g2plot';

const { Title } = Typography;

const ColumnChart = ({ data }) => {
    const containerRef = useRef(null);
    const chartRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Destroy existing chart if it exists
        if (chartRef.current) {
            chartRef.current.destroy();
            chartRef.current = null;
        }

        // Create and render column chart
        chartRef.current = new Column(containerRef.current, {
            data,
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

        chartRef.current.render();

        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
                chartRef.current = null;
            }
        };
    }, [data]);

    return (
        <Card
            title={<Title level={5}><BarChartOutlined /> Doanh thu theo thành phố và sản phẩm</Title>}
            className="shadow-sm hover:shadow-md transition-shadow"
        >
            <div ref={containerRef} style={{ height: 360 }} />
        </Card>
    );
};

export default ColumnChart;