const { v4: uuidv4 } = require('uuid');
const { validateUserEmail } = require('../../schema/schema.js');
const { generateErrorResponse, generateSuccessResponse } = require('../../models/response_model.js');


const { getAccessToken, getRefreshToken, refreshAccessTokens } = require('../../token_manager/token_generator.js');
const { TeacherUser } = require('../../models/mongo_user')
const teacherUserVerification = async (req, res) => {
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
}

module.exports = { teacherUserVerification }