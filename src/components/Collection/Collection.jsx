
// import { useState } from "react";

// import ListCollection from "./ListCollection";  // Bảng hiển thị dữ liệu
// import AddCollection from "./AddCollection"; // Form tạo sản phẩm


// export default function Collection() {
//   const [isCreating, setIsCreating] = useState(false);

//   return (
//     <div>
//       {/* Nếu đang ở chế độ tạo sản phẩm */}
//       {isCreating ? (
//         <AddCollection setIsCreating={setIsCreating} />
//       ) : (
//         <>
//           <div>
//             {/* Hiển thị UI trang Collection */}
//             <ListCollection setIsCreating={setIsCreating} isCreating={isCreating} />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
import { useState } from 'react';
import CollectionContainer from './CollectionContainer';
import AddCollection from "./AddNewGundam/AddCollection";

const GundamCollectionApp = () => {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div>
      {isCreating ? (
        <AddCollection setIsCreating={setIsCreating} />
      ) : (
        <CollectionContainer setIsCreating={setIsCreating} />
      )}
    </div>
  );
};

export default GundamCollectionApp;