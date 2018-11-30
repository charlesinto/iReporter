import express from 'express';
import path from 'path';
import { getRedFlags, getARecord, postRecord, updateLocation } from '../controller';
const router = express.Router();

router.get('/', getRedFlags);
router.get('/:id', getARecord);
router.post('/', postRecord);
router.patch('/:id/location', updateLocation);


export default router;