import { Card, Typography, List } from "antd";

const { Title, Text } = Typography;

const criteriaList = [
  "✔️ Sản phẩm phải là Gundam chính hãng, không phải hàng giả.",
  "✔️ Sản phẩm có tình trạng nguyên vẹn, không bị hư hỏng nặng.",
  "✔️ Hình ảnh sản phẩm phải rõ ràng, không bị chỉnh sửa quá mức.",
  "✔️ Người bán cần có lịch sử giao dịch tốt, không vi phạm chính sách.",
  "✔️ Giá khởi điểm và bước giá hợp lý theo thị trường.",
  "✔️ Cung cấp đầy đủ thông tin về sản phẩm: tên, phiên bản, hãng sản xuất.",
  "✔️ Đăng ký đấu giá tối thiểu 24 giờ trước khi phiên đấu giá bắt đầu.",
];

const AuctionCriteria = () => {
  return (
    <Card style={{ background: "#fff", padding: 24 }}>
      <Title level={3} style={{ marginBottom: 16 }}>
        📜 Tiêu chí duyệt đấu giá
      </Title>
      <Text type="secondary">
        Các sản phẩm muốn tham gia đấu giá cần tuân thủ các tiêu chí sau để đảm bảo tính minh bạch và công bằng.
      </Text>
      <List
        size="large"
        dataSource={criteriaList}
        renderItem={(item) => (
          <List.Item>
            <Text>{item}</Text>
          </List.Item>
        )}
        style={{ marginTop: 16 }}
      />
    </Card>
  );
};

export default AuctionCriteria;
