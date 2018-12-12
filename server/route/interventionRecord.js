import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { 
    getInterventionRecord, getASingleRecord, createNewRecord, updateInterventionComment, updateInterventionLocation, deleteInterventionRecord
    ,updateInterventionStatus
} from '../controller';
const router = express.Router();

router.get('/',VerifyToken, getInterventionRecord);
router.get('/:id', VerifyToken, getASingleRecord);
router.post('/', VerifyToken, createNewRecord);
router.patch('/:id/comment', VerifyToken, updateInterventionComment);
router.patch('/:id/location', VerifyToken, updateInterventionLocation);
router.delete('/:id', VerifyToken, deleteInterventionRecord);
router.patch('/:id/status',VerifyToken, updateInterventionStatus);

export default router; 
