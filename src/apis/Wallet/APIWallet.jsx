import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

// Axios request interceptor
axios.interceptors.request.use((config) => {
    const accessToken = Cookies.get('access_token'); // Lấy token từ cookie
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Axios response interceptor để xử lý lỗi 401 (token hết hạn)
axios.interceptors.response.use((response) => {
    return response;
}, async (error) => {
    const originalRequest = error.config;
    if (error?.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Gọi API refresh token để lấy access_token mới
        try {
            const refreshToken = Cookies.get('refresh_token'); // Lấy refresh_token từ cookie
            const response = await axios.post('/auth/refresh', { refreshToken });
            const newAccessToken = response.data.access_token;

            // Lưu access_token mới vào cookie
            Cookies.set('access_token', newAccessToken);

            // Thêm access_token mới vào header và thử lại request
            axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
            return axios(originalRequest);
        } catch (refreshError) {
            // Xử lý lỗi refresh token (ví dụ: đăng xuất người dùng)
            console.error('Refresh token failed:', refreshError);
            return Promise.reject(refreshError);
        }
    }
    return Promise.reject(error);
});


export const AddMoney = async (amount, description, redirectUrl) => {
    try {
        // Kiểm tra các tham số đầu vào
        if (!amount || amount <= 0) {
            throw new Error('Số tiền không hợp lệ');
        }

        // Đảm bảo URL đúng format
        const validRedirectUrl = redirectUrl.startsWith('http') ? redirectUrl : `https://${redirectUrl}`;
        
        const response = await axios.post('/wallet/zalopay/create', { // Sửa từ zalopay sang ralopay
            amount,
            description,
            redirect_url: validRedirectUrl
        }, {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // Thêm timeout
        });

        // Kiểm tra response
        if (!response.data) {
            throw new Error('Không nhận được dữ liệu từ server');
        }

        return response;
    } catch (error) {
        console.error('Chi tiết lỗi:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Lỗi khi tạo đơn hàng');
    }
};

export const GetMoney = async (id) => {
    return axios.get(`users/${id}/wallet/`);
}
