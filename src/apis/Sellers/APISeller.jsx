import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';


// ************ GET - POST - PUT - PATCH - DELETE **************


// GET LIST ALL SALE ORDERS FOR A SPECIFIC SELLER
export const GetOrder = (orderId) => {
    return axios.get(`/sellers/${orderId}/orders`, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}


// GET Sales Order Detail


// GET SELLER CURRENT ACTIVE SUBSCRIPTION
export const GetSellerStatus = (id) => {
    return axios.get(`/sellers/${id}/subscriptions/active`);
}







// POST ...
// export const PostGundam = (id, gundamData) => {
//     const accessToken = Cookies.get('access_token');
//     return axios.post(`/sellers/${id}/gundams`, gundamData, {
//         headers: {
//             "Content-Type": "multipart/form-data",
//             "Authorization": `Bearer ${accessToken}`
//         },
//     });
// }


// POST SELLER PUBLISH A GUNDAM FOR SALE
export const SellingGundam = (id, gundamId) => {
    return axios.patch(`/sellers/${id}/gundams/${gundamId}/publish`);
}


// POST SELLER UNPUBLISH A GUNDAM
export const RestoreGundam = (id, gundamId) => {
    return axios.patch(`/sellers/${id}/gundams/${gundamId}/unpublish`);
}


// PATCH SELLER CONFIRM AN ORDER
export const ConfirmOrder = (sellerId, orderId) => {
    return axios.patch(`/sellers/${sellerId}/orders/${orderId}/confirm`, {}, {
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
    });
}


// PATCH SELLER PAKAGING AN ORDER
export const PackagingOrder = (sellerId, orderId, packagingData) => {
    return axios.patch(`/sellers/${sellerId}/orders/${orderId}/package`, packagingData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}


// PATCH SELLER CANCEL AN ORDER