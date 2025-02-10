import axios from '../../utils/axios-custome';

export const GetGundamDetailBySlug = (slug) => {
    return axios.get(`/gundams/${slug}`);
}