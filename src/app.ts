import express from 'express';
import bodyParser from 'body-parser';
import emailRoutes from './routes/email.routes';

const app = express();
app.use(bodyParser.json());
app.use('/send-email', emailRoutes);
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

export { app };