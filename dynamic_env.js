const crypto = require('crypto');

process.env.ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || crypto.randomBytes(64).toString('hex');
process.env.REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || crypto.randomBytes(64).toString('hex');

const getAccessSecretKey = process.env.ACCESS_TOKEN_SECRET;
const getRefreshSecretKey = process.env.REFRESH_TOKEN_SECRET;

module.exports = { getAccessSecretKey, getRefreshSecretKey };
