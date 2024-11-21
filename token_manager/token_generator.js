const jwt = require('jsonwebtoken')
const { getAccessSecretKey, getRefreshSecretKey } = require('../dynamic_env')

const getAccessToken = (email, userId) => {
    return jwt.sign({ email: email, userId: userId }, getAccessSecretKey, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION })
}
const getRefreshToken = (email, userId) => {
    return jwt.sign({ email: email, userId: userId }, getRefreshSecretKey, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
}


module.exports = { getAccessToken, getRefreshToken }
