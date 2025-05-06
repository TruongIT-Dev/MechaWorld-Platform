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
        compensation_amount: offerData.compensationAmount === 0 ? null : offerData.compensationAmount,
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
            require_compensation: offerData.requireCompensation
        })
}

export const getAllUserExchangePost = (status) => {
    if(status === 'open' || status === 'closed') {
        return  axios.get(`/users/me/exchange-posts?status=${status || 'open'}`)
    } else {
        return axios.get(`/users/me/exchange-posts`)
    }
}
export const getAllExchangePost = () => {
    return  axios.get(`/exchange-posts`)
}
export const getAllExchangeOffer = () => {
    return  axios.get(`/users/me/exchange-offers`)
}
export const deleteExchangePost = (id) => {
    return  axios.delete(`/users/me/exchange-posts/${id}`)
}
export const requestNegotiation = (postId, offerId, note) => {
    return axios.patch(`/users/me/exchange-posts/${postId}/offers/${offerId}/negotiate`,{ note:note})
}

export const acceptOffer = (postID,offerID) => {
    return axios.patch(`/users/me/exchange-posts/${postID}/offers/${offerID}/accept`)
}

export const getAllExchangeParticipating = () => {
    return axios.get(`/exchanges`)
}
export const getExchangeDetail = (id) => {
    return axios.get(`/exchanges/${id}`)
}
export const cancelExchange =(exchangeID) => {
    return axios.patch(`/exchanges/${exchangeID}/cancel`)
}
export const addressExchange = (exchangeID,firstID, secondID) => {
    return axios.put(`/exchanges/${exchangeID}/delivery-addresses`,{
        from_address_id: firstID, //địa chỉ gửi
        to_address_id:  secondID,   // địa chỉ nhận
    })
}
export const payDeliveryfee =(exchangeID, deliverryData) => {
    return axios.post(`/exchanges/${exchangeID}/pay-delivery-fee`, {
        delivery_fee: deliverryData.delivery_fee,
        expected_delivery_time: deliverryData.expected_delivery_time,
        note: deliverryData.note,
    })
}