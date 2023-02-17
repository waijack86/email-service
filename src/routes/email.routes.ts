import { Router } from 'express';
import { sendEmail } from '../controllers/email.controller';

const router = Router();

router.post('/', sendEmail);

export default router;
