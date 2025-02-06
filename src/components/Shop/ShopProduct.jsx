import { Table, Row, Space, Input, Button, Modal, Form, Select } from "antd";
import  { useState } from 'react';


const { Option } = Select;
const columns = [
  {
    title: "Mã sản phẩm",
    dataIndex: "code",
    width: 40,
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    width: 100,
  },
  {
    title: "Hãng sản xuất",
    dataIndex: "manufacturer",
    width: 50,
  },
  {
    title: "Giá bán",
    dataIndex: "price",
    width: 50,
  },
  {
    title: "Action",
    dataIndex: "action",
    width: 50,
    render: () => <Button>Chỉnh sửa</Button>,
  }
];
const dataSource = Array.from({
  length: 100,
}).map((_, i) => ({
  key: i,
  code: `CGS-${i+1}`,
  name: `BANDAI MG 1/100 Gundam 00V 00 Qant[T] Full Saver Painted Plastic Model Kit ${i}`,
  price: 320000,
  manufacturer: `Bandai`,
}));

function ShopProduct() {
    const [modal2Open, setModal2Open] = useState(false);
    const [form] = Form.useForm();
    const handleOk = () => {
        form.validateFields() 
      .then((values) => {
        console.log("Data from form:", values); 

        form.resetFields(); 
        setModal2Open(false); 
      })
      .catch((errorInfo) => {
        console.log('Validate Failed:', errorInfo); 
      });
      };
      const handleCancel = () => {
        setModal2Open(false);
        form.resetFields(); 
      };
  return (
    <div>
      {/*Content */}
      <div className="container-content">
        <Row>
          <Space style={{ marginBottom: 16 }}>
            <Input.Search placeholder="Tìm kiếm sản phẩm" />
            <Button className="text-gray-950" type="primary">
              Chọn tất cả
            </Button>
            <Button
              className="text-gray-950"
              type="primary"
              onClick={() => setModal2Open(true)}
            >
              Thêm mới
            </Button>
            <Modal
              title="Thêm Sản Phẩm mới"
              centered
              open={modal2Open}
              onOk={handleOk} // Gọi handleOk khi nhấn OK
              onCancel={handleCancel} // Gọi handleCancel khi nhấn Cancel
            >
              <Form form={form} layout="vertical">
                <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="manufacturer" label="Hãng sản xuất" rules={[{ required: true, message: 'Vui lòng nhập hãng sản xuất!' }]}>
                  <Input />
                </Form.Item>
                <Form.Item name="type" label="Dòng sản xuất" rules={[{ required: true, message: 'Vui lòng chọn dòng sản xuất!' }]}>
                  <Select className="w-full" placeholder="Chọn dòng sản xuất" allowClear>
                    <Option value="High Grade">High Grade</Option>
                    <Option value="Master Grade">Master Grade</Option>
                    <Option value="Real Grade">Real Grade</Option>
                    <Option value="Perfect Grade">Perfect Grade</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="decription" label="Chi tiết">
                  <Input.TextArea />
                </Form.Item>
                <Form.Item name="price" label="Giá bán" rules={[{ required: true, message: 'Vui lòng nhập giá bán!' }]}>
                  <Input type="number" min={0} />
                </Form.Item>
                {/* ... các trường khác */}
              </Form>
            </Modal>
            {/* <Button type="danger">Xóa đã chọn</Button> */}
          </Space>
        </Row>
        <Row>
          <Table
            className={{}}
            columns={columns}
            dataSource={dataSource}
            pagination={{
              defaultPageSize: 20,
            }}
            scroll={{
              y: 55 * 5,
            }}
          />
        </Row>
      </div>

      <br />
    </div>
  );
}

export default ShopProduct;
