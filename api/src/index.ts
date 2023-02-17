import * as path from 'path';
import * as dotenv from 'dotenv';
import express from 'express';
import { getMonsterSummary, getMonsterDetail } from './monsters/monster.util';

const monsters = require('./monsters/monsters.routes');

dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}.env`) });
const app = express();

const Router = require('express-promise-router');
const router = new Router();

router.get('/monsters/:hash', async (req, res) => {
  const { hash } = req.params;
  const monsterDetail = await getMonsterDetail(hash);
  res.json(monsterDetail);
});

router.get('/monsters/summary/:hash', async (req, res) => {
  const { hash } = req.params;
  const monsterSummary = await getMonsterSummary(hash);
  res.json(monsterSummary);
});

router.all('/', (req, res) => {
    // TODO: Implement validation that a request is coming from the website.
    res.statusCode = 200;
    return res.send('200 OK');
});

app.use('/', router);

app.listen(process.env.API_PORT, () => {
  console.log(`API listening at localhost:${process.env.API_PORT}`);
})