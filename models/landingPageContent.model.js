const mongoose = require("mongoose");

const LandingPageContentSchema = new mongoose.Schema(
  {
    logo: { type: String, required: true },
    heading: { type: String, required: true }, // The question text
    subHeading: {
      type: String,
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    completionTime: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LandingPageContent", LandingPageContentSchema);
