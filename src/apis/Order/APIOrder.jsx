import axios from '../../utils/axios-custome';






export const confirmOrder = (sellerId,orderId) => {
  return axios.patch(`/sellers/${sellerId}/orders/${orderId}/confirm`, {}, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}
export const packagingOrder = (sellerId,orderId,packagingData) => {
    return axios.patch(`/sellers/${sellerId}/orders/${orderId}/package`, packagingData, {
        headers: {
        "Content-Type": "multipart/form-data",
        },
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

export const receivedOrder = (orderId) => {
  return axios.patch(`/orders/${orderId}/received`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}