import axios from '../../utils/axios-custome';


// ************ GET - POST - PUT - PATCH - DELETE **************


// GET All Purchased Orders By Users
export const GetListOrderHistory = () => {
  return axios.get(`/orders`);
}


// GET Purchased Order Detail



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


// POST Confirm Order received (By Buyer)
export const ReceivedOrder = (orderId) => {
  return axios.patch(`/orders/${orderId}/received`, {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
}


// PATCH Cancel Order By Buyer



