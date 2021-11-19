import { Product } from "./../models/index";
import productApi from "../apis/productApi";

const HomeController = {
  getHomePage: async (req, res) => {
    return res.render("homepage.ejs");
  },

  testApi: async () => {
    productApi
      .getProductNew()
      .then((resp) => {
        console.log(resp);
      })
      .catch((err) => {});
  },

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
