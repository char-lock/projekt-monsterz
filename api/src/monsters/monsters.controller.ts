import { Request, Response } from 'express';
import ApiLogger from '../common/logger';
import { MonsterSummaryModel } from './monsters.models';
import { fetchMonsterParts, fetchMonsterPalette } from './monsters.data';

/**
 * Returns an array containing the provided string separated into segments
 * of the requested length or less.
 */
const splitString = (source: string, segmentLength: number) => {
  if (segmentLength % 1 !== 0) {
    ApiLogger.warn('Used splitString function with a non-integer value.');
    segmentLength = segmentLength - (segmentLength % 1);
  }
  let stringSegments: string[] = [];
  // Iterate through the string from left to right, segmenting it into
  // the requested length until less characters remain.
  for (let i = 0; i < source.length;) {
    const limitIndex = i + segmentLength;
    if (limitIndex < source.length) {
      stringSegments.push(source.substring(i, limitIndex));
      i += segmentLength;
    } else {
      stringSegments.push(source.substring(i));
      i = source.length;
    }
  }
  return stringSegments;
}

/** Returns a list of monster part IDs generated from a provided hash-string. */
const generatePartIds = (hash: string) => {
  const monsterIdLimit = parseInt(process.env.MONSTER_COUNT);
  const hashSegments = splitString(hash, 5);
  let partIds: number[] = [];
  for (let hashPos = 0; hashPos < hashSegments.length; hashPos++) {
    // Track the current slot separately from the hash position for
    // multiple reasons -- 2 slots each for arms and legs being a major one.
    let currentSlot = hashPos + 1;
    if (hashPos > 1) currentSlot++;
    if (hashPos > 2) currentSlot++;
    const partValue = Math.floor(
      parseInt(hashSegments[hashPos], 16) / 0xfffff * monsterIdLimit) + 1;
    let partId = parseInt(`${currentSlot}${partValue}`);
    partIds.push(partId);
    if (hashPos == 1 || hashPos == 2) {
      currentSlot++;
      partId = parseInt(`${currentSlot}${partValue}`);
      partIds.push(partId);
    }
  }
  return partIds;
}

/** Returns a monster's summary details generated from a hash-string. */
const generateMonsterSummary = (hash: string): MonsterSummaryModel => {
  const partIds: number[] = generatePartIds(hash);
  // We can return the parts separated into order within an object, as
  // they are added into the array in slot order.
  return {
    hash: hash,
    bodyId: partIds[0],
    armLeftId: partIds[1],
    armRightId: partIds[2],
    legLeftId: partIds[3],
    legRightId: partIds[4],
    eyeId: partIds[5],
    mouthId: partIds[6],
    detailId: partIds[7]
  }
}

class MonstersController {

  /** Provides the details for the requested monster as part of the response. */
  static getMonsterDetails = async (req: Request, res: Response) => {
    const { hash } = req.params;
    if (!hash) res.status(404).send();
    // TODO: Test whether it is faster to generate the summary values on the fly or
    // to retrieve them from the database.
    const partIds = generatePartIds(hash);
    const monsterParts = await fetchMonsterParts(partIds);
    const paletteId = parseInt(hash[31], 16);
    const palette = await fetchMonsterPalette(paletteId);
    res.send({
      hash: hash,
      parts: {
        body: monsterParts[0],
        armLeft: monsterParts[1],
        armRight: monsterParts[2],
        legLeft: monsterParts[3],
        legRight: monsterParts[4],
        eye: monsterParts[5],
        mouth: monsterParts[6],
        detail: monsterParts[7]
      },
      palette: palette
    });
  }

  /** Provides the summary for the requested monster as part of the response.  */
  static getMonsterSummary = (req: Request, res: Response) => {
    const { hash } = req.params;
    if (!hash) res.status(404).send();
    // TODO: Test whether it is faster to generate the summary values on the fly or
    // to retrieve them from the database.
    res.send(generateMonsterSummary(hash));
  }

}

export default MonstersController;
