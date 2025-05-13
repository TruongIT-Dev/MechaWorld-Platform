import { Table, Button, Tooltip, Modal, Input, message, Popconfirm, Descriptions } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  GetListAuctionRequestsForModerator,
  ApproveAuctionRequest,
  RejectAuctionRequest,
} from "../../apis/Moderator/APIModerator";

const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN") + " đ";

const AuctionList = ({ searchTerm, filteredStatus }) => {
  const [auctionData, setAuctionData] = useState([]);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);
  const [loadingAction, setLoadingAction] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
          gundamSnapshot: item.gundam_snapshot // Store the entire snapshot
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

  const openRejectModal = (id) => {
    setSelectedRequestId(id);
    setRejectModalVisible(true);
  };

  const showDetailModal = (record) => {
    setSelectedProduct(record.gundamSnapshot);
    setDetailModalVisible(true);
  };

  const filteredData = auctionData.filter(
    (item) =>
      (item.sellerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.gundamName.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filteredStatus ? item.status === filteredStatus : true)
  );

  const columns = [
    {
      title: "Người bán",
      dataIndex: "sellerId",
      key: "sellerId",
    },
    {
      title: "Tên Gundam",
      dataIndex: "gundamName",
      key: "gundamName",
    },
     {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    render: (status) => {
      let className = '';
      
      if (status === 'approved') {
        className = 'text-green-600 bg-green-50 px-2 py-1 rounded font-medium';
      } else if (status === 'rejected') {
        className = 'text-red-600 bg-red-50 px-2 py-1 rounded font-medium';
      } else {
        className = 'text-yellow-600 bg-yellow-50 px-2 py-1 rounded font-medium';
      }
      
      return <span className={className}>{status}</span>;
    }
  },
    {
      title: "Giá khởi điểm",
      dataIndex: "startingPrice",
      key: "startingPrice",
      render: formatCurrency,
    },
    {
      title: "Bước giá",
      dataIndex: "stepPrice",
      key: "stepPrice",
      render: formatCurrency,
    },
    {
      title: "Chi tiết",
      key: "details",
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button 
            icon={<InfoCircleOutlined />} 
            onClick={() => showDetailModal(record)}
          />
        </Tooltip>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        if (record.status === "approved" || record.status === "rejected") {
          return <span>Đã xử lý</span>;
        }
      
        return (
          <div style={{ display: "flex", gap: 8 }}>
            <Popconfirm
              title="Bạn có chắc chắn muốn phê duyệt yêu cầu này?"
              onConfirm={() => handleApprove(record.id)}
              okText="Phê duyệt"
              cancelText="Hủy"
            >
              <Button
                className="text-green-600 border-green-600 hover:text-white hover:bg-green-600"
                type="default"
                loading={loadingAction}
              >
                Phê duyệt
              </Button>
            </Popconfirm>
            <Button danger onClick={() => openRejectModal(record.id)}>
              Từ chối
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Từ chối yêu cầu đấu giá"
        visible={rejectModalVisible}
        onCancel={() => setRejectModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="reject"
            onClick={handleReject}
            loading={loadingAction}
            type="default"
            style={{ color: 'red', borderColor: 'red' }}
          >
            Xác nhận từ chối
          </Button>,
        ]}
      >
        <p>Vui lòng nhập lý do từ chối:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>

      {/* Product Detail Modal */}
      <Modal
        title="Chi tiết sản phẩm"
        visible={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedProduct && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Tên sản phẩm">{selectedProduct.name}</Descriptions.Item>
            <Descriptions.Item label="Hình ảnh">
              <img 
                src={selectedProduct.image_url} 
                alt={selectedProduct.name} 
                style={{ maxWidth: '100%', maxHeight: '200px' }}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Grade">{selectedProduct.grade}</Descriptions.Item>
            <Descriptions.Item label="Scale">{selectedProduct.scale}</Descriptions.Item>
            <Descriptions.Item label="Số lượng">{selectedProduct.quantity}</Descriptions.Item>
            <Descriptions.Item label="Trọng lượng">{selectedProduct.weight}g</Descriptions.Item>
            <Descriptions.Item label="Slug">{selectedProduct.slug}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default AuctionList;