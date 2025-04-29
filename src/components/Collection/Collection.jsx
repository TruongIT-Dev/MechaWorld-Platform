// Parent component that manages state and handles data fetching
import { useState, useEffect } from 'react';
import { Layout, message, Spin, Empty, Typography } from 'antd';

import GundamFilters from './GundamFilters';
import GundamDetail from './GundamDetail';
import GundamCollectionList from './GundamCollectionList';

import { getMockData } from './data';

const { Content } = Layout;

const Collection = () => {
    // State management for the component
    const [loading, setLoading] = useState(true);
    const [collections, setCollections] = useState([]);
    const [filteredCollections, setFilteredCollections] = useState([]);
    const [selectedGundam, setSelectedGundam] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [activeFilter, setActiveFilter] = useState('All');

    // Gọi lấy List danh sách các Grade - Fix cứng code tạm thời
    const gradeList = ['Entry Grade', 'High Grade', 'Master Grade', 'Real Grade', 'Perfect Grade', 'Super Deformed'];

    // Fetch lấy toàn bộ Gundam in Store
    useEffect(() => {
        // Giả lập API call để lấy dữ liệu
        const fetchCollections = async () => {
            try {
                // Trong ứng dụng thực tế, đây sẽ là API call
                setTimeout(() => {
                    const mockData = getMockData();
                    setCollections(mockData);
                    setFilteredCollections(mockData);


                    setLoading(false);
                }, 1000);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu:", error);
                message.error("Không thể tải dữ liệu bộ sưu tập.");
                setLoading(false);
            }
        };

        fetchCollections();
    }, []);

    // Filter collection based on grade
    const filterByGrade = (grade) => {
        setActiveFilter(grade);
        if (grade === 'All') {
            setFilteredCollections(collections);
        } else {
            const filtered = collections.filter(item => item.grade === grade);
            setFilteredCollections(filtered);
        }
    };

    // Handle open Gundam details Modal
    const showGundamDetails = (gundam) => {
        setSelectedGundam(gundam);
        setIsModalOpen(true);
    };

    // Handle modal close
    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    // Toggle favorite status
    const toggleEditGundam = () => {
        console.log("Toggle Edit");

    };

    return (
        <Layout className="min-h-screen mt-32">
            <Content className="p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white p-4 md:p-6 rounded-lg shadow-sm mb-6">

                        {/* Title component */}
                        <CollectionTitle />

                        {/* Filter component */}
                        <GundamFilters
                            gradeList={gradeList}
                            activeFilter={activeFilter}
                            filterByGrade={filterByGrade}
                        />

                        {loading ? (
                            <LoadingSpinner />
                        ) : filteredCollections.length === 0 ? (
                            <Empty description="Không tìm thấy mô hình Gundam nào phù hợp với bộ lọc" />
                        ) : (
                            <GundamCollectionList
                                filteredCollections={filteredCollections}
                                gradeList={gradeList}
                                showGundamDetails={showGundamDetails}
                                toggleEditGundam={toggleEditGundam}
                            />
                        )}
                    </div>
                </div>
            </Content>

            {/* Gundam Detail Modal */}
            <GundamDetail
                selectedGundam={selectedGundam}
                isModalOpen={isModalOpen}
                handleModalClose={handleModalClose}
                toggleEditGundam={toggleEditGundam}
            />
        </Layout>
    );
};

// Simple components can be defined in the same file
const CollectionTitle = () => (
    <div className='w-full text-center uppercase'>
        <Typography.Title level={3} className="m-0">Bộ sưu tập Gundam của bạn</Typography.Title>
    </div>
);

const LoadingSpinner = () => (
    <div className="flex justify-center items-center h-64">
        <Spin size="large" tip="Đang tải bộ sưu tập..." />
    </div>
);

export default Collection;