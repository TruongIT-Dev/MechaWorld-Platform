import axios from '../../utils/axios-custome';


export const verifyOtp = (id,phone,opt) => {
    return axios.post('/otp/verify', {
        user_id: id,
        phone_number: phone,
        otp_code: opt
    }
    // ,{
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // }
);
}
export const getUser = (id) => {
    return axios.get(`/users/${id}`)
}
export const verifyPhone = (phone) => {
    return axios.post('/otp/generate', {
        phone_number: phone
    })
}
export const getUserAddresses = (id) => {
    return axios.get(`/users/${id}/addresses`) 
}
export const postUserAddresses = (id, addressData) => {
    return axios.post(`/users/${id}/addresses`, addressData)
}
export const updateUserData = (id, userData) => {
    return axios.put (`/users/${id}`, userData)
}
export const uploadAvatar = (id, file) => {
    const formData = new FormData();
    formData.append("avatar", file); // Đính kèm file vào FormData

    return axios.patch(`/users/${id}/avatar`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
}