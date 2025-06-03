import { useState, useEffect } from 'react';
import {
  Tag,
  Typography,
  message,
} from "antd";
import {
  GetListAuctionRequestsForModerator,
  ApproveAuctionRequest,
  RejectAuctionRequest,
} from "../../../apis/Moderator/APIModerator";
import AuctionStatistics from './AuctionStatistics';
import AuctionFilters from './AuctionFilters';
import AuctionTable from './AuctionTable';
import AuctionDetailModal from './AuctionDetailModal';
import RejectModal from './RejectModal';

const { Title, Text } = Typography;

const ModAuctions = () => {
  const [auctionData, setAuctionData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStatus, setFilteredStatus] = useState("");
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Fetch data
  const fetchData = () => {
    GetListAuctionRequestsForModerator()
      .then((res) => {
        const formatted = res.data.map((item) => ({
          key: item.id,
          id: item.id,
          sellerId: item.seller_id,
          gundamName: item.gundam_snapshot.name,
          status: item.status,
          startingPrice: item.starting_price,
          stepPrice: item.bid_increment,
          gundamSnapshot: item.gundam_snapshot
        }));
        setAuctionData(formatted);
      })
      .catch((err) => {
        console.error("Lỗi khi tải danh sách đấu giá:", err);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lọc dữ liệu
  const filteredData = auctionData.filter((item) => {
    return (
      (item.sellerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gundamName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filteredStatus ? item.status === filteredStatus : true)
    );
  });

  // Handlers
  const handleViewDetail = (auction) => {
    setSelectedAuction(auction);
    setDetailModalVisible(true);
  };

  const handleApprove = async (id) => {
    setLoadingAction(true);
    try {
      await ApproveAuctionRequest(id);
      message.success("Phê duyệt thành công!");
      fetchData();
    } catch (error) {
      message.error("Lỗi khi phê duyệt!");
    }
    setLoadingAction(false);
  };

  const openRejectModal = (id) => {
    setSelectedRequestId(id);
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return message.warning("Vui lòng nhập lý do từ chối.");
    }
    setLoadingAction(true);
    try {
      await RejectAuctionRequest(selectedRequestId, rejectReason);
      message.success("Từ chối thành công!");
      fetchData();
    } catch (error) {
      message.error("Lỗi khi từ chối!");
    }
    setLoadingAction(false);
    setRejectModalVisible(false);
    setRejectReason("");
    setSelectedRequestId(null);
  };

  const formatCurrency = (value) => value?.toLocaleString("vi-VN") + " đ";

  const getStatusTag = (status) => {
    const statusConfig = {
      pending: { color: "orange", icon: "⏳", text: "Chờ duyệt" },
      approved: { color: "green", icon: "✅", text: "Đã phê duyệt" },
      rejected: { color: "red", icon: "❌", text: "Bị từ chối" },
      active: { color: "blue", icon: "🔥", text: "Đang diễn ra" },
      completed: { color: "purple", icon: "🏆", text: "Hoàn thành" },
    };

    const config = statusConfig[status] || { color: "default", icon: "", text: status };

    return (
      <Tag color={config.color} className="px-3 py-1 rounded-full">
        {config.icon} {config.text}
      </Tag>
    );
  };

  return (
    <div className="p-6 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <Title level={2} className="flex items-center gap-3 mb-2">
          Quản Lý Đấu Giá
        </Title>
        <Text className="text-gray-600">
          Quản lý yêu cầu đấu giá và phê duyệt các phiên đấu giá
        </Text>
      </div>

      {/* Statistics */}
      <AuctionStatistics data={filteredData} />

      {/* Filters */}
      <AuctionFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filteredStatus={filteredStatus}
        setFilteredStatus={setFilteredStatus}
      />

      {/* Main Table */}
      <AuctionTable
        formatCurrency={formatCurrency}
        getStatusTag={getStatusTag}
        data={filteredData}
        onViewDetail={handleViewDetail}
        onApprove={handleApprove}
        onReject={openRejectModal}
        loadingAction={loadingAction}
      />

      {/* Detail Modal */}
      <AuctionDetailModal
        formatCurrency={formatCurrency}
        getStatusTag={getStatusTag}
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        auctionData={selectedAuction}
      />

      {/* Reject Modal */}
      <RejectModal
        visible={rejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
        onConfirm={handleReject}
        rejectReason={rejectReason}
        setRejectReason={setRejectReason}
        loading={loadingAction}
      />

    </div>
  );
};

export default ModAuctions;