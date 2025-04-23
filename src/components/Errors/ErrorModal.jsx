import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import React from 'react';

const errorMessages = {
    400: {
        'phone_number required': 'Tài khoản chưa đăng ký số điện thoại! <br/> Bạn cần phải có số điện thoại để có thể mua hàng.',
    },
    401: {
        'unauthorized': 'Bạn chưa đăng nhập hoặc phiên đã hết hạn.',
    },
    402: {
        'payment failed': 'Thanh toán không thành công. Vui lòng kiểm tra lại thông tin.',
    },
    422: {
        'insufficient balance': 'Số dư ví không đủ!<br/>Vui lòng nạp thêm để thanh toán.'
    },
    500: {
        'server error': 'Hệ thống đang bận. Vui lòng thử lại sau.',
    },
    default: 'Đã có lỗi xảy ra. Vui lòng thử lại.',
};

const getErrorMessage = (status, errorKey) => {
    const statusErrors = errorMessages[status];
    if (statusErrors) {
        for (const key in statusErrors) {
            if (errorKey?.toLowerCase().includes(key.toLowerCase())) {
                return statusErrors[key];
            }
        }
    }

    return errorMessages.default;
};

// 🧩 Gọi hàm này khi có lỗi từ API để hiển thị modal
export const ShowErrorModal = (status, errorKey) => {
    Modal.error({
        footer: null,
        closable: true,
        title: <div className="text-center text-xl font-semibold text-red-600">Thông báo lỗi</div>,
        icon: null,
        content: (
            <div className="text-center py-4">
                <ExclamationCircleOutlined className="text-5xl text-red-500 mb-4" />
                <div
                    className="text-lg text-gray-700"
                    dangerouslySetInnerHTML={{ __html: getErrorMessage(status, errorKey) }}
                />
            </div>
        ),
    });
};
