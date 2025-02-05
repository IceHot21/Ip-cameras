import { fetchWithRetry } from '../../refreshToken';

// Создайте экземпляр Axios с базовым URL и настройками по умолчанию
// const api = axios.create({
//   baseURL: 'http://localhost:4200',
//   withCredentials: true, // Важно для отправки cookies
// });

// Пример функции для входа
export const login = async (username, password) => {
  try {
    const response = await fetchWithRetry('https://192.168.0.150:4200/api/login', 'POST', {
      name: username,
      password: password,
    }, '/Home/Home');
    console.log(response); // Проверьте ответ сервера
    return response;
  } catch (error) {
    console.error('Login failed', error);
    throw error;
  }
};

export const register = async (username, password, ROLES) => {
  try {
    const response = await fetchWithRetry('https://localhost:4200/users/register', 'POST', {

        "name":username,
        "password": password,
        "roles": [
          ROLES
        ]
    }, '/Home/Home');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// const refreshAccessToken = async () => {
//     try {
//       const response = await axios.post('https://localhost:4200/api//refresh-token', {}, {
//         withCredentials: true, // Убедитесь, что куки включены в запрос
//       });
//       return response.data.access_token;
//     } catch (error) {
//       throw error;
//     }
//   };
  
//   axios.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//       const originalRequest = error.config;
//       if (error.response.status === 401 && !originalRequest._retry) {
//         originalRequest._retry = true;
//         const access_token = await refreshAccessToken();
//         axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
//         return axios(originalRequest);
//       }
//       return Promise.reject(error);
//     }
//   );