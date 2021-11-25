require("dotenv").config();

export const BASE_URL_SERVER = process.env.BASE_URL_SERVER;
export const BASE_URL_CLIENT = process.env.BASE_URL_CLIENT;
export const BASE_API_SERVER = BASE_URL_SERVER + "api/";

export const GET_PRODUCT = "product/";
export const PRODUCT_NEW = "product/new";
export const PRODUCT_FEATHER = "product/feather";
export const NEW_MESSAGE = "message/new-message";
