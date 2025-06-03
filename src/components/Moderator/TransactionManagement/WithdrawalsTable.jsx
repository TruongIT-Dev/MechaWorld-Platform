import { Table, Card, Space, Avatar, Tag, Badge, Button, Typography } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    PhoneOutlined,
    CreditCardOutlined,
    CalendarOutlined,
    WarningOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const WithdrawalsTable = ({ data, onViewDetails, onProcessRequest }) => {
    const formatPrice = (amount) => `${amount.toLocaleString()}₫`;

    const renderStatus = (status) => {
        const statusConfig = {
            pending: { color: 'orange', text: 'Chờ xử lý', icon: <ClockCircleOutlined /> },
            processing: { color: 'blue', text: 'Đang xử lý', icon: <ClockCircleOutlined /> },
            completed: { color: 'green', text: 'Đã hoàn thành', icon: <CheckCircleOutlined /> },
            rejected: { color: 'red', text: 'Đã từ chối', icon: <ExclamationCircleOutlined /> },
        };

        const config = statusConfig[status] || statusConfig.pending;

        return (
            <Tag color={config.color} icon={config.icon}>
                {config.text}
            </Tag>
        );
    };

    const renderPriority = (priority) => {
        const priorityConfig = {
            high: { color: 'red', text: 'Cao', icon: '🔥' },
            normal: { color: 'blue', text: 'Bình thường', icon: '📋' },
            low: { color: 'gray', text: 'Thấp', icon: '📝' },
        };

        const config = priorityConfig[priority] || priorityConfig.normal;

        return (
            <Badge color={config.color} text={`${config.icon} ${config.text}`} />
        );
    };

    const renderUserRole = (role) => {
        return role === 'seller' ? (
            <Tag color="green" icon={<BankOutlined />}>Seller</Tag>
        ) : (
            <Tag color="blue" icon={<UserOutlined />}>Member</Tag>
        );
    };

    const columns = [
        {
            title: "Mã yêu cầu",
            dataIndex: "id",
            key: "id",
            width: 100,
            render: (id) => <Text code strong className="text-blue-600">{id}</Text>,
            fixed: 'left',
        },
        {
            title: "Thông tin người dùng",
            key: "userInfo",
            width: 250,
            render: (_, record) => (
                <Space>
                    <Avatar src={record.user.avatar} size={40} icon={<UserOutlined />} />
                    <div>
                        <div className="font-semibold text-gray-800">{record.user.name}</div>
                        <div className="text-sm text-gray-500 flex items-center">
                            <PhoneOutlined className="mr-1" />
                            {record.user.phone}
                        </div>
                        <div className="text-xs text-gray-400">{record.user.email}</div>
                        <div className="mt-1">{renderUserRole(record.user.role)}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: "Số tiền yêu cầu",
            key: "amount",
            width: 150,
            render: (_, record) => (
                <div>
                    <div className="font-bold text-red-600 text-lg">
                        {formatPrice(record.amount)}
                    </div>
                    <div className="text-xs text-gray-500">
                        Số dư: {formatPrice(record.user.accountBalance)}
                    </div>
                    {record.amount > record.user.accountBalance && (
                        <div className="text-xs text-red-500 flex items-center">
                            <WarningOutlined className="mr-1" />
                            Không đủ số dư
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Thông tin ngân hàng",
            key: "bankInfo",
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="font-semibold text-gray-800">{record.bankInfo.bankName}</div>
                    <div className="text-sm text-gray-600">
                        <CreditCardOutlined className="mr-1" />
                        {record.bankInfo.accountNumber}
                    </div>
                    <div className="text-sm text-gray-500">{record.bankInfo.accountHolder}</div>
                    <div className="text-xs text-gray-400">{record.bankInfo.branch}</div>
                </div>
            ),
        },
        {
            title: "Thời gian",
            key: "dateInfo",
            width: 140,
            render: (_, record) => (
                <div>
                    <div className="text-sm">
                        <CalendarOutlined className="mr-1 text-blue-500" />
                        {record.requestDate}
                    </div>
                    {record.status === 'completed' && (
                        <div className="text-xs text-green-600 mt-1">
                            ✅ {record.completedDate}
                        </div>
                    )}
                    {record.status === 'rejected' && (
                        <div className="text-xs text-red-600 mt-1">
                            ❌ {record.rejectedDate}
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: "Ưu tiên",
            dataIndex: "priority",
            key: "priority",
            width: 120,
            render: renderPriority,
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: renderStatus,
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        icon={<EyeOutlined />}
                        type="text"
                        onClick={() => onViewDetails(record)}
                        title="Xem chi tiết"
                    />
                    {record.status === 'pending' && (
                        <Button
                            type="primary"
                            size="small"
                            onClick={() => onProcessRequest(record)}
                        >
                            Xử lý
                        </Button>
                    )}
                </Space>
            ),
            fixed: 'right',
        },
    ];

    return (
        <Card>
            <div className="mb-4">
                <Text strong>
                    Hiển thị {data.length} yêu cầu rút tiền
                </Text>
            </div>

            <Table
                columns={columns}
                dataSource={data}
                pagination={{
                    total: data.length,
                    pageSize: 10,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total, range) =>
                        `${range[0]}-${range[1]} của ${total} yêu cầu`,
                    pageSizeOptions: ['10', '20', '50'],
                }}
                scroll={{ x: 1400 }}
                className="overflow-hidden"
                size="middle"
            />
        </Card>
    );
};

export default WithdrawalsTable;