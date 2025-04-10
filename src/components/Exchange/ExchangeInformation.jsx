import { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Card, Button } from 'antd';

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

  const handleViewDetails = () => {
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };
  const handleViewDetails2 = () => {
    setIsModal2Visible(true);
  };

  const handleCloseModal2 = () => {
    setIsModal2Visible(false);
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
        <p> Sau khi hủy giao dịch, </p>

      </Modal>


      <Modal
        title="Chi Tiết Giao Dịch"
        open={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <div className="modal-content">
          <Card title={`Gundam của ${firstUser.name}`} className="gundam-card">
            <p>{firstGundamGroup.name}</p>
            <p>{firstGundamGroup.grade}</p>
            <p>{firstGundamGroup.scale}</p>
            <p>{firstGundamGroup.condition}</p>
            <p>{firstGundamGroup.manufacturer}</p>
          </Card>
          <Card title={`Gundam của ${secondUser.name}`} className="gundam-card">
            <p>{secondGundamGroup.name}</p>
            <p>{secondGundamGroup.grade}</p>
            <p>{secondGundamGroup.scale}</p>
            <p>{secondGundamGroup.condition}</p>
            <p>{secondGundamGroup.description}</p>
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