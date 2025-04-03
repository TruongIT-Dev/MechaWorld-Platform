import { useState } from 'react';

export default function ExchangeDetail() {
    // Giả lập dữ liệu để hiển thị UI
    const [viewMode, setViewMode] = useState('requester'); // 'requester' hoặc 'receiver'
    const [requests, setRequests] = useState([
        {
            id: 1,
            requesterName: 'GundamFan01',
            requesterAvatar: '/api/placeholder/40/40',
            receiverName: 'MechaCollector',
            receiverAvatar: '/api/placeholder/40/40',
            status: 'pending', // pending, accepted, rejected
            date: '02/04/2025',
            itemsOffered: [
                { id: 101, name: 'Gundam RX-78-2', image: '/api/placeholder/80/80', condition: 'Mới' }
            ],
            itemsRequested: [
                { id: 201, name: 'Wing Gundam Zero', image: '/api/placeholder/80/80', condition: 'Chưa mở hộp' }
            ]
        },
        {
            id: 2,
            requesterName: 'GundamMaster',
            requesterAvatar: '/api/placeholder/40/40',
            receiverName: 'MechaCollector',
            receiverAvatar: '/api/placeholder/40/40',
            status: 'pending',
            date: '01/04/2025',
            itemsOffered: [
                { id: 301, name: 'Gundam Exia', image: '/api/placeholder/80/80', condition: 'Mới' }
            ],
            itemsRequested: [
                { id: 401, name: 'Gundam Barbatos', image: '/api/placeholder/80/80', condition: 'Mới' }
            ]
        }
    ]);

    // Xử lý chấp nhận giao dịch
    const handleAccept = (requestId) => {
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status: 'accepted' } : req
        ));
    };

    // Xử lý từ chối giao dịch
    const handleReject = (requestId) => {
        setRequests(requests.map(req =>
            req.id === requestId ? { ...req, status: 'rejected' } : req
        ));
    };

    // UI cho người yêu cầu trao đổi chờ phản hồi
    const RequesterWaitingView = () => {
        const request = requests[0]; // Giả sử đây là request hiện tại

        return (
            <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Yêu cầu trao đổi đang chờ xử lý</h1>

                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <p className="text-blue-700">
                        Yêu cầu trao đổi của bạn đã được gửi đến <span className="font-semibold">{request.receiverName}</span>.
                        Vui lòng chờ phản hồi từ họ.
                    </p>
                </div>

                <div className="flex items-center justify-between mb-6 p-4 border-b">
                    <div className="flex items-center">
                        <img src={request.receiverAvatar} alt="Avatar" className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <h3 className="font-semibold">{request.receiverName}</h3>
                            <p className="text-gray-500 text-sm">Ngày yêu cầu: {request.date}</p>
                        </div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full">
                        Đang chờ phản hồi
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <h3 className="font-semibold mb-4">Vật phẩm bạn đề nghị:</h3>
                        <div className="space-y-4">
                            {request.itemsOffered.map(item => (
                                <div key={item.id} className="flex items-center p-3 border rounded-lg">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                                    <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Tình trạng: {item.condition}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1">
                        <h3 className="font-semibold mb-4">Vật phẩm bạn muốn nhận:</h3>
                        <div className="space-y-4">
                            {request.itemsRequested.map(item => (
                                <div key={item.id} className="flex items-center p-3 border rounded-lg">
                                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover mr-4" />
                                    <div>
                                        <h4 className="font-medium">{item.name}</h4>
                                        <p className="text-sm text-gray-500">Tình trạng: {item.condition}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition">
                        Hủy yêu cầu trao đổi
                    </button>
                </div>
            </div>
        );
    };

    // UI cho người nhận yêu cầu trao đổi
    const ReceiverListView = () => {
        return (
            <div className="max-w-4xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold mb-6">Yêu cầu trao đổi chờ xử lý</h1>

                {requests.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">Bạn không có yêu cầu trao đổi nào đang chờ xử lý</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {requests.map(request => (
                            <div key={request.id} className="border rounded-lg overflow-hidden">
                                <div className="flex items-center justify-between bg-gray-50 p-4 border-b">
                                    <div className="flex items-center">
                                        <img src={request.requesterAvatar} alt="Avatar" className="w-10 h-10 rounded-full mr-3" />
                                        <div>
                                            <h3 className="font-medium">{request.requesterName}</h3>
                                            <p className="text-gray-500 text-sm">Ngày yêu cầu: {request.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAccept(request.id)}
                                            className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition"
                                        >
                                            Chấp nhận
                                        </button>
                                        <button
                                            onClick={() => handleReject(request.id)}
                                            className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                        >
                                            Từ chối
                                        </button>
                                    </div>
                                </div>

                                <div className="p-4">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="flex-1">
                                            <h4 className="font-medium mb-3 text-gray-700">Vật phẩm được đề nghị:</h4>
                                            <div className="space-y-3">
                                                {request.itemsOffered.map(item => (
                                                    <div key={item.id} className="flex items-center p-2 bg-gray-50 rounded">
                                                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover mr-3" />
                                                        <div>
                                                            <h5 className="font-medium">{item.name}</h5>
                                                            <p className="text-xs text-gray-500">Tình trạng: {item.condition}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex-1">
                                            <h4 className="font-medium mb-3 text-gray-700">Đổi lấy vật phẩm của bạn:</h4>
                                            <div className="space-y-3">
                                                {request.itemsRequested.map(item => (
                                                    <div key={item.id} className="flex items-center p-2 bg-gray-50 rounded">
                                                        <img src={item.image} alt={item.name} className="w-14 h-14 object-cover mr-3" />
                                                        <div>
                                                            <h5 className="font-medium">{item.name}</h5>
                                                            <p className="text-xs text-gray-500">Tình trạng: {item.condition}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="container mx-auto mt-32 px-4 py-8 bg-gray-50 min-h-screen">
            {/* Toggle để chuyển đổi giữa các chế độ xem (để demo) */}
            <div className="mb-8 flex justify-center gap-4">
                <button
                    onClick={() => setViewMode('requester')}
                    className={`px-4 py-2 rounded-lg ${viewMode === 'requester' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Xem như người yêu cầu
                </button>
                <button
                    onClick={() => setViewMode('receiver')}
                    className={`px-4 py-2 rounded-lg ${viewMode === 'receiver' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                >
                    Xem như người nhận yêu cầu
                </button>
            </div>

            {/* Hiển thị giao diện dựa trên chế độ đã chọn */}
            {viewMode === 'requester' ? <RequesterWaitingView /> : <ReceiverListView />}
        </div>
    );
}