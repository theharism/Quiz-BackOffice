const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV}`),
});

module.exports = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || "development",
  mongodb_uri:process.env.MONGODB_URI || "mongodb://localhost:27017/totalsports",
};
