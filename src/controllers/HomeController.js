import db from "./../models/index";

const getHomePage = async (req, res) => {
  return res.render("homepage.ejs");
};

const testDB = async (req, res) => {
  try {
    const products = await db.products.findAll();
    return res.render("homepage.ejs", {
      products: JSON.stringify(products),
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = {
  getHomePage,
  testDB,
};
