import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************


// GET Seller Profile by ID
export const GetShopInfoById = (id) => {
    return axios.get(`/sellers/profile?user_id=${id}`)
}


// POST Create seller profile (ShopName)


// PATCH Update seller profile (ShopName)