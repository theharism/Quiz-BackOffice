const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionare.controller');
const { Verify, VerifyRole } = require('../middlewares/authenticationMiddleware');
const upload = require('../config/multer');

router.get('/', questionController.getAllQuestions);
router.get('/:id', questionController.getQuestionById);
router.post('/', Verify, VerifyRole,upload.array("images"), questionController.createQuestion);
router.put('/reorder', Verify, VerifyRole, questionController.reOrderQuestions);
router.put('/:id', Verify, VerifyRole,upload.array("images"), questionController.updateQuestion);
router.delete('/:id', Verify, VerifyRole, questionController.deleteQuestion);

module.exports = router;
