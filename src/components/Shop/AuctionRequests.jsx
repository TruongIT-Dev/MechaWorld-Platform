import { useEffect, useState } from "react";
import { Table, Tag, Image, message } from "antd";
import { AiOutlineDelete } from "react-icons/ai";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { GetListAuctionRequests,DeleteAuctionRequest  } from "../../apis/Auction/APIAuction";
import { useSelector, useDispatch } from "react-redux";

const AuctionRequests = () => {
  const user = useSelector((state) => state.auth.user);
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(false);

    // Hàm xử lý xóa yêu cầu
    const handleDelete = async (requestID) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa yêu cầu này không?")) return;
      
      try {
        await DeleteAuctionRequest(user.id, requestID);
        message.success("Xóa yêu cầu thành công");
        setAuctionData(prev => prev.filter(item => item.id !== requestID));
      } catch (error) {
        message.error("Xóa yêu cầu thất bại");
        console.error("Lỗi khi xóa yêu cầu:", error);
      }
    };

  useEffect(() => {
    const fetchAuctions = async () => {
      setLoading(true);
      try {
        const response = await GetListAuctionRequests(user.id);
        const dataWithKeys = response.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setAuctionData(dataWithKeys);
        console.log("Auction data:", dataWithKeys);
      } catch (error) {
        message.error("Lỗi khi tải danh sách yêu cầu đấu giá.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, [user.id]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  const statusColors = {
    pending: "blue",
    approved: "green",
    rejected: "red",
  };

  const columns = [
    {
      title: "Ảnh",
      dataIndex: ["gundam_snapshot", "image_url"],
      render: (url) => <Image width={100} src={url} />,
    },
    {
      title: "Tên Gundam",
      dataIndex: ["gundam_snapshot", "name"],
    },
    {
      title: "Giá Khởi Điểm",
      dataIndex: "starting_price",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Bước Giá",
      dataIndex: "bid_increment",
      render: (price) => formatCurrency(price),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "start_time",
      render: (time) => moment(time).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "end_time",
      render: (time) => moment(time).format("DD/MM/YYYY HH:mm"),
    },
   {
    title: "Trạng thái",
    dataIndex: "status",
    render: (status) => (
      <Tag color={statusColors[status] || "default"} className="capitalize">
        {status}
      </Tag>
    ),
  },
  {
    title: "Lý do từ chối",
    dataIndex: "rejected_reason",
    render: (reason, record) => 
      record.status === "rejected" ? (
        <span className="text-red-500">{reason || "Không có lý do cụ thể"}</span>
      ) : null,
  },
  {
    title: "",
    key: "action",
    render: (_, record) => (
      <button 
        onClick={() => handleDelete(record.id)}
        className="text-indigo-500 hover:text-indigo-700"
      >
        <AiOutlineDelete size={22} />
      </button>
    ),
  },
];

    // Lọc dữ liệu chỉ lấy các sản phẩm có status là "approved" hoặc "rejected"
    const filteredData = auctionData.filter(
      (item) => item.status === "pending" || item.status === "approved" || item.status === "rejected"
    );

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default AuctionRequests;
