import { Request, Response } from 'express';
import ApiLogger from '../common/logger';
import { MonsterInfoDigest } from './monsters.models';
import { fetchMonsterParts, fetchMonsterPalette } from './monsters.data';
import { defaultNotExist, defaultSuccess } from '../common/models/response.model';

/**
 * Returns an array containing the provided string separated into segments
 * of the requested length or less.
 */
const splitString = (source: string, segmentLength: number) => {
  if (segmentLength % 1 !== 0) {
    ApiLogger.warn('Used splitString function with a non-integer value.');
    segmentLength = segmentLength - (segmentLength % 1);
  }
  const stringSegments: string[] = [];
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

/** Returns whether the provided string is a valid MD5 hash. */
const validateHash = (hash: string) => {
  // Check for the proper MD5 length.
  if (hash.length != 32) return false;
  // Ensure hexidecimal values.
  const validHex = /^[a-fA-F0-9]+$/
  return validHex.test(hash);
}

/** Returns a list of monster part IDs generated from a provided hash-string. */
const generatePartIds = (hash: string) => {
  const monsterIdLimit = parseInt(process.env.MONSTER_COUNT);
  const hashSegments = splitString(hash, 5);
  const partIds: number[] = [];
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
const generateMonsterSummary = (hash: string): MonsterInfoDigest => {
  const partIds: number[] = generatePartIds(hash);
  // We can return the parts separated into order within an object, as
  // they are added into the array in slot order.
  return {
    hash: hash,
    partIds: partIds,
    paletteId: parseInt(hash.substring(hash.length - 1))
  };
}

class MonstersController {

  /** Provides the details for the requested monster as part of the response. */
  static getMonsterDetails = async (req: Request, res: Response) => {
    const { hash } = req.params;
    if (!hash || hash === '') {
      res.status(400).send({
        status: {
          code: 400,
          genericDesc: 'Bad Request',
          details: 'A hash is required in order to provide a monster\'s details.'
        },
        data: null
      });
      return;
    }
    if (!validateHash(hash)) {
      res.status(400).send({
        status: {
          code: 400,
          genericDesc: 'Bad Request',
          details: 'The provided hash is invalid. Please ensure you have provided a proper MD5 hash.'
        },
        data: null
      });
      return;
    }
    // TODO: Test whether it is faster to generate the summary values on the fly or
    // to retrieve them from the database.
    const partIds = generatePartIds(hash);
    const monsterParts = await fetchMonsterParts(partIds);
    const failureResponse = defaultNotExist('Unable to locate details for requested monster.');
    if (monsterParts.length < partIds.length) {
      ApiLogger.warn(`Unable to locate all of the monster parts for ID ${hash}`);
      res.status(404).send(failureResponse);
      return;
    }
    const paletteId = parseInt(hash[31], 16);
    const palette = await fetchMonsterPalette(paletteId);
    if (!palette) {
      ApiLogger.warn(`Unable to locate palette details for ID ${hash}`);
      res.status(404).send(failureResponse);
      return;
    }
    const resData = {
      hash: hash,
      parts: {
        body: monsterParts[0],
        arm: monsterParts[1],
        leg: monsterParts[2],
        eye: monsterParts[3],
        mouth: monsterParts[4],
        detail: monsterParts[5]
      },
      palette: palette
    };
    res.status(200).send(defaultSuccess(resData));
  }

  /** Provides the summary for the requested monster as part of the response.  */
  static getMonsterSummary = (req: Request, res: Response) => {
    const { hash } = req.params;
    if (!hash || hash == '') {
      res.status(400).send({
        status: {
          code: 400,
          genericDesc: 'Bad Request',
          details: 'A hash is required in order to provide a monster summary.'
        },
        data: null
      });
      return;
    }
    if (!validateHash(hash)) {
      res.status(400).send({
        status: {
          code: 400,
          genericDesc: 'Bad Request',
          details: 'The provided hash is invalid. Please ensure you have provided a proper MD5 hash.'
        },
        data: null
      });
      return;
    }
    // TODO: Test whether it is faster to generate the summary values on the fly or
    // to retrieve them from the database.
    res.status(200).send(defaultSuccess(generateMonsterSummary(hash)));
  }

}

export default MonstersController;
