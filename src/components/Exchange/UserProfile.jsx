import { Avatar, Button, Layout } from 'antd';
import { UserOutlined, MenuOutlined } from '@ant-design/icons';

const { Content } = Layout;

export default function UserProfile() {
    return (
        <Content className="bg-white p-4 shadow rounded-lg flex flex-col items-center">
            <Avatar size={64} icon={<UserOutlined />} />
            <h2 className="mt-2 text-lg font-semibold">Nguyễn Trường</h2>
            <Button type="primary" className="mt-3 w-full bg-blue-500">+ Đăng bài viết</Button>

            <nav className="mt-4 hidden md:block w-full">
                <ul className="text-gray-700 space-y-2">
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Quản lý bài viết của tôi</li>
                    <li className="p-2 hover:bg-gray-100 cursor-pointer">Lịch sử Trao đổi</li>
                </ul>
            </nav>

            <Button icon={<MenuOutlined />} className="mt-4 w-full md:hidden">
                Menu
            </Button>
        </Content>
    );
}
