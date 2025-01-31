import { IoMdSearch } from "react-icons/io";
import { FaCaretDown } from "react-icons/fa";
import { NavLink } from "react-router-dom";

import Logo from "../assets/image/logo.png";

// import DarkMode from "./DarkMode";
import GuestNavbar from "./GuestNavbar";

const Menu = [
  {
    id: 1,
    name: "Trang chủ",
    link: "/#",
  },
  {
    id: 2,
    name: "Về chúng tôi",
    link: "/#",
  },
  {
    id: 3,
    name: "Đấu giá",
    link: "/#",
  },
  {
    id: 4,
    name: "Kho đồ",
    link: "/#",
  },
  {
    id: 5,
    name: "Phụ kiện",
    link: "/#",
  },
];

const DropdownLinks = [
  {
    id: 1,
    name: "Master Grade",
    link: "/#",
  },
  {
    id: 2,
    name: "High Grade",
    link: "/#",
  },
  {
    id: 3,
    name: "Real Grade",
    link: "/#",
  },
  {
    id: 4,
    name: "Perfect Grade",
    link: "/#",
  },
  {
    id: 5,
    name: "None Grade",
    link: "/#",
  },
];

const Navbar = () => {

  return (
    <div className="shadow-md bg-white dark:text-white duration-200 relative z-40">
      {/* upper Navbar */}
      <div className="p-2 bg-blue-300">
        <div className="container flex justify-between items-center">
          <div>
            <a href="#" className="font-bold hover:text-blue-700 text-2xl sm:text-3xl flex gap-2">
              {/* <img src={Logo} alt="Logo" className="w-10" /> */}
              MechaWorld
            </a>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800  "
              />
              <IoMdSearch className="text-gray-500 group-hover:text-blue-700 absolute top-1/2 -translate-y-1/2 right-3" />
            </div>

            {/* Order and Dropdown */}
            <GuestNavbar />

            {/* Darkmode Switch */}
            <div>
            <NotificationIcon count={1} />
            </div>
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
                className="inline-block text-base px-4 hover:text-blue-700 hover:font-semibold duration-200 capitalize"
              >
                {data.name}
              </NavLink>
            </li>
          ))}
          {/* Simple Dropdown and Links */}
          <li className="group relative cursor-pointer">
            <NavLink to="/product" className="flex items-center text-base hover:text-blue-700 hover:font-semibold gap-[2px] py-2 capitalize">
              Sản phẩm
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </NavLink>
            <div className="absolute z-[9999] hidden group-hover:block w-[200px] rounded-md bg-white p-2 text-black shadow-md">
              <ul>
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <NavLink
                      to={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-gray-200 "
                    >
                      {data.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
