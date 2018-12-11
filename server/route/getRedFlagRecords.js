import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { getRedFlags, getARecord, postRecord, updateLocation, updateComment, deleteRecord } from '../controller';
const router = express.Router();

router.get('/', VerifyToken, getRedFlags);
router.get('/:id',VerifyToken, getARecord);
router.post('/',VerifyToken, postRecord);
router.patch('/:id/location',VerifyToken, updateLocation);
router.patch('/:id/comment',VerifyToken, updateComment);
router.delete('/:id', deleteRecord);

export default router;