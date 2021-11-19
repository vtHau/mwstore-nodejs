import db from "./../models/index";

const getHomePage = async (req, res) => {
  try {
    const products = await db.products.findAll();
    // console.log(products);/
    return res.render("homepage.ejs", {
      products: JSON.stringify(products),
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getHomePage,
};
