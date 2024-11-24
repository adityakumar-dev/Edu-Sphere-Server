const { express, app, dotenv } = require('./import.js');
dotenv.config();

const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const { generateErrorResponse, generateSuccessResponse } = require('./models/response_model.js');
const { uSAssignment, utAssignment, utNotes } = require('./file_handler/file_handler.js');
const { mongoose } = require('./db_manager/connect_db.js');
const { uploadTeacherNotes } = require('./routes/teacherRoutes/upload_notes_teacher.js');
const { uploadAssignmentTeacher } = require('./routes/teacherRoutes/upload_assignments.js');
const { uploadStudentAssignment } = require('./routes/studentRoutes/upload_assignments_student.js');
const { teacherUserVerification } = require('./routes/teacherRoutes/teacher_user_verifications.js');
const { studentUserVerification } = require('./routes/studentRoutes/student_user_verifications.js');
const { refreshTokensAllUser } = require('./utils/routes/refresh_tokens.js');
const { checkAccessTokens, checkTeacherIdentity, checkUserIdentity } = require('./utils/middleware_function.js');

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// // Rate Limiter
// const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100
// });
// app.use(limiter);

// Route Handlers
app.post('/refresh-tokens', refreshTokensAllUser);
app.post('/student/user-verification', studentUserVerification);
app.post('/teacher/user-verification', teacherUserVerification);

app.post(
    '/student/upload-assignments',
    checkAccessTokens, uSAssignment, checkUserIdentity,
    uploadStudentAssignment
);

app.post('/teacher/upload-assignments', checkAccessTokens, utAssignment, checkTeacherIdentity, uploadAssignmentTeacher);
app.post('/teacher/upload-notes', checkAccessTokens, utNotes, checkTeacherIdentity, uploadTeacherNotes);

// Health Check Endpoint
app.get("/health-check", (req, res) => {
    res.send(true);
});

// Start the Server
const port = process.env.PORT || 5500;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Global Error Handler for Multer
function handleMulterErrors(err, req, res, next) {
    if (err instanceof multer.MulterError || err.message.startsWith('File type not allowed')) {
        return res.status(400).send(generateErrorResponse(400, err.message, "File upload error!"));
    }
    next(err);
}

// Global Error Handler for Internal Server Errors
function InternalServerError(err, req, res, next) {
    console.error("Internal Server Error:", err);
    res.status(500).send(generateErrorResponse(500, err.message, "Internal Server Error"));
}

// Use error handlers after all routes
app.use(handleMulterErrors);
app.use(InternalServerError);
