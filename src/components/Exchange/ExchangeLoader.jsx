import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;

const ExchangeLoader = () => {
  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f2f5',
      }}
    >
      <Spin indicator={antIcon} tip="Đang tải trang trao đổi..." size="large" />
    </div>
  );
};

export default ExchangeLoader;
