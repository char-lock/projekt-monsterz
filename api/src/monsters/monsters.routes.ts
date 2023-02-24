import Router from 'express-promise-router';
import MonstersController from './monsters.controller';

const router = Router();

// Monster -> Part Summary -> Invalid
router.get('/summary', (req, res) => {
  res.status(400).send({
    status: {
      code: 400,
      genericDesc: 'Bad Request',
      details: 'A hash is required in order to provide a monster summary.'
    },
    data: null
  });
});
// Monster -> Part Summary -> Valid
router.get('/summary/:hash', MonstersController.getMonsterSummary);

// Monster -> Details -> Invalid
router.get('/', (req, res) => {
  res.status(400).send({
    status: {
      code: 400,
      genericDesc: 'Bad Request',
      details: 'A hash is required in order to provide a monster\'s details.'
    },
    data: null
  });
});
// Monster -> Details -> Valid
router.get('/:hash', MonstersController.getMonsterDetails);

export default router;
