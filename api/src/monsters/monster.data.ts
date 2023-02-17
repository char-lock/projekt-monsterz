import { MonsterPaletteModel, MonsterPartModel, MonsterSummaryModel } from './monster.model';
import * as db from '../common/db';

export async function fetchMonsterSummary(hash: string): Promise<MonsterSummaryModel> {
    const { rows } = await db.query(`SELECT * FROM monster_summaries WHERE hash = '${hash}';`, []);
    return rows[0];
}

export async function saveMonsterSummary(monsterSummary: MonsterSummaryModel) {
    await db.query(`INSERT INTO monster_summaries VALUES
        ('${monsterSummary.hash}', ${monsterSummary.bodyId}, ${monsterSummary.armLeftId},
            ${monsterSummary.armRightId}, ${monsterSummary.legLeftId}, ${monsterSummary.legRightId},
            ${monsterSummary.eyeId}, ${monsterSummary.mouthId}, ${monsterSummary.detailId})
    `, []);
}

export async function fetchMonsterPart(partId: number): Promise<MonsterPartModel> {
    const { rows } = await db.query(`SELECT * FROM monster_parts WHERE id = ${partId};`, []);
    return rows[0];
}

export async function fetchMonsterParts(partIds: number[]): Promise<MonsterPartModel[]> {
    const { rows } = await db.query(`SELECT  * FROM monster_parts WHERE id IN (${partIds.join(', ')});`, []);
    return [...rows];
}

export async function fetchMonsterPalette(paletteId: number): Promise<MonsterPaletteModel> {
    const { rows } = await db.query(`SELECT * FROM monster_palettes WHERE id = ${paletteId};`, []);
    return rows[0];
}
