import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../app/firebase"

export const hasDeliveryFee = (state, userID, exchangeID) => {
  return !!state.exchange?.deliveryFees?.[userID]?.[exchangeID]?.deliveryFee?.total;
};
export const selectDeliveryFee = (state, userID, exchangeID) => {
  return state.exchange?.deliveryFees?.[userID]?.[exchangeID]?.deliveryFee?.total ?? null;
};

/**
 * Lưu DeliveryFee vào Firestore
 * @param {string} userID - ID của người dùng
 * @param {string} exchangeID - ID của giao dịch
 * @param {object} feeData - Dữ liệu phí giao hàng
 */
// export const saveDeliveryFee = async (userID, exchangeID, feeData) => {
//   try {
//     const docRef = doc(db, "deliveryFees", userID);
//     await setDoc(
//       docRef,
//       {
//         [exchangeID]: feeData,
//       },
//       { merge: true }
//     );
//     console.log("Phí giao hàng đã được lưu thành công.");
//   } catch (error) {
//     console.error("Lỗi khi lưu phí giao hàng:", error);
//   }
// };
export const saveDeliveryFee = async (userID, exchangeID, feeData) => {
  try {
    // Lưu vào Firestore
    const docRef = doc(db, "deliveryFees", userID);
    await setDoc(
      docRef,
      {
        [exchangeID]: feeData,
      },
      { merge: true }
    );

    // Lưu vào localStorage với cùng cấu trúc
    const localStorageKey = `${userID}_${exchangeID}_deliverDate`;
    localStorage.setItem(localStorageKey, JSON.stringify(feeData));

    console.log("Phí giao hàng đã được lưu thành công.");
  } catch (error) {
    console.error("Lỗi khi lưu phí giao hàng:", error);
  }
};

/**
 * Lấy DeliveryFee từ Firestore
 * @param {string} userID - ID của người dùng
 * @param {string} exchangeID - ID của giao dịch
 * @returns {object|null} - Dữ liệu phí giao hàng hoặc null nếu không tìm thấy
 */
export const getDeliveryFee = async (userID, exchangeID) => {
  try {
    const docRef = doc(db, "deliveryFees", userID);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data[exchangeID] || null;
    } else {
      console.log("Không tìm thấy tài liệu phí giao hàng.");
      return null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy phí giao hàng:", error);
    return null;
  }
};