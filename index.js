const { express, app, dotenv } = require('./import.js');
const { v4: uuidv4 } = require('uuid');
const { validateUserEmail } = require('./schema/schema.js');
const { generateErrorResponse, generateSuccessResponse } = require('./models/response_model.js');

// env init
dotenv.config();

const { getAccessToken, getRefreshToken } = require('./token_manager/token_generator.js');
const { uSAssignment, utAssignment, utNotes } = require('./file_handler/file_handler.js');

// init mongo after init env
const { mongoose } = require('./db_manager/connect_db.js');
const { User, TeacherUser } = require('./models/mongo_user.js');
const { verifyAccessTokens } = require('./token_manager/verify_tokens.js');

// body parser
app.use(express.json());

// Middleware for checking access tokens
function checkAccessTokens(req, res, next) {
    const accessToken = req.body['accessToken'];
    if (verifyAccessTokens(accessToken)) {
        next();
    } else {
        res.status(401).send(generateErrorResponse(401, 'UnauthorizedError', 'Invalid or expired access token'));
    }
}

// Function to check file status
function sendFileStatus(req) {
    if (!req.file) {
        return { success: false, message: 'No file uploaded.' };
    }

    return {
        success: true,
        message: 'File uploaded successfully!',
        file: req.file
    };
}

// Route Handlers

app.post('/student/user-verification', async (req, res) => {
    try {
        const result = validateUserEmail(req.body);
        if (!result.success) {
            return res.status(400).send(generateErrorResponse(400, 'ValidationError', result.error.errors));
        }

        const { email, name, rollNumber } = req.body;
        const uuid = uuidv4();

        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ userId: uuid, email, name, rollNumber });
            await user.save();

            const accessToken = getAccessToken(email, uuid);
            const refreshToken = getRefreshToken(email, uuid);

            return res.status(201).send(generateSuccessResponse(201, 'User Created and Token Generated Successfully', {
                data: { accessToken, refreshToken },
            }));
        }

        const accessToken = getAccessToken(email, user.userId);
        const refreshToken = getRefreshToken(email, user.userId);

        res.status(200).send(generateSuccessResponse(200, 'User Exists. Token Generated Successfully', {
            data: { accessToken, refreshToken, user: { name, rollNumber, email } },
        }));

    } catch (error) {
        res.status(500).send(generateErrorResponse(500, 'InternalServerError', error.message));
    }
});

app.post('/teacher/user-verification', async (req, res) => {
    try {
        const result = validateUserEmail(req.body);
        if (!result.success) {
            return res.status(400).send(generateErrorResponse(400, 'ValidationError', result.error.errors));
        }

        const { email, name } = req.body;
        const uuid = uuidv4();

        let user = await TeacherUser.findOne({ email });

        if (!user) {
            user = new TeacherUser({ userId: uuid, email, name });
            await user.save();

            const accessToken = getAccessToken(email, uuid);
            const refreshToken = getRefreshToken(email, uuid);

            return res.status(201).send(generateSuccessResponse(201, 'User Created and Token Generated Successfully', {
                data: { accessToken, refreshToken },
            }));
        }

        const accessToken = getAccessToken(email, user.userId);
        const refreshToken = getRefreshToken(email, user.userId);

        res.status(200).send(generateSuccessResponse(200, 'User Exists. Token Generated Successfully', {
            data: { accessToken, refreshToken, user: { name, email } },
        }));

    } catch (error) {
        res.status(500).send(generateErrorResponse(500, 'InternalServerError', error.message));
    }
});

// File Upload Routes

app.post('/student/upload-assignments', checkAccessTokens, uSAssignment.single('file'), (req, res) => {
    const result = sendFileStatus(req);
    if (!result.success) {
        return res.status(400).send(result.message);
    }
    res.send(result);
});

app.post('/teacher/upload-assignments', checkAccessTokens, utAssignment.single('file'), (req, res) => {
    const result = sendFileStatus(req);
    if (!result.success) {
        return res.status(400).send(result.message);
    }
    res.send(result);
});

app.post('/teacher/upload-notes', checkAccessTokens, utNotes.single('file'), (req, res) => {
    const result = sendFileStatus(req);
    if (!result.success) {
        return res.status(400).send(result.message);
    }
    res.send(result);
});

// Health Check Endpoint
app.get("/health-check", (req, res) => {
    res.send(true);
});

// Start the Server
app.listen(process.env.PORT || 5500, () => {
    console.log("Server is listening on port " + (process.env.PORT || 5500));
});

// Global Error Handler for Multer
function handleMulterErrors(err, req, res, next) {
    if (err instanceof multer.MulterError || err.message.startsWith('File type not allowed')) {
        return res.status(400).send({ error: err.message });
    }
    next(err);
}

app.use(handleMulterErrors);
