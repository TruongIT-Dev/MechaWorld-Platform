import axios from '../../utils/axios-custome';

// list tất cả Gundams các grades
export const ListGundams = () => {
    return axios.get('/gundams')
}

export const ListGundamByGrade = (grade) => {
    return axios.get(`/gundams?grade=${grade}`)
}

export const ListGrades = () => {
    return axios.get('/grades')
}