import Axios, { AxiosRequestConfig } from 'axios';
import { API_URL } from '../config';

import storage from '../utils/storage';

function authRequestInterceptor(config: AxiosRequestConfig) {
  const token = storage.getToken();
  if (!config.headers) config.headers = {};
  if (token) {
    config.headers.authorization = `${token}`;
  }
  config.headers.Accept = 'application/json';
  return config;
}

export const axios = Axios.create({
  baseURL:
    typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
});

axios.interceptors.request.use(authRequestInterceptor);
axios.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error),
);
