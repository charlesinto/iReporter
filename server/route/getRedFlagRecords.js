import express from 'express';
import path from 'path';
import { getRedFlags, getARecord, postRecord } from '../controller';
const router = express.Router();

router.get('/', getRedFlags);
router.get('/:id', getARecord);
router.post('/', postRecord)


export default router;