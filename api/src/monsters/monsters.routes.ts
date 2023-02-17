import { getMonsterDetail, getMonsterSummary } from "./monster.util";

const Router = require('express-promise-router');

const router = new Router();

router.get('/summary/:hash', async (req, res) => {
    const { hash } = req.params;
    const monsterSummary = await getMonsterSummary(hash);
    res.json(monsterSummary);
});

router.get('/:hash', async (req, res) => {
    const { hash } = req.params;
    const monsterDetail = await getMonsterDetail(hash);
    res.json(monsterDetail);
})

export { router };