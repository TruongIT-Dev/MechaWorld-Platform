import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('access_token');

const axiosInstance = axios.create({
    headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
});

export const GetCart = () => {
    return axiosInstance.get('/cart/items');
}

export const AddToCart = async (gundamId) => {
    try {
        const response = await axios.post('/cart/items', {
            gundam_id: gundamId,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const DeleteCart = (id) => {
    return axiosInstance.delete(`/cart/items/${id}`);
}