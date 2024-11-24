const refreshTokensAllUser = async (req, res) => {
    try {
        // Get the refresh token from the Authorization header
        const authHeader = req.headers['authorization'];
        const refreshToken = authHeader && authHeader.split(' ')[1]; // Extract the token from 'Bearer <token>'

        if (!refreshToken) {
            return res.status(400).send(generateSuccessResponse(400, "Refresh token missing", null));
        }

        // Refresh tokens using the refresh token
        const data = await refreshAccessTokens(refreshToken);

        if (data !== null) {
            // Successfully refreshed tokens
            res.status(200).send(generateSuccessResponse(200, "Tokens refreshed successfully", data));
        } else {
            // Failed to refresh tokens (e.g., invalid or expired refresh token)
            res.status(401).send(generateSuccessResponse(401, "Failed to refresh tokens", null));
        }
    } catch (error) {
        // General error handling
        res.status(500).send(generateSuccessResponse(500, "Server error", null));
    }
}

module.exports = { refreshTokensAllUser }