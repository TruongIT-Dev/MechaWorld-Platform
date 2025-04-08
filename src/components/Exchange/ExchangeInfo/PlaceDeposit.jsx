/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
// import { privateAxios } from "../../../../middleware/axiosInstance";
import moment from "moment/min/moment-with-locales";
// import PayButton from "./buttons/PayButton";

moment.locale("vi");

export default function PlaceDeposit({
  exchangeDetails,
  firstAddress,
  secondAddress,
  firstUser,
  secondUser,
  // fetchExchangeDetails,
  setIsLoading,
}) {
  const [deliveryDetails, setDeliveryDetails] = useState();
  const [total, setTotal] = useState(0);

  const exchange = exchangeDetails.exchange;
  const  CurrencySplitter = (x) => {
    if (!x || x === 0) return "0";
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  const fetchDeliveryFeeAndDeliveryTime = async () => {
    setIsLoading(true);
    try {
      // const deliveryRes = await privateAxios.get(
      //   `deliveries/exchange/to-user/${exchange.id}`
      // );

      // const deliDetailsRes = await privateAxios.get(
      //   `deliveries/details/${deliveryRes.data.id}`
      // );


      // const deliveryDetails = deliDetailsRes.data;
      const deliveryDetails = [
        {
          deliveryFee: 50000,
          estDeliveryTime: moment().add(3, "days"),

        }
      ];

      setDeliveryDetails({
        fee: deliveryDetails.deliveryFee,
        estTime: deliveryDetails.estDeliveryTime,
      });

      setTotal(
        exchange.depositAmount +
          deliveryDetails.deliveryFee +
          (exchangeDetails.exchange.compensateUser &&
          exchangeDetails.exchange.compensateUser.id === firstUser.id
            ? exchange.compensationAmount
            : 0)
      );

      
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveryFeeAndDeliveryTime();
  }, []);

  const formatDate =
    moment(deliveryDetails?.estTime).format("dddd DD/MM").charAt(0).toUpperCase() +
    moment(deliveryDetails?.estTime).format("dddd DD/MM/yyyy").slice(1);

  return (
    <div className="w-ful flex flex-row gap-5 REM px-10">
      {/* Left side - Address */}
      <div className="w-1/2 flex flex-col gap-4 mr-2 border-r pr-2">
        {/* Sender */}
        <h2 className="text-xl font-semibold">Địa chỉ </h2>
        <div className="w-full flex flex-col gap-2">
          <div className="flex flex-row gap-2 items-center">
            <svg viewBox="0 0 24 24" fill="none" width={24} height={24}>
              <path d="M10 13H14M19 9V20H5V9..." stroke="#000" strokeWidth="1.5" />
            </svg>
            <h2 className="text-base font-semibold">Người gửi:</h2>
          </div>
          <div className="mt-2 flex flex-col gap-2 font-light">
            <p>
              Tên người gửi: <span className="font-medium">{secondUser.name}</span>
            </p>
            <h2>
              Địa chỉ: <span className="font-medium">{secondAddress}</span>
            </h2>
          </div>
        </div>

        {/* Receiver */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <div className="flex flex-row gap-2 items-center">
            <svg viewBox="0 0 48 48" fill="#000000" height={24} width={24}>
              <path d="M0 0h48v48H0z" fill="none"></path>
              <path d="M40,26.294V8c0-2.2-1.8-4-4-4H12..." />
            </svg>
            <h2 className="text-base font-semibold">Người nhận:</h2>
          </div>
          <div className="mt-2 flex flex-col gap-2 font-light">
            <p>
              Tên người nhận: <span className="font-medium">{firstUser.name}</span>
            </p>
            <h2>
              Địa chỉ: <span className="font-medium">{firstAddress}</span>
            </h2>
          </div>
        </div>
      </div>

      {/* Right side - Summary */}
      <div className="w-1/2 flex flex-col items-stretch justify-start gap-4 mx-auto">
        <p className="text-lg font-semibold">Tổng số tiền cần thanh toán:</p>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16">
              <path d="..." />
            </svg>
            <p className="font-semibold text-sm">Trao đổi</p>
          </div>

          <div className="flex items-center justify-between text-xs font-light px-4">
            <p>Tổng tiền cọc:</p>
            <p className="font-semibold">
              {CurrencySplitter(exchangeDetails.exchange.depositAmount || 0)} đ
            </p>
          </div>

          {exchangeDetails.exchange.compensateUser &&
            exchangeDetails.exchange.compensateUser.id === firstUser.id && (
              <div
                className={`relative flex items-center justify-between text-xs font-light px-4 ${
                  exchangeDetails.exchange.compensationAmount === 0 && "opacity-30"
                }`}
              >
                <p>Tổng tiền bù:</p>
                <p className="font-semibold">
                  {CurrencySplitter(exchangeDetails.exchange.compensationAmount || 0)} đ
                </p>
              </div>
            )}
        </div>

        <div className="flex flex-col gap-2 pb-2 border-b border-gray-400">
          <div className="flex items-center gap-2 mb-2">
            <svg width="16" height="16">
              <path d="..." />
            </svg>
            <p className="font-semibold text-sm">Vận chuyển</p>
          </div>
          <div className="flex items-center justify-between text-xs font-light px-4">
            <p>Phí giao hàng:</p>
            <p className="font-semibold">{CurrencySplitter(deliveryDetails?.fee || 0)} đ</p>
          </div>
          <div className="flex items-center justify-between text-xs font-light px-4 italic">
            <p>Ngày nhận hàng dự kiến:</p>
            <p>{formatDate}</p>
          </div>
        </div>

        <div className="flex items-center justify-between px-4">
          <p className="font-light">Tổng tiền:</p>
          <p className="font-semibold text-red-600">{CurrencySplitter(total)} đ</p>
        </div>

        {/* <PayButton
          user={firstUser}
          total={total}
          exchangeId={exchangeDetails.exchange.id}
          fetchExchangeDetails={fetchExchangeDetails}
          setIsLoading={setIsLoading}
        /> */}

        <p className="text-[0.8em] font-light italic">
          Chúng tôi chỉ hỗ trợ hình thức thanh toán bằng Ví để đảm bảo
          quyền lợi và an toàn cho người tham gia trao đổi.
        </p>
      </div>
    </div>
  );
}
PlaceDeposit.propTypes = {
  exchangeDetails: PropTypes.shape({
    exchange: PropTypes.shape({
      id: PropTypes.number.isRequired,
      depositAmount: PropTypes.number.isRequired,
      compensationAmount: PropTypes.number,
      compensateUser: PropTypes.shape({
        id: PropTypes.number.isRequired,
      }),
    }).isRequired,
  }).isRequired,
  firstAddress: PropTypes.string.isRequired,
  secondAddress: PropTypes.string.isRequired,
  firstUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  secondUser: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  fetchExchangeDetails: PropTypes.func.isRequired,
  setIsLoading: PropTypes.func.isRequired,
};
