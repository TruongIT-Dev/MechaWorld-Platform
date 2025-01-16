import { Image } from "antd";
import { Link, NavLink } from "react-router-dom";
import UserNavbar from "./UserNavbar";

export default function Navbar() {
  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white navbar-light shadow sticky-top p-0">
        <div className="container">
          <Link
            to="/"
            className="navbar-brand d-flex align-items-center"
          >
            <h2 className="m-0 text-primary uppercase flex items-center">
              <Image
                preview={false}
                width={180}
                src="/src/assets/image/navbar-logo-4-clear-bg.png" alt="logo"
              />
            </h2>
          </Link>
          <button
            type="button"
            className="navbar-toggler me-4"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="navbar-collapse visible" id="navbarCollapse">
            <div className="navbar-nav ms-auto p-4 p-lg-0">

              {/* Trang chủ */}
              <NavLink
                exact
                to="/"
                className="nav-item nav-link"
                activeClassName="active"
              >
                Trang chủ
              </NavLink>

              {/* Sản phẩm */}
              <div className="nav-item dropdown">
                <NavLink
                  to="/product"
                  className="nav-link dropdown-toggle"
                // data-bs-toggle="dropdown"
                >
                  Sản phẩm
                </NavLink>
                <div className="dropdown-menu fade-down m-0">
                  <div className="container">
                    <div className="flex">

                      {/* Sản phẩm */}
                      <div className="products mr-10">
                        <h1 className="font-bold text-xl">Mô hình Gundam</h1>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam Super Deformed (SD)
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam Entry Grade (EG)
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam High Grade (HG)
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam Real Grade (RG)
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam Master Grade (MG)
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam Perfect Grade (PG)
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Gundam Non grade
                        </NavLink>
                      </div>

                      {/* Phụ kiện */}
                      <div className="accessories">
                        <h1 className="font-bold text-xl">Phụ kiện</h1>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Giá trưng bày
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Base
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Kiềm cắt
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Phụ kiện đi kèm
                        </NavLink>
                        <NavLink
                          to="/error"
                          className="dropdown-item"
                          activeClassName="active"
                        >
                          Đèn LED
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Đấu giá */}
              <NavLink
                to="/error"
                className="nav-item nav-link"
                activeClassName="active"
              >
                Đấu giá
              </NavLink>

              {/* Giới thiệu */}
              <NavLink
                to="/about"
                className="nav-item nav-link"
                activeClassName="active"
              >
                Giới thiệu
              </NavLink>

              {/* Tủ trưng bày */}
              <NavLink
                to="/contact"
                className="nav-item nav-link"
                activeClassName="active"
              >
                Tủ trưng bày
              </NavLink>
            </div>


            {/* User đã Authenticated */}
            {/* Thay thế nút Đăng nhập bằng 2 icon: Account và Cart */}
            <UserNavbar />
          </div>

          {/* User chưa Authenticate */}
          {/* <div className="guest">
            <button className="flex w-max btn bg-blue-500 text-white py-4 px-4">
              Đăng nhập
              <i className="fa fa-arrow-right ms-3"></i>
            </button>
          </div> */}
        </div>

      </nav>
    </>
  );
}
