import AsyncStorage from '@react-native-async-storage/async-storage';
import { AxiosInstance } from 'axios';

export const setupInterceptors = (client: AxiosInstance) => {
  // Request Interceptor
  client.interceptors.request.use(
    async (config) => {
      // Add Authorization token
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.warn('Unauthorized, redirecting to login...');
      }
      return Promise.reject(error);
    }
  );
};
