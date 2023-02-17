import { getMonsterDetail, getMonsterPart, getMonsterParts, getMonsterSummary } from "./monster.util";

function testGetMonsterSummary(hash: string) {
    getMonsterSummary(hash).then((response) => { console.log(response); });
}

function testGetMonsterPart(partId: number) {
    getMonsterPart(partId).then((response) => { console.log(response); });
}

function testGetMonsterParts(partIds: number[]) {
    getMonsterParts(partIds).then((response) => { console.log(response); });
}

function testGetMonsterDetail(hash: string) {
    getMonsterDetail(hash).then((response) => { console.log(response); });
}

export function runMonsterTests() {
    const testHash = '00001000010000100001000010000111';
    // testGetMonsterSummary(testHash);
    // testGetMonsterPart(81);
    // testGetMonsterParts([11, 21, 31]);
    // testGetMonsterDetail(testHash);
}
