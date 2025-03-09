const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The question text
  type: {
    type: String,
    enum: ["text", "multiple-choice", "true-false", "numeric"],
    required: true,
  },
  options: [
    {
      text: { type: String, required: function () { return this.type !== "text"; } }, // Answer option text
      score: { type: Map, of: Number }, // Score for each category
    },
  ],
  isRequired: { type: Boolean, default: true }, // Whether the question is required
  category: { type: String, required: true }, // Categorization
},{ timestamps: true });

module.exports = mongoose.model("Question", QuestionSchema);
