import { useEffect, useState } from "react";
import { Table, Tag, Image, message, Modal, Button, Input } from "antd";
import { TiEyeOutline } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { GetSellerAuction, CancelAuction } from "../../apis/Auction/APIAuction";
import { useSelector } from "react-redux";

const { TextArea } = Input;

const AuctionList = () => {
  const user = useSelector((state) => state.auth.user);
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [currentAuction, setCurrentAuction] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      const response = await GetSellerAuction(user.id);
      setAuctionData(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách đấu giá");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAuction = async () => {
    if (!cancelReason) {
      message.warning("Vui lòng nhập lý do hủy");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        reason: cancelReason,
        user_id: user.id // Đảm bảo gửi user ID
      };
      
      console.log("Cancel payload:", payload); // Debug log
      
      await CancelAuction(currentAuction.id, payload);
      message.success("Hủy đấu giá thành công");
      setCancelModalVisible(false);
      setCancelReason("");
      fetchAuctionData();
    } catch (error) {
      console.error("Cancel error:", error.response?.data || error);
      message.error(error.response?.data?.message || "Hủy đấu giá thất bại");
    } finally {
      setLoading(false);
    }
  };

   const columns = [
    {
      title: "Sản phẩm",
      dataIndex: ["auction", "gundam_snapshot"],
      key: "product",
      render: (gundam) => (
        <div className="flex items-center">
          <Image
            width={60}
            src={gundam.image_url}
            alt={gundam.name}
            className="rounded"
          />
          <div className="ml-3">
            <div className="font-medium">{gundam.name}</div>
            <div className="text-xs text-gray-500">{gundam.grade}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Giá khởi điểm",
      dataIndex: ["auction", "starting_price"],
      key: "starting_price",
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: "Giá hiện tại",
      dataIndex: ["auction", "current_price"],
      key: "current_price",
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, record) => (
        <div>
          <div>
            Bắt đầu: {moment(record.auction.start_time).format("DD/MM/YYYY HH:mm")}
          </div>
          <div>
            Kết thúc: {moment(record.auction.end_time).format("DD/MM/YYYY HH:mm")}
          </div>
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: ["auction", "status"],
      key: "status",
      render: (status) => {
        let color = "";
        let text = "";
        switch (status) {
          case "scheduled":
            color = "blue";
            text = "Chưa bắt đầu";
            break;
          case "active":
            color = "green";
            text = "Đang diễn ra";
            break;
          case "completed":
            color = "purple";
            text = "Đã kết thúc";
            break;
          default:
            color = "gray";
            text = status;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-2">
          <NavLink to={`/auctions/${record.auction.id}`}>
            <Button icon={<TiEyeOutline />} size="small">
              Xem
            </Button>
          </NavLink>
          {record.auction.status === "scheduled" && (
            <Button
              danger
              size="small"
              onClick={() => {
                setCurrentAuction(record.auction);
                setCancelModalVisible(true);
              }}
            >
              Hủy
            </Button>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    fetchAuctionData();
  }, []);
  
  return (
    <div>
      <Table
        columns={columns}
        dataSource={auctionData}
        rowKey={(record) => record.auction.id}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Hủy đấu giá"
        visible={cancelModalVisible}
        onOk={handleCancelAuction}
        onCancel={() => {
          setCancelModalVisible(false);
          setCancelReason("");
        }}
        confirmLoading={loading}
        okText="Xác nhận hủy"
        cancelText="Hủy bỏ"
      >
        <div className="mb-4">Bạn có chắc chắn muốn hủy đấu giá này?</div>
        <div>
          <label className="block mb-2">Lý do hủy:</label>
          <TextArea
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Nhập lý do hủy đấu giá..."
          />
        </div>
      </Modal>
    </div>
  );
};

export default AuctionList;