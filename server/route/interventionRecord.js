import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { getInterventionRecord, getASingleRecord, createNewRecord } from '../controller';
const router = express.Router();

router.get('/',VerifyToken, getInterventionRecord);
router.get('/:id', VerifyToken, getASingleRecord);
router.post('/', VerifyToken, createNewRecord);

export default router; 