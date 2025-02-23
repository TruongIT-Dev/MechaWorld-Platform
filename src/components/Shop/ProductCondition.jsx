import { Form, Select, Checkbox, Input } from "antd";

const { Option } = Select;
const gundamCondition = ["new", "open box", "second hand"];
const conditionOptions = [
  { label: "Trầy xước", value: "Trầy xước" },
  { label: "Móp cạnh", value: "Móp cạnh" },
  { label: "Đã bóc seal", value: "Đã bóc seal" },
  { label: "Đã lắp ráp", value: "Đã lắp ráp" },
  { label: "Dính keo", value: "Dính keo" },
  { label: "Đã dán decal", value: "Đã dán decal" },
  { label: "Đã custom (sơn/modify)", value: "Đã custom (sơn/modify)" },
];

const ProductCondition = ({
  selectedCondition,
  setSelectedCondition,
  checkedConditions,
  setCheckedConditions,
  conditionDescription,
  setConditionDescription,
}) => {
  
  const handleCheckboxChange = (checkedValues) => {
    setCheckedConditions([...checkedValues]); 
  };

  return (
    <>
      <Form.Item name="condition" label="Tình trạng sản phẩm">
        <Select value={selectedCondition} onChange={setSelectedCondition}>
          {gundamCondition.map((cond) => (
            <Option key={cond} value={cond}>{cond}</Option>
          ))}
        </Select>
      </Form.Item>

      {selectedCondition !== "new" && (
        <>
          <p>Chọn mô tả tình trạng:</p>
          <Checkbox.Group
            options={conditionOptions}
            value={checkedConditions}
            onChange={handleCheckboxChange} 
          />
          <Form.Item label="Mô tả tình trạng thêm">
            <Input.TextArea 
              value={conditionDescription} 
              onChange={(e) => setConditionDescription(e.target.value)} 
            />
          </Form.Item>
        </>
      )}
    </>
  );
};

export default ProductCondition;
