import { useState,useEffect } from "react";
import TimerCountdown from "./TimerCountdown";
import { Modal } from "antd";
// import { set } from "@antv/util";

const DeliveryProcessInfo = (
  { firstUser, secondUser, firstAddress, secondAddress, exchangeDetails, fetchExchangeDetails }
) => {

  const [receiveDelivery, setReceiveDelivery] = useState('');
  const [sendDelivery, setSendDelivery] = useState('');
  const [isShowingReceivedDelivery, setIsShowingReceivedDelivery] =useState(true);
  const [userRefundRequest, setUserRefundRequest] = useState(false);
  const [isRefundRequest, setIsRefundRequest] = useState(false);
  const fakeDelivery = {
    id: 1,
    exchange: exchangeDetails.exchange,
    status: "pending",
    deliveryTrackingCode: 2213,
    deliveryFee: 50000,
    estimatedDeliveryTime: "2023-10-10",
    overallStatus: "DELIVERED",
    packagingImages: [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg",
    ],
    expiredAt: "2023-10-15",
    note: "Ghi chú",
    from: {
      user: {
        id: 1,
        fullName: "Nguyễn Văn A",
        phoneNumber: "0901234567",
        email: "checking@gmail.com",
        avatar: "https://example.com/avatar.jpg",
        role: "member",
        balance: 1000000,
        address: "123 Đường ABC, Quận 1, TP.HCM",
      },
      fullName: "Nguyễn Văn A",
      phoneNumber: "0901234567",
      provinceId: 201,
      districtId: 123,
      wardId: "456",
      detail: "123 Đường ABC, Quận 1, TP.HCM",
    },
    to: {
      user: {
        id: 2,
        fullName: "Trần Thị B",
        phoneNumber: "0907654321",
        email: "checking2@gmail.com",
        avatar: "https://example.com/avatar2.jpg",
        role: "member",
        balance: 2000000,
        address: "456 Đường XYZ, Quận 2, TP.HCM",
      },
      fullName: "Trần Thị B",
      phoneNumber: "0907654321",
      provinceId: 202,
      districtId: 124,
      wardId: "457",
      detail: "456 Đường XYZ, Quận 2, TP.HCM",
    }
  };

  useEffect(() => {
   setReceiveDelivery(fakeDelivery);
   setSendDelivery(fakeDelivery);
  }, []);


  return (
    <div> 
      <div>
        <h2>
          Thông tin giao hàng (
            {isShowingReceivedDelivery ? "Đơn nhận" : "Đơn gửi"})
        </h2>
        <button
          onClick={() =>
            setIsShowingReceivedDelivery(!isShowingReceivedDelivery)
          }
          className="underline rounded-md text-sm px-4 py-2 uppercase duration-200 hover:font-semibold"
        >
          {isShowingReceivedDelivery ? "Xem đơn gửi" : "Xem đơn nhận"}
        </button>
      </div>
      <div className="grow flex flex-col">
        <div className="mb-4">
          <h3 className="font-semibold text-gray-800">Người gửi</h3>
          <p className="font-light">
              {isShowingReceivedDelivery ? secondUser.name : firstUser.name}
            </p>
            <p className="font-light">
              {isShowingReceivedDelivery ? secondAddress : firstAddress}
            </p>
        </div>
        <div className="mb-4">
            <h3 className="font-semibold text-gray-800">
              Người nhận {isShowingReceivedDelivery && "(Bạn)"}:
            </h3>
            <p className="font-light">
              {isShowingReceivedDelivery ? firstUser.name : secondUser.name}
            </p>
            <p className="font-light">
              {isShowingReceivedDelivery ? firstAddress : secondAddress}
            </p>
          </div>
      </div>
      {(isShowingReceivedDelivery && receiveDelivery.deliveryTrackingCode) ||
        (!isShowingReceivedDelivery && sendDelivery.deliveryTrackingCode) ? (
          <div>
            <div>
                <h3> Mã vận đơn: &emsp;{" "}
                  <span className="font-light">
                    {isShowingReceivedDelivery
                      ? receiveDelivery.deliveryTrackingCode
                      : sendDelivery.deliveryTrackingCode}
                  </span>
                </h3>
                <button
                  onClick={()=> window.open(
                    `https://tracking.ghn.dev/?order_code=${isShowingReceivedDelivery ? receiveDelivery.deliveryTrackingCode : sendDelivery.deliveryTrackingCode}`,
                    "_blank")?.focus()
                  }
                  className="flex items-center gap-2 px-2 rounded-md border border-gray-400  text-xs duration-200 hover:bg-gray-200"
                >
                  <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                  >
                    <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                  </svg>
                  Theo dõi giao hàng
                </button>
                <div>
                  <h3>Trạng thái:</h3>
                </div>
                <div>
                  <h3>
                    Thời gian dữ kiếm: 
                  </h3>
                </div>

            </div>

          </div>
        ) : (
          <div className="basis-1/2 flex flex-col">
              <p className="text-xl font-semibold">TIẾN HÀNH ĐÓNG GÓI</p>

              <div className="flex flex-col xl:flex-row items-center justify-between gap-2 my-2">
                <p className="flex items-center gap-1 font-light text-sm">
                  Thời hạn:&ensp;
                  <span className="text-base font-semibold">72 giờ</span>
                  (sau khi thanh toán)
                </p>
                <span className="flex items-center justify-center gap-2">
                  <p className="text-sm font-light">Còn lại:</p>
                  <TimerCountdown
                    targetDate={sendDelivery?.expiredAt || new Date()}
                    exchange={exchangeDetails}
                    fetchExchangeDetails={fetchExchangeDetails}
                  />
                </span>
              </div>
          </div>
        )}
        {isShowingReceivedDelivery &&
        (receiveDelivery.overallStatus === "DELIVERED" ? (
          !userRefundRequest ? (
            <div>
              <h3 className="font-semibold text-gray-800">Đã giao hàng</h3>
              <p className="font-light">Bạn đã nhận hàng thành công!</p>
              <p className="font-light">Vui lòng xác nhận để hoàn tất giao dịch.</p>
              <button className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 duration-200">
                Xác nhận
              </button>
              <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 duration-200">
                Yêu cầu hoàn tiền
              </button>
              <Modal>

              </Modal>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800">Yêu cầu hoàn tiền</h3>
              <p className="font-light">
                Bạn đã yêu cầu hoàn tiền cho đơn hàng này.
              </p>
              <p className="font-light">Vui lòng đợi xác nhận từ người gửi.</p>
            </div>
          )
        ) : receiveDelivery.overallStatus === "FAILED" ? (
          <div>
            <h3 className="font-semibold text-gray-800">Giao hàng thất bại</h3>
            <p className="font-light">
              Đơn hàng đã không được giao thành công.
            </p>
            <p className="font-light">Vui lòng kiểm tra lại thông tin.</p>
            <button className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 duration-200">
              Liên hệ hỗ trợ 
            </button>
          </div>
        ) : (
          <div
            className={`${
              (!receiveDelivery || !receiveDelivery.deliveryTrackingCode) &&
              "hidden"
            } mt-5 r`}
          >
            <p className="w-full text-center text-sm font-light italic pb-4">
              Trên đường giao hàng đến bạn...
            </p>
            {/* <LinearProgress /> */}
          </div>
        ))}
    </div>
  )
}

export default DeliveryProcessInfo