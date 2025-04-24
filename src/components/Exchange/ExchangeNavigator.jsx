import { Avatar, Button, Layout, message, Modal } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PostModal from './PostModal';

const { Content } = Layout;

const navItems = [
    { label: 'Các bài viết trao đổi', path: '/exchange/list' },
    { label: 'Quản lý bài viết của bạn', path: '/exchange/history' },
    { label: 'Các cuộc trao đổi của bạn', path: '/exchange/manage' },
];

export default function ExchangeNavigator() {

    const [isModalOpen, setIsModalOpen] = useState(false);

    // Open modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Close modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Handle successful post submission
    const handlePostSuccess = (postData) => {
        console.log("Post created successfully:", postData);
        closeModal();

        // Show success message
        message.success("Đăng bài trao đổi Gundam thành công!");
    };

    return (
        <Content className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
            <Avatar size={64} icon={<UserOutlined />} />
            <h2 className="mt-2 text-lg font-semibold">Nguyễn Trường</h2>

            <Button
                className="mt-3 w-full bg-blue-500"
                onClick={openModal}
                type="primary"
            >
                + Đăng bài viết
            </Button>

            <nav className="mt-4 hidden md:block w-full">
                <ul className="text-gray-700 space-y-2">
                    {navItems.map(({ label, path }) => (
                        <li key={path}>
                            <NavLink
                                to={path}
                                className={({ isActive }) =>
                                    `block p-2 rounded cursor-pointer ${isActive ? 'bg-blue-100 text-blue-600 font-medium' : 'hover:bg-gray-100'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            <Button icon={<MenuOutlined />} className="mt-4 w-full md:hidden">
                Menu
            </Button>
            <Modal
                title={
                    <div className="flex items-center text-blue-800">
                        <span><span className="text-red-600">GUNDAM</span> EXCHANGE</span>
                    </div>
                }
                open={isModalOpen}
                onCancel={closeModal}
                width={700}
                footer={null}
                destroyOnClose
            >
                <PostModal
                    onClose={closeModal}
                    onSuccess={handlePostSuccess}
                />
            </Modal>
        </Content>
    );
}
