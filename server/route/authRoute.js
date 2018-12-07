import express from 'express';
import { signUpUser, login } from '../controller';
const router = express.Router();

router.post('/signup', signUpUser);
router.post('/login', login);

export default router;
