interface MonsterPart {
    id: number;
    slot: string;
    data: string;
    size: { height: number; width: number; };
    pivot: { x: number; y: number; }
}

export { MonsterPart };
