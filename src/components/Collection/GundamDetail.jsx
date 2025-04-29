import { Modal, Descriptions, Button, Image } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const GundamDetail = ({ selectedGundam, isModalOpen, handleModalClose, toggleEditGundam }) => {
    if (!selectedGundam) return null;

    return (
        <Modal
            title={selectedGundam?.name}
            open={isModalOpen}
            onCancel={handleModalClose}
            footer={null}
            width={800}
        >
            <div className="flex flex-col md:flex-row gap-6">
                <div className="md:w-1/3">
                    <Image
                        src={selectedGundam.image}
                        alt={selectedGundam.name}
                        className="rounded-lg"
                    />
                </div>
                <div className="md:w-2/3 md:h-[600px] overflow-auto">
                    <Descriptions title="THÔNG SỐ GUNDAM" bordered layout="vertical">
                        <Descriptions.Item label="Tên mô hình" span={3}>{selectedGundam.name}</Descriptions.Item>
                        <Descriptions.Item label="Grade">{selectedGundam.grade}</Descriptions.Item>
                        <Descriptions.Item label="Tỷ lệ">{selectedGundam.scale}</Descriptions.Item>
                        <Descriptions.Item label="Khối lượng">50(gam)</Descriptions.Item>
                        <Descriptions.Item label="Phiên bản">Standard/Common</Descriptions.Item>
                        <Descriptions.Item label="Vật liệu">PVC</Descriptions.Item>
                        <Descriptions.Item label="Tống số mảnh">1320 mảnh</Descriptions.Item>
                        <Descriptions.Item label="Dòng phim" span={1}>{selectedGundam.series}</Descriptions.Item>
                        <Descriptions.Item label="Nhà sản xuất">Bandai</Descriptions.Item>
                        <Descriptions.Item label="Năm sản xuất">2000</Descriptions.Item>
                        <Descriptions.Item label="Tình trạng">{selectedGundam.condition}</Descriptions.Item>
                        <Descriptions.Item label="Giá mua">{selectedGundam.price.toLocaleString('vi-VN')}đ</Descriptions.Item>
                        <Descriptions.Item label="Ngày mua">{selectedGundam.purchaseDate}</Descriptions.Item>
                        <Descriptions.Item label="Mô tả tình trạng" span={3}>Hộp mới còn nguyên seal, đầy đủ linh phụ kiện.</Descriptions.Item>
                        <Descriptions.Item label="Mô tả sản phẩm" span={3}>{selectedGundam.description}</Descriptions.Item>
                    </Descriptions>

                    <div className="mt-4 flex justify-end">
                        <Button
                            onClick={() => toggleEditGundam()}
                            icon={<EditOutlined className='mt-2' />}
                        >
                            Chỉnh sửa thông số Gundam
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default GundamDetail;