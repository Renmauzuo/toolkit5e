import {
  sizes, abilities, skills, averageStats, armorTypes, senses, pronouns, spells, traits as traitData,
  abilityScoreModifier, averageRoll, damageString, stringForCR, toSentenceCase, getOrdinal,
  armorTypeLight, armorTypeMedium,
} from '@toolkit5e/base';
import type { Statblock, Trait, Attack, ChallengeRating } from '@toolkit5e/base';

export type { StatblockRenderer, RenderStatblockOptions, WildShapeOptions } from './types.js';

const numberStrings = ['zero', 'one', 'two', 'three', 'four', 'five'];

// ---------------------------------------------------------------------------
// Token replacement
// ---------------------------------------------------------------------------

/**
 * Replaces template tokens in a description string with computed values.
 * Tokens use the format {{tokenName}} or {{category:value}}.
 */
export function replaceTokensInString(
  targetString: string,
  statBlock: Statblock & Record<string, unknown>,
  trait: Trait & Record<string, unknown>,
): string {
  let outputString = targetString;
  while (outputString.includes('{{')) {
    const tokenStartIndex = outputString.indexOf('{{');
    const tokenEndIndex = outputString.indexOf('}}') + 2;
    const fullToken = outputString.substring(tokenStartIndex, tokenEndIndex);
    const token = fullToken.substring(2, fullToken.length - 4);
    let tokenValue: string | number = '';

    if (statBlock[token] !== undefined) {
      tokenValue = statBlock[token] as string | number;
    } else if (token === 'castingStatName') {
      const statNames: Record<string, string> = { int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma' };
      tokenValue = statNames[statBlock.castingStat as string] ?? '';
    } else if (token === 'castingModifier') {
      tokenValue = '+' + (statBlock.abilityModifiers as Record<string, number>)[statBlock.castingStat as string];
    } else if (token === 'spellAttackModifier') {
      tokenValue = '+' + ((statBlock.abilityModifiers as Record<string, number>)[statBlock.castingStat as string] + (statBlock.proficiency ?? 0));
    } else if (token === 'spellSaveDC') {
      tokenValue = 8 + (statBlock.proficiency ?? 0) + (statBlock.abilityModifiers as Record<string, number>)[statBlock.castingStat as string];
    } else {
      const tokenArray = token.split(':');
      if (tokenArray[0] === 'DC') {
        let dc = 8 + (statBlock.proficiency ?? 0) + (statBlock.abilityModifiers as Record<string, number>)[tokenArray[1]];
        if (tokenArray.length > 2) dc += parseInt(tokenArray[2]);
        tokenValue = dc;
      } else if (tokenArray[0] === 'size') {
        tokenValue = sizes[statBlock.size! + parseInt(tokenArray[1])].name;
      } else if (tokenArray[0] === 'trait') {
        if (trait[tokenArray[1]] !== undefined) {
          tokenValue = trait[tokenArray[1]] as string | number;
        } else if (tokenArray[1] === 'DC') {
          let dc = 8 + (statBlock.proficiency ?? 0) + (statBlock.abilityModifiers as Record<string, number>)[trait.dcStat as string];
          if (trait.dcAdjustment) dc += trait.dcAdjustment;
          tokenValue = dc;
        } else if (tokenArray[1] === 'size') {
          let targetSize = statBlock.size!;
          if (trait.sizeAdjustment) targetSize += trait.sizeAdjustment;
          tokenValue = sizes[targetSize].name;
        } else if (tokenArray[1] === 'damage') {
          const dd = trait.damageDice!;
          const ds = trait.damageDieSize!;
          tokenValue = ds === 1 ? String(dd) : damageString(dd, ds);
        } else if (tokenArray[1] === 'castingClass') {
          tokenValue = ('' + statBlock.castingClass).replace(',', ' and ');
        } else if (tokenArray[1] === 'ordinalLevel') {
          tokenValue = getOrdinal(trait.level ?? (statBlock.level as number));
        } else if (tokenArray[1] === 'spellListInnate') {
          const spellsByUses: Record<number, string[]> = {};
          for (const spellId in trait.spellList) {
            const uses = trait.spellList![spellId].uses;
            if (!spellsByUses[uses]) spellsByUses[uses] = [];
            spellsByUses[uses].push(spellId);
          }
          const formatNames = (arr: string[]) => arr.map(id => (spells as Record<string, { name: string }>)[id]?.name ?? id).join(', ');
          let result = '';
          if (spellsByUses[0]) result += 'At will: ' + formatNames(spellsByUses[0]);
          const useCounts = Object.keys(spellsByUses).map(Number).filter(n => n > 0).sort((a, b) => b - a);
          for (const uses of useCounts) {
            if (result.length) result += '<br/>';
            result += `${uses}/day${spellsByUses[uses].length > 1 ? ' each' : ''}: ${formatNames(spellsByUses[uses])}`;
          }
          tokenValue = "<span class='trait-spacer'></span>" + result;
        }
      } else if (tokenArray[0] === 'pronoun') {
        tokenValue = (pronouns[statBlock.gender ?? 4] as Record<string, string>)[tokenArray[1]] ?? '';
      } else if (tokenArray[0] === 'abilityBonus') {
        const base = (statBlock.abilityModifiers as Record<string, number>)[tokenArray[1]];
        tokenValue = '+' + (base + (statBlock.proficiency ?? 0) * parseInt(tokenArray[2]));
      }
    }

    outputString = outputString.replace(fullToken, String(tokenValue));
  }
  return toSentenceCase(outputString);
}

// ---------------------------------------------------------------------------
// Statblock renderer
// ---------------------------------------------------------------------------

/**
 * Renders a statblock object into the provided target element.
 * The target element should contain the expected statblock HTML structure.
 *
 * @param sourceStats The statblock to render
 * @param target The root element containing the statblock HTML
 */
export function renderStatblock(sourceStats: Statblock, target: HTMLElement): void {
  const stats = sourceStats as Statblock & Record<string, unknown>;

  // Collect available spells for conditional rendering
  const availableSpells: string[] = [];
  for (const traitName in stats.traits) {
    const t = stats.traits![traitName];
    if (t.spellList) {
      for (const spell in t.spellList) availableSpells.push(spell);
    }
  }

  const q = <T extends Element>(sel: string) => target.querySelector<T>(sel);
  const setHtml = (sel: string, html: string) => { const el = q(sel); if (el) el.innerHTML = html; };
  const show = (sel: string) => { const el = q<HTMLElement>(sel); if (el) el.style.display = ''; };
  const hide = (sel: string) => { const el = q<HTMLElement>(sel); if (el) el.style.display = 'none'; };

  // Name and type line
  setHtml('#monster-name', (stats.wildShape && stats.defaultName && stats.defaultName !== stats.name)
    ? `${stats.name} (${stats.defaultName})`
    : stats.name ?? '');
  setHtml('#monster-type', `${sizes[stats.size!].name} ${stats.type}, ${stats.alignment}`);

  // Armor class
  let armorDescription: string | undefined;
  let acTotal: number;
  if (stats.armor) {
    const armor = armorTypes[stats.armor as string];
    armorDescription = armor.name ?? toSentenceCase(stats.armor as string);
    acTotal = armor.ac;
    if (armor.type === armorTypeLight) {
      acTotal += (stats.abilityModifiers as Record<string, number>).dex;
    } else if (armor.type === armorTypeMedium) {
      acTotal += Math.min((stats.abilityModifiers as Record<string, number>).dex, 2);
    }
  } else {
    acTotal = 10 + (stats.abilityModifiers as Record<string, number>).dex;
  }
  if (stats.bonusArmor) {
    acTotal += stats.bonusArmor;
    if (!armorDescription) armorDescription = stats.armorDescription ?? 'Bonus Armor';
  }
  let armorString = String(acTotal) + (armorDescription ? ` (${armorDescription})` : '');
  if (acTotal < 16 && availableSpells.includes('barkskin')) armorString += ' (16 with barkskin)';
  setHtml('#armor-class span', armorString);

  // Hit points
  let bonusHP = (stats.abilityModifiers as Record<string, number>).con * stats.hitDice!;
  for (const traitName in stats.traits) {
    const t = stats.traits![traitName];
    if (t.hitPointsPerHitDie) bonusHP += t.hitPointsPerHitDie * stats.hitDice!;
  }
  if (stats.bonusHP) bonusHP += stats.bonusHP;
  setHtml('#hit-points span', damageString(stats.hitDice!, sizes[stats.size!].hitDie, bonusHP));

  // Speed
  const speedParts: string[] = [];
  if (stats.speed) speedParts.push(`${stats.speed} ft.`);
  if (stats.swim) speedParts.push(`Swim ${stats.swim} ft.`);
  if (stats.climb) speedParts.push(`Climb ${stats.climb} ft.`);
  if (stats.burrow) speedParts.push(`Burrow ${stats.burrow} ft.`);
  if (stats.fly) speedParts.push(`Fly ${stats.fly} ft.`);
  setHtml('#speed span', speedParts.join(', '));

  // Ability scores
  for (const ability in abilities) {
    const modifier = abilityScoreModifier(stats[ability as keyof Statblock] as number);
    const modStr = `(${modifier >= 0 ? '+' : ''}${modifier})`;
    setHtml(`#monster-${ability}`, `${stats[ability as keyof Statblock]} ${modStr}`);
  }

  // Saving throws
  if (stats.saves || stats.saveBonus) {
    show('#saving-throws');
    const saveParts: string[] = [];
    for (const ability in abilities) {
      let saveModifier = 0;
      if (stats.saves?.includes(ability as never)) saveModifier += stats.proficiency!;
      if (stats.saveBonus) saveModifier += stats.saveBonus;
      if (saveModifier > 0) {
        saveModifier += (stats.abilityModifiers as Record<string, number>)[ability];
        saveParts.push(`${abilities[ability].name} ${saveModifier >= 0 ? '+' : ''}${saveModifier}`);
      }
    }
    setHtml('#saving-throws span', saveParts.join(', '));
  } else {
    hide('#saving-throws');
  }

  // Skills
  if (stats.skills) {
    show('#skills');
    const skillParts: string[] = [];
    for (const skill in stats.skills) {
      const rank = stats.skills[skill] as number;
      const skillMod = stats.proficiency! * rank + (stats.abilityModifiers as Record<string, number>)[skills[skill].ability];
      skillParts.push(`${skills[skill].name ?? toSentenceCase(skill)} ${skillMod >= 0 ? '+' : ''}${skillMod}`);
    }
    setHtml('#skills span', skillParts.join(', '));
  } else {
    hide('#skills');
  }

  // Damage vulnerabilities / resistances / immunities
  const renderList = (sel: string, list: string[] | undefined) => {
    if (list?.length) {
      setHtml(`${sel} span`, list.map(toSentenceCase).join(', '));
      show(sel);
    } else {
      hide(sel);
    }
  };
  renderList('#vulnerabilities', stats.vulnerabilities);
  renderList('#resistances', stats.resistances);
  renderList('#immunities', stats.immunities);
  if (stats.conditionImmunities?.length) {
    setHtml('#condition-immunities span', stats.conditionImmunities.map(toSentenceCase).join(', '));
  } else {
    hide('#condition-immunities');
  }

  // Senses
  const senseParts: string[] = [];
  for (const sense of senses) {
    if ((stats as Record<string, unknown>)[sense]) {
      senseParts.push(`${sense} ${(stats as Record<string, unknown>)[sense]} ft.`);
    }
  }
  stats.sensesString = senseParts.join(', ');
  stats.passivePerception = 10 + (stats.abilityModifiers as Record<string, number>).wis
    + (stats.skills?.hasOwnProperty('perception') ? stats.proficiency! : 0);
  const sensesDisplay = (stats.sensesString ? stats.sensesString + ', ' : '') + `passive Perception ${stats.passivePerception}`;
  setHtml('#senses span', sensesDisplay);

  // Challenge rating
  setHtml('#challenge-rating span', stats.cr
    ? `${stringForCR(stats.cr)} (${averageStats[Number(stats.cr) as ChallengeRating].xp.toLocaleString()} XP)`
    : '&mdash;');

  // Traits
  const traitsEl = q('#traits');
  if (traitsEl) {
    traitsEl.innerHTML = '';
    if (stats.traits) {
      for (const traitName in stats.traits) {
        const t = stats.traits[traitName] as Trait & Record<string, unknown>;
        t.text = replaceTokensInString(t.description, stats, t);
        const p = document.createElement('p');
        p.innerHTML = `<strong><em>${t.name}.</em></strong> ${t.text}`;
        traitsEl.appendChild(p);
      }
    }
  }

  // Languages
  if (stats.extraLanguages) {
    stats.languages = stats.languages ?? [];
    stats.languages.push(`any ${numberStrings[stats.extraLanguages]} language${stats.extraLanguages === 1 ? ' (usually Common)' : ''}`);
  }
  if (stats.languages?.length) {
    setHtml('#languages span', stats.languages.join(', '));
    show('#languages');
  } else {
    hide('#languages');
  }

  // Attacks section
  const attacksEl = q('#attacks');
  if (attacksEl) {
    attacksEl.innerHTML = '';

    // Multiattack
    if (stats.multiattack) {
      const attackKeys = Object.keys(stats.multiattack.attacks);
      let multiattackString: string;
      if (attackKeys.length > 1) {
        let attackCount = 0;
        const parts: string[] = [];
        for (const atk of attackKeys) {
          const count = stats.multiattack.attacks[atk];
          attackCount += count;
          parts.push(`${numberStrings[count]} with its ${stats.attacks![atk].name!.toLowerCase()}`);
        }
        const joined = parts.length > 2
          ? parts.slice(0, -1).join(', ') + ', and ' + parts[parts.length - 1]
          : parts.join(' and ');
        multiattackString = `${toSentenceCase(stats.description!)} makes ${numberStrings[attackCount]} attacks: ${joined}.`;
        if (stats.multiattack.requireDifferentTargets) {
          multiattackString += " It can\u2019t make both attacks against the same target.";
        }
      } else {
        const atk = attackKeys[0];
        multiattackString = `${toSentenceCase(stats.description!)} makes ${numberStrings[stats.multiattack.attacks[atk]]} ${stats.attacks![atk].name!.toLowerCase()} attacks.`;
      }
      stats.multiattackString = multiattackString;
      const p = document.createElement('p');
      p.innerHTML = `<strong>Multiattack:</strong> ${multiattackString}`;
      attacksEl.appendChild(p);
    }

    // Individual attacks
    if (stats.attacks) {
      for (const attackKey in stats.attacks) {
        const atk = stats.attacks[attackKey] as Attack & Record<string, unknown>;
        let abilityModifier: number;
        if (atk.finesse) {
          abilityModifier = Math.max(
            (stats.abilityModifiers as Record<string, number>).str,
            (stats.abilityModifiers as Record<string, number>).dex,
          );
        } else if (atk.spellAttack) {
          abilityModifier = (stats.abilityModifiers as Record<string, number>)[stats.castingStat as string];
        } else {
          abilityModifier = (stats.abilityModifiers as Record<string, number>).str;
        }

        const shillelagh = availableSpells.includes('shillelagh') && (attackKey === 'club' || attackKey === 'quarterstaff');
        atk.attackBonus = stats.proficiency! + abilityModifier;
        atk.damageBonus = abilityModifier;
        if (atk.enhancement) {
          atk.attackBonus += atk.enhancement;
          atk.damageBonus += atk.enhancement;
        }

        const attackType = `${atk.ranged ? 'Ranged' : 'Melee'} ${atk.spellAttack ? 'Spell' : 'Weapon'} Attack`;
        const rangeStr = atk.ranged
          ? `range ${atk.range}${atk.longRange ? '/' + atk.longRange : ''}`
          : `reach ${sizes[stats.size!].reach[atk.reach!]}`;

        let attackString = `<em>${attackType}:</em> +${Math.max(atk.attackBonus, 0)} to hit`;
        if (shillelagh) {
          attackString += ` (+${stats.proficiency! + (stats.abilityModifiers as Record<string, number>)[stats.castingStat as string]} to hit with shillelagh)`;
        }
        attackString += `, ${rangeStr} ft., `;
        if (atk.proneOnly) attackString += 'one prone creature';
        else if (atk.creatureOnly) attackString += 'one creature';
        else attackString += 'one target';
        attackString += (atk.notGrappled ? ` not grappled by ${stats.description}` : '') + '. ';

        const avgDmg = Math.max(1, averageRoll(atk.damageDice!, atk.damageDieSize!) + atk.damageBonus!);
        const maxDmg = atk.damageDice! * atk.damageDieSize! + atk.damageBonus!;
        attackString += `<em>Hit:</em> ${avgDmg}`;
        if (maxDmg > 1) {
          attackString += ` (${atk.damageDice}d${atk.damageDieSize}`;
          if (atk.damageBonus) attackString += (atk.damageBonus >= 0 ? ' + ' : ' - ') + Math.abs(atk.damageBonus);
          attackString += ')';
        }
        attackString += ` ${atk.damageType} damage`;

        if (shillelagh) {
          attackString += `, or ${damageString(atk.damageDice!, 8, (stats.abilityModifiers as Record<string, number>)[stats.castingStat as string])} with shillelagh`;
        }
        if (atk.damageRiderDice) {
          attackString += ` plus ${damageString(atk.damageRiderDice, atk.damageRiderDieSize!)} ${atk.damageRiderType} damage`;
        }
        attackString += '.';
        if (atk.generatedProc) {
          attackString += ' ' + replaceTokensInString(atk.generatedProc.description, stats, atk.generatedProc as Trait & Record<string, unknown>);
        }

        atk.text = attackString;
        const p = document.createElement('p');
        p.innerHTML = `<strong>${atk.name ?? toSentenceCase(attackKey)}</strong> ${attackString}`;
        attacksEl.appendChild(p);
      }
    }

    // Actions
    if (stats.actions) {
      for (const actionName in stats.actions) {
        const action = stats.actions[actionName] as Trait & Record<string, unknown>;
        action.text = replaceTokensInString(action.description, stats, action);
        const p = document.createElement('p');
        p.innerHTML = `<strong><em>${action.name}.</em></strong> ${action.text}`;
        attacksEl.appendChild(p);
      }
    }
  }

  // Bonus actions
  const bonusActionsEl = q('#bonus-actions');
  const bonusActionsWrapper = q<HTMLElement>('#bonus-actions-wrapper');
  if (stats.bonusActions && Object.keys(stats.bonusActions).length) {
    if (bonusActionsEl) bonusActionsEl.innerHTML = '';
    if (bonusActionsWrapper) bonusActionsWrapper.style.display = '';
    for (const bonusActionName in stats.bonusActions) {
      const ba = stats.bonusActions[bonusActionName] as Trait & Record<string, unknown>;
      ba.text = replaceTokensInString(ba.description, stats, ba);
      const p = document.createElement('p');
      p.innerHTML = `<strong><em>${ba.name}.</em></strong> ${ba.text}`;
      bonusActionsEl?.appendChild(p);
    }
  } else {
    if (bonusActionsWrapper) bonusActionsWrapper.style.display = 'none';
  }
}
