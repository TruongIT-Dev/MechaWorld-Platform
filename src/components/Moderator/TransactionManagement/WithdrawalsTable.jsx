import { useState, useEffect } from 'react';
import { Table, Card, Button, Typography, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { GetWithdrawalRequests, CompleteWithdrawalRequest, RejectWithdrawalRequest } from '../../../apis/Moderator/APIModerator';
import WithdrawActionModal from './WithdrawActionModal';
import { getWithdrawalColumns } from './withdrawalColumns';

const { Text } = Typography;

const WithdrawalsTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    
    const fetchWithdrawalRequests = async () => {
        try {
            setLoading(true);
            const response = await GetWithdrawalRequests();
            setData(response.data || []);
        } catch (error) {
            message.error('Không thể tải danh sách yêu cầu rút tiền');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id, reason) => {
    try {
        setLoading(true);
        const response = await RejectWithdrawalRequest(id, reason);
        if (response && response.data) {
            message.success('Từ chối yêu cầu thành công');
            fetchWithdrawalRequests();
        }
    } catch (error) {
        console.error('Chi tiết lỗi:', error.response?.data || error.message);
        message.error(`Từ chối thất bại: ${error.response?.data?.message || 'Lỗi không xác định'}`);
    } finally {
        setLoading(false);
    }
};

const handleComplete = async (id, transactionReference) => {
    try {
        setLoading(true);
        const response = await CompleteWithdrawalRequest(id, transactionReference);
        if (response && response.data) {
            message.success('Chấp thuận yêu cầu thành công');
            fetchWithdrawalRequests();
        }
    } catch (error) {
        console.error('Chi tiết lỗi:', error.response?.data || error.message);
        message.error(`Chấp thuận thất bại: ${error.response?.data?.message || 'Lỗi không xác định'}`);
    } finally {
        setLoading(false);
    }
};

    const handleProcessRequest = (record) => {
        setCurrentRecord(record);
        setModalVisible(true);
    };

    const handleViewDetails = (record) => {
        // Xử lý xem chi tiết
        console.log('Xem chi tiết:', record);
    };

    useEffect(() => {
        fetchWithdrawalRequests();
    }, []);

    return (
        <>
            <Card
                title="Danh sách yêu cầu rút tiền"
                extra={
                    <Button
                        icon={<ReloadOutlined />}
                        onClick={fetchWithdrawalRequests}
                        loading={loading}
                    >
                        Làm mới
                    </Button>
                }
            >
                <div className="mb-4">
                    <Text strong>
                        Hiển thị {data.length} yêu cầu rút tiền
                    </Text>
                </div>

                <Table
                    columns={getWithdrawalColumns(handleViewDetails, handleProcessRequest)}
                    dataSource={data}
                    loading={loading}
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
                    rowKey="id"
                />
            </Card>

            <WithdrawActionModal
                visible={modalVisible}
                onCancel={() => setModalVisible(false)}
                onComplete={handleComplete}
                onReject={handleReject}
                currentRecord={currentRecord}
            />
        </>
    );
};

export default WithdrawalsTable;