import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

export const viewExchangePost = () => {
    return axios.get('/exchange-posts') 
}


export const createExchangePost = (postData) => {
    const accessToken = Cookies.get('access_token');
    return axios.post(`/users/me/exchange-posts`, postData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${accessToken}`
        },
    });
}
export const createExchangeOffer = (offerData) => {
    return axios.post('/users/me/exchange-offers',{
        compensation_amount: offerData.compensationAmount,
        exchange_post_id:offerData.postID,
        offerer_gundam_id: offerData.offerer_gundam_id,
        payer_id: offerData.compensationID,
        poster_gundam_id: offerData.poster_gundam_id,
        note: offerData.note
    })
}

export const updateExchangeOffer = (offerID,offerData) => {
    return axios.patch(`/users/me/exchange-offers/${offerID}`,
        {
            compensation_amount: offerData.compensationAmount,
            note: offerData.note,
            payer_id: offerData.id,
            require_compensation: true
        })
}

export const getAllUserExchangePost = (status) => {
    return  axios.get(`/users/me/exchange-posts?status=${status || 'open'}`)
}
export const getAllExchangePost = () => {
    return  axios.get(`/exchange-posts`)
}
export const deleteExchangePost = (id) => {
    return  axios.delete(`/users/me/exchange-posts/${id}`)
}
export const requestNegotiation = (postId, offerId, note) => {
    return axios.patch(`/users/me/exchange-posts/${postId}/offers/${offerId}/negotiate`,{ note:note})
}
export const updateOffer = () => {
    return axios.patch(`/user`)
}
