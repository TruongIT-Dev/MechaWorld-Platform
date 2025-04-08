import PropTypes from 'prop-types'

const ActionButtons = ({
  currentStage,
  setFirstCurrentStage,
  oppositeCurrentStage,
  setSecondCurrentStage,
  exchangeData,
  selectedAddress,
}) => {
  const isFailed = ["FAILED", "CANCELED", "REJECTED"].includes(
    (status) => status === exchangeData.exchange.status
  ); 
  if (isFailed) return;
  if (currentStage > oppositeCurrentStage)
    return (
      <div className="w-full bg-gray-300 text-white py-2 rounded-lg text-center">
        Đang đợi người đối diện thực hiện...
      </div>
    );
  else
    return (
      <div className="relative w-full flex flex-col items-stretch justify-center px-2 mt-1">
        {currentStage === 0 &&
          (!exchangeData.isRequestUser ? (
            // <AcceptOrRejectButtons
            //   exchangeId={exchangeData.exchange.id}
            //   // fetchExchangeDetails={fetchExchangeDetails}
            // />
            <div> checking 1</div>
          ) : (
            <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
              Yêu cầu đang chờ để được chấp nhận...
            </button>
          ))}

        {currentStage === 1 &&
          oppositeCurrentStage === 1 &&
          (exchangeData.isRequestUser ? null : (
            <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
              Đang chờ người yêu cầu trao đổi xác nhận...
            </button>
          ))}
        {currentStage === 1 &&
          oppositeCurrentStage === 2 &&
          (!exchangeData.isRequestUser ? (
            // <ConfirmDealsButton
            //   exchangeDetail={exchangeData}
            //   // fetchExchangeDetails={fetchExchangeDetails}
            // />
            <div> xác nhận deal</div>
          ) : (
            <button className="w-full py-2 rounded-lg border border-gray-500 font-light cursor-default">
              Đang chờ người yêu cầu trao đổi xác nhận...
            </button>
          ))}

        {currentStage === 2 && (
          // <ConfirmDeliveryButton
          //   exchangeId={exchangeData.exchange.id}
          //   selectedAddress={selectedAddress}
          //   fetchExchangeDetails={fetchExchangeDetails}
          // />
          <div> confirm</div>
        )}
      </div>
    )
  // return (
  //   <div>

  //   </div>
  // )
}

ActionButtons.propTypes = {
    firstCurrentStage: PropTypes.object.isRequired,
}

export default ActionButtons