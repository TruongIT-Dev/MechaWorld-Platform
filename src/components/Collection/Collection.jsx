
import { useState } from "react";

import ShopProduct from "./ListCollection";  // Bảng hiển thị dữ liệu
import ShopProductCreate from "./AddCollection"; // Form tạo sản phẩm


export default function Collection  ()  {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      {/* Nếu đang ở chế độ tạo sản phẩm */}
      {isCreating ? (
        <ShopProductCreate setIsCreating={setIsCreating} />
      ) : (
        <>
          <div>
            {/* Hiển thị bảng sản phẩm */}
            <ShopProduct setIsCreating={setIsCreating} isCreating={isCreating} />
          </div>
        </>
      )}
    </div>
  );
}
