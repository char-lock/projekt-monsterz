import { IMonsterInfoDigest, IMonsterPalette, IMonsterPart } from './monsters.models';
import * as db from '../common/db';
import ApiLogger from '../common/logger';
import DummyDb from '../common/db.dummy';
import { parseBoolean } from '../common/config';

import * as dotenv from 'dotenv';
dotenv.config

const testingData = parseBoolean(process.env.API_TESTING_DATA);

export default class MonsterDataBus {

  static fetchMonsterDigest = async (monsterHash: string): Promise<IMonsterInfoDigest[]> => {
    if (testingData) {
      ApiLogger.info('Using pre-loaded testing data for request ...');
      return DummyDb.loadMonsterDigest(monsterHash);
    }
    return db.query(
      `SELECT * FROM monster_summaries WHERE data @> {'hash' = '${monsterHash}'};`
    )?.then((result) => {
      if (result.rowCount <= 0) {
        ApiLogger.info(`Unable to locate a part list for monster with hash '${monsterHash}'`);
        return [];
      }
      const partLists = result.rows.map((row) => {
        return JSON.parse(row.data) as IMonsterInfoDigest;
      });
      return partLists;
    });
  };

  /** Saves a generated monster summary to the database.  */
  static saveMonsterSummary = async (monsterDigest: IMonsterInfoDigest): Promise<IMonsterInfoDigest> => {
    if (testingData) {
      ApiLogger.info('Using pre-loaded testing data for request ...');
      DummyDb.saveMonsterDigest(monsterDigest);
      return monsterDigest;
    }
    return db.query(
      `INSERT INTO monster_summaries (data) VALUES ('${JSON.stringify(monsterDigest)}');`
    ).then(() => { return monsterDigest; });
  };

  /** Fetches the details for a monster part from the database. */
  static fetchMonsterPart = async (partId: number): Promise<IMonsterPart[]> => {
    if (testingData) {
      ApiLogger.info('Using pre-loaded testing data for request ...');
      return DummyDb.loadMonsterPart(partId);
    }
    return db.query(
      `SELECT * FROM monster_parts WHERE data->id = ${partId};`
    ).then((result) => {
      const partInfo = result.rows.map((row) => {
        return JSON.parse(row.data) as IMonsterPart;
      });
      return partInfo;
    });
  };

  /** Fetches the details for multiple mosnter parts from the database. */
  static fetchMonsterParts = async (partIds: number[]): Promise<IMonsterPart[]> => {
    if (testingData) {
      ApiLogger.info('Using pre-loaded testing data for request ...');
      return partIds.flatMap((value) => { return DummyDb.loadMonsterPart(value); });
    }
    return db.query(`SELECT  * FROM monster_parts WHERE data->id IN (${partIds.join(', ')});`).then((result) => {
      const parts = result.rows.map((row) => {
        return JSON.parse(row.data) as IMonsterPart;
      });
      return parts;
    });
  };

  /** Fetches the details for a mosnter's palette. */
  static fetchMonsterPalette = async (paletteId: number): Promise<IMonsterPalette[]> => {
    if (testingData) {
      ApiLogger.info('Using pre-loaded testing data for request ...');
      return DummyDb.loadPalette(paletteId);
    }
    return db.query(`SELECT * FROM monster_palettes WHERE data @> ${paletteId};`).then((result) => {
      const palettes = result.rows.map((row) => {
        return JSON.parse(row.data) as IMonsterPalette;
      });
      return palettes;
    });
  };

}
