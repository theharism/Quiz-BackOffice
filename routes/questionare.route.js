const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionare.controller');
const { Verify, VerifyRole } = require('../middlewares/authenticationMiddleware');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', Verify, VerifyRole, questionController.createQuestion);
router.put('/:id', Verify, VerifyRole, questionController.updateQuestion);
router.delete('/:id', Verify, VerifyRole, questionController.deleteQuestion);

module.exports = router;
