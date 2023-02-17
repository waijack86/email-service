import express from 'express';
import bodyParser from 'body-parser';
import serverless from 'serverless-http'; 
import emailRoutes from '../routes/email.routes';

const app = express();
app.use(bodyParser.json());
app.use('/default/send-email', emailRoutes);

module.exports.handler = serverless(app);