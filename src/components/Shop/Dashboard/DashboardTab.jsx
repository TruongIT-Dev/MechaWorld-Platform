import { Row, Col } from 'antd';
import { useState } from 'react';
import { message } from 'antd';

import PieChart from './charts/PieChart';
import ColumnChart from './charts/ColumnChart';
import StatCards from './StatCards';


const DashboardTab = ({ shopData }) => {
    // State to track filtered data for charts
    const [columnData, setColumnData] = useState(shopData);

    // Stats data
    const statsData = [
        { title: 'Gundam đã đăng', value: 210, color: '#1890ff' },
        { title: 'Gundam đã bán', value: 85, color: '#52c41a' },
        { title: 'Figure đã đăng', value: 150, color: '#722ed1' },
        { title: 'Figure đã bán', value: 42, color: '#eb2f96' }
    ];

    // Chart interaction handlers
    const handlePieElementClick = (type) => {
        const filtered = shopData.filter((item) => item.type === type);
        setColumnData(filtered);
        message.info(`Đang hiển thị dữ liệu cho loại sản phẩm: ${type}`);
    };

    const handlePieElementDoubleClick = () => {
        setColumnData(shopData);
        message.info('Đã khôi phục tất cả dữ liệu');
    };

    return (
        <div>
            {/* Product Stats Cards */}
            <Row gutter={16} className="mb-6">
                <StatCards stats={statsData} />
            </Row>

            {/* Charts */}
            <Row gutter={16}>
                <Col xs={24} lg={12}>
                    <PieChart
                        shopData={shopData}
                        onElementClick={handlePieElementClick}
                        onElementDoubleClick={handlePieElementDoubleClick}
                    />
                </Col>
                <Col xs={24} lg={12}>
                    <ColumnChart data={columnData} />
                </Col>
            </Row>
        </div>
    );
};

export default DashboardTab;