import React from 'react';
import { Modal, Form, Input, Radio, Divider, Button } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Title, Caption } from '../Design';

const AuctionPaymentModal = ({
  visible,
  onCancel,
  onOk,
  confirmLoading,
  auctionDetail,
  winnerInfo,
  userAddresses,
  selectedAddress,
  setSelectedAddress,
  shippingFee,
  navigate
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      title="Thanh toán đấu giá"
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={confirmLoading}
      width={800}
    >
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-4">Thông tin sản phẩm</h3>
            <div className="flex items-center gap-4 mb-4">
              <img 
                src={auctionDetail?.auction?.gundam_snapshot?.image_url} 
                alt={auctionDetail?.auction?.gundam_snapshot?.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <p className="font-medium">{auctionDetail?.auction?.gundam_snapshot?.name}</p>
                <p>Giá thắng: {winnerInfo?.finalPrice?.toLocaleString()} VNĐ</p>
              </div>
            </div>

            <h3 className="font-semibold mb-4 mt-6">Địa chỉ nhận hàng</h3>
            {userAddresses.length > 0 ? (
              <Radio.Group
                value={selectedAddress?.id}
                onChange={(e) => {
                  const addr = userAddresses.find(a => a.id === e.target.value);
                  setSelectedAddress(addr);
                }}
                className="w-full"
              >
                <div className="space-y-3">
                  {userAddresses.map(address => (
                    <Radio key={address.id} value={address.id} className="w-full">
                      <div className={`p-3 border rounded-lg ml-2 ${selectedAddress?.id === address.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                        <div className="flex justify-between">
                          <div>
                            <p className="font-medium">{address.full_name} ({address.phone_number})</p>
                            <p className="text-sm">
                              {address.detail}, {address.ward_name}, {address.district_name}, {address.province_name}
                            </p>
                          </div>
                          {address.is_primary && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Mặc định</span>
                          )}
                        </div>
                      </div>
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ trong trang cá nhân.
              </div>
            )}

            <Button
              type="link"
              className="mt-2"
              onClick={() => navigate('/member/profile/address')}
            >
              + Thêm địa chỉ mới
            </Button>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Thông tin thanh toán</h3>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Giá thắng đấu giá:</span>
                <span className="font-medium">{winnerInfo?.finalPrice?.toLocaleString()} VNĐ</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span className="font-medium">
                  {`${shippingFee?.toLocaleString()} VNĐ`}
                </span>
              </div>
              <Divider className="my-2" />
              <div className="flex justify-between text-lg">
                <span className="font-semibold">Tổng thanh toán:</span>
                <span className="font-semibold text-red-600">
                  { `${((winnerInfo?.finalPrice || 0) + (shippingFee || 0)).toLocaleString()} VNĐ`}
                </span>
              </div>
            </div>

            <Form.Item label="Ghi chú" name="note">
              <Input.TextArea rows={3} placeholder="Ghi chú cho người bán..." />
            </Form.Item>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <InfoCircleOutlined className="mr-2" />
                Sau khi thanh toán, người bán sẽ liên hệ với bạn để xác nhận đơn hàng.
              </p>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default AuctionPaymentModal;