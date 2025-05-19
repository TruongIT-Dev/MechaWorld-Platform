import { Modal, message } from "antd";
import { ParticipateInAuction } from "../../../apis/Auction/APIAuction";

export const handleParticipateAuction = (auction) => {
  return new Promise((resolve, reject) => {
    Modal.confirm({
      title: "Xác nhận tham gia đấu giá",
      content: `Bạn cần đặt cọc ${Math.round(auction.start_price * 0.15).toLocaleString()} VNĐ (15% giá khởi điểm) để tham gia phiên đấu giá này. 
      Khoản cọc sẽ được hoàn lại nếu bạn không thắng. Nếu thắng, số tiền này sẽ được trừ vào phần thanh toán.`,
      okText: "Đồng ý đặt cọc và tham gia",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await ParticipateInAuction(auction.id);
          message.success("Tham gia đấu giá thành công!");
          resolve();
        } catch (error) {
          message.error("Không thể tham gia đấu giá. Vui lòng thử lại.");
          reject(error);
        }
      },
      onCancel: () => {
        reject(new Error("Bạn đã hủy tham gia đấu giá."));
      }
    });
  });
};
