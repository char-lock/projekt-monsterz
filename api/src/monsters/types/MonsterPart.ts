import { MonsterSlot } from './MonsterSlot';
import { parseSlotFromPartId } from '../../util/monsters.util';

/**
 * 
 * A generic part of the monster and all that they entail.
 * 
 */
export class MonsterPart {
  partId: number;
  slot: MonsterSlot;
  dataUrl: string;
  // Each coordinate is between 0 and 1 --
  // with 0 indicating the furthest left or down,
  // and 1 indicating the furthest right or up.
  origin: [number, number];

  /**
   * 
   * Construct a MonsterPart using the partId and the dataUrl,
   * which serve as the bare minimum data needed to create a usable part.
   * 
   * @param partId a numeric id for the part
   * @param dataUrl a base64-encoded data URL holding the part image
   * 
   */
  constructor(partId: number, dataUrl: string) {
    this.partId = partId;
    this.slot = parseSlotFromPartId(this.partId);
    this.dataUrl = dataUrl;
    this.origin = [0.5, 0.5];
  }
}
