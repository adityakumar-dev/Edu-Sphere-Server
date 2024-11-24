const path = require('path');
const multer = require('multer');
const fs = require('fs');

// Base paths configuration
const STORAGE_PATHS = {
    STUDENT_ASSIGNMENTS: '/home/linmar/Desktop/uploads/assignments/student',
    TEACHER_ASSIGNMENTS: '/home/linmar/Desktop/upload/assignments/teacher',
    TEACHER_NOTES: '/home/linmar/Desktop/upload/notes/teacher'
};

// File extension filter function
function fileExtensionFilter(allowedExtensions) {
    return (req, file, cb) => {
        const fileExtension = path.extname(file.originalname).toLowerCase();

        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error(`File type not allowed. Allowed types: ${allowedExtensions.join(', ')}`));
        }
    };
}

// Storage configuration factory
function createStorage(storagePath) {
    return multer.diskStorage({
        destination: (req, file, cb) => {
            try {
                // Ensure directory exists
                if (!fs.existsSync(storagePath)) {
                    fs.mkdirSync(storagePath, { recursive: true });
                }
                cb(null, storagePath);
            } catch (error) {
                cb(new Error(`Failed to create or access directory: ${error.message}`));
            }
        },
        filename: (req, file, cb) => {
            try {
                // Create unique filename while preserving original name
                const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
                const filename = `${path.parse(file.originalname).name}-${uniqueSuffix}${path.extname(file.originalname)}`;
                cb(null, filename);
            } catch (error) {
                cb(new Error(`Failed to generate filename: ${error.message}`));
            }
        }
    });
}

// Create multer instances with specific configurations
const uSAssignment = multer({
    storage: createStorage(STORAGE_PATHS.STUDENT_ASSIGNMENTS),
    fileFilter: fileExtensionFilter(['.pdf', '.docx', '.txt']),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 1 // Only allow 1 file per request
    }
}).fields([
    { name: 'email', maxCount: 1 },
    { name: 'subject', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

const utAssignment = multer({
    storage: createStorage(STORAGE_PATHS.TEACHER_ASSIGNMENTS),
    fileFilter: fileExtensionFilter(['.pdf', '.docx', '.txt']),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    }
}).fields([
    { name: 'email', maxCount: 1 },
    { name: 'subject', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

const utNotes = multer({
    storage: createStorage(STORAGE_PATHS.TEACHER_NOTES),
    fileFilter: fileExtensionFilter(['.pdf', '.pptx', '.docx', '.txt']),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 1
    }
}).fields([
    { name: 'email', maxCount: 1 },
    { name: 'subject', maxCount: 1 },
    { name: 'file', maxCount: 1 }
]);

// Error handler wrapper for multer middleware
const handleMulterError = (middleware) => {
    return (req, res, next) => {
        middleware(req, res, (err) => {
            if (err) {
                if (err instanceof multer.MulterError) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'File upload error',
                        error: err.message
                    });
                }
                return res.status(500).json({
                    status: 'error',
                    message: 'Internal server error',
                    error: err.message
                });
            }
            next();
        });
    };
};



module.exports = {
    uSAssignment,
    utAssignment,
    utNotes
};