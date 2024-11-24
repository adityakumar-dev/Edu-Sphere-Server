const uploadStudentAssignment = async (req, res) => {
    try {
        const result = sendFileStatus(req.files['file'][0] || null);
        if (!result.success) {
            return res.status(400).send(result);
        }
        const file = req.files['file'][0]
        await studentAssignmentModel.updateOne(
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
    } catch (error) {
        console.error('Error uploading assignment:', error);
        res.status(500).send({ success: false, message: 'Internal server error' });
    }
}

module.exports = { uploadStudentAssignment }