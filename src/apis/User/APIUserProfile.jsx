/* eslint-disable react-refresh/only-export-components */
import axios from '../../utils/axios-custome';


export const verifyOtp = (id, phone, opt) => {
    return axios.post('/otp/phone_number/verify', {
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
    return axios.post('/otp/phone_number/generate', {
        phone_number: phone
    })
}
export const getUserAddresses = (id) => {
    return axios.get(`/users/${id}/addresses`)
}
export const postUserAddresses = (id, addressData) => {
    return axios.post(`/users/${id}/addresses`, addressData)
}
export const updateUserData = (id, fullname) => {
    return axios.put(`/users/${id}`, { full_name: fullname })
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
export const updateAddress = (id,addressId, addressData) => {
    return axios.put(`/users/${id}/addresses/${addressId}`, addressData)
}
export const deleteAddress = (id,addressID)  => {
    return axios.delete(`/users/${id}/addresses/${addressID}`)
}
export const BecomeSeller = () => {
    return axios.post('/users/become-seller');
}