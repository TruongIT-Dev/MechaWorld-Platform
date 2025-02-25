import axios from '../../utils/axios-custome';

export const GetGundamDetailBySlug = (slug) => {
    return axios.get(`/gundams/${slug}`);
}

export const GetShopInfoById = (id) => {
    return axios.get(`/sellers/${id}`)
}

export const AddToCart = (id) => {
    return axios.post(`/cart/items`, {
        gundam_id: id,
    })
}