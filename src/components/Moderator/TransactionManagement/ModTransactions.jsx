import { useState } from 'react';
import { Typography, Space, Button, Alert } from 'antd';
import { DollarOutlined, ReloadOutlined, ExportOutlined } from '@ant-design/icons';

// Import components
import WithdrawalStatistics from './WithdrawalStatistics';
import WithdrawalFilters from './WithdrawalFilters';
import WithdrawalsTable from './WithdrawalsTable';
import WithdrawalDetailModal from './WithdrawalDetailModal';
import ProcessRequestModal from './ProcessRequestModal';

const { Title, Text } = Typography;

// Mock data cho yêu cầu rút tiền
const withdrawalData = [
  {
    key: "1",
    id: "WD001",
    user: {
      name: "Nguyễn Văn An",
      avatar: "https://i.pravatar.cc/32",
      phone: "0901234567",
      email: "nguyenvana@email.com",
      role: "seller",
      accountBalance: 5200000,
      totalEarned: 15600000
    },
    amount: 2000000,
    bankInfo: {
      bankName: "Vietcombank",
      accountNumber: "1234567890",
      accountHolder: "NGUYEN VAN AN",
      branch: "Chi nhánh Quận 1"
    },
    requestDate: "2024-05-31 14:30",
    status: "pending",
    priority: "normal",
    notes: "Rút tiền bán hàng tháng 5",
    transactionHistory: [
      { date: "2024-05-30", type: "Bán hàng", amount: 800000, status: "completed" },
      { date: "2024-05-28", type: "Bán hàng", amount: 1200000, status: "completed" },
      { date: "2024-05-25", type: "Rút tiền", amount: -500000, status: "completed" }
    ]
  },
  {
    key: "2",
    id: "WD002",
    user: {
      name: "Trần Thị Bảo",
      avatar: "https://i.pravatar.cc/32",
      phone: "0907654321",
      email: "tranthib@email.com",
      role: "member",
      accountBalance: 850000,
      totalEarned: 2400000
    },
    amount: 500000,
    bankInfo: {
      bankName: "Techcombank",
      accountNumber: "9876543210",
      accountHolder: "TRAN THI BAO",
      branch: "Chi nhánh Quận 3"
    },
    requestDate: "2024-05-31 10:15",
    status: "pending",
    priority: "high",
    notes: "Cần rút gấp để thanh toán",
    transactionHistory: [
      { date: "2024-05-29", type: "Hoàn tiền", amount: 300000, status: "completed" },
      { date: "2024-05-20", type: "Bán item", amount: 550000, status: "completed" }
    ]
  },
  {
    key: "3",
    id: "WD003",
    user: {
      name: "Lê Hoàng Cường",
      avatar: "https://i.pravatar.cc/32",
      phone: "0909876543",
      email: "lehoangcuong@email.com",
      role: "seller",
      accountBalance: 0,
      totalEarned: 8900000
    },
    amount: 1500000,
    bankInfo: {
      bankName: "BIDV",
      accountNumber: "5555666677",
      accountHolder: "LE HOANG CUONG",
      branch: "Chi nhánh Quận 5"
    },
    requestDate: "2024-05-30 16:45",
    status: "completed",
    priority: "normal",
    notes: "Rút tiền định kỳ",
    completedDate: "2024-05-31 09:20",
    transactionCode: "VCB240531092001",
    processedBy: "Admin",
    transactionHistory: [
      { date: "2024-05-28", type: "Bán hàng", amount: 1200000, status: "completed" },
      { date: "2024-05-25", type: "Bán hàng", amount: 800000, status: "completed" }
    ]
  },
  {
    key: "4",
    id: "WD004",
    user: {
      name: "Phạm Minh Dũng",
      avatar: "https://i.pravatar.cc/32",
      phone: "0908765432",
      email: "phamminhd@email.com",
      role: "member",
      accountBalance: 350000,
      totalEarned: 1200000
    },
    amount: 800000,
    bankInfo: {
      bankName: "ACB",
      accountNumber: "1111222233",
      accountHolder: "PHAM MINH DUNG",
      branch: "Chi nhánh Tân Bình"
    },
    requestDate: "2024-05-29 20:30",
    status: "rejected",
    priority: "normal",
    notes: "Rút tiền mua gundam mới",
    rejectedDate: "2024-05-30 08:15",
    rejectedReason: "Số dư tài khoản không đủ. Chỉ có 350,000₫ nhưng yêu cầu rút 800,000₫",
    rejectedBy: "Admin",
    transactionHistory: [
      { date: "2024-05-25", type: "Hoàn tiền", amount: 350000, status: "completed" }
    ]
  }
];

const ModWithdrawals = () => {
  const [filteredStatus, setFilteredStatus] = useState(null);
  const [filteredRole, setFilteredRole] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isProcessModalVisible, setIsProcessModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [dateRange, setDateRange] = useState(null);

  // Thống kê tổng quan
  const stats = {
    totalRequests: withdrawalData.length,
    pendingRequests: withdrawalData.filter(w => w.status === 'pending').length,
    completedRequests: withdrawalData.filter(w => w.status === 'completed').length,
    rejectedRequests: withdrawalData.filter(w => w.status === 'rejected').length,
    totalAmount: withdrawalData
      .filter(w => w.status === 'completed')
      .reduce((sum, w) => sum + w.amount, 0),
  };

  // Lọc dữ liệu
  const filteredData = withdrawalData.filter((item) => {
    const matchesStatus = filteredStatus ? item.status === filteredStatus : true;
    const matchesRole = filteredRole ? item.user.role === filteredRole : true;
    const matchesSearch = searchText ? (
      item.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toLowerCase().includes(searchText.toLowerCase()) ||
      item.bankInfo.accountNumber.includes(searchText)
    ) : true;

    return matchesStatus && matchesRole && matchesSearch;
  });

  // Xử lý xem chi tiết
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setIsDetailModalVisible(true);
  };

  // Xử lý yêu cầu rút tiền
  const handleProcessRequest = (record) => {
    setSelectedRecord(record);
    setIsProcessModalVisible(true);
  };

  // Xử lý hoàn thành rút tiền
  const handleCompleteWithdrawal = async (requestId, transactionCode) => {
    // Gọi API hoàn thành
    console.log('Complete withdrawal:', requestId, transactionCode);
    // PATCH /v1/mod/withdrawal-requests/:requestID/complete

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  // Xử lý từ chối rút tiền
  const handleRejectWithdrawal = async (requestId, rejectReason) => {
    // Gọi API từ chối
    console.log('Reject withdrawal:', requestId, rejectReason);
    // PATCH /v1/mod/withdrawal-requests/:requestID/reject

    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 1000);
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="mb-2">
            <DollarOutlined className="mr-2 text-green-500" />
            Quản lý Yêu cầu Rút tiền
          </Title>
          <Text className="text-gray-500">
            Xử lý và quản lý các yêu cầu rút tiền từ người dùng
          </Text>
        </div>
        <Space>
          <Button icon={<ReloadOutlined />}>Làm mới</Button>
          <Button icon={<ExportOutlined />}>Xuất báo cáo</Button>
        </Space>
      </div>

      {/* Important Notice */}
      <Alert
        message="Lưu ý quan trọng cho Moderator"
        description={
          <ul className="mt-2 mb-0">
            <li>• Kiểm tra kỹ thông tin tài khoản ngân hàng trước khi chuyển tiền</li>
            <li>• Thực hiện chuyển khoản qua internet banking hoặc trực tiếp tại ngân hàng</li>
            <li>• Lưu lại mã giao dịch và biên lai từ ngân hàng để đối soát</li>
            <li>• Chỉ đánh dấu "Hoàn thành" sau khi đã chuyển tiền thành công</li>
          </ul>
        }
        type="info"
        showIcon
        className="mb-6"
      />

      {/* Statistics */}
      <WithdrawalStatistics stats={stats} />

      {/* Filters */}
      <WithdrawalFilters
        onSearch={setSearchText}
        onFilterStatus={setFilteredStatus}
        onFilterRole={setFilteredRole}
        onDateRangeChange={setDateRange}
      />

      {/* Withdrawals Table */}
      <WithdrawalsTable
        data={filteredData}
        onViewDetails={handleViewDetails}
        onProcessRequest={handleProcessRequest}
      />

      {/* Detail Modal */}
      <WithdrawalDetailModal
        visible={isDetailModalVisible}
        record={selectedRecord}
        onClose={() => setIsDetailModalVisible(false)}
      />

      {/* Process Request Modal */}
      <ProcessRequestModal
        visible={isProcessModalVisible}
        record={selectedRecord}
        onClose={() => setIsProcessModalVisible(false)}
        onComplete={handleCompleteWithdrawal}
        onReject={handleRejectWithdrawal}
      />
    </div>
  );
};

export default ModWithdrawals;