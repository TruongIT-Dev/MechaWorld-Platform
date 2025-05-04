export const hasDeliveryFee = (state, userID, exchangeID) => {
  return !!state.exchange?.deliveryFees?.[userID]?.[exchangeID]?.deliveryFee?.total;
};
export const selectDeliveryFee = (state, userID, exchangeID) => {
  return state.exchange?.deliveryFees?.[userID]?.[exchangeID]?.deliveryFee?.total ?? null;
};

  