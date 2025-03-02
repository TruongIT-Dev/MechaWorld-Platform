import { useState } from "react";
import { Button } from "antd";
import ShopProduct from "./ShopProduct";  // Bảng hiển thị dữ liệu
import ShopProductCreate from "./ShopProductCreate"; // Form tạo sản phẩm

export default function ShopProductManagement() {
  const [isCreating, setIsCreating] = useState(false);
  
  return (
    <div>
      {/* Nếu đang ở chế độ tạo sản phẩm */}
      {isCreating ? (
        <ShopProductCreate setIsCreating={setIsCreating} />
      ) : (
        <>
          {/* Tiêu đề và nút thêm */}
          <div className="flex justify-stretch mb-4">
            <h2 className="text-2xl font-semibold">Quản lý sản phẩm</h2>
            <Button
              type="primary"
              className="bg-[#0056b3] hover:bg-[#4a90e2] text-white"
              onClick={() => setIsCreating(true)}
            >
              Thêm sản phẩm
            </Button>
          </div>

          {/* Hiển thị bảng sản phẩm */}
          <ShopProduct />
        </>
      )}
    </div>
  );
}
