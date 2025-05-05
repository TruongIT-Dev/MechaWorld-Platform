import { Modal, Descriptions, Divider, Card, Avatar, Image, Tag, Tabs } from 'antd';
import { ShopOutlined, UserOutlined, EnvironmentOutlined, ClockCircleOutlined, PhoneOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

const OrderHistoryDetail = ({ visible, onClose, orderData }) => {
    // Track active tab in component state
    const [activeTab, setActiveTab] = useState('1');

    // console.log("activeTab", activeTab);

    // Reset active tab when modal opens
    useEffect(() => {
        if (visible) {
            setActiveTab('1');
        }
    }, [visible]);

    if (!orderData) return null;

    const {
        seller_info,
        buyer_info,
        order,
        order_items,
        order_delivery,
        order_transaction,
        to_delivery_information
    } = orderData;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
            .format(amount)
            .replace('₫', 'đ');
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    // Map status to step
    // const getOrderStatus = () => {
    //     const statusMap = {
    //         'pending': 0,
    //         'confirmed': 1,
    //         'shipping': 2,
    //         'delivered': 3,
    //         'completed': 4,
    //         'canceled': -1
    //     };
    //     return statusMap[order.status] || 0;
    // };

    // Map status to color
    const getStatusColor = (status) => {
        const statusColorMap = {
            'pending': 'orange',
            'packaging': 'blue',
            'delivering': 'cyan',
            'delivered': 'lime',
            'completed': 'green',
            'canceled': 'red',
            'failed': 'volcano'
        };
        return statusColorMap[status] || 'default';
    };

    // Map status to text
    const getStatusText = (status) => {
        const statusTextMap = {
            'pending': 'Chờ xác nhận',
            'packaging': 'Đang đóng gói',
            'delivering': 'Đang giao hàng',
            'delivered': 'Đã giao hàng',
            'completed': 'Hoàn tất',
            'canceled': 'Đã hủy',
            'failed': 'Thất bại'
        };
        return statusTextMap[status] || status;
    };

    // Controlled onChange handler
    const handleTabChange = (key) => {
        setActiveTab(key);
    };

    const items = [
        {
            key: '1',
            label: 'SẢN PHẨM',
            children:
                <>
                    <div className="shop-info mb-4">
                        <div className="flex items-center gap-3 mb-2">
                            <Avatar size={36} src={seller_info.avatar_url} icon={<ShopOutlined />} />
                            <span className="font-semibold text-lg">{seller_info.shop_name}</span>
                        </div>
                    </div>

                    <Card title="Sản phẩm" className="mb-4">
                        {order_items.map((item) => (
                            <div key={item.id} className="flex items-center gap-4 mb-3">
                                <Image
                                    width={80}
                                    height={80}
                                    src={item.image_url}
                                    alt={item.name}
                                    fallback="https://source.unsplash.com/80x80/?product"
                                    className="object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-semibold text-base">{item.name}</p>
                                    <p className="text-gray-500">{item.grade} {item.scale}</p>
                                    <p>Số lượng: {item.quantity}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-red-500 font-semibold">{formatCurrency(item.price)}</p>
                                </div>
                            </div>
                        ))}

                        <Divider />

                        <div className="flex justify-between">
                            <span>Tổng tiền sản phẩm:</span>
                            <span className="font-semibold">{formatCurrency(order.items_subtotal)}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span>Phí vận chuyển:</span>
                            <span>{formatCurrency(order.delivery_fee)}</span>
                        </div>
                        <div className="flex justify-between mt-2">
                            <span className="text-lg font-semibold">Thành tiền:</span>
                            <span className="text-lg font-semibold text-red-500">{formatCurrency(order.total_amount)}</span>
                        </div>
                    </Card>
                </>,
        },
        {
            key: '2',
            label: 'THÔNG TIN ĐƠN HÀNG',
            children:
                <>
                    <Descriptions bordered layout="horizontal">
                        <Descriptions.Item label="Mã đơn hàng" span={3}>
                            <span className="font-semibold">{order.code}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Ngày đặt hàng" span={3}>
                            {formatDate(order.created_at)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phương thức thanh toán" span={3}>
                            {order.payment_method === 'wallet' ? 'Ví điện tử' : order.payment_method}
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái đơn hàng" span={3}>
                            <Tag color={getStatusColor(order_transaction.status)}>
                                {getStatusText(order.status)}
                            </Tag>
                        </Descriptions.Item>
                        {order.note ? (
                            <Descriptions.Item label="Ghi chú" span={3}>
                                {order.note}
                            </Descriptions.Item>
                        ) : (
                            <Descriptions.Item label="Ghi chú" span={3}>
                                Không có ghi chú
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </>
        },
        {
            key: '3',
            label: 'THÔNG TIN GIAO HÀNG',
            children:
                <>
                    <Descriptions bordered layout="horizontal">
                        <Descriptions.Item label="Người nhận" span={3}>
                            <div className="flex items-center gap-2">
                                <UserOutlined />
                                <span>{to_delivery_information.full_name}</span>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Số điện thoại" span={3}>
                            <div className="flex items-center gap-2">
                                <PhoneOutlined />
                                <span>{to_delivery_information.phone_number}</span>
                            </div>

                        </Descriptions.Item>
                        <Descriptions.Item label="Địa chỉ" span={3}>
                            <div className="flex items-center gap-2">
                                <EnvironmentOutlined />
                                <span>
                                    {to_delivery_information.detail}, {to_delivery_information.ward_name}, {to_delivery_information.district_name}, {to_delivery_information.province_name}
                                </span>
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Thời gian dự kiến" span={3}>
                            <div className="flex items-center gap-2">
                                <ClockCircleOutlined />
                                <span>{formatDate(order_delivery.expected_delivery_time)}</span>
                            </div>
                        </Descriptions.Item>
                        {order_delivery.delivery_tracking_code && (
                            <Descriptions.Item label="Mã vận đơn" span={3}>
                                {order_delivery.delivery_tracking_code}
                            </Descriptions.Item>
                        )}
                    </Descriptions>
                </>
        },
    ];

    return (
        <Modal
            title={<h1 className='text-center font-bold text-xl'>CHI TIẾT ĐƠN MUA</h1>}
            open={visible}
            onCancel={onClose}
            footer={null}
            width={800}
            className="order-detail-modal"
            destroyOnClose={true}
        >
            <Tabs
                activeKey={activeTab}
                items={items}
                onChange={handleTabChange}
                centered
            />
        </Modal>
    );
};

export default OrderHistoryDetail;