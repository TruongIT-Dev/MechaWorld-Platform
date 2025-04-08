import { Avatar, Button, Layout, Modal } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PostModal from './PostModal';

const { Content } = Layout;

const navItems = [
    { label: 'Trang chủ', path: '/exchange/list' },
    { label: 'Bài viết của tôi', path: '/exchange/my-posts' },
    { label: 'Quản lý trao đổi', path: '/exchange/manage' },
    { label: 'Quản lý Gundam Trao đổi', path: '/exchange/manage-gundam' },
    { label: 'Lịch sử trao đổi', path: '/exchange/history' },
];

export default function UserProfile() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <Content className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
            <Avatar size={64} icon={<UserOutlined />} />
            <h2 className="mt-2 text-lg font-semibold">Nguyễn Trường</h2>

            <Button
                className="mt-3 w-full bg-blue-500"
                onClick={() => setIsModalOpen(true)}
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
                title="Đăng bài viết Trao đổi Gundam"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
            >
                <PostModal />
            </Modal>
        </Content>
    );
}
