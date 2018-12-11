import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { getInterventionRecord, getASingleRecord, createNewRecord, updateInterventionComment } from '../controller';
const router = express.Router();

router.get('/',VerifyToken, getInterventionRecord);
router.get('/:id', VerifyToken, getASingleRecord);
router.post('/', VerifyToken, createNewRecord);
router.patch('/:id/comment', VerifyToken, updateInterventionComment)
export default router; 