import axios from '../../utils/axios-custome';


// GET Order History
export const GetListOrderHistory = () => {
    return axios.get(`/orders`);
}

// GET Shop Information by ID
export const GetShopInfoById = () => {
    return axios.get(`/sellers/profile`)
}