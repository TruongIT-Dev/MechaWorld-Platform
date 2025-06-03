import { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, Card, List, Popconfirm } from 'antd';
import { BankOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Option } = Select;

const BankAccountModal = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm();
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [bankAccounts, setBankAccounts] = useState([]);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        if (visible) {
            fetchBanks();
            fetchBankAccounts();
        }
    }, [visible]);

    const fetchBanks = async () => {
        try {
            const response = await fetch('https://api.vietqr.io/v2/banks');
            const data = await response.json();
            setBanks(data.data || []);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách ngân hàng:', error);
            message.error('Không thể tải danh sách ngân hàng');
        }
    };

    const fetchBankAccounts = async () => {
        try {
            // API call to get user's bank accounts
            // const response = await getBankAccounts();
            // setBankAccounts(response.data || []);

            // Mock data for demo
            setBankAccounts([
                {
                    id: 1,
                    account_holder: 'NGUYEN VAN A',
                    account_number: '1234567890',
                    bank_code: 'VCB',
                    bank_name: 'Vietcombank',
                    is_default: true
                }
            ]);
        } catch (error) {
            console.error('Lỗi khi lấy tài khoản ngân hàng:', error);
        }
    };

    const handleAddBankAccount = async (values) => {
        setLoading(true);
        try {
            const selectedBank = banks.find(bank => bank.code === values.bank_code);

            const newAccount = {
                account_holder: values.account_holder.toUpperCase(),
                account_number: values.account_number,
                bank_code: values.bank_code,
                bank_name: selectedBank?.shortName || selectedBank?.name
            };

            // API call to add bank account
            // const response = await addBankAccount(newAccount);

            // Mock success
            setBankAccounts(prev => [...prev, { ...newAccount, id: Date.now() }]);

            form.resetFields();
            setIsAddingNew(false);
            message.success('Thêm tài khoản ngân hàng thành công');
            onSuccess();
        } catch (error) {
            message.error('Không thể thêm tài khoản ngân hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async (accountId) => {
        try {
            // API call to delete bank account
            // await deleteBankAccount(accountId);

            setBankAccounts(prev => prev.filter(acc => acc.id !== accountId));
            message.success('Xóa tài khoản thành công');
        } catch (error) {
            message.error('Không thể xóa tài khoản');
        }
    };

    const handleClose = () => {
        setIsAddingNew(false);
        form.resetFields();
        onCancel();
    };

    return (
        <Modal
            title={
                <div className="flex items-center text-lg">
                    <BankOutlined className="text-blue-500 mr-2" />
                    <span>Quản lý tài khoản ngân hàng</span>
                </div>
            }
            open={visible}
            onCancel={handleClose}
            footer={null}
            width={700}
            className="rounded-lg"
        >
            <div className="space-y-6">
                {/* Existing Bank Accounts */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Tài khoản đã lưu</h3>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setIsAddingNew(true)}
                            className="bg-blue-500 hover:bg-blue-600"
                        >
                            Thêm tài khoản mới
                        </Button>
                    </div>

                    {bankAccounts.length > 0 ? (
                        <List
                            dataSource={bankAccounts}
                            renderItem={(account) => (
                                <List.Item
                                    actions={[
                                        <Popconfirm
                                            title="Bạn có chắc chắn muốn xóa tài khoản này?"
                                            onConfirm={() => handleDeleteAccount(account.id)}
                                            okText="Xóa"
                                            cancelText="Hủy"
                                            okButtonProps={{ danger: true }}
                                        >
                                            <Button
                                                type="text"
                                                icon={<DeleteOutlined />}
                                                danger
                                                size="small"
                                            />
                                        </Popconfirm>
                                    ]}
                                >
                                    <List.Item.Meta
                                        avatar={
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <BankOutlined className="text-blue-600 text-xl" />
                                            </div>
                                        }
                                        title={
                                            <div className="flex items-center space-x-2">
                                                <span className="font-semibold">{account.bank_name}</span>
                                                {account.is_default && (
                                                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                        Mặc định
                                                    </span>
                                                )}
                                            </div>
                                        }
                                        description={
                                            <div className="space-y-1">
                                                <p className="text-gray-700">
                                                    <strong>Chủ tài khoản:</strong> {account.account_holder}
                                                </p>
                                                <p className="text-gray-700">
                                                    <strong>Số tài khoản:</strong>
                                                    <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-sm">
                                                        {account.account_number}
                                                    </code>
                                                </p>
                                            </div>
                                        }
                                    />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Card className="text-center py-8 bg-gray-50">
                            <BankOutlined className="text-4xl text-gray-400 mb-3" />
                            <p className="text-gray-600">Chưa có tài khoản ngân hàng nào</p>
                        </Card>
                    )}
                </div>

                {/* Add New Bank Account Form */}
                {isAddingNew && (
                    <Card title="Thêm tài khoản ngân hàng mới" className="border-blue-200">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleAddBankAccount}
                            className="space-y-4"
                        >
                            <Form.Item
                                label="Tên chủ tài khoản"
                                name="account_holder"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập tên chủ tài khoản' },
                                    { min: 2, message: 'Tên phải có ít nhất 2 ký tự' }
                                ]}
                            >
                                <Input
                                    placeholder="NGUYEN VAN A"
                                    size="large"
                                    className="uppercase"
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase();
                                        form.setFieldsValue({ account_holder: value });
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Số tài khoản"
                                name="account_number"
                                rules={[
                                    { required: true, message: 'Vui lòng nhập số tài khoản' },
                                    { pattern: /^\d{6,20}$/, message: 'Số tài khoản phải từ 6-20 chữ số' }
                                ]}
                            >
                                <Input
                                    placeholder="1234567890"
                                    size="large"
                                    maxLength={20}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Ngân hàng"
                                name="bank_code"
                                rules={[{ required: true, message: 'Vui lòng chọn ngân hàng' }]}
                            >
                                <Select
                                    placeholder="Chọn ngân hàng"
                                    size="large"
                                    showSearch
                                    filterOption={(input, option) =>
                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {banks.map(bank => (
                                        <Option key={bank.code} value={bank.code}>
                                            <div className="flex items-center space-x-2">
                                                <img
                                                    src={bank.logo}
                                                    alt={bank.shortName}
                                                    className="w-6 h-6 object-contain"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <span>{bank.shortName} - {bank.name}</span>
                                            </div>
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>

                            <div className="flex justify-end space-x-3 pt-4">
                                <Button
                                    onClick={() => {
                                        setIsAddingNew(false);
                                        form.resetFields();
                                    }}
                                    size="large"
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    size="large"
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Thêm tài khoản
                                </Button>
                            </div>
                        </Form>
                    </Card>
                )}

                {/* Important Notes */}
                <Card className="bg-yellow-50 border-yellow-200">
                    <h4 className="font-semibold text-yellow-800 mb-2">Lưu ý quan trọng:</h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Tên chủ tài khoản phải khớp với tên đăng ký trên hệ thống</li>
                        <li>• Chỉ hỗ trợ tài khoản ngân hàng Việt Nam</li>
                        <li>• Kiểm tra kỹ thông tin trước khi lưu</li>
                        <li>• Tài khoản đầu tiên sẽ được đặt làm mặc định</li>
                    </ul>
                </Card>
            </div>
        </Modal>
    );
};

export default BankAccountModal;