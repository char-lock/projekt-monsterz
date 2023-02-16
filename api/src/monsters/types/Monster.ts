import { MonsterBody } from "./MonsterBody";
import { MonsterPalette } from "./MonsterPalette";
import { MonsterPart } from "./MonsterPart";

import { parsePartIdsFromHash, validateHash, findPartBySlot } from "../../util/monsters.util";
import { MonsterSlot } from "./MonsterSlot";

/**
 * 
 * A representation of a monster with all of its parts and the relevant metadata.
 * 
 */
export class Monster {
    hash: string;
    parts: {
        body: MonsterBody;
        leftArm: MonsterPart;
        rightArm: MonsterPart;
        leftLeg: MonsterPart;
        rightLeg: MonsterPart;
        mouth: MonsterPart;
        eye: MonsterPart;
        detail: MonsterPart;
    };
    palette: MonsterPalette;

    /**
     * 
     * Construct a Monster from its hash.
     * There will be an attempt to get the details from the database,
     * but the parts can be generated if the hash is a new one.
     * 
     * @param hash md5 hash representing the monster
     * 
     */
    constructor(hash: string) {
        if (!validateHash(hash)) throw new Error('Provided hash is not a valid MD5 hash.');
        this.hash = hash;
        // Fetch part IDs for the hash, either through the database or through parsing.
        let partIds: number[] = []
        // TODO: Implement database request here.
        // Handle if the hash has never been seen before.
        if (partIds.length !== 8) {
            partIds = parsePartIdsFromHash(this.hash);
        }
        // Fetch the part data from the database and assign them to the
        // relevant properties.
        let partDetails = [];
        // TODO: Implement database request here.
        this.parts = {
          body: findPartBySlot(partDetails, MonsterSlot.BODY),
          leftArm: findPartBySlot(partDetails, MonsterSlot.LEFT_ARM),
          rightArm: findPartBySlot(partDetails, MonsterSlot.RIGHT_ARM),
          leftLeg: findPartBySlot(partDetails, MonsterSlot.LEFT_LEG),
          rightLeg: findPartBySlot(partDetails, MonsterSlot.RIGHT_LEG),
          mouth: findPartBySlot(partDetails, MonsterSlot.MOUTH),
          eye: findPartBySlot(partDetails, MonsterSlot.EYE),
          detail: findPartBySlot(partDetails, MonsterSlot.DETAIL)
        };
        // Calculate the palette ID and assign it.
        const paletteId: number = parseInt(hash[31], 16);
        let palette: MonsterPalette;
        // TODO: Implement database request here.
        this.palette = palette;
    }
}
