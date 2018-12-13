import express from 'express';
import Auth from '../controller/authController';

const auth = new Auth();
const router = express.Router();

router.post('/signup', auth.signUpUser);
router.post('/login', auth.login);

export default router;
