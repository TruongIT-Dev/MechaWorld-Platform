import { Card, Col, Pagination, Row, Button, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

import FilterSidebar from './ProductFilter';

const Product = () => {
    const { Meta } = Card;

    return (
        <>
            <div className="container">
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
                                <div className="product-list">
                                    <Row gutter={24}>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden mb-2"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>}
                                                />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>} />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>} />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>} />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>} />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>} />
                                            </Card>
                                        </Col>
                                        <Col span={6}>
                                            <Card
                                                bordered={false}
                                                className="max-w-fit overflow-hidden"
                                                cover={
                                                    <img
                                                        className="cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                        alt="example"
                                                        src="/src/assets/image/product-1.webp"
                                                    />
                                                }
                                            >
                                                <Meta
                                                    title="Mô hình lắp ráp RG 1/144 Hi-ν GUNDAM Hi Nu Bandai 4573102619150"
                                                    description={<span className="text-red-600 font-semibold">1.199.900₫</span>} />
                                            </Card>
                                        </Col>
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