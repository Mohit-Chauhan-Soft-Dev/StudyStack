import api from './api';

export const noteService = {
  getAllNotes: async () => {
    const response = await api.get('/notes');
    return response;
  },

  getNoteById: async (id) => {
    const response = await api.get(`/notes/${id}`);
    return response.data;
  },

  uploadNote: async (formData) => {
    const response = await api.post('/notes/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};