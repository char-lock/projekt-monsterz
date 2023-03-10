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

export interface IMonsterInfoDigest {
  hash: string,
  partIds: number[],
  paletteId: number
}

export interface IMonsterPalette {
  id: number,
  colours: string[]
}

export interface IMonsterPart {
  id: number,
  slot: MonsterSlot,
  imageData: string,
  palette: IMonsterPalette
}

export interface IMonsterSlotMap {
  body: IMonsterPart,
  arm: IMonsterPart,
  leg: IMonsterPart,
  eye: IMonsterPart,
  mouth: IMonsterPart,
  detail: IMonsterPart
}

export interface IMonsterInfo {
  hash: string,
  parts: IMonsterSlotMap,
  palette: IMonsterPalette
}
