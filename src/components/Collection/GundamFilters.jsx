import { Button } from 'antd';

const GundamFilters = ({ gradeList, activeFilter, filterByGrade }) => {
    return (
        <div className="flex flex-wrap justify-center items-center gap-2 my-6">
            <Button
                type={activeFilter === 'All' ? 'primary' : 'default'}
                className={activeFilter === 'All' ? 'bg-blue-500' : ''}
                onClick={() => filterByGrade('All')}
            >
                Tất cả
            </Button>

            {gradeList.map(grade => (
                <Button
                    key={grade}
                    type={activeFilter === grade ? 'primary' : 'default'}
                    className={activeFilter === grade ? 'bg-blue-500' : ''}
                    onClick={() => filterByGrade(grade)}
                >
                    {grade}
                </Button>
            ))}
        </div>
    );
};

export default GundamFilters;