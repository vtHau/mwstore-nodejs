import productApi from "./../apis/productApi";

const HomeController = {
  getHomePage: (req, res) => {
    productApi
      .getProductNew()
      .then((res) => {
        console.log(res);
        return res.render("homepage.ejs");
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default HomeController;
