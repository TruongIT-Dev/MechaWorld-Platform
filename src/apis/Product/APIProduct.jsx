import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';
// list tất cả Gundams các grades
export const GetGundams = () => {
    return axios.get('/gundams?status=published')
}

export const GetGundamByGrade = (grade) => {
    return axios.get(`/gundams?grade=${grade}`)
}

export const GetGrades = () => {
    return axios.get('/grades')
}
export const  PostGundam = (id, gundamData) => {
    const accessToken = Cookies.get('access_token');
    // console.log(accessToken);
    return axios.post(`/sellers/${id}/gundams`, gundamData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${accessToken}`
        },
      });
}
export const GetGundamByID = (id, gundamName) => {
    return axios.get(`/sellers/${id}/gundams?name=${gundamName}`)
}
export  const SellingGundam = (id, gundamId) => {
    return axios.patch(`/sellers/${id}/gundams/${gundamId}/publish`);
}
export  const RestoreGundam = (id, gundamId) => {
    return axios.patch(`/sellers/${id}/gundams/${gundamId}/unpublish`);
}
export const GetSellerStatus =  (id) => {
    return axios.get(`/sellers/${id}/subscriptions/active`);
}
export const GetSellerData =  (id) => {
    return axios.get(`/sellers/${id}`);
}
