import { Product } from "./../models/index";
import productApi from "../apis/productApi";

const HomeController = {
  getHomePage: async (req, res) => {
    return res.render("homepage.ejs");
  },

  testApi: () => {
    const test = [
      {
        type: "web_url",
        title: "Xem chi tiết",
        url: "https://www.facebook.com/",
        webview_height_ratio: "full",
      },
    ];

    productApi
      .getProductNew()
      .then((res) => {
        const products = res
          .filter((product, key) => key <= 10)
          .map((product, key) => {
            const { title, price, image } = product;
            const newProduct = {
              title: title,
              subtitle: price,
              image_url: image,
              buttons: test,
            };

            return newProduct;
          });

        console.log("product: ", products);
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
