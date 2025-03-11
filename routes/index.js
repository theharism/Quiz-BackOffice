const express = require('express');
const router = express.Router();

router.use('/questions', require('./questionare.route'));
router.use('/quiz-results', require('./quizResult.route'));
router.use('/auth', require('./auth.route'));

module.exports = router;
