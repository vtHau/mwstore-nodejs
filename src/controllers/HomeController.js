import { Product } from "./../models/index";
import productApi from "../apis/productApi";
import OcrService from "./../services/OcrService";
import request from "request";
const image =
  "https://scontent.fsgn5-9.fna.fbcdn.net/v/t1.15752-9/256365722_427737702282310_4511055179493906282_n.jpg?_nc_cat=105&ccb=1-5&_nc_sid=ae9488&_nc_ohc=AzekMLglY5YAX_llD2h&_nc_ht=scontent.fsgn5-9.fna&oh=4d9c46ea8abe20e8fa03a7780cf7c01a&oe=61BF9D58";

const IMAGE_STARTED =
  "https://luv.vn/wp-content/uploads/2021/08/hinh-anh-gai-xinh-52.jpg";

const HomeController = {
  getHomePage: async (req, res) => {
    return res.render("homepage.ejs");
  },

  testApi: async () => {
    const text = await OcrService.tesseract(image);
    console.log("Result laf", text);
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
