import {
  QuestNodeAction,
  InitCombatAction,
  CombatTimerStopAction,
  CombatDefeatAction,
  CombatVictoryAction,
  TierSumDeltaAction,
  AdventurerDeltaAction,
  ViewQuestAction
} from './ActionTypes'
import {XMLElement, SettingsType} from '../reducers/StateTypes'
import {toCard, toPrevious} from './card'
import {loadTriggerNode, loadCombatNode, handleChoice, handleEvent} from '../QuestParser'
import {QuestDetails} from '../reducers/QuestTypes'

export function handleCombatTimerStop(elapsedMillis: number): CombatTimerStopAction {
  return {type: 'COMBAT_TIMER_STOP', elapsedMillis};
}

export function initQuest(node: XMLElement): QuestNodeAction {
  return {type: 'QUEST_NODE', node};
}

export function initCombat(node: XMLElement, settings: SettingsType): InitCombatAction {
  return {type: 'INIT_COMBAT', node, numPlayers: settings.numPlayers, difficulty: settings.difficulty};
}

export function choice(settings: SettingsType, node: XMLElement, index: number) {
  return (dispatch: Redux.Dispatch<any>): any => {
    var nextNode: XMLElement = handleChoice(node, index);
    loadNode(settings, dispatch, nextNode);
  }
}

export function loadNode(settings: SettingsType, dispatch: Redux.Dispatch<any>, nextNode: XMLElement) {
  var after: Redux.Action;
  var phase: any = undefined;
  switch (nextNode.get(0).tagName.toUpperCase()) {
    case 'TRIGGER':
      let name: string = loadTriggerNode(nextNode).name;
      if (name === 'end') {
        return dispatch(toPrevious('QUEST_START', undefined, true));
      }
      throw new Error('invalid trigger ' + name);
    case 'COMBAT':
      after = initCombat(nextNode, settings);
      phase = 'DRAW_ENEMIES';
      break;
    default:
      after = {type: 'QUEST_NODE', node: nextNode} as QuestNodeAction;
  }
  // Every choice has an effect.
  dispatch(after);
  dispatch(toCard('QUEST_CARD', phase));

}

export function event(node: XMLElement, evt: string) {
  return (dispatch: Redux.Dispatch<any>): any => {
    var nextNode: XMLElement = handleEvent(node, evt);
    loadNode(null, dispatch, nextNode);
  }
}

export function combatDefeat(): CombatDefeatAction {
  return {type: 'COMBAT_DEFEAT'};
}

export function combatVictory(numPlayers: number, maxTier: number): CombatVictoryAction {
  return {type: 'COMBAT_VICTORY', numPlayers, maxTier};
}

export function tierSumDelta(delta: number): TierSumDeltaAction {
  return {type: 'TIER_SUM_DELTA', delta};
}

export function adventurerDelta(numPlayers: number, delta: number): AdventurerDeltaAction {
  return {type: 'ADVENTURER_DELTA', delta, numPlayers};
}

// TODO: This should probably go in a "search" actions file.
export function viewQuest(quest: QuestDetails): ViewQuestAction {
  return {type: 'VIEW_QUEST', quest};
}