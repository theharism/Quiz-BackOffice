const mongoose = require("mongoose");
const Question = require("../models/questionare.model"); // Ensure correct path to Question model

const QuizResultSchema = new mongoose.Schema(
  {
    responses: [
      {
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true }, // Reference to question
        selectedOptions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question.options" }], // Stores selected option IDs
        writtenAnswer: { type: String, default: null }, // Stores user input for text/numeric questions
      }
    ],
    totalScores: { type: Map, of: Number, default: {} }, // Calculated before save
  },
  { timestamps: true }
);

// **Pre-save middleware to calculate totalScores dynamically
QuizResultSchema.pre("save", async function (next) {
  try {
    let totalScores = {};

    for (const response of this.responses) {
      const question = await Question.findById(response.questionId).lean(); // Fetch question data
      if (!question || !question.options) continue;

      response?.selectedOptions?.forEach((optionId) => {
        const option = question.options.find((opt) => opt._id.equals(optionId)); // Find the option
        if (option && option.score) {
          for (const [category, score] of Object.entries(option.score)) {
            totalScores[category] = (totalScores[category] || 0) + score;
          }
        }
      });
    }

    this.totalScores = totalScores; // Store calculated scores before saving
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("QuizResult", QuizResultSchema);
