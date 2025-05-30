import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Input, message, Steps, QRCode, Tabs, Tooltip, InputNumber, Tag } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined, WalletOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { checkWallet } from '../../apis/User/APIUser';
import { AddMoney,getWalletTransactions } from '../../apis/Wallet/APIWallet';

const { Step } = Steps;
const { TabPane } = Tabs;

// Mapping các loại giao dịch sang tiếng Việt
const transactionTypeMap = {
  deposit: { text: 'Nạp tiền', color: 'green' },
  withdrawal: { text: 'Rút tiền', color: 'red' },
  payment: { text: 'Thanh toán', color: 'orange' },
  payment_received: { text: 'Nhận thanh toán', color: 'blue' },
  refund: { text: 'Hoàn tiền', color: 'purple' },
  hold_funds: { text: 'Tạm giữ tiền', color: 'gold' },
  release_funds: { text: 'Giải phóng tiền', color: 'cyan' },
  exchange_compensation_hold: { text: 'Tạm giữ bồi thường', color: 'volcano' },
  exchange_compensation_transfer: { text: 'Chuyển bồi thường', color: 'magenta' },
  exchange_compensation_release: { text: 'Giải phóng bồi thường', color: 'lime' },
  auction_deposit: { text: 'Đặt cọc đấu giá', color: 'geekblue' },
  auction_deposit_refund: { text: 'Hoàn tiền đấu giá', color: 'purple' },
  auction_compensation: { text: 'Bồi thường đấu giá', color: 'volcano' },
  auction_winner_payment: { text: 'Thanh toán đấu giá', color: 'orange' },
  auction_seller_payment: { text: 'Nhận tiền đấu giá', color: 'blue' },
  subscription_payment: { text: 'Thanh toán gói dịch vụ', color: 'gold' }
};

// Mapping trạng thái giao dịch
const statusMap = {
  completed: { text: 'Thành công', color: 'success' },
  pending: { text: 'Đang xử lý', color: 'processing' },
  failed: { text: 'Thất bại', color: 'error' }
};

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentData, setPaymentData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const userId = useSelector((state) => state.auth.user.id);
  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const [balanceRes, transactionsRes] = await Promise.all([
        checkWallet(userId),
        getWalletTransactions()
      ]);
      
      setBalance(balanceRes.data.balance);
      setTransactions(transactionsRes.data || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu ví:', error);
      message.error('Lỗi khi lấy thông tin ví. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };;

  // Giữ nguyên hàm API tạo đơn hàng ZabPay
  const createZabPayOrder = async (amount) => {
    try {
      const response = await AddMoney(
        amount,
        "Nạp tiền vào ví ZaloPay",
        `${window.location.origin}/member/profile/wallet`
      );

      console.log('API Response:', response.data);

      if (response.data && response.data.order_url) {
        return {
          success: true,
          data: {
            order_url: response.data.order_url,
            order_id: response.data.order_id || Date.now().toString()
          }
        };
      }
      throw new Error(response.data?.message || 'Không nhận được link thanh toán');
    } catch (error) {
      console.error('Lỗi API:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      throw new Error(`Lỗi hệ thống: ${error.message}`);
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount && depositAmount < 10000) {
      message.error('Bạn cần nạp tối thiểu là 10,000 VNĐ.');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(1);

    try {
      const result = await createZabPayOrder(depositAmount);

      if (result.success) {
        setPaymentData({
          amount: depositAmount,
          orderUrl: result.data.order_url,
          orderId: result.data.order_id
        });

        setCurrentStep(2);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      message.error(`Lỗi: ${error.message.replace('Lỗi hệ thống: ', '')}`);
      setCurrentStep(0);

      if (process.env.NODE_ENV === 'development') {
        console.error('Debug Info:', {
          amount: depositAmount,
          error: error.message,
          stack: error.stack
        });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentComplete = async () => {
    try {
      const response = await checkWallet(userId);
      if (response.data && response.data.balance !== undefined) {
        setBalance(response.data.balance);
      }

      setIsProcessing(false);
      setCurrentStep(0);
      setIsDepositModalVisible(false);
      message.success(`Nạp tiền thành công ${depositAmount.toLocaleString()} VNĐ`);

      // Add to transaction history
      transactionData.unshift({
        key: Date.now().toString(),
        type: 'Nạp tiền',
        amount: `+${depositAmount.toLocaleString()} VNĐ`,
        date: new Date().toISOString().split('T')[0],
        status: 'Thành công'
      });
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      message.error('Nạp tiền thành công nhưng không thể cập nhật số dư');
    }
  };

  // Column Bảng Lịch sử Giao dịch
  const columns = [
    {
      title: "Thời gian",
      dataIndex: "created_at",
      key: "created_at",
      render: (date) => new Date(date).toLocaleString(),
      sorter: (a, b) => new Date(a.created_at) - new Date(b.created_at),
      defaultSortOrder: 'descend'
    },
    {
      title: "Mã giao dịch",
      dataIndex: "reference_id",
      key: "reference_id",
      render: (id) => <span className="text-gray-500 font-mono">{id}</span>
    },
    {
      title: "Loại giao dịch",
      dataIndex: "entry_type",
      key: "entry_type",
      render: (type) => (
        <Tag color={transactionTypeMap[type]?.color || 'default'}>
          {transactionTypeMap[type]?.text || type}
        </Tag>
      ),
      filters: Object.entries(transactionTypeMap).map(([key, value]) => ({
        text: value.text,
        value: key
      })),
      onFilter: (value, record) => record.entry_type === value,
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount, record) => (
        <span className={record.entry_type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
          {record.entry_type === 'deposit' ? '+' : '-'}₫{amount.toLocaleString()}
        </span>
      ),
      sorter: (a, b) => a.amount - b.amount
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={statusMap[status]?.color || 'default'}>
          {statusMap[status]?.text || status}
        </Tag>
      ),
      filters: Object.entries(statusMap).map(([key, value]) => ({
        text: value.text,
        value: key
      })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Chi tiết",
      key: "action",
      render: (_, record) => (
        <Button type="link" size="small" onClick={() => showTransactionDetail(record)}>
          Xem chi tiết
        </Button>
      ),
    },
  ];

  const showTransactionDetail = (transaction) => {
    Modal.info({
      title: 'Chi tiết giao dịch',
      width: 600,
      content: (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Mã giao dịch:</span>
            <span className="font-medium">{transaction.reference_id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Loại giao dịch:</span>
            <Tag color={transactionTypeMap[transaction.entry_type]?.color || 'default'}>
              {transactionTypeMap[transaction.entry_type]?.text || transaction.entry_type}
            </Tag>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Số tiền:</span>
            <span className={transaction.entry_type === 'deposit' ? 'text-green-600' : 'text-red-600'}>
              {transaction.entry_type === 'deposit' ? '+' : '-'}₫{transaction.amount.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái:</span>
            <Tag color={statusMap[transaction.status]?.color || 'default'}>
              {statusMap[transaction.status]?.text || transaction.status}
            </Tag>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thời gian tạo:</span>
            <span>{new Date(transaction.created_at).toLocaleString()}</span>
          </div>
          {transaction.completed_at && (
            <div className="flex justify-between">
              <span className="text-gray-600">Thời gian hoàn thành:</span>
              <span>{new Date(transaction.completed_at).toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-600">Mô tả:</span>
            <span>{transaction.reference_type}</span>
          </div>
        </div>
      ),
      okText: 'Đóng',
      okButtonProps: {
      className: 'text-red-600 border-red-600 hover:text-white hover:bg-red-600',
      },
    });
  };

  return (
    <>
      <div className="container mx-auto p-10">
        <h2 className="text-2xl font-semibold">
          <WalletOutlined className="mr-2 mb-6" /> Ví MechaWorld
        </h2>

        <Tabs defaultActiveKey="1" type="card">
          <TabPane tab="Nạp / Rút & Số dư ví" key="1">
            <Card className="shadow-md rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center px-4 py-6">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-100 text-blue-600 p-4 rounded-full">
                    <WalletOutlined className="text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-1">Số dư ví</h2>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-semibold text-gray-900">
                        {showBalance ? `₫ ${balance.toLocaleString()} VNĐ` : "••••••••"}
                      </span>
                      <Tooltip title={showBalance ? "Ẩn số dư" : "Hiện số dư"}>
                        <Button
                          icon={showBalance ? <EyeInvisibleOutlined /> : <EyeOutlined />}
                          onClick={() => setShowBalance(!showBalance)}
                          type="text"
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>

                {/* Bên phải: Các nút Nạp / Rút */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="primary"
                    icon={<ArrowDownOutlined />}
                    onClick={() => {
                      setIsDepositModalVisible(true);
                      setDepositAmount(0);
                      setCurrentStep(0);
                    }}
                    className="bg-blue-500 border-none"
                  >
                    Nạp tiền
                  </Button>
                  <Button
                    icon={<ArrowUpOutlined />}
                    className="border-gray-300"
                  >
                    Rút tiền
                  </Button>
                </div>
              </div>
            </Card>
          </TabPane>

          {/* Tab 2: Lịch sử giao dịch */}
          {/* Tab 2: Lịch sử giao dịch */}
          <TabPane tab="Lịch sử giao dịch" key="2">
            <Card className="shadow-md rounded-lg overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h2>
              <Table
                columns={columns}
                dataSource={transactions}
                rowKey="id"
                loading={loading}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ['10', '20', '50'],
                  showTotal: (total) => `Tổng ${total} giao dịch`
                }}
                scroll={{ x: true }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Modal Nạp Tiền - giữ nguyên logic */}
      <Modal
        title={
          <div className="flex items-center">
            <ArrowDownOutlined className="text-blue-500 mr-2" />
            <span>NẠP TIỀN VÀO VÍ MECHAWORLD</span>
          </div>
        }
        open={isDepositModalVisible}
        onOk={currentStep === 2 ? handlePaymentComplete : handleDeposit}
        onCancel={() => {
          if (!isProcessing) {
            setIsDepositModalVisible(false);
            setCurrentStep(0);
          }
        }}
        okText={currentStep === 2 ? 'Tôi đã thanh toán' : 'Tiếp tục'}
        cancelText="Hủy bỏ"
        okButtonProps={{
          disabled: isProcessing && currentStep !== 2,
          loading: isProcessing && currentStep !== 2,
          className: 'bg-blue-500 border-none'
        }}
        cancelButtonProps={{
          disabled: isProcessing
        }}
        width={600}
        closable={!isProcessing}
        maskClosable={!isProcessing}
        footer={currentStep === 2 ? null : undefined}
      >
        <div className="mt-4">
          <Steps current={currentStep}>
            <Step title="Số tiền cần nạp" />
            <Step title="Đang tạo giao dịch" icon={isProcessing && currentStep === 1 ? <LoadingOutlined /> : null} />
            <Step title="Thanh toán" />
          </Steps>

          {currentStep === 0 && (
            <div className="mt-6">

              <label className="block text-gray-700 mb-2">Số tiền cần nạp (VNĐ)</label>

              <InputNumber
                placeholder="Nhập số tiền..."
                value={depositAmount || null}
                onChange={(value) => {
                  if (!isNaN(value)) {
                    setDepositAmount(value);
                  }
                }}
                min={10000}
                step={10000}
                className="w-full py-2"
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                parser={(value) => value.replace(/[^0-9]/g, "")}
                addonAfter="VNĐ"
                size="large"
              />

              <p className="text-red-500 mt-2">Lưu ý: Số tiền cần phải nạp tối thiểu: 10,000 VNĐ</p>

              <div className="flex gap-2 mt-4">
                {[50000, 100000, 200000, 500000].map(amount => (
                  <Button
                    key={amount}
                    onClick={() => setDepositAmount(amount)}
                    className={depositAmount === amount ? 'bg-blue-50 border-blue-500' : ''}
                  >
                    {amount.toLocaleString()}đ
                  </Button>
                ))}
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="text-center my-8">
              <LoadingOutlined style={{ fontSize: 48 }} />
              <p className="mt-4 text-lg">Đang tạo yêu cầu nạp tiền...</p>
            </div>
          )}

          {currentStep === 2 && paymentData && (
            <div className="mt-6">
              <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
                <p className="text-green-800 font-medium">Vui lòng thanh toán qua cổng ZaloPay</p>
                <p className="text-gray-600 mt-2">Số tiền: {paymentData.amount.toLocaleString()} VNĐ</p>
                <p className="text-gray-500 text-sm mt-1">Mã giao dịch: {paymentData.orderId}</p>
              </div>

              <div className="flex flex-col items-center">
                <QRCode
                  value={paymentData.orderUrl}
                  size={200}
                  className="mb-4"
                  color="#1890ff"
                />
                <p className="text-sm text-gray-500 mb-4">Quét mã QR bằng ứng dụng ZaloPay</p>

                <Button
                  type="primary"
                  className="bg-blue-500 border-none hover:bg-blue-600 mb-4"
                  onClick={() => window.open(paymentData.orderUrl, '_blank')}
                >
                  Mở ZaloPay để thanh toán
                </Button>

                {/* <p className="text-sm text-gray-500">
                  Sau khi thanh toán xong, vui lòng nhấn "Tôi đã thanh toán" để hoàn tất
                </p> */}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>

  );
};

export default WalletPage;