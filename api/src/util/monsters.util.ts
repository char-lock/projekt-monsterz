import { MonsterSlot } from "../monsters/types/MonsterSlot";
import { MonsterPart } from "../monsters/types/MonsterPart";

/**
 * 
 * Searches a provided list for the first part assign to the requested slot and
 * returns it. If there is no part in the list assigned to the slot, returns null.
 * 
 * @param partList list of parts to search
 * @param slot slot for which to search
 * 
 */
function findPartBySlot(partList: MonsterPart[], slot: MonsterSlot) {
    partList.forEach(
        (value) => {
            if (value.slot == slot) return value;
        }
    )
    return null;
}

/**
 * 
 * Returns a list of part IDs derived from the hash.
 * 
 * @param hash the hash from which to pull part IDs.
 *  
 */
function parsePartIdsFromHash(hash: string): number[] {
  const partSets = parseInt(process.env.AVAILABLE_MONSTERS);
  let partIds: number[] = [];
  for (let i = 0; i < 9; i++) {
    let hashPart = i;
    // Adjust the multiplier for the hash substring.
    if (i >= 2) hashPart--;
    if (i >= 4) hashPart--;
    let partHash = hash.substring(hashPart * 5, (hashPart * 5) + 5);
    let partValue = parseInt(partHash, 16);
    partValue = Math.ceil(partValue / 0xfffff * partSets);
    partIds.push(parseInt(`${i + 1}${partValue}`));
    if (i === 1 || i === 3) {
        i++;
        partIds.push(parseInt(`${i + 1}${partValue}`));
    }
  }
  return partIds;
}

function parseSlotFromPartId(partId: number): MonsterSlot {
  let slotPosition = 1;
  // Once we are exactly one digit more than the entire id,
  // the loop will terminate.
  while (partId % slotPosition != partId) { slotPosition *= 10; }
  // Because of the nature of the loop, we need to back up one position
  // for the true position of the slot.
  slotPosition /= 10;
  const slotValue = (partId - (partId % slotPosition)) / slotPosition;
  return slotValue;
}

/**
 * 
 * Returns whether or not a hash matches the requirements to be a possible
 * result of the MD5 algorithm.
 * 
 * @param hash the hash to validate
 * 
 */
function validateHash(hash: string): boolean {
  if (hash.length !== 32) return false;
  if (!hash.match(/^[0-9a-fA-F]+$/)) return false;
  return true;
}

export { findPartBySlot, parseSlotFromPartId, parsePartIdsFromHash, validateHash };
