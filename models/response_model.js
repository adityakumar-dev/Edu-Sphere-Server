
const validateType = (value, type, defaultValue = null) => {
    return typeof value === type ? value : defaultValue;
};


function generateErrorResponse(status, error, message, details = null, path = null) {
    return {
        status: validateType(status, 'number', 500),
        error: validateType(error, 'string', 'InternalServerError'),
        message: validateType(message, 'string', 'An unexpected error occurred'),
        ...(details && { details: validateType(details, 'string', null) }),
        ...(path && { path: validateType(path, 'string', null) }),
        timestamp: new Date().toISOString(),
    };
}

function generateLoginResponse(email, accessToken, refreshToken) {
    return {
        email: validateType(email, 'string', ''),
        accessToken: validateType(accessToken, 'string', ''),
        refreshToken: validateType(refreshToken, 'string', ''),
        timestamp: new Date().toISOString(),
    };
}


function generateSuccessResponse(status, message, data = null) {
    return {
        status: validateType(status, 'number', 200),
        message: validateType(message, 'string', 'Success'),
        ...(data && { data }),
        timestamp: new Date().toISOString(),
    };
}

module.exports = { generateErrorResponse, generateLoginResponse, generateSuccessResponse };
