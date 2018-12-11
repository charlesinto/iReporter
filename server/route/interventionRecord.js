import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { getInterventionRecord, getASingleRecord } from '../controller';
const router = express.Router();

router.get('/',VerifyToken, getInterventionRecord);
router.get('/:id', VerifyToken, getASingleRecord);

export default router; 