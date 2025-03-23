const express = require('express');
const router = express.Router();

router.use('/questions', require('./questionare.route'));
router.use('/quiz-results', require('./quizResult.route'));
router.use('/auth', require('./auth.route'));
router.use('/landing-page-content', require('./landingPageContent.route'));

module.exports = router;
