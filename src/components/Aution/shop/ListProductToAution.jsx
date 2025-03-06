import { TiEyeOutline } from "react-icons/ti";
import { CiEdit } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { NavLink } from "react-router-dom";
import { Title } from "../Design";

const ListProductToAution = () => {
  // Dữ liệu mẫu với các trạng thái khác nhau
  const products = [
    {
      id: 1,
      name: "Auction Title 01",
      winner: "Bidding_HvO253gT",
      bidAmount: "12228955",
      image: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
      status: "Hoàn thành"
    },
    {
      id: 2,
      name: "Auction Title 02",
      winner: "Bidding_HvO253gT",
      bidAmount: "15000000",
      image: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
      status: "Đang đấu giá"
    },
    {
      id: 3,
      name: "Auction Title 03",
      winner: "Bidding_HvO253gT",
      bidAmount: "10000000",
      image: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
      status: "Đang chờ kiểm duyệt"
    },
    {
      id: 4,
      name: "Auction Title 04",
      winner: "Bidding_HvO253gT",
      bidAmount: "20000000",
      image: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
      status: "Hủy bỏ"
    },
    {
      id: 5,
      name: "Auction Title 05",
      winner: "Bidding_HvO253gT",
      bidAmount: "18000000",
      image: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
      status: "Đấu giá kết thúc"
    },
    {
      id: 6,
      name: "Auction Title 06",
      winner: "Bidding_HvO253gT",
      bidAmount: "22000000",
      image: "https://product.hstatic.net/200000326537/product/bans61551_0_0443645eee8145f38744b7376eab2bff_grande.png",
      status: "Đang giao hàng"
    }
  ];

  // Hàm để trả về màu chữ dựa trên trạng thái
  const getStatusStyle = (status) => {
    switch (status) {
      case "Hoàn thành":
        return { color: "text-green-500", text: "Hoàn thành" };
      case "Đang đấu giá":
        return { color: "text-blue-500", text: "Đang đấu giá" };
      case "Đang chờ kiểm duyệt":
        return { color: "text-yellow-500", text: "Đang chờ kiểm duyệt" };
      case "Hủy bỏ":
        return { color: "text-red-500", text: "Hủy bỏ" };
      case "Đấu giá kết thúc":
        return { color: "text-purple-500", text: "Đấu giá kết thúc" };
      case "Đang giao hàng":
        return { color: "text-indigo-500", text: "Đang giao hàng" };
      default:
        return { color: "text-gray-500", text: "Không xác định" };
    }
  };

  return (
    <>
      <section className="shadow-s1 p-8 rounded-lg">
        <div className="flex justify-between">
          <Title level={5} className="font-normal">
            Danh sách GunDam đấu giá
          </Title>
        </div>
        <hr className="my-5" />

        <div className="relative overflow-x-auto rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-100">
              <tr>
                <th scope="col" className="px-6 py-5">
                  Tên GunDam
                </th>
                <th scope="col" className="px-6 py-3">
                  Người chiến thắng
                </th>
                <th scope="col" className="px-6 py-3">
                  Số tiền đấu giá
                </th>
                <th scope="col" className="px-6 py-3">
                  Hình ảnh
                </th>
                <th scope="col" className="px-6 py-3">
                  Trạng thái
                </th>
                <th scope="col" className="px-6 py-3">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const statusStyle = getStatusStyle(product.status);
                return (
                  <tr key={product.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.winner}</td>
                    <td className="px-6 py-4">{product.bidAmount} VNĐ</td>
                    <td className="px-6 py-4">
                      <img className="w-20 h-20" src={product.image} alt={product.name} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className={statusStyle.color}>{statusStyle.text}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center flex items-center gap-3 mt-1">
                      <NavLink to="#" type="button" className="font-medium text-indigo-500">
                        <TiEyeOutline size={25} />
                      </NavLink>
                      <NavLink to="#" type="button" className="font-medium text-green">
                        <CiEdit size={25} />
                      </NavLink>
                      <button className="font-medium text-red-500">
                        <MdOutlineDeleteOutline size={25} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};

export default ListProductToAution;