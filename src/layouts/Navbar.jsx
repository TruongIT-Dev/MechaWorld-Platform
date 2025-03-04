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
  {
    id: 5,
    name: "Phụ kiện",
    link: "/#",
  },
];

// const DropdownLinks = [
//   {
//     id: 1,
//     name: "Entry Grade",
//     link: "/#",
//   },
//   {
//     id: 2,
//     name: "High Grade",
//     link: "/#",
//   },
//   {
//     id: 3,
//     name: "Master Grade",
//     link: "/#",
//   },
//   {
//     id: 4,
//     name: "Perfect Grade",
//     link: "/#",
//   },
//   {
//     id: 5,
//     name: "Real Grade",
//     link: "/#",
//   },
//   {
//     id: 6,
//     name: "Super Deformed",
//     link: "/#",
//   },
//   {
//     id: 7,
//     name: "None Grade",
//     link: "/#",
//   },
// ];


const Navbar = () => {
  const { isLoggedIn, user } = useSelector(state => state.auth);

  return (
    <div className="main-navbar fixed w-full bg-white dark:text-white shadow-md z-40 top-0 transition-all duration-300">
      {/* upper Navbar */}
      <div className="p-2 bg-blue-300">
        <div className="container flex justify-between items-center">
          <div>
            <a href="#" className="font-bold hover:text-blue-700 text-2xl sm:text-3xl flex gap-2">
              MechaWorld
            </a>
          </div>

          {/* search bar */}
          <div className="flex justify-between items-center gap-4">
            <div className="relative group hidden sm:block">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-[200px] sm:w-[200px] group-hover:w-[300px] transition-all duration-300 rounded-full border border-gray-300 px-2 py-1 focus:outline-none focus:border-1 focus:border-primary dark:border-gray-500 dark:bg-gray-800"
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
                className="inline-block text-base px-4 py-2 hover:text-blue-700 hover:font-semibold duration-200 uppercase"
              >
                {data.name}
              </NavLink>
            </li>
          ))}
          {/* <li className="group relative cursor-pointer">
            <NavLink
              to="/product"
              className="flex items-center text-base hover:text-blue-700 hover:font-semibold gap-[2px] py-2 uppercase"
            >
              Sản phẩm
              <span>
                <FaCaretDown className="transition-all duration-200 group-hover:rotate-180" />
              </span>
            </NavLink>
            <div className="absolute z-[9999] hidden group-hover:block w-[350px] rounded-md bg-white p-2 text-black shadow-md">
              <ul className="grid grid-cols-2">
                {DropdownLinks.map((data) => (
                  <li key={data.id}>
                    <NavLink
                      to={data.link}
                      className="inline-block w-full rounded-md p-2 hover:bg-gray-200"
                    >
                      {data.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
