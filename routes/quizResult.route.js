const express = require('express');
const router = express.Router();
const quizResultController = require('../controllers/quizResult.controller');
const { Verify, VerifyRole } = require('../middlewares/authenticationMiddleware');

router.get('/',Verify,VerifyRole, quizResultController.getAllQuizResults);
router.get('/:id',Verify,VerifyRole, quizResultController.getQuizResultById);
router.post('/', quizResultController.createQuizResult);
router.put('/:id',Verify,VerifyRole, quizResultController.updateQuizResult);
router.delete('/:id',Verify,VerifyRole, quizResultController.deleteQuizResult);

module.exports = router;
