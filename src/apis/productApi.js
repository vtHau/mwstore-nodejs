import axiosClient from "./axiosClient";
import * as PATH_URL from "./../constants/apiUrl";

const productApi = {
  test: () => {
    return axiosClient.get(
      "https://api.apify.com/v2/key-value-stores/EJ3Ppyr2t73Ifit64/records/LATEST"
    );
  },
  getProductNew: () => {
    return axiosClient.get(PATH_URL.PRODUCT_NEW);
  },
  getProductFeather: () => {
    return axiosClient.get(PATH_URL.PRODUCT_FEATHER);
  },
};

export default productApi;
