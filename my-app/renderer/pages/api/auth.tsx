import axios from 'axios';

export const login = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:4200/api/auth/login', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const pisya = async () => {
  try {
    const response = await axios.post('http://localhost:4200/api/auth/pisya', {}, {
      withCredentials: true, // Это включает передачу куки
    });
    console.log(response);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const register = async (username, password) => {
  try {
    const response = await axios.post('http://localhost:4200/api/auth/register', {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refreshAccessToken = async () => {
    try {
      const response = await axios.post('http://localhost:4200/api/auth/refresh', {}, {
        withCredentials: true, // Убедитесь, что куки включены в запрос
      });
      return response.data.access_token;
    } catch (error) {
      throw error;
    }
  };
  
  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const access_token = await refreshAccessToken();
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        return axios(originalRequest);
      }
      return Promise.reject(error);
    }
  );