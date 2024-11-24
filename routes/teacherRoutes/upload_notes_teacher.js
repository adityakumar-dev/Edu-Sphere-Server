const { sendFileStatus } = require('../../utils/file_status')

const uploadTeacherNotes = async (req, res) => {
    const result = sendFileStatus(req);
    if (!result.success) {
        return res.status(400).send(result.message);
    } const file = req.files['file'][0]
    await teacherNotesModel.updateOne(
        { userId: req.user['userId'], email: req.user['email'], name: req.user['name'] },
        {
            $push: {
                assignments: {
                    subject: req.body['subject'],
                    files: [
                        {
                            fileName: file.originalname,
                            systemPath: file.path,
                            uploadedAt: Date.now(),
                        },
                    ],
                },
            },
        },
        { upsert: true }
    );


    res.send(result);
}

module.exports = { uploadTeacherNotes }