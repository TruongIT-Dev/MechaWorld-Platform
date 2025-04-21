import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Input, message, Steps, QRCode, Tabs, Tooltip } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, LoadingOutlined, WalletOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';

import { checkWallet } from '../../apis/User/APIUser';
import { AddMoney } from '../../apis/Wallet/APIWallet';

const { Step } = Steps;
const { TabPane } = Tabs;

const transactionData = [
  { key: '1', type: 'Nạp tiền', amount: '+1,000,000 VNĐ', date: '2023-10-01', status: 'Thành công' },
  { key: '2', type: 'Chuyển tiền', amount: '-500,000 VNĐ', date: '2023-10-02', status: 'Thành công' },
  { key: '3', type: 'Rút tiền', amount: '-200,000 VNĐ', date: '2023-10-03', status: 'Đang xử lý' },
];

const WalletPage = () => {
  const [balance, setBalance] = useState(0);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentData, setPaymentData] = useState(null);
  const userId = useSelector((state) => state.auth.user.id);

  const [showBalance, setShowBalance] = useState(true);

  useEffect(() => {
    checkWallet(userId).then((response) => {
      console.log('API Response:', response.data);
      setBalance(response.data.balance);
    }).catch((error) => {
      console.error('Lỗi API:', {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });
      message.error('Lỗi khi lấy thông tin ví. Vui lòng thử lại sau.');
    });

  }, []);

  // Giữ nguyên hàm API tạo đơn hàng ZabPay
  const createZabPayOrder = async (amount) => {
    try {
      const response = await AddMoney(
        amount,
        "Nạp tiền vào ví ZabPay",
        `${window.location.origin}/wallet`
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
    if (!depositAmount || depositAmount < 10000) {
      message.error('Số tiền nạp tối thiểu là 10,000 VNĐ');
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
      // Refresh balance after successful payment
      // const userId = localStorage.getItem('userId');
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
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Loại giao dịch",
      dataIndex: "type",
      key: "type",
      render: (type) =>
        type === "deposit" ? (
          <span className="text-green-600 font-medium">Nạp tiền</span>
        ) : (
          <span className="text-red-600 font-medium">Rút tiền</span>
        ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      render: (amount) => `₫ ${amount.toLocaleString()} VNĐ`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
  ];

  const depositHistory = [
    { date: "2025-04-06", type: "deposit", amount: 500000, status: "Thành công" },
    { date: "2025-04-03", type: "deposit", amount: 200000, status: "Thành công" },
  ];

  const withdrawHistory = [
    { date: "2025-04-02", type: "withdraw", amount: 100000, status: "Đang xử lý" },
  ];

  return (
    <>
      <div className="container mx-auto p-10">
        <h2 className="text-2xl font-semibold">
          <WalletOutlined className="mr-2" /> Ví Điện Tử
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
                    className="bg-green-500 border-none hover:bg-green-600"
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
          <TabPane tab="Lịch sử giao dịch" key="2">
            <Card className="shadow-md rounded-lg overflow-hidden">
              <h2 className="text-xl font-semibold mb-4">Lịch sử Nạp / Rút tiền</h2>
              <Table
                columns={columns}
                dataSource={[...depositHistory, ...withdrawHistory]}
                rowKey={(record, index) => index}
                pagination={{ pageSize: 5 }}
              />
            </Card>
          </TabPane>
        </Tabs>
      </div>

      {/* Modal Nạp Tiền - giữ nguyên logic */}
      <Modal
        title={
          <div className="flex items-center">
            <ArrowDownOutlined className="text-green-500 mr-2" />
            <span>Nạp tiền vào ví ZabPay</span>
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
          className: 'bg-green-500 border-none hover:bg-green-600'
        }}
        cancelButtonProps={{
          disabled: isProcessing
        }}
        width={600}
        closable={!isProcessing}
        maskClosable={!isProcessing}
      >
        <div className="mt-4">
          <Steps current={currentStep}>
            <Step title="Nhập số tiền" />
            <Step title="Xử lý" icon={isProcessing && currentStep === 1 ? <LoadingOutlined /> : null} />
            <Step title="Thanh toán" />
          </Steps>

          {currentStep === 0 && (
            <div className="mt-6">
              <label className="block text-gray-700 mb-2">Số tiền cần nạp (VNĐ)</label>
              <Input
                type="number"
                placeholder="Nhập số tiền"
                value={depositAmount || ''}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full p-2 border rounded"
                min="10000"
                step="10000"
                addonAfter="VNĐ"
                size="large"
              />
              <p className="text-gray-500 mt-2">Số tiền tối thiểu: 10,000 VNĐ</p>

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
                <p className="text-green-800 font-medium">Vui lòng thanh toán qua ZabPay</p>
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
                <p className="text-sm text-gray-500 mb-4">Quét mã QR bằng ứng dụng ZabPay</p>

                <Button
                  type="primary"
                  className="bg-blue-500 border-none hover:bg-blue-600 mb-4"
                  onClick={() => window.open(paymentData.orderUrl, '_blank')}
                >
                  Mở ZabPay để thanh toán
                </Button>

                <p className="text-sm text-gray-500">
                  Sau khi thanh toán xong, vui lòng nhấn "Tôi đã thanh toán" để hoàn tất
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>

  );
};

export default WalletPage;