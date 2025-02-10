import { useEffect, useState } from "react";
import { Collapse, Input, Radio, Slider } from "antd";
import { ListGrades } from "../../apis/Product/APIProduct";

const { Panel } = Collapse;

const FilterSidebar = () => {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState();
    const [error, setError] = useState("");

    const [condition, setCondition] = useState("all");
    const [priceRange, setPriceRange] = useState([100, 1000]);


    // Fetch ALL Grades
    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const response = await ListGrades();
                setGrades(response?.data || []);
            } catch (err) {
                setError("Grades Error: Lỗi fetch API grades");
            }
        };

        fetchGrades();
    }, []);


    return (
        <div className="bg-white shadow-lg rounded-lg p-4">
            <h1 className="text-lg font-bold mb-4">KHÁM PHÁ GUNDAM</h1>

            {/* Search Bar */}
            <div className="search-bar my-2">
                <Input
                    placeholder="Tìm Gundam..."
                />
            </div>

            <Collapse defaultActiveKey={["1"]} ghost>
                {/* Loại Gundam */}
                <Panel className="font-bold" header="Loại Gundam" key="1">
                    <Radio.Group
                        onChange={(e) => setSelectedGrade(e.target.value)}
                        value={selectedGrade}
                        className="flex flex-col space-y-2 font-normal"
                    >
                        {grades.map((grade, index) => (
                            <Radio key={index} value={grade?.name}>
                                {grade?.display_name}
                            </Radio>
                        ))}
                    </Radio.Group>
                </Panel>

                {/* Tình trạng */}
                <Panel className="font-bold" header="Tình trạng" key="2">
                    <Radio.Group
                        onChange={(e) => setCondition(e.target.value)}
                        value={condition}
                        className="flex flex-col space-y-2 font-normal"
                    >
                        <Radio value="all">Tất cả tình trạng</Radio>
                        <Radio value="new">Nguyên seal</Radio>
                        <Radio value="builded">Mô hình đã lắp ráp</Radio>
                        <Radio value="used">Đã qua sử dụng</Radio>
                    </Radio.Group>
                </Panel>

                {/* Khoảng giá */}
                <Panel className="font-bold" header="Khoảng giá" key="3">
                    <Slider
                        range
                        min={100}
                        max={1000}
                        defaultValue={priceRange}
                        onChange={(value) => setPriceRange(value)}
                    />
                    <div className="flex justify-between text-sm mt-2">
                        <span>${priceRange[0]}</span>
                        <span>${priceRange[1]}</span>
                    </div>
                </Panel>
            </Collapse>

        </div>
    );
};

export default FilterSidebar;
