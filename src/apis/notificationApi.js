import axiosClient from "./axiosClient";
import * as PATH_URL from "./../constants/apiUrl";

const notificationApi = {
  getToken: (data) => {
    return axiosClient.post(PATH_URL.GET_TOKEN, data);
  },
  getAllToken: () => {
    return axiosClient.post(PATH_URL.ALL_TOKEN);
  },
};

export default notificationApi;
