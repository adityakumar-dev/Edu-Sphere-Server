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
function verifyAccessTokens(refreshToken) {
    try {
        const user = jwt.verify(refreshToken, getAccessSecretKey, (err, decoded) => {
            if (err) {
                return null;
            }
            return decoded;
        });
        console.log("user is : " + user)
        if (!user) {
            return null;
        }

        return user;
    } catch (error) {
        console.error('Error verifying token:', error);
        return 'Invalid Access token';
    }
}


module.exports = { verifyAccessTokens, verifyRefreshTokens }