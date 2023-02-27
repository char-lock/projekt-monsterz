export enum MonsterSlot {
  BODY = 1,
  ARM,
  LEG,
  EYE,
  MOUTH,
  DETAIL
}

export enum PaletteShade {
  DARKEST = 0,
  DARKER,
  DARK,
  BASELINE,
  LIGHT,
  LIGHTER,
  LIGHTEST
}

export interface MonsterInfoDigest {
  hash: string,
  partIds: number[],
  paletteId: number
}

export interface MonsterPalette {
  id: number,
  colours: string[7]
}

export interface MonsterPart {
  id: number,
  slot: MonsterSlot,
  imageData: string,
  palette: MonsterPalette
}

export interface MonsterSlotMap {
  body: MonsterPart,
  arm: MonsterPart,
  leg: MonsterPart,
  eye: MonsterPart,
  mouth: MonsterPart,
  detail: MonsterPart
}

export interface MonsterInfo {
  hash: string,
  parts: MonsterSlotMap,
  palette: MonsterPalette
}
