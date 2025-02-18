import React, { useState } from 'react';
import { Table, Button, Card, Statistic, Modal, Input } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined, SwapOutlined } from '@ant-design/icons';

const { Column } = Table;

const transactionData = [
  { key: '1', type: 'Nạp tiền', amount: '+1,000,000 VNĐ', date: '2023-10-01', status: 'Thành công' },
  { key: '2', type: 'Chuyển tiền', amount: '-500,000 VNĐ', date: '2023-10-02', status: 'Thành công' },
  { key: '3', type: 'Rút tiền', amount: '-200,000 VNĐ', date: '2023-10-03', status: 'Đang xử lý' },
];

const WalletPage = () => {
  const [balance, setBalance] = useState(5000000);
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [depositAmount, setDepositAmount] = useState(0);

  const handleDeposit = () => {
    setBalance(balance + depositAmount);
    setIsDepositModalVisible(false);
  };

  return (
    <div className="p-4">
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
        <Button className="bg-red-500 border-none" type="primary" icon={<ArrowDownOutlined />} size="large" onClick={() => setIsDepositModalVisible(true)}>
          Nạp tiền
        </Button>
        <Button className="bg-red-500 border-none" type="primary" icon={<ArrowUpOutlined />} size="large">
          Rút tiền
        </Button>
        <Button className="bg-red-500 border-none" type="primary" icon={<SwapOutlined />} size="large">
          Chuyển tiền
        </Button>
      </div>

      {/* Modal Nạp Tiền */}
      <Modal
        title="Nạp tiền"
        open={isDepositModalVisible}
        onOk={handleDeposit}
        onCancel={() => setIsDepositModalVisible(false)}
      >
        <Input
          type="number"
          placeholder="Nhập số tiền"
          value={depositAmount}
          onChange={(e) => setDepositAmount(Number(e.target.value))}
        />
      </Modal>
    </div>
  );
};

export default WalletPage;
