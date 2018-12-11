import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { getInterventionRecord } from '../controller';
const router = express.Router();

router.get('/',VerifyToken, getInterventionRecord);

export default router; 