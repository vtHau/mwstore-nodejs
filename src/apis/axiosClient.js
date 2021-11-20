import axios from "axios";
import queryString from "query-string";
import * as PATH_URL from "../constants/apiUrl";

const axiosClient = axios.create({
  baseURL: PATH_URL.BASE_API_SERVER,
  headers: {
    accept: "application/json",
    "content-type": "application/json",
  },
  paramsSerializer: (params) => queryString.stringify(params),
});

axiosClient.interceptors.request.use(async (config) => {
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    throw error;
  }
);

export default axiosClient;
