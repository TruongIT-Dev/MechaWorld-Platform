import {
    Modal,
    Space,
    Typography,
    Button,
    Row,
    Col,
    Card,
    Avatar,
    Tag,
    Divider,
    Timeline,
    Alert
} from 'antd';
import {
    DollarOutlined,
    PhoneOutlined,
    MailOutlined,
    BankOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const WithdrawalDetailModal = ({ visible, record, onClose }) => {
    const formatPrice = (amount) => `${amount.toLocaleString()}₫`;

    if (!record) return null;

    return (
        <Modal
            title={
                <Space>
                    <DollarOutlined className="text-blue-500" />
                    <span>Chi tiết yêu cầu rút tiền</span>
                    <Text code className="text-blue-600">{record.id}</Text>
                </Space>
            }
            open={visible}
            onCancel={onClose}
            footer={[
                <Button key="close" onClick={onClose}>
                    Đóng
                </Button>
            ]}
            width={800}
            styles={{ body: { maxHeight: '70vh', overflowY: 'auto' } }}
        >
            <div>
                {/* User Information */}
                <Row gutter={[24, 16]} className="mb-6">
                    <Col span={12}>
                        <Card size="small" title="👤 Thông tin người dùng">
                            <Space direction="vertical" size="small" className="w-full">
                                <div className="flex items-center">
                                    <Avatar src={record.user.avatar} className="mr-2" size={40} />
                                    <div>
                                        <Text strong>{record.user.name}</Text>
                                        <br />
                                        <Tag color={record.user.role === 'seller' ? 'green' : 'blue'}>
                                            {record.user.role === 'seller' ? 'Seller' : 'Member'}
                                        </Tag>
                                    </div>
                                </div>
                                <div>
                                    <PhoneOutlined className="mr-2" />
                                    {record.user.phone}
                                </div>
                                <div>
                                    <MailOutlined className="mr-2" />
                                    {record.user.email}
                                </div>
                            </Space>
                        </Card>
                    </Col>

                    <Col span={12}>
                        <Card size="small" title="💰 Thông tin tài chính">
                            <Space direction="vertical" size="small" className="w-full">
                                <div>
                                    <Text strong>Số dư hiện tại:</Text>
                                    <br />
                                    <Text className={record.user.accountBalance > 0 ? "text-green-600" : "text-red-600"} strong>
                                        {formatPrice(record.user.accountBalance)}
                                    </Text>
                                </div>
                                <div>
                                    <Text strong>Tổng thu nhập:</Text>
                                    <br />
                                    <Text className="text-blue-600">{formatPrice(record.user.totalEarned)}</Text>
                                </div>
                                <div>
                                    <Text strong>Số tiền yêu cầu rút:</Text>
                                    <br />
                                    <Text className="text-red-600 text-lg" strong>{formatPrice(record.amount)}</Text>
                                </div>
                            </Space>
                        </Card>
                    </Col>
                </Row>

                {/* Bank Information */}
                <Card size="small" className="mb-4" title="🏦 Thông tin ngân hàng">
                    <Row gutter={[16, 8]}>
                        <Col span={12}>
                            <Text strong>Ngân hàng:</Text>
                            <br />
                            <Text>{record.bankInfo.bankName}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Số tài khoản:</Text>
                            <br />
                            <Text code>{record.bankInfo.accountNumber}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Tên tài khoản:</Text>
                            <br />
                            <Text>{record.bankInfo.accountHolder}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Chi nhánh:</Text>
                            <br />
                            <Text>{record.bankInfo.branch}</Text>
                        </Col>
                    </Row>
                </Card>

                {/* Request Information */}
                <Card size="small" className="mb-4" title="📋 Thông tin yêu cầu">
                    <Row gutter={[16, 8]}>
                        <Col span={12}>
                            <Text strong>Thời gian tạo:</Text>
                            <br />
                            <Text>{record.requestDate}</Text>
                        </Col>
                        <Col span={12}>
                            <Text strong>Trạng thái:</Text>
                            <br />
                            <Tag color={
                                record.status === 'completed' ? 'green' :
                                    record.status === 'rejected' ? 'red' :
                                        record.status === 'processing' ? 'blue' : 'orange'
                            }>
                                {record.status === 'pending' ? 'Chờ xử lý' :
                                    record.status === 'processing' ? 'Đang xử lý' :
                                        record.status === 'completed' ? 'Đã hoàn thành' : 'Đã từ chối'}
                            </Tag>
                        </Col>
                        {record.notes && (
                            <Col span={24}>
                                <Text strong>Ghi chú:</Text>
                                <br />
                                <Text italic>{record.notes}</Text>
                            </Col>
                        )}
                    </Row>

                    {/* Completed/Rejected Info */}
                    {record.status === 'completed' && (
                        <>
                            <Divider />
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong className="text-green-600">Ngày hoàn thành:</Text>
                                    <br />
                                    <Text>{record.completedDate}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong className="text-green-600">Mã giao dịch:</Text>
                                    <br />
                                    <Text code className="text-green-600">{record.transactionCode}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Xử lý bởi:</Text>
                                    <br />
                                    <Text>{record.processedBy}</Text>
                                </Col>
                            </Row>
                        </>
                    )}

                    {record.status === 'rejected' && (
                        <>
                            <Divider />
                            <Row gutter={[16, 8]}>
                                <Col span={12}>
                                    <Text strong className="text-red-600">Ngày từ chối:</Text>
                                    <br />
                                    <Text>{record.rejectedDate}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Từ chối bởi:</Text>
                                    <br />
                                    <Text>{record.rejectedBy}</Text>
                                </Col>
                                <Col span={24}>
                                    <Text strong className="text-red-600">Lý do từ chối:</Text>
                                    <br />
                                    <Alert
                                        message={record.rejectedReason}
                                        type="error"
                                        showIcon
                                        className="mt-2"
                                    />
                                </Col>
                            </Row>
                        </>
                    )}
                </Card>

                {/* Transaction History */}
                <Card size="small" title="📊 Lịch sử giao dịch gần đây">
                    <Timeline>
                        {record.transactionHistory.map((transaction, index) => (
                            <Timeline.Item
                                key={index}
                                color={transaction.amount > 0 ? 'green' : 'red'}
                                dot={transaction.amount > 0 ? <DollarOutlined /> : <BankOutlined />}
                            >
                                <div>
                                    <Text strong>{transaction.type}</Text>
                                    <br />
                                    <Text className={transaction.amount > 0 ? "text-green-600" : "text-red-600"}>
                                        {transaction.amount > 0 ? '+' : ''}{formatPrice(Math.abs(transaction.amount))}
                                    </Text>
                                    <br />
                                    <Text className="text-gray-500">{transaction.date}</Text>
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Card>
            </div>
        </Modal>
    );
};

export default WithdrawalDetailModal;