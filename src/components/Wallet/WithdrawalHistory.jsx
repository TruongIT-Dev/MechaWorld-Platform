import { useState } from 'react';
import { Table, Tag, Button, Modal, Card, Timeline, Popconfirm, Tooltip } from 'antd';
import {
    EyeOutlined,
    StopOutlined,
    ClockCircleOutlined,
    CheckCircleOutlined,
    ExclamationCircleOutlined,
    BankOutlined
} from '@ant-design/icons';
import { WITHDRAWAL_STATUS_MAP, WITHDRAWAL_STATUS } from '../constants/withdrawalConstants';

const WithdrawalHistory = ({ withdrawalRequests, loading, onCancel }) => {

    const showRequestDetail = (request) => {
        const statusInfo = WITHDRAWAL_STATUS_MAP[request.status] || {};

        Modal.info({
            title: (
                <div className="flex items-center">
                    <BankOutlined className="mr-2 text-blue-500" />
                    Chi tiết yêu cầu rút tiền
                </div>
            ),
            width: 700,
            content: (
                <div className="space-y-6 mt-4">
                    {/* Header Info */}
                    <Card size="small" className="bg-gray-50">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Mã yêu cầu</p>
                                <p className="font-mono text-sm bg-white px-2 py-1 rounded border">
                                    {request.id || request.reference_id}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600 text-sm mb-1">Trạng thái</p>
                                <Tag color={statusInfo.color} className="text-sm">
                                    {statusInfo.text}
                                </Tag>
                            </div>
                        </div>
                    </Card>

                    {/* Amount and Bank Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Thông tin rút tiền" size="small">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Số tiền:</span>
                                    <span className="font-semibold text-red-600 text-lg">
                                        -₫{request.amount.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phí giao dịch:</span>
                                    <span className="text-green-600">Miễn phí</span>
                                </div>
                                <div className="flex justify-between border-t pt-2">
                                    <span className="text-gray-600 font-medium">Tổng nhận:</span>
                                    <span className="font-bold text-lg">
                                        ₫{request.amount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </Card>

                        <Card title="Tài khoản nhận" size="small">
                            <div className="space-y-2">
                                <div>
                                    <p className="text-gray-600 text-sm">Ngân hàng</p>
                                    <p className="font-medium">{request.bank_account?.bank_name}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Chủ tài khoản</p>
                                    <p className="font-medium">{request.bank_account?.account_holder}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Số tài khoản</p>
                                    <p className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                                        {request.bank_account?.account_number}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Timeline */}
                    <Card title="Tiến độ xử lý" size="small">
                        <Timeline>
                            <Timeline.Item
                                color="blue"
                                dot={<CheckCircleOutlined />}
                            >
                                <div>
                                    <p className="font-medium">Yêu cầu được tạo</p>
                                    <p className="text-sm text-gray-500">
                                        {new Date(request.created_at).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </Timeline.Item>

                            {request.status !== WITHDRAWAL_STATUS.PENDING && (
                                <Timeline.Item
                                    color={request.status === WITHDRAWAL_STATUS.CANCELLED ? 'red' : 'orange'}
                                    dot={
                                        request.status === WITHDRAWAL_STATUS.CANCELLED ?
                                            <ExclamationCircleOutlined /> :
                                            <ClockCircleOutlined />
                                    }
                                >
                                    <div>
                                        <p className="font-medium">
                                            {request.status === WITHDRAWAL_STATUS.CANCELLED ? 'Đã hủy' : 'Đang xử lý'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {request.processed_at && new Date(request.processed_at).toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </Timeline.Item>
                            )}

                            {request.status === WITHDRAWAL_STATUS.COMPLETED && (
                                <Timeline.Item
                                    color="green"
                                    dot={<CheckCircleOutlined />}
                                >
                                    <div>
                                        <p className="font-medium">Hoàn thành</p>
                                        <p className="text-sm text-gray-500">
                                            {new Date(request.completed_at).toLocaleString('vi-VN')}
                                        </p>
                                        {request.transaction_id && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                Mã GD: {request.transaction_id}
                                            </p>
                                        )}
                                    </div>
                                </Timeline.Item>
                            )}

                            {request.status === WITHDRAWAL_STATUS.PENDING && (
                                <Timeline.Item
                                    color="gray"
                                    dot={<ClockCircleOutlined />}
                                >
                                    <div>
                                        <p className="font-medium text-gray-500">Chờ xử lý</p>
                                        <p className="text-sm text-gray-400">
                                            Dự kiến: 1-3 ngày làm việc
                                        </p>
                                    </div>
                                </Timeline.Item>
                            )}
                        </Timeline>
                    </Card>

                    {/* Notes */}
                    {request.notes && (
                        <Card title="Ghi chú" size="small">
                            <p className="text-gray-700">{request.notes}</p>
                        </Card>
                    )}

                    {/* Status Description */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                            <strong>Trạng thái hiện tại:</strong> {statusInfo.description}
                        </p>
                    </div>
                </div>
            ),
            okText: 'Đóng',
            okButtonProps: {
                className: 'bg-blue-500 hover:bg-blue-600 border-blue-500',
            },
        });
    };

    const columns = [
        {
            title: "Thời gian",
            dataIndex: "created_at",
            key: "created_at",
            width: 180,
            render: (date) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('vi-VN')}
                    </div>
                    <div className="text-sm text-gray-500">
                        {new Date(date).toLocaleTimeString('vi-VN')}
                    </div>
                </div>
            ),
            sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
            defaultSortOrder: 'descend'
        },
        {
            title: "Mã yêu cầu",
            dataIndex: "id",
            key: "id",
            width: 130,
            render: (id) => (
                <code className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">
                    WD{id}
                </code>
            )
        },
        {
            title: "Số tiền",
            dataIndex: "amount",
            key: "amount",
            width: 150,
            render: (amount) => (
                <div className="font-semibold text-red-600">
                    -₫{amount.toLocaleString()}
                </div>
            ),
            sorter: (a, b) => a.amount - b.amount
        },
        {
            title: "Ngân hàng",
            key: "bank_info",
            width: 200,
            render: (_, record) => (
                <div>
                    <div className="font-medium text-gray-900">
                        {record.bank_account?.bank_name}
                    </div>
                    <div className="text-sm text-gray-500">
                        {record.bank_account?.account_number}
                    </div>
                </div>
            )
        },
        {
            title: "Trạng thái",
            dataIndex: "status",
            key: "status",
            width: 130,
            render: (status) => {
                const statusInfo = WITHDRAWAL_STATUS_MAP[status] || {};
                return (
                    <Tag color={statusInfo.color}>
                        {statusInfo.text}
                    </Tag>
                );
            },
            filters: Object.entries(WITHDRAWAL_STATUS_MAP).map(([key, value]) => ({
                text: value.text,
                value: key
            })),
            onFilter: (value, record) => record.status === value,
        },
        {
            title: "Thao tác",
            key: "actions",
            width: 150,
            render: (_, record) => (
                <div className="flex space-x-2">
                    <Tooltip title="Xem chi tiết">
                        <Button
                            type="text"
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => showRequestDetail(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>

                    {record.status === WITHDRAWAL_STATUS.PENDING && (
                        <Popconfirm
                            title="Bạn có chắc chắn muốn hủy yêu cầu này?"
                            description="Hành động này không thể hoàn tác."
                            onConfirm={() => onCancel(record.id)}
                            okText="Hủy yêu cầu"
                            cancelText="Không"
                            okButtonProps={{ danger: true }}
                        >
                            <Tooltip title="Hủy yêu cầu">
                                <Button
                                    type="text"
                                    size="small"
                                    icon={<StopOutlined />}
                                    danger
                                />
                            </Tooltip>
                        </Popconfirm>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div>
            <Card className="shadow-sm border-0">
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">Lịch sử rút tiền</h3>
                    <p className="text-gray-600 text-sm mt-1">Theo dõi các yêu cầu rút tiền của bạn</p>
                </div>

                <Table
                    columns={columns}
                    dataSource={withdrawalRequests}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                        showTotal: (total) => `Tổng ${total} yêu cầu`,
                        showQuickJumper: true
                    }}
                    scroll={{ x: true }}
                    className="border border-gray-200 rounded-lg"
                    size="middle"
                    locale={{
                        emptyText: (
                            <div className="text-center py-8">
                                <BankOutlined className="text-4xl text-gray-300 mb-3" />
                                <p className="text-gray-500">Chưa có yêu cầu rút tiền nào</p>
                            </div>
                        )
                    }}
                />
            </Card>
        </div>
    );
};

export default WithdrawalHistory;