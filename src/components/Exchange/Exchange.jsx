// Exchange.tsx
import { Layout, Row, Col } from 'antd';
import UserProfile from './UserProfile';
import { Outlet } from 'react-router-dom';

export default function Exchange() {
    return (
        <Layout className="bg-gray-100 mt-36 mb-6 mx-40 px-4">
            <div className="container mx-auto">
                <Row gutter={[16, 16]}>
                    {/* Sidebar trái */}
                    <Col xs={24} md={6}>
                        <div className="sticky top-16">
                            <UserProfile />
                        </div>
                    </Col>

                    {/* Phần nội dung động bên phải */}
                    <Col xs={24} md={18}>
                        <Outlet />
                    </Col>
                </Row>
            </div>
        </Layout>
    );
}
