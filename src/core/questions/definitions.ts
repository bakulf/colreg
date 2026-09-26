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
  }),
  mcq({
    id: 'def-special-rules',
    topic: 'definitions',
    concept: 'rule1:special-rules',
    difficulty: 1,
    prompt: 'A harbour authority has made special rules for navigation within its harbour. Under Rule 1(b), such special rules:',
    answer: 'Operate within the harbour, and shall conform as closely as possible to the Collision Regulations',
    distractors: [
      'Are void wherever they differ in any respect from the Collision Regulations',
      'Apply only to vessels of less than 20 metres navigating within the harbour',
      'Apply only to vessels flying the flag of the State that made them',
    ],
    ruleRefs: ['Rule 1(b)'],
    explanation:
      'Rule 1(b): nothing in the Rules shall interfere with special rules made by an appropriate authority for roadsteads, harbours, rivers, lakes or inland waterways connected with the high seas and navigable by seagoing vessels. Such special rules shall conform as closely as possible to the Rules.',
  }),
  mcq({
    id: 'def-additional-signals',
    topic: 'definitions',
    concept: 'rule1:additional-signals',
    difficulty: 2,
    prompt: 'Rule 1(c) allows a Government to make special rules for additional station or signal lights, shapes or whistle signals for:',
    answer: 'Ships of war and vessels proceeding under convoy, and (lights or shapes only) fishing vessels fishing as a fleet',
    distractors: [
      'Any vessel of 100 metres or more in length, and vessels carrying dangerous cargoes',
      'Pilot vessels and vessels engaged in hydrographic survey, and vessels under oars',
      'Yachts racing under the rules of a national sailing authority, and their escort boats',
    ],
    ruleRefs: ['Rule 1(c)'],
    explanation:
      'Rule 1(c) names ships of war and vessels proceeding under convoy (lights, shapes or whistle signals), and fishing vessels engaged in fishing as a fleet (lights or shapes). Such signals shall, so far as possible, be such that they cannot be mistaken for any light, shape or signal authorised elsewhere in the Rules.',
  }),
  mcq({
    id: 'def-special-construction',
    topic: 'definitions',
    concept: 'rule1:special-construction',
    difficulty: 2,
    prompt: 'Her Government has determined that a vessel of special construction or purpose cannot comply fully with the Rules on the number, position, range or arc of visibility of her lights. She shall:',
    answer: 'Comply with such other provisions as her Government has determined to be the closest possible compliance',
    distractors: [
      'Be exempt from exhibiting navigation lights, provided she keeps a proper look-out',
      'Exhibit the lights of a vessel restricted in her ability to manoeuvre instead',
      'Remain in port between sunset and sunrise and in restricted visibility',
    ],
    ruleRefs: ['Rule 1(e)'],
    explanation:
      'Rule 1(e): such a vessel shall comply with such other provisions in regard to the number, position, range or arc of visibility of lights or shapes, and the disposition and characteristics of sound-signalling appliances, as her Government shall have determined to be the closest possible compliance with the Rules.',
  }),
  mcq({
    id: 'def-vessel',
    topic: 'definitions',
    concept: 'definition:vessel',
    difficulty: 1,
    prompt: 'Under Rule 3(a), the word "vessel" includes:',
    answer: 'Every description of water craft, including non-displacement craft, WIG craft and seaplanes, used or capable of being used for transport on water',
    distractors: [
      'Displacement craft only; hovercraft and seaplanes are governed by aviation rules instead',
      'Every description of water craft of 7 metres or more in length, excluding seaplanes and WIG craft',
      'Ships and boats including hovercraft, but not WIG craft or seaplanes, which are aircraft',
    ],
    ruleRefs: ['Rule 3(a)'],
    explanation:
      'Rule 3(a): "vessel" includes every description of water craft, including non-displacement craft, WIG craft and seaplanes, used or capable of being used as a means of transportation on water. There is no minimum size.',
  }),
  mcq({
    id: 'def-trolling',
    topic: 'definitions',
    concept: 'definition:engaged-in-fishing',
    difficulty: 2,
    prompt: 'A motor boat is underway trailing trolling lines astern. Under the Rules she is:',
    answer: 'A power-driven vessel, not a vessel engaged in fishing',
    distractors: [
      'A vessel engaged in fishing, since she has lines in the water',
      'A vessel restricted in her ability to manoeuvre',
      'A vessel engaged in fishing only while a fish is being played',
    ],
    ruleRefs: ['Rule 3(d)', 'Rule 3(b)'],
    explanation:
      'Rule 3(d): a vessel engaged in fishing is one fishing with nets, lines, trawls or other apparatus which restrict manoeuvrability, but not a vessel fishing with trolling lines or other apparatus which do not restrict manoeuvrability. Propelled by machinery, she is a power-driven vessel under Rule 3(b).',
  }),
  mcq({
    id: 'def-seaplane',
    topic: 'definitions',
    concept: 'definition:seaplane',
    difficulty: 1,
    prompt: 'The word "seaplane" in the Rules includes:',
    answer: 'Any aircraft designed to manoeuvre on the water',
    distractors: [
      'Any aircraft flying at low altitude over the sea',
      'Only floatplanes while moored or at anchor',
      'Any craft which flies close to the surface using surface effect',
    ],
    ruleRefs: ['Rule 3(e)'],
    explanation:
      'Rule 3(e): the word "seaplane" includes any aircraft designed to manoeuvre on the water. A craft flying close to the surface using surface-effect action is a WIG craft, defined separately in Rule 3(m).',
  }),
  mcq({
    id: 'def-wig',
    topic: 'definitions',
    concept: 'definition:wig-craft',
    difficulty: 2,
    prompt: 'A Wing-in-Ground (WIG) craft is defined as:',
    answer: 'A multimodal craft which, in its main operational mode, flies in close proximity to the surface by utilising surface-effect action',
    distractors: [
      'A craft supported on a cushion of air generated by fans, operating in the non-displacement mode',
      'Any aircraft designed to take off from, land on and manoeuvre on the surface of the water',
      'A high-speed craft lifted clear of the water on underwater foils once above a certain speed',
    ],
    ruleRefs: ['Rule 3(m)'],
    explanation:
      'Rule 3(m). The distractors describe an air-cushion vessel (a non-displacement craft, lit under Rule 23(b)), a seaplane (Rule 3(e)) and a hydrofoil, which is simply a power-driven vessel.',
  }),
  mcq({
    id: 'def-rule38-exemptions',
    topic: 'definitions',
    concept: 'rule38:exemptions',
    difficulty: 3,
    prompt: 'The exemptions in Rule 38 are available to:',
    answer: 'Vessels complying with the 1960 Collision Regulations whose keels were laid before the 1972 Regulations entered into force',
    distractors: [
      'Vessels of special construction or purpose whose Government has determined they cannot comply fully',
      'Vessels of less than 12 metres, which are exempt from the Annex I positioning requirements',
      'Vessels navigating only in waters for which special rules have been made by a local authority',
    ],
    ruleRefs: ['Rule 38'],
    explanation:
      'Rule 38 applies to any vessel complying with the 1960 Regulations, the keel of which was laid (or at a corresponding stage of construction) before the entry into force of the 1972 Regulations. Most exemptions were time-limited; some, such as repositioning lights on conversion from Imperial to metric units, are permanent. Special-construction vessels are dealt with by Rule 1(e).',
  }),
  mcq({
    id: 'def-part-f',
    topic: 'definitions',
    concept: 'rule41:verification',
    difficulty: 2,
    prompt: 'What is Part F of the Regulations (Rules 39 to 41) concerned with?',
    answer: 'Periodic audits by IMO of each Contracting Party to verify its compliance with and implementation of the Convention',
    distractors: [
      'Inspection of individual ships\' lights and sound appliances by port State control officers',
      'Certification of each watchkeeping officer\'s knowledge of the Rules by the flag State',
      'Exemptions for vessels whose keels were laid before the Regulations entered into force',
    ],
    ruleRefs: ['Rule 41(a)', 'Rule 39(b)'],
    explanation:
      'Part F, added in 2013, is titled "Verification of compliance". Rule 41(a): every Contracting Party shall be subject to periodic audits by the Organization in accordance with the audit standard (the III Code, Rule 39) to verify compliance with and implementation of the Convention. It places no duties on ships.',
  }),
];
