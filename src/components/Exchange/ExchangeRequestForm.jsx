import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExchangeRequestForm() {


    const navigate = useNavigate();

    // State cho thông tin sản phẩm của receiver
    const [receiverProduct, setReceiverProduct] = useState({
        id: 201,
        name: 'Wing Gundam Zero',
        image: '/api/placeholder/200/150',
        condition: 'Chưa mở hộp',
        scale: '1/144 HG',
        owner: 'MechaCollector',
        ownerAvatar: '/api/placeholder/40/40',
        description: 'Gundam Wing Zero Custom phiên bản giới hạn, còn nguyên seal.'
    });

    // State cho modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State cho thông tin sản phẩm đang được thêm vào
    const [newProduct, setNewProduct] = useState({
        name: '',
        condition: 'Mới',
        scale: '1/144 HG',
        description: '',
        image: null
    });

    // State cho danh sách sản phẩm của requester
    const [requesterProducts, setRequesterProducts] = useState([]);

    // Xử lý mở modal
    const openModal = () => {
        setIsModalOpen(true);
    };

    // Xử lý đóng modal
    const closeModal = () => {
        setIsModalOpen(false);
    };

    // Xử lý thay đổi thông tin sản phẩm mới
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct({
            ...newProduct,
            [name]: value
        });
    };

    // Xử lý thêm sản phẩm mới
    const handleAddProduct = (e) => {
        e.preventDefault();
        const productWithId = {
            ...newProduct,
            id: Date.now(),
            image: newProduct.image || '/api/placeholder/200/150'
        };
        setRequesterProducts([...requesterProducts, productWithId]);
        setNewProduct({
            name: '',
            condition: 'Mới',
            scale: '1/144 HG',
            description: '',
            image: null
        });
        closeModal();
    };

    // Xử lý upload ảnh
    const handleImageChange = (e) => {
        // Đối với demo, chúng ta sẽ chỉ lưu URL giả
        setNewProduct({
            ...newProduct,
            image: '/api/placeholder/200/150'
        });
    };

    // Xử lý gửi yêu cầu trao đổi
    const handleSubmitExchange = () => {
        alert('Đã gửi yêu cầu trao đổi thành công!');
        // Trong thực tế, sẽ gửi API request ở đây
        navigate('/exchange/detail');
    };

    return (
        <div className="container mx-auto mt-32 px-4 py-8 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6 text-center">Tạo Yêu Cầu Trao Đổi Gundam</h1>

            {/* Layout Flex chia đôi màn hình */}
            <div className="flex flex-col md:flex-row gap-6 max-w-6xl mx-auto">
                {/* Phần bên trái - Sản phẩm của receiver */}
                <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm muốn nhận</h2>
                    <div className="border rounded-lg p-4">
                        <div className="flex flex-col">
                            <div className="mb-4">
                                <img
                                    src={receiverProduct.image}
                                    alt={receiverProduct.name}
                                    className="w-full h-auto object-cover rounded-lg"
                                />
                            </div>
                            <div>
                                <div className="flex items-center mb-3">
                                    <img
                                        src={receiverProduct.ownerAvatar}
                                        alt="Owner avatar"
                                        className="w-8 h-8 rounded-full mr-2"
                                    />
                                    <span className="font-medium">{receiverProduct.owner}</span>
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{receiverProduct.name}</h3>
                                <div className="grid grid-cols-2 gap-2 mb-3">
                                    <div>
                                        <span className="text-gray-600 text-sm">Tình trạng:</span>
                                        <p className="font-medium">{receiverProduct.condition}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600 text-sm">Tỷ lệ:</span>
                                        <p className="font-medium">{receiverProduct.scale}</p>
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="text-gray-600 text-sm">Mô tả:</span>
                                    <p>{receiverProduct.description}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Phần bên phải - Sản phẩm của requester */}
                <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm đề nghị trao đổi</h2>

                    {requesterProducts.length > 0 ? (
                        <div className="space-y-4 mb-4">
                            {requesterProducts.map((product) => (
                                <div key={product.id} className="border rounded-lg p-4">
                                    <div className="flex flex-col">
                                        <div className="mb-3">
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-auto object-cover rounded-lg"
                                            />
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                                        <div className="grid grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <span className="text-gray-600 text-sm">Tình trạng:</span>
                                                <p className="font-medium">{product.condition}</p>
                                            </div>
                                            <div>
                                                <span className="text-gray-600 text-sm">Tỷ lệ:</span>
                                                <p className="font-medium">{product.scale}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600">{product.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}

                    {/* Card để thêm sản phẩm mới */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition"
                        onClick={openModal}
                    >
                        <div className="text-center">
                            <div className="mx-auto bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mb-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="font-medium text-lg mb-1">Thêm Gundam</h3>
                            <p className="text-gray-500 text-sm">Nhấn để thêm sản phẩm trao đổi</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Nút gửi yêu cầu trao đổi */}
            <div className="mt-8 flex justify-center">
                <button
                    onClick={handleSubmitExchange}
                    disabled={requesterProducts.length === 0}
                    className={`px-6 py-3 rounded-lg font-medium ${requesterProducts.length > 0
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        } transition`}
                >
                    {requesterProducts.length > 0
                        ? 'Gửi yêu cầu trao đổi'
                        : 'Vui lòng thêm sản phẩm'}
                </button>
            </div>

            {/* Modal thêm sản phẩm */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-semibold">Thêm Gundam để trao đổi</h3>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleAddProduct}>
                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Tên Gundam *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newProduct.name}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Tình trạng *</label>
                                <select
                                    name="condition"
                                    value={newProduct.condition}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="Mới">Mới</option>
                                    <option value="Chưa mở hộp">Chưa mở hộp</option>
                                    <option value="Đã lắp ráp">Đã lắp ráp</option>
                                    <option value="Đã sơn">Đã sơn</option>
                                    <option value="Cũ">Cũ</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Tỷ lệ</label>
                                <select
                                    name="scale"
                                    value={newProduct.scale}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                >
                                    <option value="1/144 HG">1/144 HG</option>
                                    <option value="1/144 RG">1/144 RG</option>
                                    <option value="1/100 MG">1/100 MG</option>
                                    <option value="1/60 PG">1/60 PG</option>
                                    <option value="SD">SD</option>
                                    <option value="Khác">Khác</option>
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="block text-gray-700 mb-1">Mô tả</label>
                                <textarea
                                    name="description"
                                    value={newProduct.description}
                                    onChange={handleInputChange}
                                    className="w-full border rounded-lg px-3 py-2"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div className="mb-6">
                                <label className="block text-gray-700 mb-1">Hình ảnh</label>
                                <div className="border border-dashed rounded-lg p-4 text-center">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer block">
                                        <div className="mx-auto bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-blue-600">Tải ảnh lên</span>
                                        <p className="text-sm text-gray-500 mt-1">PNG, JPG (Max. 5MB)</p>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 border rounded-lg mr-2 hover:bg-gray-50"
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newProduct.name}
                                    className={`px-4 py-2 rounded-lg ${newProduct.name
                                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        }`}
                                >
                                    Thêm sản phẩm
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}