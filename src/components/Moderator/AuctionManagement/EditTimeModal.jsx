import { useState, useEffect } from 'react';
import { Modal, Button, Form, DatePicker, message } from "antd";
import dayjs from "dayjs";
import { UpdateAuctionTime } from "../../../apis/Moderator/APIModerator";

const EditTimeModal = ({ 
  visible, 
  onClose, 
  auctionData,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && auctionData) {
      form.setFieldsValue({
        startTime: dayjs(auctionData.startTime),
        endTime: dayjs(auctionData.endTime)
      });
    }
  }, [visible, auctionData]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      await UpdateAuctionTime(auctionData.id, {
        start_time: values.startTime.format('YYYY-MM-DDTHH:mm:ssZ'),
        end_time: values.endTime.format('YYYY-MM-DDTHH:mm:ssZ')
      });
      
      message.success("Cập nhật thời gian thành công!");
      onSuccess();
      onClose();
    } catch (error) {
      message.error("Lỗi khi cập nhật thời gian!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Chỉnh sửa thời gian đấu giá"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Hủy
        </Button>,
        <Button
          key="update"
          type="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          Cập nhật
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="startTime"
          label="Thời gian bắt đầu"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian bắt đầu' }]}
        >
          <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="endTime"
          label="Thời gian kết thúc"
          rules={[{ required: true, message: 'Vui lòng chọn thời gian kết thúc' }]}
        >
          <DatePicker showTime format="DD/MM/YYYY HH:mm" style={{ width: '100%' }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTimeModal;