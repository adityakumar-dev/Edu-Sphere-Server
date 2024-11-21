const path = require('path');
const multer = require('multer');

function fileExtensionFilter(allowedExtensions) {
    return (req, file, cb) => {
        // Get the file extension
        const fileExtension = path.extname(file.originalname).toLowerCase();

        // Check if the file extension is in the allowed list
        if (allowedExtensions.includes(fileExtension)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed. Allowed types: ' + allowedExtensions.join(', ')));
        }
    };
}

// Define storage configuration
const storage = (storagePath) => multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, storagePath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = file.originalname + Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const uSAssignment = multer({
    storage: storage('/home/linmar/Desktop/uploads/assignments/student'),
    fileFilter: fileExtensionFilter(['.pdf', '.docx', '.txt'])
});
const utAssignment = multer({
    storage: storage('/home/linmar/Desktop/upload/assignments/teacher'),
    fileFilter: fileExtensionFilter(['.pdf', '.docx', '.txt'])
});
const utNotes = multer({
    storage: storage('/home/linmar/Desktop/upload/notes/teacher'),
    fileFilter: fileExtensionFilter(['.pdf', '.pptx', '.docx', '.txt'])
});

module.exports = { uSAssignment, utAssignment, utNotes };
