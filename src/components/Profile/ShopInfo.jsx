import { Card } from 'antd';
import { ShopOutlined, AppstoreAddOutlined } from '@ant-design/icons';

export default function ShopInfo() {
    return (
        <>
            {/* Đã làm Người bán */}
            <Card className="p-4 rounded-2xl shadow-md border border-blue-400 bg-blue-50" >
                <div className="flex items-center space-x-4 mb-4">
                    <ShopOutlined className="text-xl text-blue-500" />
                    <h2 className="text-sm font-semibold text-blue-700">Gundam Master</h2>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <AppstoreAddOutlined className="text-lg text-green-500" />
                        <span className='text-sm'>Số lượt đăng bán còn lại: <strong>3</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className='text-sm'>Số lượt tham gia đấu giá còn lại: <strong>1</strong></span>
                    </div>
                </div>
            </Card >
        </>
    );
}
