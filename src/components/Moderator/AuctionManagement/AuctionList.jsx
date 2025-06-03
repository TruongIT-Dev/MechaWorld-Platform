import { Table, Button, Tooltip, Modal, Input, message, Popconfirm, Descriptions, DatePicker, Form } from "antd";
import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  GetListAuctionRequestsForModerator,
  ApproveAuctionRequest,
  RejectAuctionRequest,
  UpdateAuctionTime,
} from "../../../apis/Moderator/APIModerator";
import dayjs from "dayjs";

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
  const [timeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [form] = Form.useForm();

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
          startTime: item.start_time,
          endTime: item.end_time,
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

  const handleUpdateTime = async () => {
    try {
      const values = await form.validateFields();
      setLoadingAction(true);
      
      await UpdateAuctionTime(selectedAuction.id, {
        start_time: values.startTime.format('YYYY-MM-DDTHH:mm:ssZ'),
        end_time: values.endTime.format('YYYY-MM-DDTHH:mm:ssZ')
      });
      
      message.success("Cập nhật thời gian đấu giá thành công!");
      fetchData();
      setTimeModalVisible(false);
    } catch (error) {
      message.error("Lỗi khi cập nhật thời gian đấu giá!");
      console.error(error);
    } finally {
      setLoadingAction(false);
    }
  };

  const openRejectModal = (id) => {
    setSelectedRequestId(id);
    setRejectModalVisible(true);
  };

  const showDetailModal = (record) => {
    setSelectedProduct(record.gundamSnapshot);
    setDetailModalVisible(true);
  };

  const showTimeModal = (record) => {
    setSelectedAuction(record);
    form.setFieldsValue({
      startTime: dayjs(record.startTime),
      endTime: dayjs(record.endTime)
    });
    setTimeModalVisible(true);
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
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <div>
          <div>Bắt đầu: {dayjs(record.startTime).format('DD/MM/YYYY HH:mm')}</div>
          <div>Kết thúc: {dayjs(record.endTime).format('DD/MM/YYYY HH:mm')}</div>
        </div>
      ),
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
  title: "Chỉnh thời gian",
  key: "timeAdjustment",
  render: (_, record) => {
    // Kiểm tra kỹ điều kiện status
    console.log('Record status:', record.status); // Thêm dòng này để debug
    
    if (record.status === "approved" || record.status === "APPROVED") { // Kiểm tra cả chữ hoa/thường
      return (
        <Button
          icon={<EditOutlined />}
          onClick={() => showTimeModal(record)}
          type="primary"
        >
          Chỉnh sửa
        </Button>
      );
    }
    return <span>Không thể chỉnh</span>;
  },
},
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => {
        if (record.status === "rejected") {
          return <span>Đã từ chối</span>;
        }
        
        if (record.status === "pending") {
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
        }
        return <span>Đã phê duyệt</span>;
      },
    },
  ];

  return (
    <>
<Table
  columns={columns}
  dataSource={filteredData}
  pagination={{ pageSize: 5 }}
  scroll={{ x: 1500 }} // Tăng giá trị này nếu cần
  style={{ width: '100%' }}
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

      {/* Update Time Modal */}
      <Modal
        title="Chỉnh sửa thời gian đấu giá"
        visible={timeModalVisible}
        onCancel={() => setTimeModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setTimeModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="update"
            type="primary"
            onClick={handleUpdateTime}
            loading={loadingAction}
          >
            Cập nhật
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="startTime"
            label="Thời gian bắt đầu"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
          <Form.Item
            name="endTime"
            label="Thời gian kết thúc"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
          >
            <DatePicker showTime format="DD/MM/YYYY HH:mm" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AuctionList;