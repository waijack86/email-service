import { body } from 'express-validator';
import { isEmail } from 'validator';

export const sendEmailValidators = [
    body('to', 'Recipient (to) is required').notEmpty().bail().custom((value) => {
        // Check if email is valid
        if (!isEmail(value)) {
            throw new Error('Invalid email format');
        }

        return true;
    }),
    // Check is the suject empty and string
    body('subject', 'Subject is required').notEmpty().isString(),
    // Check is the message empty and string
    body('message', 'Message is required').notEmpty().isString(),
    body().custom((value, { req }) => {
        const { to, subject, message } = req.body;
        // Check all fields whether empty
        if (!to && !subject && !message) {
            throw new Error('At least one field is required');
        }
        return true;
    })
];
