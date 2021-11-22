import { Product } from "./../models/index";

const HomeController = {
  getHomePage: async (req, res) => {
    return res.render("homepage.ejs");
  },

  testApi: async () => {},

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
