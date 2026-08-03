import api from './api';

export const contactService = {

  sendMessage: async (form) => {
    const response = await api.post('/public/contact', form);
    return response.data;
  }
};
