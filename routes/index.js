const express = require('express');
const router = express.Router();

router.use('/questions', require('./questionare.route'));

module.exports = router;
