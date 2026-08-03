import api from './api';

export const statsService = {

  getUsersCount: async () => {
    const response = await api.get('/public/users/count');
    console.log(response.data);
    return response.data;
  },

  getNotesCount: async () => {
    const response = await api.get('/public/notes/count');
    console.log(response.data);
    return response.data;
  }

};
