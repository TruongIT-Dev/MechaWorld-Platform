import { Alert } from "antd";

const Confirmation = () => {
    return (
        <div className="space-y-4">
            <Alert message="Vui lòng kiểm tra lại thông tin trước khi gửi." type="info" />
            <p className="text-gray-700">Nhấn Hoàn tất để đăng ký gian hàng.</p>
        </div>
    );
};

export default Confirmation;
