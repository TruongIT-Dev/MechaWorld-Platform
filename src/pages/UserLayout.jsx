import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';

import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

const { Content } = Layout;

const UserLayout = () => {

    return (
        <Layout>
            <Navbar />

            {/* CONTENT */}
            <Content>
                <div className='user-layout'>
                    <Outlet></Outlet>
                </div>
            </Content>

            {/* FOOTER */}
            <Footer />
        </Layout>
    )
}
export default UserLayout