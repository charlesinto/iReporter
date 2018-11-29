import express from 'express';
import path from 'path';
import { getRedFlags } from '../controller';
const router = express.Router();

router.get('/', getRedFlags);


export default router;