import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/** Part A: application, responsibility, and the Rule 3 definitions. */
export const DEFINITION_QUESTIONS: Question[] = [
  mcq({
    id: 'def-underway',
    topic: 'definitions',
    concept: 'definition:underway',
    difficulty: 1,
    prompt: 'What does "underway" mean?',
    answer: 'That the vessel is not at anchor, made fast to the shore, or aground',
    distractors: [
      'That the vessel is moving through the water',
      'That the vessel is moving over the ground',
      'That the vessel has her engine running or sails set',
    ],
    ruleRefs: ['Rule 3(i)'],
    explanation:
      'Rule 3(i): "underway" means that a vessel is not at anchor, or made fast to the shore, or aground. It says nothing about movement — a vessel drifting with her engine off is underway but not making way.',
    teachingNote:
      'Underway and making way are two independent facts. Drill the four-box grid: underway + making way, underway + not making way, at anchor, aground. Each box has its own lights and its own fog signal.',
    misconception:
      'Students equate underway with moving. The distinction matters immediately in Rule 35: one prolonged blast if making way, two prolonged if underway but stopped.',
  }),
  mcq({
    id: 'def-nuc',
    topic: 'definitions',
    concept: 'definition:not-under-command',
    difficulty: 2,
    prompt: 'A vessel "not under command" is one which:',
    answer:
      'Through some exceptional circumstance is unable to manoeuvre as required by the Rules and so cannot keep out of the way of another vessel',
    distractors: [
      'Has nobody on the bridge keeping a look-out',
      'Is engaged in work which restricts her ability to manoeuvre',
      'Has lost her steering gear but can still manoeuvre on engines',
    ],
    ruleRefs: ['Rule 3(f)'],
    explanation:
      'Rule 3(f). The defining feature is an exceptional circumstance — a breakdown — that removes the ability to comply. A vessel restricted by the nature of her work is a different category: restricted in ability to manoeuvre, Rule 3(g).',
    teachingNote:
      'NUC = something broke. RAM = something is being done. That one line separates the two categories reliably.',
    misconception:
      'Students file dredgers and cable layers under NUC. They are RAM: their limitation comes from the work, not from a failure.',
  }),
  mcq({
    id: 'def-ram-list',
    topic: 'definitions',
    concept: 'definition:ram-categories',
    difficulty: 3,
    prompt: 'Which of these is NOT listed in Rule 3(g) as a vessel restricted in her ability to manoeuvre?',
    answer: 'A vessel engaged in fishing with trolling lines',
    distractors: [
      'A vessel engaged in dredging or underwater operations',
      'A vessel engaged in replenishment while underway',
      'A vessel engaged in the launching or recovery of aircraft',
    ],
    ruleRefs: ['Rule 3(g)', 'Rule 3(d)'],
    explanation:
      'Rule 3(g) lists: laying, servicing or picking up a navigation mark, submarine cable or pipeline; dredging, surveying or underwater operations; replenishment or transferring persons, provisions or cargo while underway; launching or recovery of aircraft; mine clearance; and a towing operation such as severely restricts the towing vessel and her tow in their ability to deviate. Trolling lines are explicitly excluded even from "engaged in fishing" by Rule 3(d).',
    misconception:
      'Trolling is the trap. Rule 3(d) says fishing apparatus must restrict manoeuvrability, and it expressly does not include trolling lines — so a sportfisher dragging lures is just a power-driven vessel.',
  }),
  mcq({
    id: 'def-cbd',
    topic: 'definitions',
    concept: 'definition:constrained-by-draught',
    difficulty: 2,
    prompt: 'Which vessel may claim to be "constrained by her draught"?',
    answer:
      'A power-driven vessel severely restricted in her ability to deviate because of her draught in relation to the available depth and width of navigable water',
    distractors: [
      'Any vessel drawing more than 10 metres',
      'Any deep-draught vessel, whether power-driven or sailing',
      'Any vessel confined to a narrow channel or fairway',
    ],
    ruleRefs: ['Rule 3(h)', 'Rule 28'],
    explanation:
      'Rule 3(h). Two conditions the examiner is looking for: the vessel must be power-driven, and the restriction must relate draught to both depth and width of the available water.',
    teachingNote:
      'Note that CBD does not appear in the Rule 18 pecking order proper. Rule 18(d) only says other vessels shall, if circumstances admit, avoid impeding her — a weaker obligation than "keep out of the way".',
    misconception:
      'Students promote CBD to somewhere near RAM. It is not in the hierarchy; "avoid impeding" is not the same as "give way".',
  }),
  mcq({
    id: 'def-restricted-visibility',
    topic: 'definitions',
    concept: 'definition:restricted-visibility',
    difficulty: 1,
    prompt: 'Rule 3(l) defines restricted visibility as any condition in which visibility is restricted by:',
    answer: 'Fog, mist, falling snow, heavy rainstorms, sandstorms or any other similar causes',
    distractors: [
      'Fog or mist only',
      'Any condition reducing visibility below two nautical miles',
      'Darkness, fog, mist or heavy rain',
    ],
    ruleRefs: ['Rule 3(l)'],
    explanation:
      'Rule 3(l) gives the list and leaves it open with "or any other similar causes". Note what is absent: darkness. Night is not restricted visibility.',
    misconception:
      'Students add darkness to the list. At night in clear weather vessels are still in sight of one another, so Section II applies, not Rule 19.',
  }),
  mcq({
    id: 'def-in-sight',
    topic: 'definitions',
    concept: 'definition:in-sight-of-one-another',
    difficulty: 2,
    prompt: 'Two vessels are "in sight of one another" when:',
    answer: 'One can be observed visually from the other',
    distractors: [
      'Each has the other on radar',
      'They are within visual signalling distance',
      'They are within the range of their navigation lights',
    ],
    ruleRefs: ['Rule 3(k)', 'Rule 11'],
    explanation:
      'Rule 3(k): vessels shall be deemed to be in sight of one another only when one can be observed visually from the other. Radar contact does not count.',
    teachingNote:
      'This definition is the switch that selects which section of Part B you are in. Visual contact opens Section II (Rules 11 to 18); without it you are in Rule 19.',
    misconception:
      'The classic error is applying crossing rules to a radar target in fog. Rule 19 has no stand-on vessel — the whole give-way/stand-on vocabulary is unavailable to you.',
  }),
  mcq({
    id: 'def-rule2-departure',
    topic: 'definitions',
    concept: 'rule2:departure',
    difficulty: 3,
    prompt: 'Under Rule 2(b), a departure from the Rules is permitted:',
    answer: 'Where necessary to avoid immediate danger, having due regard to the special circumstances of the case',
    distractors: [
      'Never — the Rules admit no exception',
      'Whenever the master judges it commercially expedient',
      'Only with the agreement of the other vessel, signalled by whistle',
    ],
    ruleRefs: ['Rule 2(b)'],
    explanation:
      'Rule 2(b) requires due regard to all dangers of navigation and collision and to any special circumstances, including the limitations of the vessels involved, which may make a departure from these Rules necessary to avoid immediate danger.',
    teachingNote:
      'Pair 2(a) and 2(b) as a hinge: 2(a) says obeying the letter is not a defence if good seamanship demanded more; 2(b) says the letter yields when only a departure avoids immediate danger.',
    misconception:
      'Students read Rule 2 as a general escape clause. The threshold is "immediate danger", not inconvenience.',
  }),
  mcq({
    id: 'def-application-waters',
    topic: 'definitions',
    concept: 'rule1:application',
    difficulty: 1,
    prompt: 'Where do the Collision Regulations apply?',
    answer: 'On the high seas and in all waters connected therewith navigable by seagoing vessels',
    distractors: [
      'On the high seas only, outside territorial waters',
      'Everywhere except inside harbour limits',
      'Wherever a vessel of more than 12 metres is navigating',
    ],
    ruleRefs: ['Rule 1(a)'],
    explanation:
      'Rule 1(a). Rule 1(b) then allows a government to make special rules for roadsteads, harbours, rivers, lakes or inland waterways connected with the high seas, which must conform as closely as possible to these Rules.',
  }),
  mcq({
    id: 'def-sailing-vessel',
    topic: 'definitions',
    concept: 'definition:sailing-vessel',
    difficulty: 1,
    prompt: 'A yacht is motorsailing: engine engaged, mainsail and genoa drawing. Under the Rules she is:',
    answer: 'A power-driven vessel',
    distractors: [
      'A sailing vessel',
      'A sailing vessel while the sails are drawing, and power-driven only when they are not',
      'A vessel restricted in her ability to manoeuvre',
    ],
    ruleRefs: ['Rule 3(b)', 'Rule 3(c)', 'Rule 25(e)'],
    explanation:
      'Rule 3(c): a sailing vessel is one under sail provided that propelling machinery, if fitted, is not being used. With the engine engaged she is power-driven under Rule 3(b), and Rule 25(e) requires her to exhibit forward, where it can best be seen, a conical shape apex downwards.',
    teachingNote:
      'Worth making the point that the cone is required of every motorsailing yacht by day, and that almost nobody flies it. As an instructor you will be asked why; the honest answer is that widespread non-compliance does not change the requirement.',
    misconception:
      'Students think having sails up is what counts. It is the engine that decides.',
  }),
];
