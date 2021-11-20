import { Product } from "./../models/index";
import productApi from "../apis/productApi";
import request from "request";
const IMAGE_STARTED =
  "https://luv.vn/wp-content/uploads/2021/08/hinh-anh-gai-xinh-52.jpg";

const HomeController = {
  getHomePage: async (req, res) => {
    return res.render("homepage.ejs");
  },

  testApi: () => {},

  testDB: async (req, res) => {
    try {
      const products = await Product.findAll();
      console.log(products);
      return res.render("testdb.ejs", {
        products: JSON.stringify(products),
      });
    } catch (e) {
      console.log(e);
    }
  },
};

export default HomeController;
