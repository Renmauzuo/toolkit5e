import type { Statblock } from '@toolkit5e/base';

export interface WildShapeOptions {
  int: number;
  wis: number;
  cha: number;
  resistances?: string[];
  immunities?: string[];
  conditionImmunities?: string[];
  saves?: string[];
  magicAttacks?: boolean;
  proficiency?: number;
  bonusArmor?: number;
  saveBonus?: number;
  bonusHP?: number;
  attackBonus?: number;
  damageBonus?: number;
  riderDice?: number;
  riderDieSize?: number;
  riderType?: string;
}

export interface RenderStatblockOptions {
  wildShape?: WildShapeOptions;
}

/** A function that renders a statblock into a target element */
export type StatblockRenderer = (statblock: Statblock, target: HTMLElement, options?: RenderStatblockOptions) => void;
