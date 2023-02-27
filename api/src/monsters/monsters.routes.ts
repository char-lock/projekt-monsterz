import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { defaultBadRequest } from '../common/models/response.model';
import MonstersController from './monsters.controller';

const router = Router();

// Monster -> Details
router.get('/', (req: Request, res: Response) => {
  res.status(400).send(defaultBadRequest('A hash is required in order to provide a monster\'s details.'));
});
router.get('/:hash', MonstersController.getMonsterDetails);
// Monster -> Part Summary
router.get('/:hash/parts', MonstersController.getMonsterSummary);

export default router;
