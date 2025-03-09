const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResult.controller');

router.get('/', quizResultController.getAllQuizResults);
router.get('/:id', quizResultController.getQuizResultById);
router.post('/', quizResultController.createQuizResult);
router.put('/:id', quizResultController.updateQuizResult);
router.delete('/:id', quizResultController.deleteQuizResult);

module.exports = router;
