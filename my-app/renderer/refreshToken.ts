import axios from "axios";
import { useRouter } from 'next/router';

/**
 * Функция для обновления токена
 * 
 * @param {function} navigate - Функция для перехода на другую страницу
 * 
 * @returns {Promise<string | null>} - Promise, который выполняется с новым токеном
 *                                     или null, если обновление токена не удалось
 */
export const refreshToken = async () => {
    try {
        // Отправляем запрос на обновление токена
        const response = await axios.post('https://192.168.0.152:4200/api/refresh-token', null, { withCredentials: true });

        // Если запрос выполнен успешно, возвращаем новый токен
        return response.data.accessToken;
    } catch (error) {
        // Если возникла ошибка, проверяем ее код
        if (error.response?.status === 401) {
            // Если код ошибки 401 (Unauthorized), сохраняем информацию о том,
            // что пользователь не авторизован, и перенаправляем на страницу входа
            const router = useRouter();
            router.push('/LoginPage/LoginPage');
        } else {
            // Если код ошибки не 401, выводим сообщение об ошибке
            console.error('Error refreshing token:', error);
        }
        // Возвращаем null, если обновление токена не удалось
        return null;
    }
};

/**
 * Функция для выполнения запросов с повторной попыткой при 401 ошибке
 * 
 * @param {string} url - URL для запроса
 * @param {string} method - Метод запроса (GET, POST, PUT, DELETE)
 * @param {object} data - Данные для отправки в теле запроса
 * @param {function} navigate - Функция для перехода на другую страницу
 * 
 * @returns {Promise<object>} - Promise, который выполняется с данными
 *                             из ответа сервера
 */
export const fetchWithRetry = async (url, method, data, navigate) => {
    try {
        // Выполняем запрос
        const response = await axios({ method, url, data, withCredentials: true });

        // Если запрос выполнен успешно, возвращаем ответ сервера
        return response.data;
    } catch (error) {
        // Если возникла ошибка, проверяем ее код
        if (error.response && error.response.status === 401) {
            // Если код ошибки 401 (Unauthorized), пытаемся обновить токен
            const tokenRefreshed = await refreshToken();

            if (tokenRefreshed) {
                // Если обновление токена прошло успешно, повторяем запрос
                const response = await axios({ method, url, data, withCredentials: true });
                const router = useRouter();
                router.push(navigate);
                return response.data;
            } else {
                // Если обновление токена не прошло успешно, выбрасываем ошибку
                throw new Error('Token refresh failed');
            }
        } else {
            // Если код ошибки не 401, выбрасываем ошибку
            throw error;
        }
    }
};