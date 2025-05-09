import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Avatar } from 'antd';
import DealsInformation from './ExchangeInfo/DealsInformation';
import ViewBothGundamsLists from './ExchangeInfo/ViewBothGundamsLists';

const ExchangeInformation = ({
  firstUser,
  exchangeDetail,
  secondUser,
  firstGundamGroup,
  secondGundamGroup,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModal2Visible, setIsModal2Visible] = useState(false);
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const handleViewDetails = () => {
    setIsModalVisible(true);
    console.log("first gundam group", firstGundamGroup);
    console.log("second gundam group", secondGundamGroup);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleViewDetails2 = () => {
    setIsModal2Visible(true);
  };

  const handleCloseModal2 = () => {
    setIsModal2Visible(false);
    setIsCheckboxChecked(false);
  };

  if ([ 'completed'].includes(exchangeDetail.status)) {
    return null;
  }

  return (
    <div className="exchange-information-container mb-3">
      <div className="flex justify-between items-center gap-[10%]">
      {['delivering', 'delivered'].includes(exchangeDetail.status) && (
        <Button
          type="danger"
          className="flex-3 bg-red-300 hover:bg-red-700 border-red-400 hover:text-white"
          style={{ flex: 3 }}
          onClick={handleViewDetails2}
        >
          Dừng Giao Dịch
        </Button>
      )}
        <Button
          type="primary"
          className="flex-5 bg-blue-400 hover:bg-blue-700"
          style={{ flex: 5 }}
          onClick={handleViewDetails}
        >
          Xem Chi Tiết
        </Button>
      </div>
      <Modal
        title="Xác nhận dừng giao dịch"
        open={isModal2Visible}
        onCancel={handleCloseModal2}
        footer={null}
      >
        <h2>Lưu ý:</h2>
        <div className='flex '>
          <p> Nếu dừng trao đổi, bạn sẽ không thể tiếp tục thảo luận hay trò truyện với <Avatar src={secondUser.avatar_url}/><p className='font-bold'>{secondUser.full_name}</p>về cuộc trao đổi này.</p>
        </div>
       
        <p className='text-red-500 mt-2'> *Hành động này không thể hoàn tác.</p>
        <br />
        <div className="flex justify-end gap-2 mt-4">
        <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="confirmStopExchange"
              onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            />
            <label htmlFor="confirmStopExchange" className="text-sm">
              Tôi xác nhận muốn dừng giao dịch
            </label>
          </div>
          <Button type="primary" danger disabled={!isCheckboxChecked} onClick={handleCloseModal2}>
            Dừng trao đổi
          </Button>
          <Button onClick={handleCloseModal2} >Tiếp tục trao đổi</Button>
        </div>

      </Modal>


      <Modal
        title="Chi Tiết Giao Dịch"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <>
          <DealsInformation
            exchangeDetails={exchangeDetail}
            self={firstUser}
            theOther={secondUser}
          />
                    
          <ViewBothGundamsLists
            currentGundam={firstUser}
            partnerGundam={secondUser}
          />
        </>
      </Modal>
    </div>
  );
};

ExchangeInformation.propTypes = {
  firstCurrentStage: PropTypes.number,
  secondCurrentStage: PropTypes.number,
  exchangeData: PropTypes.object,
  firstUser: PropTypes.object,
  secondUser: PropTypes.object,
  firstGundamGroup: PropTypes.array,
  secondGundamGroup: PropTypes.array,
  exchangeDetail: PropTypes.object,
};

export default ExchangeInformation;