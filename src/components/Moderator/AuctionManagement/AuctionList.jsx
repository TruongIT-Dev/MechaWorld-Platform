import { Table, Button, Tooltip, Modal, Input, message, Popconfirm, Descriptions, DatePicker, Form } from "antd";
import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  GetListAuctionForModerator,
  UpdateAuctionTime,
} from "../../../apis/Moderator/APIModerator";
import dayjs from "dayjs";

const formatCurrency = (value) =>
  value?.toLocaleString("vi-VN") + " đ";

const AuctionList = ({ searchTerm, filteredStatus }) => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAuctions();
  }, [searchTerm, filteredStatus]);

  const fetchAuctions = async () => {
    setLoading(true);
    try {
      const response = await GetListAuctionForModerator();
      let filteredData = response.data;

      // Filter by search term
      if (searchTerm) {
        filteredData = filteredData.filter(item => 
          item.auction.gundam_snapshot.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by status
      if (filteredStatus) {
        filteredData = filteredData.filter(item => 
          item.auction.status === filteredStatus
        );
      }

      setAuctions(filteredData);
    } catch (error) {
      message.error("Failed to fetch auctions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTime = (auction) => {
    setSelectedAuction(auction);
    form.setFieldsValue({
      start_time: dayjs(auction.start_time),
      end_time: dayjs(auction.end_time)
    });
    setIsModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const updatedData = {
        start_time: values.start_time.toISOString(),
        end_time: values.end_time.toISOString()
      };

      await UpdateAuctionTime(selectedAuction.id, updatedData);
      message.success("Auction time updated successfully");
      setIsModalVisible(false);
      fetchAuctions();
    } catch (error) {
      message.error("Failed to update auction time");
      console.error(error);
    }
  };

  const columns = [
    {
      title: 'Gundam',
      dataIndex: ['auction', 'gundam_snapshot', 'name'],
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <img 
            src={record.auction.gundam_snapshot.image_url} 
            alt={text} 
            className="w-10 h-10 object-cover mr-2"
          />
          {text}
        </div>
      ),
    },
    {
      title: 'Starting Price',
      dataIndex: ['auction', 'starting_price'],
      key: 'starting_price',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Current Price',
      dataIndex: ['auction', 'current_price'],
      key: 'current_price',
      render: (value) => formatCurrency(value),
    },
    {
      title: 'Status',
      dataIndex: ['auction', 'status'],
      key: 'status',
      render: (status) => (
        <span className={`capitalize ${status === 'scheduled' ? 'text-blue-500' : 
                         status === 'ongoing' ? 'text-green-500' : 
                         status === 'completed' ? 'text-purple-500' : 
                         'text-gray-500'}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Start Time',
      dataIndex: ['auction', 'start_time'],
      key: 'start_time',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'End Time',
      dataIndex: ['auction', 'end_time'],
      key: 'end_time',
      render: (time) => dayjs(time).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Tooltip title="View Details">
            <Button 
              icon={<InfoCircleOutlined />} 
              onClick={() => setSelectedAuction(record.auction)}
            />
          </Tooltip>
          <Tooltip title="Edit Time">
            <Button 
              icon={<EditOutlined />} 
              onClick={() => handleUpdateTime(record.auction)}
              disabled={record.auction.status !== 'scheduled'}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={auctions}
        rowKey={(record) => record.auction.id}
        loading={loading}
        scroll={{ x: true }}
      />

      {/* Auction Details Modal */}
      <Modal
        title="Auction Details"
        visible={!!selectedAuction && !isModalVisible}
        onCancel={() => setSelectedAuction(null)}
        footer={[
          <Button key="back" onClick={() => setSelectedAuction(null)}>
            Close
          </Button>,
        ]}
      >
        {selectedAuction && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Gundam Name">
              {selectedAuction.gundam_snapshot.name}
            </Descriptions.Item>
            <Descriptions.Item label="Grade">{selectedAuction.gundam_snapshot.grade}</Descriptions.Item>
            <Descriptions.Item label="Scale">{selectedAuction.gundam_snapshot.scale}</Descriptions.Item>
            <Descriptions.Item label="Starting Price">
              {formatCurrency(selectedAuction.starting_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Current Price">
              {formatCurrency(selectedAuction.current_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Buy Now Price">
              {formatCurrency(selectedAuction.buy_now_price)}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <span className="capitalize">{selectedAuction.status}</span>
            </Descriptions.Item>
            <Descriptions.Item label="Start Time">
              {dayjs(selectedAuction.start_time).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {dayjs(selectedAuction.end_time).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
            <Descriptions.Item label="Total Participants">
              {selectedAuction.total_participants}
            </Descriptions.Item>
            <Descriptions.Item label="Total Bids">
              {selectedAuction.total_bids}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Update Time Modal */}
      <Modal
        title="Update Auction Time"
        visible={isModalVisible}
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        okText="Update"
        cancelText="Cancel"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="start_time"
            label="Start Time"
            rules={[{ required: true, message: 'Please select start time' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              style={{ width: '100%' }} 
            />
          </Form.Item>
          <Form.Item
            name="end_time"
            label="End Time"
            rules={[{ required: true, message: 'Please select end time' }]}
          >
            <DatePicker 
              showTime 
              format="YYYY-MM-DD HH:mm" 
              style={{ width: '100%' }} 
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AuctionList;