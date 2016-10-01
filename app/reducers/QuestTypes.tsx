export interface QuestDetails {
  id?: string;
  url?: string;
  xml?: string;
  created?: string;
  modified?: string;
  published?: string;
  shared?: string;
  short_url?: string;
  meta_title?: string,
  meta_summary?: string,
  meta_minPlayers?: number,
  meta_maxPlayers?: number,
  meta_email?: string,
  meta_url?: string,
  meta_minTimeMinutes?: number,
  meta_maxTimeMinutes?: number,
  meta_author?: string
};

export type QuestCardName = 'COMBAT' | 'ROLEPLAY';

export type CombatDifficultyType = 'EASY' | 'NORMAL' | 'HARD' | 'IMPOSSIBLE';
export interface CombatDifficultySettings {
  roundTimeMillis: number,
  surgePeriod: number,
  damageMultiplier: number,
}

export type Enemy = {name: string, tier: number};
export type Loot = {tier: number, count: number};

export interface CombatAttack {
  surge: boolean;
  damage: number;
}

export type MidCombatPhaseNameType = 'DRAW_ENEMIES' | 'PREPARE' | 'TIMER' | 'SURGE' | 'RESOLVE_ABILITIES' | 'ENEMY_TIER' | 'PLAYER_TIER'
export type EndCombatPhaseNameType = 'VICTORY' | 'DEFEAT';

export interface MidCombatPhase {
  enemies: Enemy[];
  mostRecentAttack?: CombatAttack;
  roundCount: number;
  numAliveAdventurers: number;
  tier: number;
}
export interface EndCombatPhase {
  loot: Loot[];
  levelUp: boolean;
}

export type CombatPhase = MidCombatPhase | EndCombatPhase;
export type CombatPhaseNameType = MidCombatPhaseNameType | EndCombatPhaseNameType;

export interface CombatDetails {
  settings: CombatDifficultySettings;
  phase?: CombatPhase;
}