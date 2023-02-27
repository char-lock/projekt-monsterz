import { MonsterInfoDigest, MonsterPalette, MonsterPart } from './monsters.models';
import * as db from '../common/db';

/** Fetches a monster's part summary from the database. */
export const fetchMonsterSummary = async (hash: string): Promise<MonsterInfoDigest> => {
  const { rows } = await db.query(`SELECT * FROM monster_summaries WHERE data @> {'hash' = '${hash}'};`);
  return rows[0];
};

/** Saves a generated monster summary to the database.  */
export const saveMonsterSummary = async (monsterSummary: MonsterInfoDigest) => {
  await db.query(`INSERT INTO monster_summaries VALUES
    ('${JSON.stringify(monsterSummary)}');
  `);
};

/** Fetches the details for a monster part from the database. */
export const fetchMonsterPart = async (partId: number): Promise<MonsterPart> => {
  const { rows } = await db.query(`SELECT * FROM monster_parts WHERE data->id = ${partId};`);
  return rows[0];
};

/** Fetches the details for multiple mosnter parts from the database. */
export const fetchMonsterParts = async (partIds: number[]): Promise<MonsterPart[]> => {
  const { rows } = await db.query(`SELECT  * FROM monster_parts WHERE data->id IN (${partIds.join(', ')});`);
  return [...rows];
};

/** Fetches the details for a mosnter's palette. */
export const fetchMonsterPalette = async (paletteId: number): Promise<MonsterPalette> => {
  const { rows } = await db.query(`SELECT * FROM monster_palettes WHERE data @> ${paletteId};`);
  return rows[0];
};
