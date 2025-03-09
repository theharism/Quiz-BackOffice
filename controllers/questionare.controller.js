const Question = require('../models/questionare.model');
const logger = require('../services/logger'); // Assuming you have a logger service

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        logger.info('Fetched all questions successfully');
        res.status(200).json({ success: true, data: questions });
    } catch (error) {
        logger.error('Error fetching questions: ', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Get question by ID
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.id);
        if (!question) {
            logger.warn(`Question with ID ${req.params.id} not found`);
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        logger.info(`Fetched question with ID ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: question });
    } catch (error) {
        logger.error(`Error fetching question with ID ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

// Create a new question
exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = await Question.create(req.body);
        logger.info('Created new question successfully');
        res.status(201).json({ success: true, data: newQuestion });
    } catch (error) {
        logger.error('Error creating question: ', error);
        res.status(400).json({ success: false, message: 'Error creating question', error: error.message });
    }
};

// Update a question
exports.updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedQuestion) {
            logger.warn(`Question with ID ${req.params.id} not found for update`);
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        logger.info(`Updated question with ID ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: updatedQuestion });
    } catch (error) {
        logger.error(`Error updating question with ID ${req.params.id}: `, error);
        res.status(400).json({ success: false, message: 'Error updating question', error: error.message });
    }
};

// Delete a question
exports.deleteQuestion = async (req, res) => {
    try {
        const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
        if (!deletedQuestion) {
            logger.warn(`Question with ID ${req.params.id} not found for deletion`);
            return res.status(404).json({ success: false, message: 'Question not found' });
        }
        logger.info(`Deleted question with ID ${req.params.id} successfully`);
        res.status(200).json({ success: true, message: 'Question deleted successfully' });
    } catch (error) {
        logger.error(`Error deleting question with ID ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};