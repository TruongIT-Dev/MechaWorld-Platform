import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';
import { normalizeDeliveryTime } from '../../components/Aution/User/dateFormat';

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


// ************ GET - POST - PUT - PATCH - DELETE **************

// ************ SELLER **************

// GET List auction requests of a seller
export const GetListAuctionRequests = (sellerID) => {
    return axios.get(`/sellers/${sellerID}/auction-requests`);
}

// POST Create a new auction request by seller
export const CreateAuctionRequest = (sellerID, requestData) => {
    return axios.post(`/sellers/${sellerID}/auction-requests`, {
        bid_increment: requestData.bid_increment,
        buy_now_price: requestData.buy_now_price,
        end_time: requestData.end_time,
        gundam_id: requestData.gundam_id,
        start_time: requestData.start_time,
        starting_price: requestData.starting_price
    });
};

// DELETE Delete an auction request by seller
export const DeleteAuctionRequest = (sellerID, requestID) => {
    return axios.delete(`/sellers/${sellerID}/auction-requests/${requestID}`);
}

// ************ USER **************

export const GetListAuction = () => {
    return axios.get(`/auctions`);
}

export const GetListAuctionDetial = (auctionID) => {
    return axios.get(`/auctions/${auctionID}`);
}

// GET List user participated auctions
export const GetUserParticipatedAuctions = () => {
    return axios.get(`/users/me/auctions`);
}

// GET List user bids
export const GetUserBids = () => {
    return axios.get(`/users/me/auctions/bids`);
}

// POST Place a bid in an auction
export const PlaceBid = (auctionID, bidAmount) => {
    return axios.post(`/users/me/auctions/${auctionID}/bids`, {
        amount: bidAmount
    });
}

// POST Participate in an auction
export const ParticipateInAuction = (auctionID) => {
    return axios.post(`/users/me/auctions/${auctionID}/participate`);
}

// POST Pay for winning auction bid


/**
 * Thanh toán cho phiên đấu giá thắng
 * @param {string} auctionID - ID phiên đấu giá
 * @param {object} paymentData - Dữ liệu thanh toán
 * @returns {Promise} Promise từ axios
 */
export const PayForWinningBid = (auctionID, paymentData) => {
  // Chuẩn hóa thời gian giao hàng dự kiến
  const payload = {
    ...paymentData,
    expected_delivery_time: normalizeDeliveryTime(paymentData.expected_delivery_time)
  };

  console.log('Payment payload:', payload); // Debug log

  return axios.post(`/users/me/auctions/${auctionID}/payment`, payload, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
  });
};
