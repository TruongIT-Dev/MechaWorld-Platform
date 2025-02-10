import { useState } from "react";
import { Modal, Button } from "antd";
import RegisterShopForm from "../RegisterShop/RegisterForm";

const ShopRegister = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div
            className="relative p-6 h-full  bg-cover bg-no-repeat flex items-center"
            style={{ backgroundImage: "url('/src/assets/bg-shop-register.jpg')" }}
        >
            {/* Lớp overlay làm mờ */}
            <div className="absolute inset-0 bg-black opacity-50"></div>

            {/* Nội dung bên trái, căn giữa theo chiều dọc và sát trái */}
            <div className="relative z-10 max-w-md text-white ml-10">
                <h1 className="text-3xl font-bold mb-4">Trở thành Seller ngay hôm nay!</h1>
                <p className="mb-6">Bán các sản phẩm Gundam độc quyền và tiếp cận hàng ngàn khách hàng.</p>
                <Button type="primary" size="large" onClick={() => setIsModalOpen(true)}>
                    Đăng ký ngay
                </Button>
            </div>

            {/* Popup đăng ký seller */}
            <Modal
                width={1000}
                title="Đăng ký tài khoản bán hàng trên Mecha World"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <RegisterShopForm />
            </Modal>
        </div>
    );
};

export default ShopRegister;
