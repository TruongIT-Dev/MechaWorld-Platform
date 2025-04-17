import { Button, Layout, Modal } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { ExclamationCircleOutlined } from "@ant-design/icons";

import Navbar from '../layouts/Navbar';
import Footer from '../layouts/Footer';

import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

const { Content } = Layout;

const UserLayout = () => {

    const [isPhoneNumberExisted, setIsPhoneNumberExisted] = useState(false);

    const userInfo = useSelector((state) => state.auth.user);
    const navigate = useNavigate();

    // console.log("userInfo:", userInfo);

    useEffect(() => {
        if (userInfo && !userInfo?.phone_number) {
            setIsPhoneNumberExisted(true);
        }
    }, [userInfo]);

    const handleCancel = () => {
        setIsPhoneNumberExisted(false);
    };

    const handleGoVerify = () => {
        setIsPhoneNumberExisted(false);
        navigate("/member/profile/account");
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
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


            <Modal
                title="YÊU CẦU XÁC THỰC SỐ ĐIỆN THOẠI!"
                open={isPhoneNumberExisted}
                closable={false}
                centered
                footer={[
                    <Button key="later" onClick={handleCancel}>
                        Để đăng ký sau
                    </Button>,
                    <Button key="verify" type="primary" danger onClick={handleGoVerify}>
                        Đi làm ngay!
                    </Button>,
                ]}
            >
                <div className='flex justify-center items-center'>
                    <div className="flex flex-col justify-center items-center text-center">
                        <ExclamationCircleOutlined className="text-yellow-500 text-4xl mb-4" />
                        <p className="text-base font-medium">
                            Tài khoản chưa Đăng Ký <span className="text-red-500 font-semibold">Số điện thoại</span>
                        </p>
                        <p className='text-base font-medium'> Bạn cần phải có Số điện thoại để có thể giao dịch GUNDAM.</p>
                    </div>
                </div>
            </Modal>
        </div>

    )
}
export default UserLayout