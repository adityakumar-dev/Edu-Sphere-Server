const jwt = require('jsonwebtoken')
const { getAccessSecretKey, getRefreshSecretKey } = require('../dynamic_env')
const { verifyRefreshTokens } = require('./verify_tokens')

const getAccessToken = (email, userId) => {
    return jwt.sign({ email: email, userId: userId }, getAccessSecretKey, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION })
}
const getRefreshToken = (email, userId) => {
    return jwt.sign({ email: email, userId: userId }, getRefreshSecretKey, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
}
const refreshAccessTokens = async (refreshToken, email, userId) => {
    try {

        await verifyRefreshTokens(refreshToken);

        return {
            accessToken: getAccessToken(email, userId),
            refreshToken: getRefreshToken(email, userId),
        };
    } catch (error) {
        console.error('Token verification failed:', error);
        return null;
    }
};

module.exports = { getAccessToken, getRefreshToken, refreshAccessTokens }
