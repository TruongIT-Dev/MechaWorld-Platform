import { Card, Col, Pagination, Row, Button, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

import FilterSidebar from './ProductFilter';
import { useEffect, useState } from 'react';
import { ListGundams } from '../../apis/Product/APIProduct';

const Product = () => {

    const { Meta } = Card;

    // useState
    const [gundams, setGundams] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ListGundams();
                setGundams(response?.data.data || []);
            } catch (err) {
                setError("Lỗi khi tải sản phẩm");
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <div className="container mt-24">
                {/* Breadcrumb */}
                <div className="breadcurm-section px-4 py-2 hidden">
                    <Breadcrumb
                        items={[
                            {
                                href: '',
                                title: <HomeOutlined />,
                            },
                            {
                                href: '',
                                title: (
                                    <>
                                        <UserOutlined />
                                        <span>Sản phẩm</span>
                                    </>
                                ),
                            },
                            {
                                title: '....',
                            },
                        ]}
                    />
                </div>

                {/* Content */}
                <div className="content py-10">
                    <Row gutter={24}>
                        {/* Filter */}
                        <Col span={5}><FilterSidebar /></Col>

                        {/* Start List of Products */}
                        <Col span={19}>
                            <div className="product-car bg-white shadow-lg rounded-lg p-4">

                                {/* Top Filter */}
                                <div className="flex justify-between items-center">
                                    <h1 className="text-lg font-semibold">THỂ LOẠI: <span className='font-normal'>HG</span></h1>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Sắp xếp:</span>
                                        <Button className="border rounded-md">Mới nhất</Button>
                                        <Button className="border rounded-md">Giá tăng dần</Button>
                                        <Button className="border rounded-md">Giá giảm dần</Button>

                                    </div>
                                </div>

                                {/* Products */}
                                <div className="product-list mt-6">
                                    <Row gutter={24}>
                                        {gundams.map((gundam, index) => (
                                            <Col key={index} span={6}>
                                                <Card
                                                    bordered={false}
                                                    className="max-w-fit max-h-fit mb-2"
                                                    cover={
                                                        <div className="h-[200px] w-full overflow-hidden">
                                                            <img
                                                                className="w-full h-full object-cover cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                                alt="example"
                                                                src={gundam?.images?.[0]?.url || "https://via.placeholder.com/150"}
                                                            />
                                                        </div>
                                                    }
                                                >
                                                    <Meta
                                                        title={gundam.name}
                                                        description={<span className="text-red-600 font-semibold">{gundam.price} VND</span>}
                                                    />
                                                </Card>
                                            </Col>
                                        ))}
                                    </Row>
                                </div>

                                {/* Pagination */}
                                <div className="pagination mt-5 flex justify-center">
                                    <Pagination defaultCurrent={1} total={50} />
                                </div>
                            </div>
                        </Col>
                        {/* End List of Products */}
                    </Row>
                </div>
            </div>
        </>
    )
}

export default Product