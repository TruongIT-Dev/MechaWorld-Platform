import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************

// 1. Retrieves a list of all available Gundam model grades
export const GetGrades = () => {
    return axios.get('/grades')
}

export const GetGundamByGrade = (grade) => {
    return axios.get(`/gundams?grade=${grade}`)
}

// 2. Retrieves a list of selling Gundams, optionally filtered by grade
export const GetGundams = () => {
    return axios.get('/gundams?status=published')
}

export const GetGundamsAuction = () => {
    return axios.get('/gundams?status=auctioning')
}

// 3. Retrieves detailed information about a specific Gundam model


// 4. Retrieves a specific Gundam model by its unique slug
export const GetGundamDetailBySlug = (slug) => {
    return axios.get(`/gundams/by-slug/${slug}`);
}

// 5. Retrieves detailed information about a specific Gundam model

// 6. Hard delete a Gundam model by its ID

// 7. Update the basic information of a Gundam model

// 8. Update the accessories of a Gundam model

// 9. Add secondary images to a Gundam model

// 10. Delete a secondary image from a Gundam model

// 11. Update the primary image of a Gundam model



