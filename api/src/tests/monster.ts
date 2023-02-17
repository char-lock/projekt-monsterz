import { Monster } from '../monsters/types/Monster';

const testHash = '00001000010000100001000010000111';

async function run() {
    const monster = new Monster(testHash);
    await monster.setup();
    console.log(monster);
}

run();
