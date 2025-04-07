import React, { useState } from 'react';
import { Table, Button, Card, Statistic, Modal, Input, message, Steps, QRCode } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SwapOutlined, LoadingOutlined } from '@ant-design/icons';
import { AddMoney } from '../../apis/Wallet/APIWallet'; // Import hàm AddMoney

const { Column } = Table;
const { Step } = Steps;

const transactionData = [
  { key: '1', type: 'Nạp tiền', amount: '+1,000,000 VNĐ', date: '2023-10-01', status: 'Thành công' },
  { key: '2', type: 'Chuyển tiền', amount: '-500,000 VNĐ', date: '2023-10-02', status: 'Thành công' },
  { key: '3', type: 'Rút tiền', amount: '-200,000 VNĐ', date: '2023-10-03', status: 'Đang xử lý' },
];

const WalletPage = () => {
  const [balance, setBalance] = useState(5000000);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [paymentData, setPaymentData] = useState(null);

  // Hàm gọi API tạo đơn hàng ZabPay (thay thế ZaloPay)
  // WalletPage.tsx
const createZabPayOrder = async (amount) => {
  try {
      const response = await AddMoney(
          amount,
          "Nạp tiền vào ví ZabPay",
          `${window.location.origin}/wallet`
      );

      // Kiểm tra kỹ cấu trúc response thực tế
      console.log('API Response:', response.data);

      // Điều chỉnh theo response thực tế của ZabPay/RaloPay
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
      
      // Hiển thị thông báo chi tiết hơn trong development
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

  // Xử lý sau khi thanh toán (giả lập)
  const handlePaymentComplete = () => {
    setBalance(balance + depositAmount);
    setIsProcessing(false);
    setCurrentStep(0);
    setIsDepositModalVisible(false);
    message.success(`Nạp tiền thành công ${depositAmount.toLocaleString()} VNĐ`);
    
    transactionData.unshift({
      key: Date.now().toString(),
      type: 'Nạp tiền',
      amount: `+${depositAmount.toLocaleString()} VNĐ`,
      date: new Date().toISOString().split('T')[0],
      status: 'Thành công'
    });
  };

  return (
    <div className="container mx-auto mt-36 mb-14">
      {/* Số dư ví */}
      <Card className="mb-6">
        <Statistic
          title="Số dư ví"
          value={balance}
          precision={0}
          valueStyle={{ color: '#3f8600' }}
          prefix="₫"
          suffix="VNĐ"
        />
      </Card>

      {/* Lịch sử giao dịch */}
      <Card title="Lịch sử giao dịch">
        <Table dataSource={transactionData} pagination={true}>
          <Column title="Loại giao dịch" dataIndex="type" key="type" />
          <Column title="Số tiền" dataIndex="amount" key="amount" />
          <Column title="Ngày" dataIndex="date" key="date" />
          <Column title="Trạng thái" dataIndex="status" key="status" />
        </Table>
      </Card>

      {/* Nút chức năng */}
      <div className="flex space-x-4 mb-6 mt-6">
        <Button 
          className="bg-red-500 border-none hover:bg-red-600" 
          type="primary" 
          icon={<ArrowDownOutlined />} 
          size="large" 
          onClick={() => {
            setIsDepositModalVisible(true);
            setDepositAmount(0);
            setCurrentStep(0);
          }}
        >
          Nạp tiền
        </Button>
        <Button 
          className="bg-red-500 border-none hover:bg-red-600" 
          type="primary" 
          icon={<ArrowUpOutlined />} 
          size="large"
        >
          Rút tiền
        </Button>
        <Button 
          className="bg-red-500 border-none hover:bg-red-600" 
          type="primary" 
          icon={<SwapOutlined />} 
          size="large"
        >
          Chuyển tiền
        </Button>
      </div>

      {/* Modal Nạp Tiền */}
      <Modal
        title="Nạp tiền vào ví ZabPay"
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
          className: 'bg-red-500 border-none hover:bg-red-600'
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
              />
              <p className="text-gray-500 mt-2">Số tiền tối thiểu: 10,000 VNĐ</p>
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
                <p className="text-gray-500 text-sm mt-1">Mã giao dịch: {paymentData.appTransId}</p>
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
    </div>
  );
};

export default WalletPage;