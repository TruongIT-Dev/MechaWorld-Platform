import { Avatar, Button, Layout, Modal } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';
import PostModal from './PostModal';

const { Content } = Layout;

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
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Quản lý bài viết của tôi</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Quản lý trao đổi</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Lịch sử trao đổi</li>
                </ul>
            </nav>

            <Button icon={<MenuOutlined />} className="mt-4 w-full md:hidden">
                Menu
            </Button>


            {/* Modal Post Bài viết */}
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
