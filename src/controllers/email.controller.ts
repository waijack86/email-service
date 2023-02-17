import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { createSesClient } from '../configs/aws.config';
import { EmailPayload } from '../interfaces/email.interface';
import { sendEmailValidators } from '../validators/email.validator';
import * as dotenv from 'dotenv';
dotenv.config();

export async function sendEmail(req: Request, res: Response) {
    // Validate request body
    await Promise.all(sendEmailValidators.map((validator) => validator.run(req)));
    console.log(req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        console.error('Error message', { error: errorMessages });
        return res.status(400).json({ success: false, message: errorMessages });
    }

    // Compile the payload
    const { to, subject, message } = req.body as EmailPayload;
    const params = {
        Destination: { ToAddresses: [to] },
        Message: {
        Body: { Text: { Data: message } },
        Subject: { Data: subject }
        },
        Source:  process.env.SOURCE
    };
    console.log(params);

    // Send the email
    try {
        const ses = await createSesClient();
        const data = await ses.sendEmail(params).promise();
        console.log(`Email sent to ${to} with message ID: ${data.MessageId}`);
        res.status(200).json({
            success: true,
            message: `Email sent to ${to}`,
            data: { MessageId: data.MessageId }
        });
    } catch (error) {
        console.error(`Failed to send email to ${to}: ${error}`);
        res.status(500).json({
            success: false,
            message: `Failed to send email to ${to}`,
            error: error
        });
    }
}
