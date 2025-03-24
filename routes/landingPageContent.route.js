const express = require('express');
const router = express.Router();
const landingPageContentController = require('../controllers/landingPageContent.controller');
const { Verify, VerifyRole } = require('../middlewares/authenticationMiddleware');
const upload = require('../config/multer');

router.get('/', landingPageContentController.getAllLandingPageContents);
router.get('/:id',Verify,VerifyRole, landingPageContentController.getLandingPageContentById);
router.post('/', upload.single("logo"), landingPageContentController.createLandingPageContent);
router.put('/:id',Verify,VerifyRole, upload.single("logo"), landingPageContentController.updateLandingPageContent);
router.delete('/:id',Verify,VerifyRole, landingPageContentController.deleteLandingPageContent);

module.exports = router;
