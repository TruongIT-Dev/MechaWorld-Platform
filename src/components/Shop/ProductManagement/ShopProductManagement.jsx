import { useState } from "react";

import ShopProduct from "./ShopProduct";  // Bảng hiển thị dữ liệu
import ShopProductCreate from "./ShopProductCreate"; // Form tạo sản phẩm

export default function ShopProductManagement() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="container mx-auto px-4">
      {/* Nếu đang ở chế độ tạo sản phẩm */}
      {isCreating ? (
        <ShopProductCreate setIsCreating={setIsCreating} />
      ) : (
        <>
          {/* Hiển thị bảng sản phẩm */}
          <ShopProduct setIsCreating={setIsCreating} isCreating={isCreating} />
        </>
      )}
    </div>
  );
}
