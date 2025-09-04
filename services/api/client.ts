import axios from 'axios';
import Config from 'react-native-config';
import { setupInterceptors } from './interceptors';

const client = axios.create({
  baseURL: Config.API_BASE_URL || 'http://192.168.0.2:7700/v1/api',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach interceptors
setupInterceptors(client);

export default client;
