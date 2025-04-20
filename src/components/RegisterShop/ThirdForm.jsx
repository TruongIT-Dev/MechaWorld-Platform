import { useEffect } from "react";
import { Form, Checkbox } from "antd";

const ThirdForm = ({ formData, setFormData, setCanProceed }) => {

    useEffect(() => {
        setCanProceed(formData?.agreedToTerms || false);
    }, [formData?.agreedToTerms, setCanProceed]);

    return (
        <div className="bg-white rounded-lg">
            <h2 className="text-xl font-bold mb-2">Điều khoản sử dụng dành cho Người Bán</h2>
            <p className="text-gray-600 mb-4">Vui lòng đọc kỹ các điều khoản trước khi tiếp tục.</p>

            <div className="border p-4 h-52 overflow-y-auto bg-gray-100 text-sm rounded-md">
                <p><strong>1. Điều kiện trở thành Người Bán</strong></p>
                <p>- Cung cấp thông tin chính xác về danh tính và cửa hàng.</p>
                <p>- Chịu trách nhiệm về các sản phẩm đăng bán, bao gồm nguồn gốc và chất lượng.</p>

                <p className="mt-2"><strong>2. Quy định về sản phẩm</strong></p>
                <p>- Sản phẩm phải tuân thủ pháp luật Việt Nam, không vi phạm bản quyền.</p>
                <p>- Không được đăng bán sản phẩm cấm hoặc vi phạm đạo đức.</p>

                <p className="mt-2"><strong>3. Chính sách giao hàng và đổi trả</strong></p>
                <p>- Cung cấp thông tin giao hàng chính xác để tránh khiếu nại.</p>
                <p>- Nếu có khiếu nại từ khách hàng, bạn có trách nhiệm xử lý theo quy định.</p>

                <p className="mt-2"><strong>4. Xử lý vi phạm</strong></p>
                <p>- Nền tảng có quyền tạm ngưng hoặc chấm dứt tài khoản nếu vi phạm điều khoản.</p>
                <p>- Vi phạm nghiêm trọng có thể dẫn đến các biện pháp pháp lý.</p>
            </div>

            <Form.Item className="mt-4">
                <Checkbox
                    checked={formData?.agreedToTerms}
                    onChange={(e) => setFormData({ ...formData, agreedToTerms: e.target.checked })}
                >
                    Tôi đồng ý với các điều khoản trên
                </Checkbox>
            </Form.Item>
        </div>
    );
};

export default ThirdForm;
