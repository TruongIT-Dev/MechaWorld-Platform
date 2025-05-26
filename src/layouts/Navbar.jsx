import { Input } from "antd";
import { useSelector } from "react-redux"
import { NavLink, useNavigate } from "react-router-dom";
import { SearchOutlined } from "@ant-design/icons";

import UserNavbar from "./UserNavbar";
import GuestNavbar from "./GuestNavbar";

const Menu = [
  {
    id: 1,
    name: "Trang chủ",
    link: "/#",
  },
  {
    id: 2,
    name: "Đấu giá",
    link: "/auction",
  },
  {
    id: 3,
    name: "Sản phẩm Gundam",
    link: "/product",
  },
  {
    id: 4,
    name: "Trao đổi",
    link: "/exchange/list",
  },
  {
    id: 5,
    name: "Bộ Sưu Tập",
    link: "/collection/list",
  },
];

const Navbar = () => {
  const { isLoggedIn, user } = useSelector(state => state.auth);
  const navigate = useNavigate();

  const onSearch = (value, _e, info) =>
    console.log(info?.source, value);

  const handleCollectionClick = (e, link) => {
    if (link === "/collection/list" && !isLoggedIn) {
      e.preventDefault();
      navigate("/member/login");
    }
  };

  return (
    <div className="main-navbar fixed w-full bg-white dark:text-white shadow-md z-40 top-0 transition-all duration-300">
      {/* upper Navbar */}
      <div className="p-4 bg-blue-300">
        <div className="container flex justify-between items-center gap-10">
          <div className="flex items-center">
            <a href="#" className="font-bold hover:text-blue-700 text-2xl sm:text-3xl flex gap-2">
              MechaWorld
            </a>
          </div>

          {/* Search bar */}
          <div className="hidden md:block flex-1">
            <Input
              onSubmit={onSearch}
              placeholder="Thử tìm kiếm một sản phẩm Gundam..."
              size="large"
              prefix={<SearchOutlined className="text-gray-500" />}
              className="rounded-full px-5 py-2 shadow-sm border border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            {/* Order and Dropdown */}
            {isLoggedIn ? <UserNavbar user={user} /> : <GuestNavbar />}
          </div>
        </div>
      </div>

      {/* lower Navbar */}
      <div className="flex justify-center p-1 bg-gray-50">
        <ul className="sm:flex hidden items-center gap-4">
          {Menu.map((data) => (
            <li key={data.id}>
              <NavLink
                to={data.link}
                onClick={(e) => handleCollectionClick(e, data.link)}
                className={({ isActive }) =>
                  `inline-block text-lg px-4 py-2 uppercase 
                transition-all duration-300 ease-in-out 
                ${isActive
                    ? 'text-blue-500 font-medium'
                    : 'hover:text-blue-500 text-gray-700'
                  }`
                }
              >
                {data.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;