import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************


// Get All Gundam Grades
export const GetGrades = () => {
    return axios.get('/grades')
}


// Get All Gundams By status
export const GetGundams = () => {
    return axios.get('/gundams?status=published')
}


// Get All Gundams By Grade
export const GetGundamByGrade = (grade) => {
    return axios.get(`/gundams?grade=${grade}`)
}


// GET Specific Gundam By slug
export const GetGundamDetailBySlug = (slug) => {
    return axios.get(`/gundams/by-slug/${slug}`);
}
