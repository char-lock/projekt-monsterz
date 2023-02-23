import { MonsterPaletteModel, MonsterPartModel, MonsterSummaryModel } from './monsters.models';
import * as db from '../common/db';

/** Fetches a monster's part summary from the database. */
export const fetchMonsterSummary = async (hash: string): Promise<MonsterSummaryModel> => {
    const { rows } = await db.query(`SELECT * FROM monster_summaries WHERE hash = '${hash}';`);
    return rows[0];
}

/** Saves a generated monster summary to the database.  */
export const saveMonsterSummary = async (monsterSummary: MonsterSummaryModel) => {
  await db.query(`INSERT INTO monster_summaries VALUES
    ('${monsterSummary.hash}', ${monsterSummary.bodyId}, ${monsterSummary.armLeftId},
    ${monsterSummary.armRightId}, ${monsterSummary.legLeftId}, ${monsterSummary.legRightId},
    ${monsterSummary.eyeId}, ${monsterSummary.mouthId}, ${monsterSummary.detailId})
  `);
}

/** Fetches the details for a monster part from the database. */
export const fetchMonsterPart = async (partId: number): Promise<MonsterPartModel> => {
    const { rows } = await db.query(`SELECT * FROM monster_parts WHERE id = ${partId};`);
    return rows[0];
}

/** Fetches the details for multiple mosnter parts from the database. */
export const fetchMonsterParts = async (partIds: number[]): Promise<MonsterPartModel[]> => {
    const { rows } = await db.query(`SELECT  * FROM monster_parts WHERE id IN (${partIds.join(', ')});`);
    return [...rows];
}

/** Fetches the details for a mosnter's palette. */
export const fetchMonsterPalette = async (paletteId: number): Promise<MonsterPaletteModel> => {
    const { rows } = await db.query(`SELECT * FROM monster_palettes WHERE id = ${paletteId};`);
    return rows[0];
}
