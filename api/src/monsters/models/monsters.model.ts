import { MonsterPart } from './monsters.part.model';
import { MonsterPalette } from './monsters.palette.model';

interface Monster {
    hash: string;
    parts: {
        body: MonsterPart;
        arm: MonsterPart;
        leg: MonsterPart;
        eye: MonsterPart;
        detail: MonsterPart;
    };
    palette: MonsterPalette;
}

export { Monster };
