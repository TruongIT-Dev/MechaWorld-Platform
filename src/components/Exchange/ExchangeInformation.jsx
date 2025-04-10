import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Card, Button, Avatar } from 'antd';

const ExchangeInformation = ({
  firstCurrentStage,
  secondCurrentStage,
  exchangeData,
  firstUser,
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

  return (
    <div className="exchange-information-container">
      <div className="flex justify-between items-center gap-[10%]">
        <Button
          type="danger"
          className="flex-3 bg-red-300 hover:bg-red-700 border-red-400 hover:text-white"
          style={{ flex: 3 }}
          onClick={handleViewDetails2}
        >
          Dừng Giao Dịch
        </Button>
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
        <p> Nếu dừng trao đổi, bạn sẽ không thể tiếp tục thảo luận hay trò truyện với <Avatar src={secondUser.avatar}/> {secondUser.name} về cuộc trao đổi này.</p>
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
        <div className="modal-content">
          <Card title={`Gundam của ${firstUser.name}`} className="gundam-card">
            {firstGundamGroup?.[0]?.gundams?.length > 0 ? (
              firstGundamGroup[0].gundams.map((gundam) => (
                <div key={gundam.id} className="mb-4">
                  <p><strong>Tên:</strong> {gundam.name}</p>
                  <p><strong>Grade:</strong> {gundam.grade}</p>
                  <p><strong>Scale:</strong> {gundam.scale}</p>
                  <p><strong>Condition:</strong> {gundam.condition}</p>
                  <p><strong>Manufacturer:</strong> {gundam.manufacturer}</p>
                  {/* <img src={{gundam.}} alt="" /> */}
                </div>
              ))
            ) : (
              <p>Không có Gundam nào để hiển thị.</p>
            )}
          </Card>

          <Card title={`Gundam của ${secondUser.name}`} className="gundam-card">
            {secondGundamGroup?.[0]?.gundams?.length > 0 ? (
              secondGundamGroup[0].gundams.map((gundam) => (
                <div key={gundam.id} className="mb-4">
                  <p><strong>Tên:</strong> {gundam.name}</p>
                  <p><strong>Grade:</strong> {gundam.grade}</p>
                  <p><strong>Scale:</strong> {gundam.scale}</p>
                  <p><strong>Condition:</strong> {gundam.condition}</p>
                  <p><strong>Manufacturer:</strong> {gundam.manufacturer}</p>
                </div>
              ))
            ) : (
              <p>Không có Gundam nào để hiển thị.</p>
            )}
          </Card>
        </div>
      </Modal>
    </div>
  );
};

ExchangeInformation.propTypes = {
  firstCurrentStage: PropTypes.object.isRequired,
  secondCurrentStage: PropTypes.object.isRequired,
  exchangeData: PropTypes.object.isRequired,
  firstUser: PropTypes.object.isRequired,
  secondUser: PropTypes.object.isRequired,
  firstGundamGroup: PropTypes.object.isRequired,
  secondGundamGroup: PropTypes.object.isRequired,
};

export default ExchangeInformation;