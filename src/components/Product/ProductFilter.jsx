import { useState } from "react";
import { Collapse, Input, Radio, Slider } from "antd";

const { Panel } = Collapse;

const FilterSidebar = () => {
    const [grade, setGrade] = useState("all");
    const [condition, setCondition] = useState("all");
    const [priceRange, setPriceRange] = useState([100, 1000]);

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
                        onChange={(e) => setGrade(e.target.value)}
                        value={grade}
                        className="flex flex-col space-y-2 font-normal"
                    >
                        <Radio value="all">Tất cả loại</Radio>
                        <Radio value="EG">Entry Grade</Radio>
                        <Radio value="HG">High Grade</Radio>
                        <Radio value="MG">Master Grade</Radio>
                        <Radio value="PG">Perfect Grade</Radio>
                        <Radio value="RG">Real Grade</Radio>
                        <Radio value="SD">Super Deformed</Radio>
                        <Radio value="NG">None Grade</Radio>
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
