import { Space, Avatar, Tag, Badge, Button, Typography } from 'antd';
import {
    UserOutlined,
    BankOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    EyeOutlined,
    CreditCardOutlined,
    CalendarOutlined
} from '@ant-design/icons';

const { Text } = Typography;

export const formatPrice = (amount) => `${amount.toLocaleString()}₫`;

export const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
};

export const renderStatus = (status) => {
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

export const renderPriority = (amount) => {
    if (amount > 5000000) {
        return { color: 'red', text: 'Cao', icon: '🔥' };
    } else if (amount > 1000000) {
        return { color: 'orange', text: 'Trung bình', icon: '⚠️' };
    }
    return { color: 'blue', text: 'Bình thường', icon: '📋' };
};

export const getWithdrawalColumns = (handleViewDetails, handleProcessRequest) => [
    {
        title: "Mã yêu cầu",
        dataIndex: "id",
        key: "id",
        width: 120,
        render: (id) => <Text code strong className="text-blue-600">#{id.substring(0, 8)}</Text>,
        fixed: 'left',
    },
    {
        title: "Thông tin người dùng",
        key: "userInfo",
        width: 200,
        render: (_, record) => (
            <Space>
                <Avatar size={40} icon={<UserOutlined />} />
                <div>
                    <div className="font-semibold text-gray-800">User ID: {record.user_id.substring(0, 8)}</div>
                    <div className="text-xs text-gray-500">
                        <BankOutlined className="mr-1" />
                        {record.bank_account.bank_name}
                    </div>
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
                    Ngày tạo: {formatDate(record.created_at)}
                </div>
            </div>
        ),
    },
    {
        title: "Thông tin ngân hàng",
        key: "bankInfo",
        width: 220,
        render: (_, record) => (
            <div>
                <div className="font-semibold text-gray-800">{record.bank_account.bank_name}</div>
                <div className="text-sm text-gray-600">
                    <CreditCardOutlined className="mr-1" />
                    {record.bank_account.account_number}
                </div>
                <div className="text-sm text-gray-500">{record.bank_account.account_name}</div>
                <div className="text-xs text-gray-400">{record.bank_account.bank_short_name}</div>
            </div>
        ),
    },
    {
        title: "Thời gian",
        key: "dateInfo",
        width: 180,
        render: (_, record) => (
            <div>
                <div className="text-sm">
                    <CalendarOutlined className="mr-1 text-blue-500" />
                    {formatDate(record.created_at)}
                </div>
                {record.status === 'completed' && record.completed_at && (
                    <div className="text-xs text-green-600 mt-1">
                        ✅ {formatDate(record.completed_at)}
                    </div>
                )}
                {record.status === 'rejected' && record.processed_at && (
                    <div className="text-xs text-red-600 mt-1">
                        ❌ {formatDate(record.processed_at)}
                    </div>
                )}
            </div>
        ),
    },
    {
        title: "Ưu tiên",
        key: "priority",
        width: 120,
        render: (_, record) => {
            const priority = renderPriority(record.amount);
            return (
                <Badge color={priority.color} text={`${priority.icon} ${priority.text}`} />
            );
        },
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
                    onClick={() => handleViewDetails(record)}
                    title="Xem chi tiết"
                />
                {(record.status === 'pending' || record.status === 'processing') && (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => handleProcessRequest(record)}
                    >
                        {record.status === 'pending' ? 'Xử lý' : 'Tiếp tục'}
                    </Button>
                )}
            </Space>
        ),
        fixed: 'right',
    },
];