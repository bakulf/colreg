import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/** Part B: the steering and sailing rules, 4 to 19. */
export const STEERING_QUESTIONS: Question[] = [
  mcq({
    id: 'str-lookout-means',
    topic: 'steering',
    concept: 'rule5:lookout',
    difficulty: 1,
    prompt: 'Rule 5 requires a proper look-out to be kept:',
    answer: 'By sight and hearing as well as by all available means appropriate in the prevailing circumstances and conditions',
    distractors: [
      'By sight and hearing at all times',
      'By radar whenever radar is fitted',
      'By sight and hearing at night, and by sight alone by day',
    ],
    ruleRefs: ['Rule 5'],
    explanation:
      '"All available means" is the phrase that does the work: it pulls in radar, AIS, VHF and the echo sounder when they are appropriate, and it is the hook on which most collision inquiries hang their findings.',
    teachingNote:
      'Ask the student what "appropriate in the prevailing circumstances" excludes. In clear weather in open water, not running the radar may be fine; in fog it never is.',
  }),
  mcq({
    id: 'str-safe-speed-factors',
    topic: 'steering',
    concept: 'rule6:safe-speed-factors',
    difficulty: 2,
    prompt: 'Which of the following is NOT one of the factors Rule 6 lists as bearing on safe speed for all vessels?',
    answer: 'The fuel consumption of the vessel at the speed chosen',
    distractors: [
      'The state of visibility',
      'The manoeuvrability of the vessel, with special reference to stopping distance and turning ability',
      'At night, the presence of background light such as from shore lights or from backscatter of her own lights',
    ],
    ruleRefs: ['Rule 6(a)'],
    explanation:
      'Rule 6(a) lists six factors for all vessels: visibility, traffic density, manoeuvrability (stopping distance and turning ability), background light at night, state of wind sea and current and proximity of navigational hazards, and draught in relation to available depth. Rule 6(b) adds a further six for vessels with operational radar.',
    teachingNote:
      'Six and six is a clean memory hook. Candidates are regularly asked to produce several of them cold.',
  }),
  mcq({
    id: 'str-risk-doubt',
    topic: 'steering',
    concept: 'rule7:doubt',
    difficulty: 1,
    prompt: 'You are unsure whether risk of collision exists with a vessel you are watching. Rule 7 tells you to:',
    answer: 'Deem that such risk exists',
    distractors: [
      'Continue to watch and decide when the range has closed',
      'Call the other vessel on VHF and ask her intentions',
      'Deem that no risk exists until the bearing steadies',
    ],
    ruleRefs: ['Rule 7(a)'],
    explanation:
      'Rule 7(a): if there is any doubt such risk shall be deemed to exist. The Rules resolve uncertainty against you throughout — compare Rule 13(c) on overtaking.',
    teachingNote:
      'Collect the "if in doubt" clauses as a set: Rule 7(a) risk of collision, Rule 13(c) overtaking, Rule 12(a)(iii) the port-tack yacht that cannot determine the other tack. All three resolve towards the more cautious duty.',
  }),
  mcq({
    id: 'str-risk-steady-bearing',
    topic: 'steering',
    concept: 'rule7:steady-bearing',
    difficulty: 2,
    prompt: 'A large vessel is closing you at short range and the compass bearing is changing appreciably. Rule 7(d) says:',
    answer: 'Risk of collision may nevertheless exist, particularly when approaching a very large vessel or a tow, or at close range',
    distractors: [
      'No risk of collision exists, because the bearing is changing',
      'Risk exists only if the bearing change is less than five degrees per minute',
      'Risk exists only if she is forward of your beam',
    ],
    ruleRefs: ['Rule 7(d)(ii)'],
    explanation:
      'Rule 7(d)(i) gives the steady-bearing test; 7(d)(ii) immediately qualifies it. A 300 metre ship has a bearing spread of her own — the bow may be drawing left while the stern draws right and you are still going to be hit.',
    misconception:
      'Students treat a changing bearing as proof of safety. At half a mile from a container ship it proves nothing.',
  }),
  mcq({
    id: 'str-action-apparent',
    topic: 'steering',
    concept: 'rule8:substantial-action',
    difficulty: 2,
    prompt: 'Rule 8 requires that any alteration of course or speed to avoid collision shall be:',
    answer: 'Large enough to be readily apparent to another vessel observing visually or by radar, avoiding a succession of small alterations',
    distractors: [
      'At least 10 degrees of course, or 2 knots of speed',
      'As small as will suffice, to minimise deviation from the passage plan',
      'Made only after sounding the appropriate manoeuvring signal',
    ],
    ruleRefs: ['Rule 8(b)'],
    explanation:
      'Rule 8(b). The Rules give no numbers; the test is perceptibility to the other vessel, including on her radar, where a small alteration may take several minutes of plotting to detect at all.',
    teachingNote:
      'A practical figure to teach alongside the rule: 30 degrees or more, or a visible change in aspect. Be explicit that this is seamanship guidance, not the wording of the rule.',
  }),
  mcq({
    id: 'str-narrow-channel-side',
    topic: 'steering',
    concept: 'rule9:keep-starboard',
    difficulty: 1,
    prompt: 'A vessel proceeding along a narrow channel or fairway shall keep:',
    answer: 'As near to the outer limit of the channel which lies on her starboard side as is safe and practicable',
    distractors: [
      'In the centre of the channel, where the water is deepest',
      'As near to the outer limit on her port side as is safe and practicable',
      'To whichever side gives her the most favourable tidal stream',
    ],
    ruleRefs: ['Rule 9(a)'],
    explanation:
      'Rule 9(a). Note "as is safe and practicable" — the rule does not require you to run aground in the interest of compliance.',
  }),
  mcq({
    id: 'str-narrow-channel-impede',
    topic: 'steering',
    concept: 'rule9:not-impede',
    difficulty: 2,
    prompt: 'In a narrow channel, which vessels shall not impede the passage of a vessel which can safely navigate only within that channel?',
    answer: 'A vessel of less than 20 metres in length and a sailing vessel',
    distractors: [
      'Sailing vessels only',
      'Vessels of less than 12 metres only',
      'All vessels other than those constrained by their draught',
    ],
    ruleRefs: ['Rule 9(b)', 'Rule 9(c)', 'Rule 9(d)'],
    explanation:
      'Rule 9(b) names vessels under 20 metres and sailing vessels. Rule 9(c) adds vessels engaged in fishing, and Rule 9(d) says a vessel shall not cross a narrow channel if such crossing impedes a vessel which can safely navigate only within it.',
    teachingNote:
      'Twenty metres recurs: Rule 9(b), Rule 10(j) and Rule 20-something visibility bands. Worth a dedicated card on "what changes at 20m, 12m, 7m and 50m".',
    misconception:
      '"Shall not impede" is not the same as "give way". Rule 8(f) explains it: the vessel required not to impede must take early action to allow sufficient sea room, and remains fully bound by the steering rules if risk of collision then develops.',
  }),
  mcq({
    id: 'str-tss-crossing',
    topic: 'steering',
    concept: 'rule10:crossing-angle',
    difficulty: 2,
    prompt: 'A vessel obliged to cross a traffic lane in a traffic separation scheme shall cross:',
    answer: 'On a heading as nearly as practicable at right angles to the general direction of traffic flow',
    distractors: [
      'On a course made good as nearly as practicable at right angles to the traffic flow',
      'At as small an angle to the general direction of traffic flow as practicable',
      'At any angle, provided she keeps clear of vessels in the lane',
    ],
    ruleRefs: ['Rule 10(c)'],
    explanation:
      'Rule 10(c) says heading, not course made good, and IMO has confirmed the point: you do not crab across to hold a 090 track. A heading at right angles gets you out of the lane fastest and makes your aspect unambiguous to traffic in the lane.',
    misconception:
      'Students set a course to steer that corrects for tide, so as to make good a perpendicular track. That is exactly what the rule does not want.',
  }),
  mcq({
    id: 'str-sailing-different-tacks',
    topic: 'steering',
    concept: 'rule12:different-tacks',
    difficulty: 1,
    prompt: 'Two sailing vessels are approaching so as to involve risk of collision, one with the wind on her port side and the other with the wind on her starboard side. Which keeps out of the way?',
    answer: 'The one which has the wind on her port side',
    distractors: [
      'The one which has the wind on her starboard side',
      'The one to windward',
      'The faster of the two',
    ],
    ruleRefs: ['Rule 12(a)(i)'],
    explanation:
      'Rule 12(a)(i). Tack is decided by the side the wind is on, and Rule 12(b) defines the windward side as the side opposite to that on which the mainsail is carried.',
    teachingNote:
      'Racing sailors arrive knowing this one and then over-apply their racing rules, which differ in several places. Flag the difference early.',
  }),
  mcq({
    id: 'str-sailing-same-tack',
    topic: 'steering',
    concept: 'rule12:same-tack',
    difficulty: 1,
    prompt: 'Two sailing vessels have the wind on the same side. Which keeps out of the way?',
    answer: 'The vessel to windward keeps out of the way of the vessel to leeward',
    distractors: [
      'The vessel to leeward keeps out of the way of the vessel to windward',
      'The overtaking vessel, in every case',
      'The vessel with the wind further aft',
    ],
    ruleRefs: ['Rule 12(a)(ii)'],
    explanation:
      'Rule 12(a)(ii). The windward vessel has the better options — she can bear away or luff with the wind she has — and she is also the one taking the leeward vessel\'s wind.',
  }),
  mcq({
    id: 'str-sailing-doubt',
    topic: 'steering',
    concept: 'rule12:doubt',
    difficulty: 2,
    prompt: 'A sailing vessel with the wind on her port side sees a sailing vessel to windward and cannot determine with certainty whether the other has the wind on her port or starboard side. She shall:',
    answer: 'Keep out of the way of the other',
    distractors: [
      'Hold her course and speed until the other\'s tack becomes apparent',
      'Assume the other is on port tack and stand on',
      'Sound five or more short and rapid blasts',
    ],
    ruleRefs: ['Rule 12(a)(iii)'],
    explanation:
      'Rule 12(a)(iii). At night, when all you have is a white sternlight or a distant tricolour, this is the rule that resolves the situation.',
  }),
  mcq({
    id: 'str-overtaking-sector',
    topic: 'steering',
    concept: 'rule13:sector',
    difficulty: 2,
    prompt: 'A vessel is deemed to be overtaking when coming up with another from a direction:',
    answer: 'More than 22.5 degrees abaft the other vessel\'s beam',
    distractors: [
      'More than 22.5 degrees abaft her own beam',
      'More than 112.5 degrees from the other vessel\'s bow',
      'Anywhere abaft the other vessel\'s beam',
    ],
    ruleRefs: ['Rule 13(b)'],
    explanation:
      'Rule 13(b): in such a position that at night she would be able to see only the sternlight of the vessel she is overtaking and neither of her sidelights. The sternlight arc is 135 degrees, which is 67.5 degrees each side of right astern — that is, 22.5 degrees abaft the beam.',
    teachingNote:
      'Teach the sector from the lights, not from the number. If you can see only her sternlight, you are overtaking. The geometry then falls out on its own.',
    misconception:
      'The bearing is taken from the overtaken vessel, not from the overtaking one. Students routinely measure it from the wrong ship.',
  }),
  mcq({
    id: 'str-overtaking-persists',
    topic: 'steering',
    concept: 'rule13:persistence',
    difficulty: 3,
    prompt: 'You are overtaking a vessel. As you draw up, the bearing changes until she is broad on your starboard bow and you are on her port bow. What is now the position?',
    answer: 'You remain the overtaking vessel and must keep out of the way until finally past and clear',
    distractors: [
      'It has become a crossing situation and she must now give way, having you on her starboard side',
      'It has become a crossing situation and you must give way as the vessel with the other on her starboard side',
      'Both vessels are now stand-on and must sound five short blasts',
    ],
    ruleRefs: ['Rule 13(a)', 'Rule 13(d)'],
    explanation:
      'Rule 13(d): any subsequent alteration of the bearing between the two vessels shall not make the overtaking vessel a crossing vessel within the meaning of these Rules or relieve her of the duty of keeping clear until she is finally past and clear. Rule 13(a) also gives Rule 13 precedence over anything in Section II.',
    teachingNote:
      'This is a favourite examination question because it tests whether the candidate understands that the character of a situation is fixed at the outset.',
  }),
  mcq({
    id: 'str-head-on-test',
    topic: 'steering',
    concept: 'rule14:recognition',
    difficulty: 2,
    prompt: 'At night, a head-on situation shall be deemed to exist when a power-driven vessel sees another ahead or nearly ahead and:',
    answer: 'Sees her masthead lights in a line or nearly in a line and/or both her sidelights',
    distractors: [
      'Sees one masthead light and one sidelight',
      'Sees both sidelights only, masthead lights being irrelevant at night',
      'Sees a single white light ahead',
    ],
    ruleRefs: ['Rule 14(b)', 'Rule 14(c)'],
    explanation:
      'Rule 14(b). Rule 14(c) adds that when a vessel is in any doubt whether such a situation exists she shall assume that it does and act accordingly — another of the doubt clauses.',
    teachingNote:
      'Two masthead lights in line is the strongest aspect cue at sea: the pair opens and closes long before the sidelights tell you anything. Be careful with the inference about size, though. Rule 23(a)(ii) requires the second light at 50 metres and over but expressly permits a shorter vessel to show it, so two masthead lights do not prove she is 50 metres or more.',
  }),
  mcq({
    id: 'str-crossing-avoid-ahead',
    topic: 'steering',
    concept: 'rule15:give-way',
    difficulty: 1,
    prompt: 'Two power-driven vessels are crossing so as to involve risk of collision. The vessel which has the other on her own starboard side shall keep out of the way and shall, if the circumstances admit:',
    answer: 'Avoid crossing ahead of the other vessel',
    distractors: [
      'Avoid crossing astern of the other vessel',
      'Alter course to port',
      'Reduce speed and sound one prolonged blast',
    ],
    ruleRefs: ['Rule 15'],
    explanation:
      'Rule 15. Combined with Rule 16, the standard answer is a substantial alteration to starboard, taken early, passing under the other vessel\'s stern.',
    teachingNote:
      'Give the student the reason, not just the instruction: passing astern means that if the other vessel does something unexpected, your alteration still opens the range. Crossing ahead bets on her holding course.',
  }),
  mcq({
    id: 'str-standon-may-act',
    topic: 'steering',
    concept: 'rule17:may-act',
    difficulty: 3,
    prompt: 'You are the stand-on vessel. Under Rule 17(a)(ii), you MAY take action by your manoeuvre alone:',
    answer: 'As soon as it becomes apparent to you that the give-way vessel is not taking appropriate action in compliance with these Rules',
    distractors: [
      'Only when collision cannot be avoided by the action of the give-way vessel alone',
      'At any time, since the stand-on vessel has the right of way',
      'Only after sounding five or more short and rapid blasts and receiving no response',
    ],
    ruleRefs: ['Rule 17(a)(ii)', 'Rule 17(b)'],
    explanation:
      'Rule 17(a)(ii) is permissive — "may" — and is triggered by the give-way vessel\'s apparent failure to act. Rule 17(b) is mandatory — "shall" — and is triggered when the vessels are so close that collision cannot be avoided by the give-way vessel alone.',
    teachingNote:
      'Three stages, and candidates must be able to name all three: 17(a)(i) keep course and speed; 17(a)(ii) may act; 17(b) shall act. Losing marks here is usually about missing the middle stage.',
    misconception:
      'Students think stand-on means "do nothing until it is too late". It means hold course and speed so the other vessel can solve the problem — and then act while the problem is still solvable.',
  }),
  mcq({
    id: 'str-standon-not-to-port',
    topic: 'steering',
    concept: 'rule17:not-to-port',
    difficulty: 3,
    prompt: 'A power-driven stand-on vessel takes action under Rule 17(a)(ii) in a crossing situation. She shall, if the circumstances admit:',
    answer: 'Not alter course to port for a vessel on her own port side',
    distractors: [
      'Not alter course to starboard for a vessel on her own port side',
      'Not alter course to port for a vessel on her own starboard side',
      'Not reduce speed, since only a course alteration is permitted',
    ],
    ruleRefs: ['Rule 17(c)'],
    explanation:
      'Rule 17(c). The vessel on your port side is the give-way vessel; she should be turning to starboard, which carries her across your bow from left to right. If you also turn to port you turn into her.',
    teachingNote:
      'Draw it. The prohibition is obvious on paper and almost impossible to recover from memory alone under exam pressure.',
  }),
  mcq({
    id: 'str-rule18-order',
    topic: 'steering',
    concept: 'rule18:hierarchy',
    difficulty: 2,
    prompt: 'A vessel engaged in fishing and a sailing vessel are in sight of one another and risk of collision exists. Which keeps out of the way?',
    answer: 'The sailing vessel keeps out of the way of the vessel engaged in fishing',
    distractors: [
      'The vessel engaged in fishing keeps out of the way of the sailing vessel',
      'Neither; both alter course to starboard',
      'Whichever has the other on her starboard side',
    ],
    ruleRefs: ['Rule 18(b)'],
    explanation:
      'Rule 18(b): a sailing vessel underway shall keep out of the way of a vessel not under command, a vessel restricted in her ability to manoeuvre, and a vessel engaged in fishing.',
    teachingNote:
      'The ladder in 18(a) to (c) runs: not under command, restricted in ability to manoeuvre, engaged in fishing, sailing, power-driven. Teach it as a ladder with conditions, not as a ranking of ships. Rule 18 opens "except where Rules 9, 10 and 13 otherwise require", so a narrow channel, a traffic scheme or an overtaking situation overrides it; and a vessel constrained by her draught is not on the ladder at all — Rule 18(d) only asks others to avoid impeding her.',
  }),
  mcq({
    id: 'str-rv-avoid-port',
    topic: 'steering',
    concept: 'rule19:radar-alone',
    difficulty: 3,
    prompt: 'In restricted visibility you detect by radar alone a vessel forward of your beam, and a close-quarters situation is developing. Rule 19(d) says that so far as possible you shall avoid:',
    answer: 'An alteration of course to port, unless the other vessel is being overtaken',
    distractors: [
      'An alteration of course to starboard',
      'Any alteration of course; only speed may be adjusted',
      'An alteration of course to port in every case, without exception',
    ],
    ruleRefs: ['Rule 19(d)(i)', 'Rule 19(d)(ii)'],
    explanation:
      'Rule 19(d) gives two prohibitions: an alteration to port for a vessel forward of the beam other than for a vessel being overtaken, and an alteration of course towards a vessel abeam or abaft the beam.',
    teachingNote:
      'Resist turning this into geometry. For a contact fine on your starboard bow a turn to port opens the bearing, and it is still forbidden. The reason is that you are both manoeuvring blind and independently: if each of you keeps to starboard for anything forward of the beam, your alterations add up instead of cancelling, and neither of you turns across the other. A port turn is also the one she has least reason to expect.',
  }),
  mcq({
    id: 'str-rv-fog-signal-forward',
    topic: 'steering',
    concept: 'rule19:fog-signal-forward',
    difficulty: 3,
    prompt: 'In restricted visibility you hear, apparently forward of your beam, the fog signal of another vessel. Rule 19(e) requires you to:',
    answer: 'Reduce your speed to the minimum at which you can be kept on your course, and if necessary take all way off, and in any event navigate with extreme caution',
    distractors: [
      'Alter course to starboard by at least 30 degrees',
      'Stop engines immediately and sound two prolonged blasts',
      'Maintain course and speed, since you are the stand-on vessel',
    ],
    ruleRefs: ['Rule 19(e)'],
    explanation:
      'Rule 19(e) applies unless you have determined that risk of collision does not exist. The same duty applies if you cannot avoid a close-quarters situation with a vessel forward of the beam.',
    misconception:
      'Candidates reach for a course alteration. Rule 19(e) is about speed: slow to steerage way, be ready to stop.',
  }),
  mcq({
    id: 'str-rv-no-standon',
    topic: 'steering',
    concept: 'rule19:no-standon',
    difficulty: 2,
    prompt: 'In restricted visibility, which vessel is the stand-on vessel?',
    answer: 'Neither — Rule 19 creates no stand-on vessel',
    distractors: [
      'The vessel which has the other on her port side',
      'The vessel higher in the Rule 18 order of precedence',
      'The vessel being overtaken',
    ],
    ruleRefs: ['Rule 19(a)', 'Rule 19(b)', 'Rule 11'],
    explanation:
      'Rule 19 applies to vessels not in sight of one another. Rules 11 to 18, which contain the whole give-way and stand-on scheme, apply only to vessels in sight of one another. In fog both vessels have an independent duty to take avoiding action in ample time.',
    teachingNote:
      'This is the single most important idea in Section III and the one most often got wrong. There is no right of way in fog.',
  }),
];
