/* eslint-disable react-refresh/only-export-components */
import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

// ************ GET - POST - PUT - PATCH - DELETE **************


// GET Retrieve a user by ID
export const getUser = (id) => {
    return axios.get(`/users/${id}`)
}


// GET Retreive user address
export const getUserAddresses = (id) => {
    return axios.get(`/users/${id}/addresses`)
}


// GET Check user wallet amount
export const checkWallet = (id) => {
    return axios.get(`/users/${id}/wallet`)
}


// GET Gundams of a user by ID
export const GetGundamByID = (id, gundamName) => {
    return axios.get(`/users/${id}/gundams?name=${gundamName}`)
}

// POST Create a new user address
export const postUserAddresses = (id, addressData) => {
    return axios.post(`/users/${id}/addresses`, addressData)
}


// POST Memeber become Seller
export const BecomeSeller = () => {
    return axios.post('/users/become-seller');
}


// POST Create a new Gundam model by user
export const PostGundam = (id, gundamData) => {
    const accessToken = Cookies.get('access_token');
    return axios.post(`/users/${id}/gundams`, gundamData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`
        },
    });
}


// PUT Update user information (fullName) 
export const updateUserData = (id, fullname) => {
    return axios.put(`/users/${id}`, { full_name: fullname })
}


// PUT Update user address
export const updateAddress = (id, addressId, addressData) => {
    return axios.put(`/users/${id}/addresses/${addressId}`, addressData)
}


// PATCH Update usre avatar
export const uploadAvatar = (id, file) => {
    const formData = new FormData();
    formData.append("avatar", file); // Đính kèm file vào FormData

    return axios.patch(`/users/${id}/avatar`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}


// Delete Remove user address
export const deleteAddress = (id, addressID) => {
    return axios.delete(`/users/${id}/addresses/${addressID}`)
}



// GET List all gundams for a specific user


// GET Retrieve a user by phone_number number
