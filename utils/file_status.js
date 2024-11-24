function sendFileStatus(req) {
    if (req === null) {
        return { success: false, message: 'No file uploaded.' };
    }

    return {

        success: true,
        message: 'File uploaded successfully!',
        file: req.originalname
    };
}

module.exports = { sendFileStatus }