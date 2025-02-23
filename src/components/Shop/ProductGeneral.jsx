import { Form, Input, Select } from "antd";

const { Option } = Select;

const seriesGundam = ["Mobile Suit Gundam", "Gundam Wing", "Gundam Seed", "Gundam 00"];
const grade = [
  { name: "HG", display_name: "High Grade" },
  { name: "MG", display_name: "Master Grade" },
  { name: "RG", display_name: "Real Grade" },
  { name: "PG", display_name: "Perfect Grade" }
];
const gundamScale = ["1/144", "1/100", "1/60", "1/48"];

const ProductGeneral = () => {
  return (
    <>
      <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm!" }]}>
        <Input />
      </Form.Item>
      <Form.Item name="series" label="Series Gundam">
        <Select placeholder="Chọn series hoặc nhập mới" allowClear>
          {seriesGundam.map((series) => (
            <Option key={series} value={series}>{series}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="grade" label="Grade">
        <Select placeholder="Chọn grade" allowClear>
          {grade.map((g) => (
            <Option key={g.name} value={g.name}>{g.display_name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name="scale" label="Tỉ lệ Gundam">
        <Select placeholder="Chọn tỉ lệ" allowClear>
          {gundamScale.map((scale) => (
            <Option key={scale} value={scale}>{scale}</Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
};

export default ProductGeneral;
