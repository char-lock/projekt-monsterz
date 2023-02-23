import Router from 'express-promise-router';
import MonstersController from './monsters.controller';

const router = Router();

// Monster -> Part Summary
router.get('/summary/:hash', MonstersController.getMonsterSummary);

// Monster -> Details
router.get('/:hash', MonstersController.getMonsterDetails);

export default router;
