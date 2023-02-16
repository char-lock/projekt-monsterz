import { MonsterBody } from "./MonsterBody";
import { MonsterPalette } from "./MonsterPalette";
import { MonsterPart } from "./MonsterPart";

import { parsePartIdsFromHash, validateHash, findPartBySlot } from "../../util/monsters.util";
import { MonsterSlot } from "./MonsterSlot";

import { pgPool } from "../../common/db";
import { DataType } from "ts-postgres";

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
        pgPool.use((client) => {
            client.query(`
                SELECT bodyId, leftArmId, rightArmId, leftLegId, rightLegId, mouthId, eyeId, detailId
                FROM monsters 
                WHERE id = ${this.hash}
            `, [], [DataType.Numeric]).then(
                (result) => {
                    if (result.rows.length > 0) {
                        partIds = result.rows[0].map(parseInt);
                    }
            })
        });
        // Handle if the hash has never been seen before.
        if (partIds.length !== 8) {
            partIds = parsePartIdsFromHash(this.hash);
            pgPool.use((client) => {
                client.query(`
                    INSERT INTO monsters
                      (id, bodyId, leftArmId, rightArmId, leftLegId, rightLegId, mouthId, eyeId, detailId)
                      VALUES (${this.hash}, ${partIds.join(', ')});
                `);
            });
        }
        // Fetch the part data from the database and assign them to the
        // relevant properties.
        let partDetails: MonsterPart[] = [];
        pgPool.use((client) => {
            client.query(`
                SELECT * FROM monster_parts
                    WHERE partId IN (${partIds.join(', ')});
            `).then((result) => { 
                for (const row of result) {
                    const partObj: MonsterPart = row.names.reduce((carry, item) => {
                        carry[item] = row.get(item);
                        return carry;
                    }, {partId: 0, slot: 0, dataUrl: '', origin: [0.5, 0.5]});
                    if (partObj.partId != 0) partDetails.push(partObj);
                }
             });
        });
        if (partDetails.length < 8) throw new Error(`Not enough parts to build a monster. Expected 8, got ${partDetails.length}`);
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
        pgPool.use((client) => {
            client.query(`
                SELECT darkest, darker, dark, base, light, lighter, lightest FROM monster_palettes
                    WHERE paletteId = ${paletteId};
            `).then((result) => {
                palette = result.names.reduce((carry, item) => {
                    carry.colours[item] = result.rows[0][result.names.findIndex((value) => { return value === item; })]
                    return carry;
                }, {
                    paletteId: paletteId,
                    colours: { 
                        darkest: '',
                        darker: '', 
                        dark: '', 
                        base: '', 
                        light: '',
                        lighter: '',
                        lightest: ''
                    } 
                });
            });
        });
        this.palette = palette;
    }
}
