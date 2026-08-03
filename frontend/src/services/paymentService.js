import api from './api';


export const paymentService = {

  createOrder: async (noteId) => {
    const response = await api.post(`/order/create/${noteId}`, {});
    return response.data;
  },

  paymentCallback: async (paymentData) => {
    const response = await api.post('/purchase/callback', paymentData, {});
    return response.data;
  },

  checkOrderStatus: async (noteId) => {
    const response = await api.get(`/order/check/${noteId}`);
    return response.data;
  }
};