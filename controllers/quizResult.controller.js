const QuizResult = require('../models/quizResult.model');
const logger = require('../services/logger');

// Get all Quiz Results
exports.getAllQuizResults = async (req, res) => {
    try {
      const quizResults = await QuizResult.find()
        .populate({
          path: "responses.questionId",
          select: "text options",
        })
        .lean();
  
      quizResults.forEach((attempt) => {
        attempt.responses.forEach((response) => {
          if (response.questionId && response?.selectedOptions?.length) {
            response.selectedOptions = response.questionId.options
              .filter((opt) => response.selectedOptions?.some((selectedId) => selectedId?.equals(opt?._id)))
              .map((opt) => ({ _id: opt?._id, text: opt?.text, score: opt?.score }));
          }
        });
      });
  
      logger.info("Fetched all quiz results successfully");
      res.status(200).json({ success: true, data: quizResults });
    } catch (error) {
      logger.error("Error fetching quiz results: ", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
};  

// Get quiz result by ID
exports.getQuizResultById = async (req, res) => {
    try {
        const quizResult = await QuizResult.findById(req.params.id);
        if (!quizResult) {
            logger.warn(`Quiz Result with ID ${req.params.id} not found`);
            return res.status(404).json({ success: false, message: 'Quiz Result not found' });
        }
        logger.info(`Fetched quiz result with ID ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: quizResult });
    } catch (error) {
        logger.error(`Error fetching quiz result with ID ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create a new quiz result
exports.createQuizResult = async (req, res) => {
    try {
        const newQuizResult = await QuizResult.create(req.body);
        logger.info('Created new quiz result successfully');
        res.status(201).json({ success: true, data: newQuizResult });
    } catch (error) {
        logger.error('Error creating quiz result: ', error);
        res.status(400).json({ success: false, message: 'Error creating quiz result', error: error.message });
    }
};

// Update a quiz result
exports.updateQuizResult = async (req, res) => {
    try {
        const updatedQuizResult = await QuizResult.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuizResult) {
            logger.warn(`Quiz Result with ID ${req.params.id} not found for update`);
            return res.status(404).json({ success: false, message: 'Quiz Result not found' });
        }
        logger.info(`Updated quiz result with ID ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: updatedQuizResult });
    } catch (error) {
        logger.error(`Error updating quiz result with ID ${req.params.id}: `, error);
        res.status(400).json({ success: false, message: 'Error updating quiz result', error: error.message });
    }
};

// Delete a quiz result
exports.deleteQuizResult = async (req, res) => {
    try {
        const deletedQuizResult = await QuizResult.findByIdAndDelete(req.params.id);
        if (!deletedQuizResult) {
            logger.warn(`Quiz Result with ID ${req.params.id} not found for deletion`);
            return res.status(404).json({ success: false, message: 'Quiz Result not found' });
        }
        logger.info(`Deleted quiz result with ID ${req.params.id} successfully`);
        res.status(200).json({ success: true, message: 'Quiz Result deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting quiz result with ID ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};