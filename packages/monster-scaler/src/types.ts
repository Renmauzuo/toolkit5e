import type { Statblock, Trait, Attack } from '@toolkit5e/base';

export interface MonsterVariant {
  name: string;
  type?: string;
  stats?: Record<number, Partial<Statblock>>;
  lockedStats?: Partial<Statblock>;
  traits?: string[];
}

export interface MonsterTemplate {
  name?: string;
  type: string;
  subtype?: string;
  alignment: string;
  race?: string;
  gender?: number;
  variants?: Record<string, MonsterVariant>;
  lockedStats: Partial<Statblock> & {
    attacks?: Record<string, Partial<Attack>>;
    traits?: Record<string, Partial<Trait>>;
    skills?: Record<string, number>;
    [key: string]: unknown;
  };
  stats: Record<number, Partial<Statblock> & {
    attacks?: Record<string, Partial<Attack>>;
    traits?: Record<string, Partial<Trait>>;
    [key: string]: unknown;
  }>;  traits?: string[];
  actions?: string[];
  bonusActions?: string[];
  sounds?: string[];
}

export interface ScaleMonsterOptions {
  /** ID of the chosen variant if this creature has variants */
  variant?: string;
  /** Index into the races array if the creature is a humanoid of "any race" */
  race?: number;
}

export interface Benchmarks {
  upper?: { cr: number; [key: string]: unknown };
  lower?: { cr: number; [key: string]: unknown };
}
