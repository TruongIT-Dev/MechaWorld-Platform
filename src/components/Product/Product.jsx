import { Card, Col, Pagination, Row, Button, Breadcrumb } from 'antd';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';

import ProductFilter from './ProductFilter';

export default function Product() {
    const { Meta } = Card;

    return (
        <>
            <div className="container my-10">
                {/* Breadcrumb */}
                <div className="breadcurm-section px-4 py-2">
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
                <div className="container-content">
                    <Row>
                        {/* Filter */}
                        <Col span={6}><ProductFilter /></Col>

                        {/* Start List of Products */}
                        <Col span={18}>
                            <div className="product-car">
                                {/* Top Filter */}
                                <div className="mt-4 mb-9 flex justify-between items-center">
                                    <h1 className="text-lg font-bold">HG - HIGH GRADE</h1>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-medium">Sắp xếp:</span>
                                        <Button className="border rounded-md">Nổi bật</Button>
                                        <Button className="border rounded-md">Giá: Tăng dần</Button>
                                        <Button className="border rounded-md">Giá: Giảm dần</Button>
                                        <Button className="border rounded-md">A-Z</Button>
                                        <Button className="border rounded-md">Z-A</Button>
                                        <Button className="border rounded-md">Mới nhất</Button>
                                        <Button className="rounded-md">Bán chạy</Button>
                                    </div>
                                </div>

                                {/* Products */}
                                <div className="product-list wow fadeInUp" data-wow-delay="0.3s">
                                    <Row gutter={24}>
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
                            </div>
                            {/* Pagination */}
                            <div className="pagination mt-5 flex justify-center">
                                <Pagination defaultCurrent={1} total={50} />
                            </div>
                        </Col>
                        {/* End List of Products */}
                    </Row>
                </div>
            </div>
        </>
    )
}