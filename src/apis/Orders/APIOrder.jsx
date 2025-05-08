import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************


// GET All Purchased Orders By Users
export const GetListOrderHistory = () => {
  return axios.get(`/orders`);
}


// GET Purchased Order Detail
export const GetOrderDetail = (id) => {
  return axios.get(`/orders/${id}`)
}


// POST Create New Order
export const CheckoutCart = (checkoutData) => {
  return axios.post('/orders', {
    buyer_address_id: checkoutData.buyer_address_id,
    delivery_fee: checkoutData.delivery_fee,
    expected_delivery_time: checkoutData.expected_delivery_time,
    gundam_ids: checkoutData.gundam_ids,
    items_subtotal: checkoutData.items_subtotal,
    payment_method: checkoutData.payment_method,
    seller_id: checkoutData.seller_id,
    total_amount: checkoutData.total_amount,
    note: checkoutData.note || ''
  }, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}


// POST Confirm Order Delevered (By Buyer)
export const ConfirmOrderDelivered = (orderId) => {
  return axios.patch(`/orders/${orderId}/complete`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}


// PATCH USER PAKAGING AN ORDER
export const PackagingOrder = ( orderId, packagingData) => {
  return axios.patch(`/orders/${orderId}/package`, packagingData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}


// PATCH Cancel Order By Buyer



