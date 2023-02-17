import request from 'supertest';
import http from 'http';
import emailRoutes from '../src/routes/email.routes';
import express from 'express';
import bodyParser from 'body-parser';


let server: http.Server;
const app = express();
app.use(bodyParser.json());
app.use('/send-email', emailRoutes);

beforeAll((done) => {
    const port = process.env.PORT || 3100;
    server = app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
        done();
    });
  });
  
afterAll(done => {
    server.close(() => {
        console.log('Server closed');
        done();
    });
});

describe('Email API', () => {
    const validEmailAddress = 'waijack86@hotmail.com';
    const invalidEmailAddress = 'notanemailaddress';
    const emptyString = '';
    const validSubject = 'Test Email';
    const validMessage = 'This is a test email'; 

    describe('POST /send-email', () => {
        it('sends an email when provided with valid data', async () => {
            const res = await request(app)
                .post('/send-email')
                .send({
                    to: validEmailAddress,
                    subject: validSubject,
                    message: validMessage
        });
            expect(res.status).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success: true,
                    message: expect.stringContaining('Email sent to '), 
                    data: expect.objectContaining({
                        MessageId: expect.any(String)
                    })
                })
            );
        });

        it('should return 400 when request is missing required fields', async () => {
            const res = await request(app)
                .post('/send-email')
                .send({});
            expect(res.status).toBe(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success: false,
                    message: expect.arrayContaining (['At least one field is required'])
                })
            );
        });
        
        it('should return 400 when email address is invalid', async () => {
            const res = await request(app)
                .post('/send-email')
                .send({
                    to: invalidEmailAddress,
                    subject: validSubject,
                    body: validMessage
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success: false,
                    message: expect.arrayContaining (['Invalid email format'])
                })
            );
        });

        it('should return 400 when subject is empty', async () => {
            const res = await request(app)
                .post('/send-email')
                .send({
                    to: validEmailAddress,
                    subject: emptyString,
                    body: validMessage
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success: false,
                    message: expect.arrayContaining (['Subject is required'])
                })
            );
        });

        it('should return 400 when body is empty', async () => {
            const res = await request(app)
                .post('/send-email')
                .send({
                    to: validEmailAddress,
                    subject: validSubject,
                    body: emptyString
                });
            expect(res.status).toBe(400);
            expect(res.body).toEqual(
                expect.objectContaining({
                    success: false,
                    message: expect.arrayContaining (['Message is required'])
                })
            );
        });
    });
});