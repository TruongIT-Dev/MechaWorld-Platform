import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HomeOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Button, Breadcrumb } from 'antd';

import { GetGundamByGrade, GetGundams } from '../../apis/Product/APIProduct';
import FilterSidebar from './ProductFilter';

const Product = () => {

    const { Meta } = Card;
    const navigate = useNavigate();

    // useState
    const [gundams, setGundams] = useState([]);
    const [filters, setFilters] = useState({
        selectedGrade: null,
        condition: "all",
        priceRange: [100, 1000]
    });

    const [loading, setLoading] = useState(true);


    // Gọi API khi bộ lọc thay đổi
    useEffect(() => {
        const fetchGundams = async () => {
            try {
                let response;
                if (filters.selectedGrade) {
                    response = await GetGundamByGrade(filters.selectedGrade);
                } else {
                    response = await GetGundams();
                }

                let filteredData = response.data;

                // Lọc theo tình trạng
                if (filters.condition !== "all") {
                    filteredData = filteredData.filter(gundam => gundam.condition === filters.condition);
                }

                // Lọc theo giá
                filteredData = filteredData.filter(gundam =>
                    gundam.price >= filters.priceRange[0] * 1000 &&
                    gundam.price <= filters.priceRange[1] * 1000
                );

                setGundams(filteredData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách Gundam:", error);
            }
        };

        fetchGundams();
    }, [filters]);

    // Hàm nhận dữ liệu lọc từ FilterSidebar
    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    // handleClicked to Link detail gundam
    const handleClickedDetailGundam = (slug) => {
        navigate(`/product/${slug}`);
    }

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
                        <Col span={5}><FilterSidebar onFilterChange={handleFilterChange} /></Col>

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
                                        {gundams.length > 0 ? (
                                            gundams.map((gundam, index) => (
                                                <Col key={index} span={6}>
                                                    <Card
                                                        onClick={() => handleClickedDetailGundam(gundam.slug)}
                                                        bordered={false}
                                                        className="max-w-fit max-h-fit mb-2 border-2 p-1"
                                                        cover={
                                                            <div className="h-[200px] w-full overflow-hidden">
                                                                <img
                                                                    className="w-full h-full object-cover cursor-pointer transform transition-transform duration-500 hover:scale-110"
                                                                    alt="example"
                                                                    src={gundam?.image_urls?.[0] || "https://via.placeholder.com/150"}
                                                                />
                                                            </div>
                                                        }
                                                    >
                                                        <Meta
                                                            title={gundam.name}
                                                            description={<span className="text-red-600 font-semibold">Giá: {gundam.price} VND</span>}
                                                        />
                                                    </Card>
                                                </Col>
                                            ))
                                        ) : (
                                            <p className="text-center text-gray-500">Không có sản phẩm nào.</p>
                                        )}
                                    </Row>
                                </div>

                                {/* Pagination */}
                                {/* <div className="pagination mt-5 flex justify-center">
                                    <Pagination defaultCurrent={1} total={50} />
                                </div> */}
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