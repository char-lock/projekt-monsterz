import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, `..${path.sep}..${path.sep}..${path.sep}.conf`) });

import { MonsterDetailModel, MonsterPaletteModel, MonsterPartModel, MonsterSummaryModel } from "./monster.model";
import { fetchMonsterPalette, fetchMonsterPart, fetchMonsterParts, fetchMonsterSummary, saveMonsterSummary } from "./monster.data";
import { APILogger } from "../common/api.logger";

const logger: APILogger = new APILogger();

function splitHash(hash: string) {
    let hashSplit: string[] = [];
    for (let i = 0; i < hash.length;) {
        if ((i + 5) < hash.length) {
            hashSplit.push(hash.substring(i, i + 5));
            i += 5;
        } else {
            hashSplit.push(hash.substring(i));
            i = hash.length;
        }
    }
    return hashSplit;
}

function getPartIdsFromHash(hash: string) {
    const monsterLimit = parseInt(process.env.AVAILABLE_MONSTERS);
    const hashParts: string[] = splitHash(hash);
    let partIds: number[] = [];
    for (let hashPosition = 0; hashPosition < hashParts.length + 2; hashPosition++) {
        let slot = hashPosition + 1;
        if (hashPosition > 1) slot++;
        if (hashPosition > 2) slot++;
        let partValue = Math.round(parseInt(hashParts[hashPosition], 16) / 0xfffff * monsterLimit) + 1;
        let partId = parseInt(`${slot}${partValue}`);
        partIds.push(partId);
        if (hashPosition == 1) {
            slot++;
            partId = parseInt(`${slot}${partValue}`);
            partIds.push(partId);
        }
        if (hashPosition == 2) {
            slot++;
            partId = parseInt(`${slot}${partValue}`);
            partIds.push(partId);
        }
    }
    return partIds;
}

function generateMonsterSummary(hash: string): MonsterSummaryModel {
    const partIds: number[] = getPartIdsFromHash(hash);
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
    };
}

export async function getMonsterSummary(hash: string): Promise<MonsterSummaryModel> {
    let monsterSummary: MonsterSummaryModel = await fetchMonsterSummary(hash);
    if (!monsterSummary) {
            logger.info(`Could not locate a monster summary in database with hash [${hash}]. Generating ...`);
            monsterSummary = generateMonsterSummary(hash);
            saveMonsterSummary(monsterSummary);
            logger.info(`Saved monster summary to database.`);
    }
    return monsterSummary;
}

export async function getMonsterPart(partId: number): Promise<MonsterPartModel> {
    let monsterPart: MonsterPartModel = await fetchMonsterPart(partId);
    return monsterPart;
}

export async function getMonsterParts(partIds: number[]): Promise<MonsterPartModel[]> {
    let monsterParts: MonsterPartModel[] = await fetchMonsterParts(partIds);
    if (monsterParts.length == 0) {
        console.log(`No matching parts found for IDs in [${partIds.join(', ')}]`);
        monsterParts = null;
    }
    return monsterParts;
}

export async function getMonsterPalette(paletteId: number) {
    let monsterPalette: MonsterPaletteModel = await fetchMonsterPalette(paletteId);
    return monsterPalette;
}

export async function getMonsterDetail(hash: string): Promise<MonsterDetailModel> {
    let monsterSummary = await getMonsterSummary(hash);
    let partIds: number[] = [];
    partIds.push(monsterSummary.bodyId);
    partIds.push(monsterSummary.armLeftId);
    partIds.push(monsterSummary.armRightId);
    partIds.push(monsterSummary.legLeftId);
    partIds.push(monsterSummary.legRightId);
    partIds.push(monsterSummary.eyeId);
    partIds.push(monsterSummary.mouthId);
    partIds.push(monsterSummary.detailId);
    console.log(partIds);
    let monsterParts = await getMonsterParts(partIds);
    const paletteId = parseInt(hash[31], 16);
    let palette = await getMonsterPalette(paletteId);
    return {
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
    }
}