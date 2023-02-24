export const BodySlotPositions = {
  LEFT_ARM: [0.1, 0.66],
  RIGHT_ARM: [0.9, 0.66],
  LEFT_LEG: [0.33, 0.1],
  RIGHT_LEG: [0.66, 0.1],
  EYE: [0.5, 0.75],
  MOUTH: [0.5, 0.5],
  DETAIL: [0.5, 0.9]
}

export enum MonsterSlot {
  BODY = 1,
  LEFT_ARM,
  RIGHT_ARM,
  LEFT_LEG,
  RIGHT_LEG,
  EYE,
  MOUTH,
  DETAIL
}

export type MonsterSlotModel = {
  body: MonsterPartModel;
  armLeft: MonsterPartModel;
  armRight: MonsterPartModel;
  legLeft: MonsterPartModel;
  legRight: MonsterPartModel;
  eye: MonsterPartModel;
  mouth: MonsterPartModel;
  detail: MonsterPartModel;
}

export type MonsterPartModel = {
  id: number;
  slot: MonsterSlot;
  dataUrl: string;
  joint: [number, number];
}

export type MonsterPaletteModel = {
  id: number;
  darkest: string;
  darker: string;
  dark: string;
  base: string;
  light: string;
  lighter: string;
  lightest: string;
}

export type MonsterSummaryModel = {
  hash: string;
  bodyId: number;
  armLeftId: number;
  armRightId: number;
  legLeftId: number;
  legRightId: number;
  eyeId: number;
  mouthId: number;
  detailId: number;
}

export type MonsterDetailModel = {
  hash: string;
  parts: MonsterSlotModel;
  palette: MonsterPaletteModel;
}
