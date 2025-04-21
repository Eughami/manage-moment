import {
  AUTH_TOKEN,
  PUBLIC_REQUEST_KEY,
  TOKEN_PAYLOAD_KEY,
} from '@/constants/auth';
import { logoutExternally } from '@/contexts/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 60000,
});

service.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(AUTH_TOKEN);

    if (token && !config.headers[PUBLIC_REQUEST_KEY])
      config.headers[TOKEN_PAYLOAD_KEY] = `Bearer ${token}`;

    return config;
  },
  (error) => {
    toast.error('Error');
    Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response) => response,
  (error) => {
    let message = '';
    // request happened and server responded
    if (error.response) {
      const errMsg = error.response.data;
      message = errMsg?.message || errMsg.error.toString();

      if (error.response.status === 401 || error.response.status === 403) {
        // log out if this not a login request
        if (!error.response.config.url.includes('/auth')) {
          logoutExternally();
        }
      }

      toast.error(message);
      return Promise.reject(error.response.data);
    }

    //request happened and server did not respond or request triggered an error
    toast.error(error.message);
    return Promise.reject(error);
  }
);

export default service;
