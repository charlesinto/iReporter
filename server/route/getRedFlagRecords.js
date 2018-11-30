import express from 'express';
import path from 'path';
import { getRedFlags, getARecord, postRecord, updateLocation, updateComment, deleteRecord } from '../controller';
const router = express.Router();

router.get('/', getRedFlags);
router.get('/:id', getARecord);
router.post('/', postRecord);
router.patch('/:id/location', updateLocation);
router.patch('/:id/comment', updateComment);
router.delete('/:id', deleteRecord);

export default router;