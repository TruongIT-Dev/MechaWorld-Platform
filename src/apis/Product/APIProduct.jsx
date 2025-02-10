import axios from '../../utils/axios-custome';

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