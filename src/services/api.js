import axios from "axios";
import { getToken } from "@/utils/storageUtils";

// TODO: not using proxy temporarily
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
// const API_BASE_URL = "http://localhost:3000";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const apiConfig = {
  baseURL: API_BASE_URL,
};

const interceptorHandlers = [
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
];

export const api = axios.create(apiConfig); // for JSON type
export const customReponseTypeApi = axios.create(apiConfig); // for other types

// Add request interceptor
api.interceptors.request.use(...interceptorHandlers);
customReponseTypeApi.interceptors.request.use(...interceptorHandlers);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    const { data } = response;

    // format errorCode
    if (!data.success) {
      const { detail, error_code: errorCode, ...rest } = data.error;

      return {
        ...data,
        error: {
          detail,
          errorCode,
          ...rest,
        },
      };
    }

    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
