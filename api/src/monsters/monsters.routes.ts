import { Request, Response } from 'express';
import Router from 'express-promise-router';
import { createResponse } from '../common/response';
import MonstersController from './monsters.controller';

const router = Router();

// Monster -> Details
router.get('/', (req: Request, res: Response) => {
  res.status(400).send(
    createResponse(400, 'A hash is required in order to provide a monster\'s details.', null));
});
router.get('/:hash', MonstersController.getMonsterDetails);
// Monster -> Part Summary
router.get('/:hash/parts', MonstersController.getMonsterSummary);
// Handle remaining requests
router.all('/', (req: Request, res: Response) => {
  res.status(404).send(createResponse(404, '', null));
});
router.all('*', (req: Request, res: Response) => {
  res.status(404).send(createResponse(404, '', null));
});
router.all('/:hash/*', (req: Request, res: Response) => {
  res.status(404).send(createResponse(404, '', null));
});

export default router;
