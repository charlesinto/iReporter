import express from 'express';
import VerifyToken from '../middleware/authentication';
import RedFlagController from '../controller/redFlagController';

const RedFlag = new RedFlagController();
const router = express.Router();

router.get('/', VerifyToken, RedFlag.getRedFlags);
router.get('/:id', VerifyToken, RedFlag.getARecord);
router.post('/', VerifyToken, RedFlag.postRecord);
router.patch('/:id/location', VerifyToken, RedFlag.updateLocation);
router.patch('/:id/comment', VerifyToken, RedFlag.updateComment);
router.delete('/:id', VerifyToken, RedFlag.deleteRecord);
router.patch('/:id/status', VerifyToken, RedFlag.updateRedFlagStatus);

export default router;
