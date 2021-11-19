import { Product } from "./../models/index";
import productApi from "../apis/productApi";
const IMAGE_STARTED =
  "https://luv.vn/wp-content/uploads/2021/08/hinh-anh-gai-xinh-52.jpg";

const getProduct = (products) => {
  products.push({
    title: "Quay về",
    subtitle: "Về lại danh mục sản phẩm",
    image_url: IMAGE_STARTED,
    buttons: [
      {
        type: "postback",
        title: "Quay về",
        payload: "PRODUCT_LIST",
      },
    ],
  });

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
    const products = [];

    productApi
      .getProductNew()
      .then((res) => {
        res.forEach((product, key) => {
          if (key <= 4) {
            const { title, price, image } = product;
            products.push({
              title: title,
              subtitle: price,
              image_url: image,
              buttons: [
                {
                  type: "web_url",
                  title: "Xem chi tiết",
                  url: "https://www.facebook.com/",
                  webview_height_ratio: "full",
                },
              ],
            });
          }
        });

        console.log(products);

        const resTemplate = getProduct(products);
        console.log(resTemplate);
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
