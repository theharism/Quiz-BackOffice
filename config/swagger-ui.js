const swaggerUi = require("swagger-ui-express");
const keys = require("./keys");
const logger = require("../services/logger");
const swaggerAutogen = require("swagger-autogen")();
const path = require('path');
const outputFile = path.resolve(__dirname, "./swagger-ui.json");
const endpointsFiles = [path.resolve(__dirname, '../server.js')];

const setupSwagger = async (app) => {
  if (keys.env === "development") {
    try {
      await swaggerAutogen(outputFile, endpointsFiles);
      logger.info(logger.logTypes.SWAGGER, {
        message: `Swagger UI generated`,
      });

      app.use(
        "/api/docs",
        swaggerUi.serve,
        swaggerUi.setup(require(outputFile))
      );

      logger.info(logger.logTypes.SWAGGER, {
        message: `Docs available at http://localhost:${keys.port}/api/docs`,
      });
    } catch (error) {
      logger.error(logger.logTypes.SWAGGER, {
        message: `Error generating Swagger UI: ${error.message}`,
      });
    }
  }
};

module.exports = setupSwagger;