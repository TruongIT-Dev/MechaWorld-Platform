import { Table, Row, Button, InputNumber, Select } from "antd";
import { useEffect, useState } from "react";
import { GetGundamByID } from "../../apis/Product/APIProduct";
import Cookies from "js-cookie";

const { Option } = Select;

function ShopProduct() {
  const user = JSON.parse(Cookies.get("user"));
  const [gundamList, setGundamList] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  
  // Bộ lọc giá tiền & phân khúc
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  const [selectedGrade, setSelectedGrade] = useState(null);

  useEffect(() => {
    GetGundamByID(user.id,"")
      .then((response) => {
        setGundamList(response.data);
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", error);
      });
  }, []);

  // Lọc dữ liệu khi có thay đổi
  useEffect(() => {
    let filtered = gundamList;

    // Lọc theo giá
    if (minPrice !== null) {
      filtered = filtered.filter((item) => item.price >= minPrice);
    }
    if (maxPrice !== null) {
      filtered = filtered.filter((item) => item.price <= maxPrice);
    }

    // Lọc theo tình trạng
    if (selectedCondition) {
      filtered = filtered.filter((item) => item.condition === selectedCondition);
    }

    // Lọc theo phân khúc (grade)
    if (selectedGrade) {
      filtered = filtered.filter((item) => item.grade === selectedGrade);
    }

    setFilteredData(filtered);
  }, [minPrice, maxPrice, selectedCondition, selectedGrade, gundamList]);

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "image_urls",
      render: (images) => (
        <img src={images[0]} alt="Gundam" width={100} height={100} style={{ objectFit: "cover" }} />
      ),
      width: 120,
    },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name", width: 200 },
    { title: "Phân khúc", dataIndex: "grade", key: "grade", width: 100 },
    { title: "Hãng sản xuất", dataIndex: "manufacturer", key: "manufacturer", width: 100 },
    {
      title: "Giá bán",
      dataIndex: "price",
      key: "price",
      width: 100,
      sorter: (a, b) => a.price - b.price,
      render: (price) => `${price.toLocaleString()} VNĐ`,
    },
    {
      title: "Tình trạng sản phẩm",
      dataIndex: "condition",
      key: "condition",
      width: 120,
      filters: [
        { text: "Hàng mới", value: "new" },
        { text: "Đã mở hộp", value: "open box" },
        { text: "Đã qua sử dụng", value: "second hand" },
      ],
      onFilter: (value, record) => record.condition === value,
      render: (condition) => {
        const conditionMap = {
          new: "Hàng mới",
          "open box": "Đã mở hộp",
          "second hand": "Đã qua sử dụng",
        };
        return conditionMap[condition] || condition;

      },
    },
    {
      title: "Hành động",
      key: "action",
      render: () => <Button type="primary"className="bg-[#0056b3] hover:bg-[#4a90e2]">Chỉnh sửa</Button>,
      width: 100,
    },
  ];

  return (
    <div>
      <div className="container-content">
        <Row className="mb-4 flex gap-8">
          <InputNumber
            placeholder="Giá thấp nhất"
            min={0}
            value={minPrice}
            onChange={setMinPrice}
          />
          <InputNumber
            placeholder="Giá cao nhất"
            min={0}
            value={maxPrice}
            onChange={setMaxPrice}
          />
          <Select placeholder="Lọc tình trạng" allowClear onChange={setSelectedCondition}>
            <Option value="new">Hàng mới</Option>
            <Option value="open box">Đã mở hộp</Option>
            <Option value="second hand">Đã qua sử dụng</Option>
          </Select>
          <Select placeholder="Lọc phân khúc" allowClear onChange={setSelectedGrade}>
            {[...new Set(gundamList.map((item) => item.grade))].map((grade) => (
              <Option key={grade} value={grade}>
                {grade}
              </Option>
            ))}
          </Select>
          <Button onClick={() => setFilteredData(gundamList)} className="">Xóa bộ lọc</Button>
        </Row>

        <Table columns={columns} dataSource={filteredData} pagination={{
                defaultPageSize: 10,
            }}
            scroll={{
              y: 55 * 10,
            }} />
      </div>
    </div>
  );
}

export default ShopProduct;
