import {
  Table,
  Row,
  Space,
  Input,
  Button,
  Modal,
  Form,
  Steps,
} from "antd";
import { useState } from "react";
import ProductGeneral from "./ProductGeneral";
import ProductInfoDetail from "./ProductInfoDetail";
import ProductCondition from "./ProductCondition";

const { Step } = Steps;

function ShopProduct() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const [editorContent, setEditorContent] = useState("");
  const [selectedCondition, setSelectedCondition] = useState("new");
  const [checkedConditions, setCheckedConditions] = useState([]);
  const [conditionDescription, setConditionDescription] = useState("");

  const steps = [
    { title: "Thông tin Sản phẩm", content: <ProductGeneral form={form} /> },
    {
      title: "Thông tin chi tiết sản phẩm",
      content: (
        <ProductInfoDetail
          form={form}
          editorContent={editorContent}
          setEditorContent={setEditorContent}
        />
      ),
    },
    {
      title: "Tình trạng sản phẩm",
      content: (
        <ProductCondition
          selectedCondition={selectedCondition}
          setSelectedCondition={setSelectedCondition}
          checkedConditions={checkedConditions}
          setCheckedConditions={setCheckedConditions} 
          conditionDescription={conditionDescription}
          setConditionDescription={setConditionDescription}
        />
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((values) => {
      const productData = {
        ...values,
        description: editorContent,
        condition: selectedCondition,
        condition_description:
          selectedCondition === "new"
            ? "Hộp mới nguyên Seal, chưa bị trầy xước"
            : [...checkedConditions, conditionDescription]
                .filter(Boolean)
                .join(" / "),
      };
      console.log("Data gửi API:", productData);

      form.resetFields();
      setEditorContent("");
      setCheckedConditions([]); 
      setConditionDescription("");
      setSelectedCondition("new");
      setCurrentStep(0);
      setModalOpen(false);
    });
  };

  const next = () => setCurrentStep(currentStep + 1);
  const prev = () => setCurrentStep(currentStep - 1);

  return (
    <div>
      <div className="container-content">
        <Row>
          <Space style={{ marginBottom: 16 }}>
            <Input.Search placeholder="Tìm kiếm sản phẩm" />
            <Button type="primary" className="bg-[#0056b3] hover:bg-[#4a90e2] text-white">Chọn tất cả</Button>
            <Button type="primary" onClick={() => setModalOpen(true)} className="bg-[#0056b3] hover:bg-[#4a90e2] text-white">
              Thêm mới
            </Button>

            <Modal
              title="Thêm Sản Phẩm Mới"
              centered
              open={modalOpen}
              onCancel={() => {
                form.resetFields();
                setModalOpen(false);
              }}
              footer={null}
              width={800}
            >
              <div className="max-w-full mx-auto bg-white p-6">
                <Steps progressDot current={currentStep} className="mb-6">
                  {steps.map((step, index) => (
                    <Step key={index} title={step.title} />
                  ))}
                </Steps>

                <Form form={form} layout="vertical">
                  {steps[currentStep].content}
                </Form>

                <div className="flex justify-between mt-6">
                  {currentStep > 0 && <Button onClick={prev}>Quay lại</Button>}
                  {currentStep < steps.length - 1 ? (
                    <Button onClick={next}>Tiếp tục</Button>
                  ) : (
                    <Button type="primary" onClick={handleOk} className="bg-[#0056b3] hover:bg-[#4a90e2] text-white">
                      Hoàn tất
                    </Button>
                  )}
                </div>
              </div>
            </Modal>
          </Space>
        </Row>

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
            dataSource={[]}
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
