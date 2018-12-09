import express from 'express';
import path from 'path';
import { VerifyToken } from '../middleware'
import { getRedFlags, getARecord, postRecord, updateLocation, updateComment, deleteRecord } from '../controller';
const router = express.Router();

router.get('/', VerifyToken, getRedFlags);
router.get('/:id', getARecord);
router.post('/', postRecord);
router.patch('/:id/location', updateLocation);
router.patch('/:id/comment', updateComment);
router.delete('/:id', deleteRecord);

export default router;