import { Table, Button, Tooltip, Modal, Input, message, Popconfirm } from "antd";
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
      render: () => (
        <Tooltip title="Xem chi tiết">
          <Button icon={<InfoCircleOutlined />} />
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
              <Button type="primary" loading={loadingAction}>Phê duyệt</Button>
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
        onOk={handleReject}
        onCancel={() => setRejectModalVisible(false)}
        okText="Xác nhận từ chối"
        cancelText="Hủy"
        confirmLoading={loadingAction}
      >
        <p>Vui lòng nhập lý do từ chối:</p>
        <Input.TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
        />
      </Modal>
    </>
  );
};

export default AuctionList;
