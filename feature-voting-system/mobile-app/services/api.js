import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

let sessionCookie = null;

export const setSessionCookie = (cookie) => {
  sessionCookie = cookie;
  if (cookie) {
    api.defaults.headers.common['Cookie'] = cookie;
  } else {
    delete api.defaults.headers.common['Cookie'];
  }
};

export const authAPI = {
  login: async (username) => {
    try {
      const response = await api.post('/login', { username });
      const setCookieHeader = response.headers['set-cookie'];
      if (setCookieHeader) {
        const cookie = setCookieHeader[0];
        setSessionCookie(cookie);
      }
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },
};

export const featuresAPI = {
  getAll: async () => {
    try {
      const response = await api.get('/features');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to fetch features');
    }
  },

  create: async (title, description) => {
    try {
      const response = await api.post('/features', { title, description });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to create feature');
    }
  },

  vote: async (featureId) => {
    try {
      const response = await api.post(`/features/${featureId}/vote`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to vote');
    }
  },

  removeVote: async (featureId) => {
    try {
      const response = await api.delete(`/features/${featureId}/vote`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Failed to remove vote');
    }
  },
};

export const userVotesAPI = {
  getUserVotes: async (userId) => {
    try {
      const features = await featuresAPI.getAll();
      const userVotes = new Set();

      for (const feature of features) {
        try {
          await api.post(`/features/${feature.id}/vote`);
          await api.delete(`/features/${feature.id}/vote`);
        } catch (error) {
          if (error.response?.status === 409) {
            userVotes.add(feature.id);
            await api.delete(`/features/${feature.id}/vote`);
            await api.post(`/features/${feature.id}/vote`);
          }
        }
      }

      return userVotes;
    } catch (error) {
      return new Set();
    }
  },
};