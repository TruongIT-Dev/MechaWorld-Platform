import { Layout, Row, Col, Modal } from 'antd';
import UserProfile from './UserProfile';
import RequestList from './RequestList';

export default function Exchange() {
    return (
        <Layout className="bg-gray-100 mt-36 mb-6 mx-40 px-4">
            <div className="container mx-auto">
                <Row gutter={[16, 16]}>
                    {/* Thông tin người dùng */}
                    <Col xs={24} md={6}>
                        <div className="sticky top-16">
                            <UserProfile />
                        </div>
                    </Col>

                    {/* Danh sách yêu cầu */}
                    <Col xs={24} md={18}>
                        <RequestList />
                    </Col>
                </Row>
            </div>
        </Layout>
    );
}
