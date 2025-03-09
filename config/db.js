const mongoose = require("mongoose");
const keys = require("./keys");
const logger = require("../services/logger");

module.exports =async () => {
  try {
    await mongoose.connect(
        keys.mongodb_uri
    );
    logger.info(logger.logTypes.SERVER,{message:"Connected to MongoDB"});
  } catch (error) {
    logger.error(logger.logTypes.SERVER,{message:error.message});
    process.exit(1);
  }
};

