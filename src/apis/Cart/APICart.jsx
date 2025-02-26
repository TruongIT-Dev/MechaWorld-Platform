import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');

console.log(`Bearer ${token}`)

export const GetCart = () => {
    return axios.get('/cart/items');
}



export const DeleteCart = (id) => {
    return axios.delete(`/cart/items/${id}`);
}