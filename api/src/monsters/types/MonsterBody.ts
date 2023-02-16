import { MonsterPart } from "./MonsterPart";
import { MonsterSlot } from "./MonsterSlot";

export class MonsterBody extends MonsterPart {
    slotPositions: {
        LEFT_ARM: [number, number];
        RIGHT_ARM: [number, number];
        LEFT_LEG: [number, number];
        RIGHT_LEG: [number, number];
        EYE: [number, number];
        MOUTH: [number, number];
        DETAIL: [number, number];
    };

    constructor(partId: number, dataUrl: string) {
        super(partId, dataUrl);
        this.slotPositions = {
            LEFT_ARM: [0.1, 0.66],
            RIGHT_ARM: [0.9, 0.66],
            LEFT_LEG: [0.33, 0.1],
            RIGHT_LEG: [0.66, 0.1],
            EYE: [0.5, 0.75],
            MOUTH: [0.5, 0.5],
            DETAIL: [0.5, 0.9]
        };
    }

    /**
     * 
     * Returns the relative position on the body to attach a part.
     * 
     * @param slot targetted slot
     * 
     */
    getSlotPosition(slot: MonsterSlot): [number, number] {
        return this.slotPositions[MonsterSlot[slot]];
    }
}