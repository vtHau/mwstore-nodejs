import { Product } from "./../models/index";
import productApi from "../apis/productApi";

const getProduct = (products) => {
  const response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: products,
      },
    },
  };

  return response;
};

const HomeController = {
  getHomePage: async (req, res) => {
    return res.render("homepage.ejs");
  },

  testApi: () => {
    const but = [
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
              buttons: but,
            };

            return newProduct;
          });
        const test = getProduct(products);

        // console.log("product: ", test.attachment.payload);
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
