import express from 'express';
import path from 'path';
import { getRedFlags, getARecord } from '../controller';
const router = express.Router();

router.get('/', getRedFlags);
router.get('/:id', getARecord);


export default router;