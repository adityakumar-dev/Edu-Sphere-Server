const jwt = require('jsonwebtoken')
const { getAccessSecretKey, getRefreshSecretKey } = require('../dynamic_env')

const verifyRefreshTokens = (refreshToken) => {
    return jwt.verify(refreshToken, getRefreshSecretKey, (err, user) => {
        if (err) {
            reject('Invalid refresh token');
        } else {
            resolve(user);
        }
    });
}
const verifyAccessTokens = (refreshToken) => {
    return jwt.verify(refreshToken, getAccessSecretKey, (err, user) => {
        if (err) {
            return 'Invalid Access token';
        } else {
            return user;
        }
    });
}


module.exports = { verifyAccessTokens, verifyRefreshTokens }