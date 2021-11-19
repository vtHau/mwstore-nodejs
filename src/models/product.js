"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    ociate(models) {}
  }
  Product.init(
    {
      name: DataTypes.STRING,
      slug: DataTypes.STRING,
      price: DataTypes.BIGINT,
      description: DataTypes.STRING,
      image: DataTypes.STRING,
      visit: DataTypes.BIGINT,
      feather: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: "products",
      modelName: "Product",
      timestamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );
  return Product;
};
