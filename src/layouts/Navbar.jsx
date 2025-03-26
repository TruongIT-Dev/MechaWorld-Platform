import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux"
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
    link: "/aution",
  },
  {
    id: 3,
    name: "Sản phẩm Gundam",
    link: "/product",
  },
  {
    id: 4,
    name: "Trao đổi",
    link: "/exchange",
  },
  // {
  //   id: 5,
  //   name: "Phụ kiện",
  //   link: "/#",
  // },
];


const Navbar = () => {
  const { isLoggedIn, user } = useSelector(state => state.auth);

  return (
    <div className="main-navbar fixed w-full bg-white dark:text-white shadow-md z-40 top-0 transition-all duration-300">
      {/* upper Navbar */}
      <div className="p-4 bg-blue-300">
        <div className="container flex justify-between items-center">
          <div className="flex items-center">
            {/* <img src={Logo} alt="Logo MechaWorld" className="w-[90px] h-[50px] object-contain" /> */}
            <a href="#" className="font-bold hover:text-blue-700 text-2xl sm:text-3xl flex gap-2">
              MechaWorld
            </a>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-10">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Bạn muốn tìm kiếm sản phẩm Gundam gì...."
                className="w-[200px] sm:w-[350px] group-hover:w-[450px] transition-all duration-300 rounded-full border border-gray-300 p-2 focus:outline-none focus:border-1 focus:border-blue-700 dark:border-gray-500 dark:bg-gray-800"
              />
            </div>

            {/* Order and Dropdown */}
            {isLoggedIn ? <UserNavbar user={user} /> : <GuestNavbar />}

            {/* Darkmode Switch */}

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
                className={({ isActive }) =>
                  `inline-block text-base px-4 py-2 uppercase 
                transition-all duration-300 ease-in-out 
                ${isActive
                    ? 'text-blue-500 font-bold'
                    : 'hover:text-blue-500 hover:font-bold text-gray-700'
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
