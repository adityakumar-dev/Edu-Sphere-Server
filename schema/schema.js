const z = require('zod');

// Function to validate user's email
const validateUserEmail = (req) => {
    const email = req['email'] || '';
    console.log(email)

    const EmailSchema = z.object({
        email: z.string().email("Invalid email address").nonempty("Email is required"),
    });

    return EmailSchema.safeParse({ email });


};

module.exports = { validateUserEmail };
