import {DifficultyType, CombatDifficultySettings, CombatAttack, MidCombatPhase, EndCombatPhase, Enemy, Loot, CombatState, isCombatPhase} from './QuestTypes'
import {AppState} from './StateTypes'
import {InitCombatAction, CombatTimerStopAction, TierSumDeltaAction, AdventurerDeltaAction, NavigateAction, CombatVictoryAction} from '../actions/ActionTypes'
import {handleChoice, loadCombatNode, CombatResult} from '../QuestParser'

function getDifficultySettings(difficulty: DifficultyType): CombatDifficultySettings {
  switch(difficulty) {
    case 'EASY':
    return {
      roundTimeMillis: 15000,
      surgePeriod: 4,
      damageMultiplier: 0.75,
    };
    case 'NORMAL':
    return {
      roundTimeMillis: 10000,
      surgePeriod: 3,
      damageMultiplier: 1.0,
    };
    case 'HARD':
    return {
      roundTimeMillis: 8000,
      surgePeriod: 3,
      damageMultiplier: 1.5,
    };
    case 'IMPOSSIBLE':
    return {
      roundTimeMillis: 6000,
      surgePeriod: 2,
      damageMultiplier: 2.0,
    };
    default:
      throw new Error("Unknown difficulty " + difficulty);
  }
}

export function isSurgeRound(combat: CombatState): boolean {
  let rounds = combat.roundCount;
  let surgePd = combat.surgePeriod;
  return (surgePd - (rounds % surgePd + 1)) === 0;
}

export function generateCombatAttack(combat: CombatState, elapsedMillis: number): CombatAttack {
  // enemies each get to hit once - twice if the party took too long
  let damage = 0;
  let attackCount = combat.tier;
  if (combat.roundTimeMillis - elapsedMillis < 0) {
    attackCount *= 2;
  }

  // Attack once for each tier
  for (var i = 0; i < attackCount; i++) {
    damage += _randomAttackDamage();
  }

  // Scale according to multiplier, then round to whole number.
  damage = Math.round(damage * combat.damageMultiplier);

  return {
    surge: isSurgeRound(combat),
    damage,
  }
}

export function generateLoot(maxTier: number): Loot[] {
  var loot: Loot[] = [
    {tier: 1, count: 0},
    {tier: 2, count: 0},
    {tier: 3, count: 0},
  ];

  while (maxTier > 0) {
    var r: number = Math.random();

    if (r < 0.1 && maxTier >= 3) {
      maxTier -= 3;
      loot[2].count++;
    } else if (r < 0.4 && maxTier >= 2) {
      maxTier -= 2;
      loot[1].count++;
    } else {
      maxTier -= 1;
      loot[0].count++;
    }

  }

  for (var i = loot.length-1; i >= 0; i--) {
    if (!loot[i].count) {
      loot.splice(i, 1);
    }
  }

  return loot;
};

function _randomAttackDamage() {
  // D = Damage per ddt (0, 1, or 2 discrete)
  // M = miss, H = hit, C = crit, P(M) + P(H) + P(C) = 1
  // E[D] = Expected damage for a single second
  // P(C) = 1/3 * P(H)
  // P(M) = 1 - 4/3 * P(H)
  // E[D] = 0 * P(M) + 1 * P(H) + 2 * P(C) = 0.9

  var r = Math.random();
  if (r < 0.4) {
    return 0;
  } else if (r < 0.5) {
    return 2;
  } else { // r >= 0.5
    return 1;
  }
};

export function combat(state: CombatState, action: Redux.Action): CombatState {
  var newState: CombatState;
  // TODO: Difficulty settings should change with settings change.
  switch(action.type) {
    case 'INIT_COMBAT':
      let tierSum: number = 0;
      let combatAction = action as InitCombatAction;
      let enemies: Enemy[] =  (combatAction.node) ? loadCombatNode(combatAction.node).enemies : [];
      for (let enemy of enemies) {
        tierSum += enemy.tier;
      }
      return Object.assign({
        enemies: enemies,
        roundCount: 0,
        numAliveAdventurers: combatAction.numPlayers,
        tier: tierSum,
      }, getDifficultySettings(combatAction.difficulty));
    case 'COMBAT_TIMER_STOP':
      let elapsedMillis: number = (action as CombatTimerStopAction).elapsedMillis;
      return Object.assign({}, state, {
        mostRecentAttack: generateCombatAttack(state, elapsedMillis),
        roundCount: state.roundCount + 1,
      });
    case 'COMBAT_DEFEAT':
      return Object.assign({}, state, {
        loot: [],
        levelUp: false,
      });
    case 'COMBAT_VICTORY':
      let victoryAction = action as CombatVictoryAction;
      return Object.assign({}, state, {
        loot: generateLoot(victoryAction.maxTier),
        levelUp: (victoryAction.numPlayers <= victoryAction.maxTier)
      });
    case 'TIER_SUM_DELTA':
      let newTierCount = state.tier + (action as TierSumDeltaAction).delta;
      if (newTierCount < 0) {
        return state;
      }
      return Object.assign({}, state, {tier: newTierCount});
    case 'ADVENTURER_DELTA':
      let newAdventurerCount = state.numAliveAdventurers + (action as AdventurerDeltaAction).delta;
      if (newAdventurerCount > (action as AdventurerDeltaAction).numPlayers || newAdventurerCount < 0) {
        return state;
      }
      return Object.assign({}, state, {numAliveAdventurers: newAdventurerCount});
    default:
      return state;
  }
}