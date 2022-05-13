import axiosClient from "./axiosClient";
import * as PATH_URL from "./../constants/apiUrl";

const messageApi = {
  postMessage: (data) => {
    return axiosClient.post(PATH_URL.NEW_MESSAGE, data);
  },
};

export default messageApi;
