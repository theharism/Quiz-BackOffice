const LandingPageContent = require('../models/landingPageContent.model');
const logger = require('../services/logger'); // Assuming you have a logger service

exports.getAllLandingPageContents = async (req, res) => {
    try {
        let landingPageContents;
    
        if (req.query.latest) {
            landingPageContents = await LandingPageContent.find()
                .sort({ createdAt: -1 })
                .limit(1);
    
            const latestContent = landingPageContents[0] || {}; // Return empty object if no data
            logger.info(`Fetched latest landing page content successfully`);
            return res.status(200).json({ success: true, data: latestContent });
        }
    
        landingPageContents = await LandingPageContent.find();
        logger.info(`Fetched ${landingPageContents.length} landing page contents successfully`);
    
        res.status(200).json({ success: true, data: landingPageContents });
    } catch (error) {
        logger.error(`Error fetching landing page contents:`, error);
        res.status(500).json({ success: false, message: "Server Error" });
    }    
};

exports.getLandingPageContentById = async (req, res) => {
    try {
        const landingPageContent = await LandingPageContent.findById(req.params.id);
        if (!landingPageContent) {
            logger.warn(`Landing page content with id ${req.params.id} not found`);
            return res.status(404).json({ success: false, message: 'Landing page content not found' });
        }
        logger.info(`Fetched landing page content with id ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: landingPageContent });
    } catch (error) {
        logger.error(`Error fetching landing page content with id ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.createLandingPageContent = async (req, res) => {
    try {
        const landingPageContent = await LandingPageContent.create({
            ...req.body,
            logo: req.file ? req.file.destination + req.file.filename : null,
        });
        logger.info(`Created landing page content successfully`);
        res.status(201).json({ success: true, data: landingPageContent });
    } catch (error) {
        logger.error(`Error creating landing page content: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.updateLandingPageContent = async (req, res) => {
    try {
        const landingPageContent = await LandingPageContent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!landingPageContent) {
            logger.warn(`Landing page content with id ${req.params.id} not found`);
            return res.status(404).json({ success: false, message: 'Landing page content not found' });
        }
        logger.info(`Updated landing page content with id ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: landingPageContent });
    } catch (error) {
        logger.error(`Error updating landing page content with id ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.deleteLandingPageContent = async (req, res) => {
    try {
        const landingPageContent = await LandingPageContent.findByIdAndDelete(req.params.id);
        if (!landingPageContent) {
            logger.warn(`Landing page content with id ${req.params.id} not found`);
            return res.status(404).json({ success: false, message: 'Landing page content not found' });
        }
        logger.info(`Deleted landing page content with id ${req.params.id} successfully`);
        res.status(200).json({ success: true, data: landingPageContent });
    } catch (error) {
        logger.error(`Error deleting landing page content with id ${req.params.id}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};