import {
  Table,
  Row,
  Button,

} from "antd";


function ShopProduct() {
  const dataSource = Array.from({ length: 10 }).map((_, i) => ({
    key: i,
    code: `CGS-${i + 1}`,
    name: `Gundam RX-78-${i + 1}`,
    manufacturer: "Bandai",
    price: 300000,
  }));


  return (
    <div>
      <div className="container-content">      

        <Row>
          <Table
            columns={[
              { title: "Mã sản phẩm", dataIndex: "code", width: 40 },
              { title: "Tên sản phẩm", dataIndex: "name", width: 100 },
              { title: "Hãng sản xuất", dataIndex: "manufacturer", width: 50 },
              { title: "Giá bán", dataIndex: "price", width: 50 },
              {
                title: "Action",
                dataIndex: "action",
                render: () => <Button>Chỉnh sửa</Button>,
              },
            ]}
            dataSource={dataSource}
            pagination={{ defaultPageSize: 20 }}
          />
        </Row>
      </div>
      <div>
      </div>
    </div>
  );
}

export default ShopProduct;
