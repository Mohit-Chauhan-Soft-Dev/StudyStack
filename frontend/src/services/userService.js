import api from './api';

export const userService = {
  getUserByEmail: async (email) => {
    const response = await api.get(`/users?email=${email}`);
    // console.log(response.data);
    return response.data;
  }
};  