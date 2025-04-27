import { useState } from 'react';
import { Modal, Tabs, Form, Input, InputNumber, Button, Card, Tag, Checkbox, message, Radio, Space } from 'antd';
import { DollarOutlined, FileTextOutlined, SwapOutlined, InfoCircleOutlined } from '@ant-design/icons';

// Giả lập dữ liệu Gundam của người dùng hiện tại
// const myGundams = [
//     {
//         id: 'mg1',
//         name: 'Gundam Astray Red Frame',
//         image: 'https://m.media-amazon.com/images/I/71xQGWfYJKL._AC_UF1000,1000_QL80_.jpg',
//         condition: 'New',
//         scale: '1/100 MG'
//     },
//     {
//         id: 'mg2',
//         name: 'Gundam Deathscythe Hell',
//         image: 'https://m.media-amazon.com/images/I/71cOuEctNnL._AC_UF1000,1000_QL80_.jpg',
//         condition: 'Built',
//         scale: '1/144 RG'
//     },
//     {
//         id: 'mg3',
//         name: 'Nu Gundam Ver. Ka',
//         image: 'https://m.media-amazon.com/images/I/615YhvfMjIL._AC_UF1000,1000_QL80_.jpg',
//         condition: 'New',
//         scale: '1/100 MG'
//     },
//     {
//         id: 'mg4',
//         name: 'Sazabi Ver. Ka',
//         image: 'https://m.media-amazon.com/images/I/61BWmit0VXL._AC_UF1000,1000_QL80_.jpg',
//         condition: 'Built',
//         scale: '1/100 MG'
//     }
// ];

export default function ModalOfferExchange({ isOpen, onClose, requestData,gundamList }) {
    const [form] = Form.useForm();
    const [activeTab, setActiveTab] = useState('1');
    const [selectedGundam, setSelectedGundam] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [compensationType, setCompensationType] = useState('none');

    console.log(requestData);

    // Giả lập dữ liệu của bài đăng/request mà người dùng muốn trao đổi
    const receiverInfo = {
        id: 'user123',
        name: 'GundamCollector',
        avatar: 'https://i.pravatar.cc/300?img=8',
        requestTitle: 'Tìm kiếm Gundam Strike Freedom để trao đổi'
    };

    // Dữ liệu người hiện tại
    const currentUser = {
        id: 'current-user',
        name: 'YourUsername'
    };

    const handleTabChange = (key) => {
        // Validate form trước khi chuyển sang tab khác
        if (key === '3' && activeTab === '1') {
            form.validateFields(['compensationType', 'compensationAmount'])
                .then(() => {
                    setActiveTab(key);
                })
                .catch((error) => {
                    console.log('Form validation failed:', error);
                });
        } else {
            setActiveTab(key);
        }
    };

    const handleGundamSelect = (gundamId) => {
        setSelectedGundam(gundamId);
    };

    const handleCompensationTypeChange = (e) => {
        setCompensationType(e.target.value);
        // Reset compensation amount when changing type
        if (e.target.value === 'none') {
            form.setFieldsValue({ compensationAmount: 0 });
        }
    };

    const handleSubmit = () => {
        if (!selectedGundam) {
            message.error('Vui lòng chọn một Gundam để trao đổi');
            setActiveTab('3');
            return;
        }

        form.validateFields()
            .then((values) => {
                setIsSubmitting(true);

                // Giả lập gửi request API
                setTimeout(() => {
                    console.log('Submitting exchange offer:', {
                        ...values,
                        gundamId: selectedGundam,
                        requestId: requestData?.id || 'default-request-id'
                    });

                    message.success('Đã gửi yêu cầu trao đổi thành công!');
                    setIsSubmitting(false);
                    
                    // Reset form và đóng modal
                    form.resetFields();
                    setSelectedGundam(null);
                    setActiveTab('1');
                    setCompensationType('none');
                    onClose();
                }, 1000);
            })
            .catch((errorInfo) => {
                console.log('Form validation error:', errorInfo);
            });
    };

    const handleCancel = () => {
        form.resetFields();
        setSelectedGundam(null);
        setActiveTab('1');
        setCompensationType('none');
        onClose();
    };

    return (
        <Modal
            title={
                <div className="flex items-center gap-2">
                    <SwapOutlined className="text-blue-500" />
                    <span className="text-lg font-bold">TẠO YÊU CẦU TRAO ĐỔI</span>
                </div>
            }
            open={isOpen}
            onCancel={handleCancel}
            width={800}
            footer={null}
            destroyOnClose={true}
        >
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-start gap-2">
                    <InfoCircleOutlined className="text-blue-500 mt-1" />
                    <div>
                        <p className="mb-1">
                            Bạn đang tạo đề nghị trao đổi với{' '}
                            <span className="font-semibold">{receiverInfo.name}</span>
                        </p>
                        <p className="text-sm text-gray-600">
                            Vui lòng điền thông tin trao đổi và chọn Gundam bạn muốn trao đổi.
                        </p>
                    </div>
                </div>
            </div>

            <Tabs
                activeKey={activeTab}
                onChange={handleTabChange}
                items={[

                    // Tab 1: THÔNG TIN BÙ TRỪ TIỀN
                    {
                        key: '1',
                        label: (
                            <span className="flex items-center gap-1">
                                <FileTextOutlined />
                                THÔNG TIN BÙ TRỪ TIỀN
                            </span>
                        ),
                        children: (
                            <Form
                                form={form}
                                layout="vertical"
                                className="pt-2"
                                initialValues={{
                                    compensationType: 'none',
                                    compensationAmount: 0
                                }}
                            >
                                <Form.Item
                                    label={<span className="font-medium text-base">Bạn muốn ai là người Bù Trừ tiền?</span>}
                                    className="mb-4"
                                >
                                    <div className="flex flex-wrap gap-2">
                                        <Button
                                            type={compensationType === 'none' ? 'primary' : 'default'}
                                            onClick={() => {
                                                setCompensationType('none');
                                                form.setFieldsValue({
                                                    compensationType: 'none',
                                                    compensationAmount: 0
                                                });
                                            }}
                                            className={compensationType === 'none' ? 'bg-blue-500' : ''}
                                        >
                                            Không ai phải bù trừ tiền
                                        </Button>
                                        <Button
                                            type={compensationType === 'receiver' ? 'primary' : 'default'}
                                            onClick={() => {
                                                setCompensationType('receiver');
                                                form.setFieldsValue({ compensationType: 'receiver' });
                                            }}
                                            className={compensationType === 'receiver' ? 'bg-blue-500' : ''}
                                        >
                                            {requestData?.full_name} sẽ bù tiền
                                        </Button>
                                        <Button
                                            type={compensationType === 'sender' ? 'primary' : 'default'}
                                            onClick={() => {
                                                setCompensationType('sender');
                                                form.setFieldsValue({ compensationType: 'sender' });
                                            }}
                                            className={compensationType === 'sender' ? 'bg-blue-500' : ''}
                                        >
                                            Bạn sẽ bù tiền
                                        </Button>
                                    </div>
                                    <Form.Item
                                        name="compensationType"
                                        hidden
                                    >
                                        <Input />
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item
                                    name="compensationAmount"
                                    label="Số tiền bù trừ (VND)"
                                    rules={compensationType !== 'none' ? [
                                        { required: true, message: 'Vui lòng nhập số tiền bù trừ' },
                                        { type: 'number', min: 1000, message: 'Số tiền bù trừ phải từ 1,000 VND trở lên' }
                                    ] : []}
                                >
                                    <InputNumber
                                        className="w-full"
                                        placeholder="Nhập số tiền bù trừ"
                                        min={1000}
                                        step={10000}
                                        formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        addonBefore={<DollarOutlined />}
                                        disabled={compensationType === 'none'}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="note"
                                    label="Ghi chú (không bắt buộc)"
                                >
                                    <Input.TextArea
                                        rows={4}
                                        placeholder="Nhập ghi chú về đề nghị trao đổi của bạn (nếu có)..."
                                        maxLength={500}
                                        showCount
                                    />
                                </Form.Item>

                                <Form.Item className="mb-0">
                                    <div className="flex justify-between">
                                        <Button onClick={handleCancel}>
                                            Hủy
                                        </Button>
                                        <Button
                                            className='bg-blue-500'
                                            type="primary"
                                            onClick={() => handleTabChange('2')}>
                                            Bước tiếp theo...
                                        </Button>
                                    </div>
                                </Form.Item>
                            </Form>
                        ),
                    },

                    // Tab 2: CHỌN GUNDAM CỦA MÌNH ĐỂ TRAO ĐỔI
                    {
                        key: '2',
                        label: (
                            <span className="flex items-center gap-1">
                                <SwapOutlined />
                                GUNDAM TRAO ĐỔI CỦA BẠN
                            </span>
                        ),
                        children: (
                            <div className="pt-2">
                                <p className="mb-4 text-red-500">
                                    *Lưu ý: Chọn một trong những Gundam đang có trong kho của bạn để trao đổi.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
                                    {gundamList?.map((gundam) => (
                                        <Card
                                            key={gundam.gundam_id}
                                            hoverable
                                            className={`border-2 transition-all ${selectedGundam === gundam.gundam_id ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                                            cover={
                                                <div className="relative">
                                                    <img
                                                        alt={gundam.name}
                                                        src={gundam.primary_image_url}
                                                        className="h-48 w-full object-cover"
                                                    />
                                                    <Tag
                                                        color={gundam.condition === 'New' ? 'gold' : 'purple'}
                                                        className="absolute top-2 right-2"
                                                    >
                                                        {gundam.condition}
                                                    </Tag>
                                                </div>
                                            }
                                            onClick={() => handleGundamSelect(gundam.gundam_id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold mb-1">{gundam.name}</p>
                                                    <Tag color="blue">{gundam.scale}</Tag>
                                                </div>
                                                <Checkbox
                                                    checked={selectedGundam === gundam.gundam_id}
                                                    onChange={() => handleGundamSelect(gundam.gundam_id)}
                                                    className="scale-125"
                                                />
                                            </div>
                                        </Card>
                                    ))}

                                    {gundamList?.length === 0 && (
                                        <div className="col-span-2 text-center py-8 bg-gray-100 rounded-lg">
                                            <p className="text-gray-500">Bạn chưa có Gundam nào để trao đổi</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button onClick={() => handleTabChange('1')}>
                                        Quay lại
                                    </Button>
                                    <Button
                                        className='bg-blue-500'
                                        type="primary"
                                        onClick={() => handleTabChange('3')}
                                        loading={isSubmitting}
                                        disabled={!selectedGundam}
                                    >  Bước tiếp theo...
                                    </Button>
                                </div>
                            </div>
                        ),
                    },

                    // Tab 3: CHỌN GUNDAM CỦA NGƯỜI ĐĂNG ĐỂ TRAO ĐỔI
                    {
                        key: '3',
                        label: (
                            <span className="flex items-center gap-1">
                                <SwapOutlined />
                                GUNDAM TRAO ĐỔI CỦA ...
                            </span>
                        ),
                        children: (
                            <div className="pt-2">
                                <p className="mb-4 text-red-500">
                                    *Lưu ý: Chọn một trong những Gundam của [...] để trao đổi.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
                                    {myGundams.map((gundam) => (
                                        <Card
                                            key={gundam.id}
                                            hoverable
                                            className={`border-2 transition-all ${selectedGundam === gundam.id ? 'border-blue-500 shadow-md' : 'border-gray-200'}`}
                                            cover={
                                                <div className="relative">
                                                    <img
                                                        alt={gundam.name}
                                                        src={gundam.image}
                                                        className="h-48 w-full object-cover"
                                                    />
                                                    <Tag
                                                        color={gundam.condition === 'New' ? 'gold' : 'purple'}
                                                        className="absolute top-2 right-2"
                                                    >
                                                        {gundam.condition}
                                                    </Tag>
                                                </div>
                                            }
                                            onClick={() => handleGundamSelect(gundam.id)}
                                        >
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold mb-1">{gundam.name}</p>
                                                    <Tag color="blue">{gundam.scale}</Tag>
                                                </div>
                                                <Checkbox
                                                    checked={selectedGundam === gundam.id}
                                                    onChange={() => handleGundamSelect(gundam.id)}
                                                    className="scale-125"
                                                />
                                            </div>
                                        </Card>
                                    ))}

                                    {myGundams.length === 0 && (
                                        <div className="col-span-2 text-center py-8 bg-gray-100 rounded-lg">
                                            <p className="text-gray-500">[...] chưa thêm Gundam nào để trao đổi</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-between">
                                    <Button onClick={() => handleTabChange('1')}>
                                        Quay lại
                                    </Button>
                                    <Button
                                        className='bg-blue-500'
                                        type="primary"
                                        onClick={handleSubmit}
                                        loading={isSubmitting}
                                        disabled={!selectedGundam}>
                                        Gửi đề xuất trao đổi
                                    </Button>
                                </div>
                            </div>
                        ),
                    },
                ]}
            />
        </Modal>
    );
}