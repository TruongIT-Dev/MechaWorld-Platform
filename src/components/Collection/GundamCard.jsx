import { Card, Typography, Tag } from 'antd';

import { getGradeColor } from './GradeUltils';

const { Title } = Typography;

const GundamCard = ({ gundam, onCardClick }) => {
    return (
        <Card
            key={gundam.id}
            hoverable
            className="overflow-hidden shadow-md hover:shadow-lg transition-all"
            onClick={onCardClick}
        >
            <div className="relative">
                <img
                    alt={gundam.name}
                    src={gundam.image}
                    className="w-full h-48 object-contain mb-2"
                />
            </div>
            <div className="px-1">
                <div className="flex justify-between items-start mb-2">
                    <Title level={5} className="m-0 text-gray-800 truncate" style={{ maxWidth: '80%' }}>
                        {gundam.name}
                    </Title>
                    <Tag color={getGradeColor(gundam.grade)}>{gundam.scale}</Tag>
                </div>
                <div className="flex justify-between text-gray-600 text-sm mt-1">
                    <span>{gundam.series}</span>
                    <span>{gundam.purchaseDate}</span>
                </div>
            </div>
        </Card>
    );
};

export default GundamCard;