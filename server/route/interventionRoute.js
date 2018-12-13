import express from 'express';
import path from 'path';
import VerifyToken from '../middleware/authentication';
import InterventionController from '../controller/interventionController';

const Intervention = new InterventionController();
const router = express.Router();

router.get('/', VerifyToken, Intervention.getInterventionRecord);
router.get('/:id', VerifyToken, Intervention.getASingleRecord);
router.post('/', VerifyToken, Intervention.createNewRecord);
router.patch('/:id/comment', VerifyToken, Intervention.updateInterventionComment);
router.patch('/:id/location', VerifyToken, Intervention.updateInterventionLocation);
router.delete('/:id', VerifyToken, Intervention.deleteInterventionRecord);
router.patch('/:id/status', VerifyToken, Intervention.updateInterventionStatus);

export default router;
