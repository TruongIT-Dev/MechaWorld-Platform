import axios from 'axios';

// const baseURL = 'http://localhost:8080/v1/';
const baseURL = '/v1';
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Tạo instance axios với baseURL và header chứa token
const instance = axios.create({

    baseURL: baseURL,

    // `timeout` để chỉ định số mili - giây trước khi request hết giờ.
    // Nếu thời gian request lâu hơn `timeout` thì request sẽ được ngưng giữa chừng.
    timeout: 1000,

    // `withCredentials` biểu thị liệu việc tạo ra request cross-site `Access-Control`
    // thì có cần sử dụng credential hay không.
    withCredentials: true,
});

// Lưu Token tại LocalStorage. Dự kiến sẽ đổi qua Cookie sau
instance.defaults.headers.common = { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }

// Thêm một bộ đón chặn request
axios.interceptors.request.use(function (config) {
    // Làm gì đó trước khi request dược gửi đi
    return config;
}, function (error) {
    // Làm gì đó với lỗi request
    return Promise.reject(error);
});

// Thêm một bộ đón chặn response
axios.interceptors.response.use(function (response) {
    // Bất kì mã trạng thái nào nằm trong tầm 2xx đều khiến hàm này được trigger
    // Làm gì đó với dữ liệu response
    return response;
}, function (error) {
    // Bất kì mã trạng thái nào lọt ra ngoài tầm 2xx đều khiến hàm này được trigger\
    // Làm gì đó với lỗi response
    return Promise.reject(error);
});


export default instance;
