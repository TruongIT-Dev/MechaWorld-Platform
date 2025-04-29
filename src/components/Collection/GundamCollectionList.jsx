import { Collapse, Empty } from 'antd';

import GundamCard from './GundamCard';

import { getGradeImage } from './GradeUltils';

const GundamCollectionList = ({ filteredCollections, gradeList, showGundamDetails, toggleFavorite }) => {
    const groupedByGrade = {};

    // Phân loại Gundam theo Grade
    gradeList.forEach(grade => {
        groupedByGrade[grade] = filteredCollections.filter(item => item.grade === grade);
    });

    // Lọc ra những grade có Gundam
    const gradesWithContent = gradeList.filter(grade =>
        groupedByGrade[grade] && groupedByGrade[grade].length > 0
    );

    // Nếu không có Gundam nào phù hợp với bộ lọc
    if (gradesWithContent.length === 0) {
        return (
            <Empty
                description="Không tìm thấy mô hình Gundam nào phù hợp với bộ lọc"
            />
        );
    }

    // Tạo các panel items cho Collapse
    const items = gradesWithContent.map(grade => {
        const gundamsInGrade = groupedByGrade[grade];

        // Tạo header với icon và tên grade
        const header = (
            <div className="flex items-center gap-3">
                <img
                    src={getGradeImage(grade)}
                    alt={`${grade} icon`}
                    className="h-12 w-12 rounded-full"
                />
                <span className="font-medium">{grade}</span>
                <span className="text-gray-500 ml-2">
                    ({gundamsInGrade.length} mô hình)
                </span>
            </div>
        );

        return {
            key: grade,
            label: header,
            children: (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-3">
                    {gundamsInGrade.map(gundam => (
                        <GundamCard
                            key={gundam.id}
                            gundam={gundam}
                            onCardClick={() => showGundamDetails(gundam)}
                            onFavoriteToggle={(e) => toggleFavorite(gundam.id, e)}
                        />
                    ))}
                </div>
            )
        };
    });

    return (
        <Collapse
            items={items}
            defaultActiveKey={gradesWithContent[0]} // Mở sẵn grade đầu tiên
            className="bg-white"
            expandIconPosition="end"
        />
    );
};

export default GundamCollectionList;