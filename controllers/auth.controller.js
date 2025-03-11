const keys = require('../config/keys');
const User = require('../models/user.model');
const logger = require('../services/logger'); // Assuming you have a logger service
const bcrypt = require('bcrypt');

// login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            logger.warn(`User with username ${req.body.username} not found`);
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        logger.info(`Fetched user with username ${req.body.username} successfully`);

        const isPasswordValid = await bcrypt.compare(
            `${req.body.password}`,
            user.password
        );

        if (!isPasswordValid)
            return res.status(401).json({
                status: "failed",
                data: [],
                message:
                    "Invalid username or password. Please try again with the correct credentials.",
            });

        let options = {
            maxAge: 30 * 24 * 60 * 60 * 1000, // would expire in 30days
            httpOnly: true, // The cookie is only accessible by the web server
            secure: keys.env === "production",
            sameSite: keys.env === "production" ? "None" : "Lax",
        };
        const token = user.generateAccessJWT(); // generate session token for user
        res.cookie("SessionID", token, options); // set the token to response header, so that the client sends it back on each subsequent request
        res.status(200).json({
            status: "success",
            message: "You have successfully logged in.",
        });
    } catch (error) {
        logger.error(`Error fetching user with username ${req.body.username}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.register = async (req, res) => {
    try {
        await User.create(req.body);
        logger.info(`Created user with username ${req.body.username} successfully`);
        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'Username already exists' });
        }
        logger.error(`Error creating user with username ${req.body.username}: `, error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

exports.logout = async (req, res) => {
    try {
      const authHeader = req.headers['cookie']; // get the session cookie from request header
      if (!authHeader) return res.sendStatus(204); // No content
      // Also clear request cookie on client
      res.setHeader('Clear-Site-Data', '"cookies"');
      res.status(200).json({ message: 'You are logged out!' });
    } catch (err) {
      res.status(500).json({
        status: 'error',
        message: 'Internal Server Error',
      });
    }
    res.end();
};

exports.checkAuth = async (req, res) => {
    res.status(200).json({ message: 'You are authenticated!' });
}
