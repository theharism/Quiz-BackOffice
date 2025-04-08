const Question = require('../models/questionare.model');
const logger = require('../services/logger'); // Assuming you have a logger service

// Get all questions
exports.getAllQuestions = async (req, res) => {
    try {
        let questions = await Question.find();
        logger.info('Fetched all questions successfully');
        // Sort by order if available, otherwise by creation date
        questions = questions.sort((a, b) => {
        if (a.order !== undefined && b.order !== undefined) {
          return a.order - b.order
        }
        // Fallback to creation date
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
        return dateB - dateA
      })
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
        const { text, type, isRequired, category, allowMultipleSelections, options } = JSON.parse(req.body.data);
        if(type === 'slider'){
            options?.forEach((option, index) => {
                if (req.files[index]) {
                    option.image = req.files[index].destination + req.files[index].filename
                }
            });
        }
        const newQuestion = await Question.create({text, type, isRequired, category, allowMultipleSelections, options});
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

        const { text, type, isRequired, category, allowMultipleSelections, options } = JSON.parse(req.body.data);
        
        let index = 0;
        options?.forEach((option) => {
            if (req.files[index] && typeof option.image === 'object') {
                option.image = req.files[index].destination + req.files[index].filename
                index += 1
            }
        });
        
        const updatedQuestion = await Question.findByIdAndUpdate(req.params.id, { text, type, isRequired, category, allowMultipleSelections, options }, { new: true, runValidators: true });
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

exports.reOrderQuestions = async (req, res) => {
    try {
      const { questions } = req.body; // Expecting an array of objects [{ id, order }]
  
      if (!Array.isArray(questions) || questions.length === 0) {
        return res.status(400).json({ message: "Invalid input data." });
      }
  
      // Validate input
      for (const { _id, order } of questions) {
        if (!_id || typeof order !== "number") {
          return res.status(400).json({ message: "Each item must have an id and a numeric order." });
        }
      }
  
      // Bulk update orders
      const bulkOps = questions.map(({ _id, order }) => ({
        updateOne: {
          filter: { _id: _id },
          update: { $set: { order } }
        }
      }));
  
      // Execute bulk write
      await Question.bulkWrite(bulkOps);
  
      res.status(200).json({ success:true ,message: "Questions reordered successfully." });
    } catch (error) {
      console.error("Error reordering questions:", error);
      res.status(500).json({ success:false, message: "Internal server error." });
    }
};
  