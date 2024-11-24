const { verifyAccessTokens } = require('../token_manager/verify_tokens.js');
const { generateErrorResponse, generateSuccessResponse } = require('../models/response_model.js');

function checkAccessTokens(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];

        if (!authHeader) {
            return res.status(401).send(generateErrorResponse(401, 'UnauthorizedError', 'Access token missing'));
        }

        const accessToken = authHeader.startsWith('Bearer ')
            ? authHeader.slice(7, authHeader.length).trim()
            : authHeader;

        const user = verifyAccessTokens(accessToken);
        console.log("User is : " + user)
        if (user !== null) {
            req.user = user;
            next();
        } else {
            res.status(401).send(generateErrorResponse(401, 'UnauthorizedError', 'Invalid or expired access token'));
        }
    } catch (error) {
        console.error('Error verifying access token:', error);
        res.status(500).send(generateErrorResponse(500, 'ServerError', 'Internal server error'));
    }
}
async function checkUserIdentity(req, res, next) {
    try {
        console.log(req.body)
        const email = req.body['email'] || '';
        const data = await User.findOne({ email: email });
        if (data !== null) {
            req.user = data;
            next();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error checking user identity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}
async function checkTeacherIdentity(req, res, next) {
    try {
        const email = req.body['email'] || '';
        const data = await TeacherUser.findOne({ email: email });
        if (data !== null) {
            req.user = data;
            next();
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (err) {
        console.error('Error checking user identity:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = { checkAccessTokens, checkTeacherIdentity, checkUserIdentity }