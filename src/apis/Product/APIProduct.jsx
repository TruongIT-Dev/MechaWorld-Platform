import axios from '../../utils/axios-custome';
import Cookies from 'js-cookie';
// list tất cả Gundams các grades
export const GetGundams = () => {
    return axios.get('/gundams')
}

export const GetGundamByGrade = (grade) => {
    return axios.get(`/gundams?grade=${grade}`)
}

export const GetGrades = () => {
    return axios.get('/grades')
}
export const  PostGundam = (id, gundamData) => {
    const accessToken = Cookies.get('access_token');
    console.log(accessToken);
    return axios.post(`/users/${id}/gundams`, gundamData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${accessToken}`
        },
      });
}