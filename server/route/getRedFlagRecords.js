import express from 'express';
import path from 'path';
import { getRedFlags, getARecord, postRecord, updateLocation, updateComment } from '../controller';
const router = express.Router();

router.get('/', getRedFlags);
router.get('/:id', getARecord);
router.post('/', postRecord);
router.patch('/:id/location', updateLocation);
router.patch('/:id/comment', updateComment);


export default router;