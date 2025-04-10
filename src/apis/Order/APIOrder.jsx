import axios from '../../utils/axios-custome';






export const confirmOrder = (sellerId,orderId) => {
  return axios.patch(`/sellers/${sellerId}/orders/${orderId}/confirm`, {}, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}
export const packagingOrder = (sellerId,orderId,packaging_images) => {
    return axios.patch(`/sellers/${sellerId}/orders/${orderId}/packaging`, {packaging_images}, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
    });
}


export const getOrder = (orderId) => {
  return axios.get(`/sellers/${orderId}/orders`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}