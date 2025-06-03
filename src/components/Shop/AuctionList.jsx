import { useEffect, useState } from "react";
import { Table, Tag, Image, message } from "antd";
import { TiEyeOutline } from "react-icons/ti";
import { NavLink } from "react-router-dom";
import moment from "moment";
import { GetListAuctionRequests } from "../../apis/Auction/APIAuction";
import { useSelector } from "react-redux";

const AuctionList = () => {
  const user = useSelector((state) => state.auth.user);
  const [auctionData, setAuctionData] = useState([]);
  const [loading, setLoading] = useState(false);

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
      title: "",
      key: "action",
      render: (_, record) => (
        <NavLink to={`/auctions/${record.id}`} className="text-indigo-500">
          <TiEyeOutline size={22} />
        </NavLink>
      ),
    },
  ];

  // Lọc dữ liệu chỉ lấy các sản phẩm có status là "approved" hoặc "rejected"
  const filteredData = auctionData.filter(
    (item) => item.status === "approved" || item.status === "rejected"
  );

  return (
    <Table
      columns={columns}
      dataSource={filteredData} // Sử dụng dữ liệu đã lọc
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default AuctionList;
