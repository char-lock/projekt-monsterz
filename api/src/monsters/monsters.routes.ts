import { Request, Response, NextFunction } from 'express';
import { sql } from '../common/services/pg';

import { Monster } from './models/monsters.model';
import { MonsterPalette } from './models/monsters.palette.model';
import { MonsterPart } from './models/monsters.part.model';

require('dotenv').config({ path: '../../../../.env' });

/** Ensures that a provided hash meets the parameters of being valid. Returns validity. */
const validateMonsterHash = (monsterHash: string) => {
    return true;
}

/** Returns the corresponding part ID based upon the slot and hexstring provided. */
const calculatePartId = (hex: string, slot: number) => {
    const monsterPartCount = parseInt(process.env.AVAILABLE_MONSTERS) || 0;
    const maxHex = 0xfffff;
    let hexValue = parseInt(hex, 8);
    let partId = Math.round(hexValue / maxHex * monsterPartCount);
    return parseInt(`${slot}${partId}`);
}

/** Returns a dictionary of UUIDs for the individual parts of a monster. */
const parseMonsterHash = (monsterHash: string) => {
    if (!validateMonsterHash(monsterHash)) return {};
    return {
        "body": calculatePartId(monsterHash.substring(0, 5), 1),
        "arm": calculatePartId(monsterHash.substring(5, 10), 2),
        "leg": calculatePartId(monsterHash.substring(10, 15), 3),
        "eye": calculatePartId(monsterHash.substring(15, 20), 4),
        "detail": calculatePartId(monsterHash.substring(20, 25), 5),
        "palette": parseInt(monsterHash.substring(25, 26), 16)
    };
}

const getMonsterPart = async (partId: number) => {
    const monsterPart: [MonsterPart] = await sql`SELECT * FROM monster_parts WHERE id = ${partId}`;
    return monsterPart;
}

const getMonsterParts = async (partIds: number[]) => {
    const monsterParts: MonsterPart[] = await sql`SELECT * FROM monster_parts WHERE id IN (${partIds.join(', ')})`;
    return monsterParts;
}

const getMonsterPalette = async (paletteId: number) => {
    const monsterPalette: [MonsterPalette] = await sql`SELECT * FROM monster_palettes where id = ${paletteId}`;
    return monsterPalette;
}

const findPartBySlot = (parts: MonsterPart[], slot: number) => {
    parts.forEach( (value: MonsterPart) => {
        // Determine where the slotId is for the monsterPart.
        let slotPosition = 1;
        while ((value.id % slotPosition) != value.id) {
            slotPosition *= 10;
        }
        slotPosition /= 10; // Required for when the while loop ends, as it will move one position too many.
        // Check if the current part has an id for the slot.
        let valueSlot = value.id - (value.id % (slotPosition / 10));
        if (valueSlot / slotPosition === slot) {
            return value;
        }
    });
    return null;
}

/** Pulls a monster based upon the hash provided. */
const getMonster = async (req: Request, res: Response, next: NextFunction) => {
  let monsterHash = (req.params.hash) ? req.params.hash : null;
  // Handle if no monster hash was provided as part of the request.
  if (!validateMonsterHash(monsterHash)) return res.status(404).json({
    message: 'No monster hash provided'
  });
  // Calculate the UUID for the parts of the hash.
  // Example Hash: 098f6bcd4621d373cade4e832627b4f6
  // 098f6 | bcd46 | 21d37 | 3cade | 4e832 | 627b4 | f6
  let monsterIds = parseMonsterHash(monsterHash);
  if (!monsterIds.body) return {};
  let monsterParts = await getMonsterParts([monsterIds.body, monsterIds.arm, monsterIds.leg, monsterIds.eye, monsterIds.detail]);
  let monster: Monster = {
    hash: monsterHash,
    parts: {
        body: findPartBySlot(monsterParts, 1),
        arm: findPartBySlot(monsterParts, 2),
        leg: findPartBySlot(monsterParts, 3),
        eye: findPartBySlot(monsterParts, 4),
        detail: findPartBySlot(monsterParts, 5)
    },
    palette: (await getMonsterPalette(monsterIds.palette))[0]
  }
  return monster;
};
