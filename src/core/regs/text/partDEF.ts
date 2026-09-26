import type { RegDoc } from '../model.ts';
import { PARTS } from '../../rules.ts';

/**
 * Parts D, E and F — Rules 32 to 41, as amended (Rule 33(a) as amended in
 * 2001; Part F added by resolution A.1085(28)).
 */
export const PART_DEF: RegDoc[] = [
  { id: 'r32', kind: 'rule', number: '32', title: 'Definitions', part: PARTS.D, text: `
(a) The word "whistle" means any sound signalling appliance capable of producing the prescribed blasts and which complies with the specifications in Annex III to these Regulations.
(b) The term "short blast" means a blast of about one second's duration.
(c) The term "prolonged blast" means a blast of from four to six seconds' duration.
` },

  { id: 'r33', kind: 'rule', number: '33', title: 'Equipment for sound signals', part: PARTS.D, text: `
(a) A vessel of 12 metres or more in length shall be provided with a whistle, a vessel of 20 metres or more in length shall be provided with a bell in addition to a whistle, and a vessel of 100 metres or more in length shall, in addition, be provided with a gong, the tone and sound of which cannot be confused with that of the bell. The whistle, bell and gong shall comply with the specifications in Annex III to these Regulations. The bell or gong or both may be replaced by other equipment having the same respective sound characteristics, provided that manual sounding of the prescribed signals shall always be possible.
(b) A vessel of less than 12 metres in length shall not be obliged to carry the sound signalling appliances prescribed in paragraph (a) of this Rule but if she does not, she shall be provided with some other means of making an efficient sound signal.
` },

  { id: 'r34', kind: 'rule', number: '34', title: 'Manoeuvring and warning signals', part: PARTS.D, text: `
(a) When vessels are in sight of one another, a power-driven vessel underway, when manoeuvring as authorized or required by these Rules, shall indicate that manoeuvre by the following signals on her whistle:
  - one short blast to mean "I am altering my course to starboard";
  - two short blasts to mean "I am altering my course to port";
  - three short blasts to mean "I am operating astern propulsion".
(b) Any vessel may supplement the whistle signals prescribed in paragraph (a) of this Rule by light signals, repeated as appropriate, whilst the manoeuvre is being carried out:
  (i) these light signals shall have the following significance:
    - one flash to mean "I am altering my course to starboard";
    - two flashes to mean "I am altering my course to port";
    - three flashes to mean "I am operating astern propulsion";
  (ii) the duration of each flash shall be about one second, the interval between flashes shall be about one second, and the interval between successive signals shall be not less than ten seconds;
  (iii) the light used for this signal shall, if fitted, be an all-round white light, visible at a minimum range of 5 miles, and shall comply with the provisions of Annex I to these Regulations.
(c) When in sight of one another in a narrow channel or fairway:
  (i) a vessel intending to overtake another shall in compliance with Rule 9(e)(i) indicate her intention by the following signals on her whistle:
    - two prolonged blasts followed by one short blast to mean "I intend to overtake you on your starboard side";
    - two prolonged blasts followed by two short blasts to mean "I intend to overtake you on your port side".
  (ii) the vessel about to be overtaken when acting in accordance with Rule 9(e)(i) shall indicate her agreement by the following signal on her whistle:
    - one prolonged, one short, one prolonged and one short blast, in that order.
(d) When vessels in sight of one another are approaching each other and from any cause either vessel fails to understand the intentions or actions of the other, or is in doubt whether sufficient action is being taken by the other to avoid collision, the vessel in doubt shall immediately indicate such doubt by giving at least five short and rapid blasts on the whistle. Such signal may be supplemented by a light signal of at least five short and rapid flashes.
(e) A vessel nearing a bend or an area of a channel or fairway where other vessels may be obscured by an intervening obstruction shall sound one prolonged blast. Such signal shall be answered with a prolonged blast by any approaching vessel that may be within hearing around the bend or behind the intervening obstruction.
(f) If whistles are fitted on a vessel at a distance apart of more than 100 metres, one whistle only shall be used for giving manoeuvring and warning signals.
` },

  { id: 'r35', kind: 'rule', number: '35', title: 'Sound signals in restricted visibility', part: PARTS.D, text: `
In or near an area of restricted visibility, whether by day or night, the signals prescribed in this Rule shall be used as follows:
(a) A power-driven vessel making way through the water shall sound at intervals of not more than 2 minutes one prolonged blast.
(b) A power-driven vessel underway but stopped and making no way through the water shall sound at intervals of not more than 2 minutes two prolonged blasts in succession with an interval of about 2 seconds between them.
(c) A vessel not under command, a vessel restricted in her ability to manoeuvre, a vessel constrained by her draught, a sailing vessel, a vessel engaged in fishing and a vessel engaged in towing or pushing another vessel shall, instead of the signals prescribed in paragraphs (a) or (b) of this Rule, sound at intervals of not more than 2 minutes three blasts in succession, namely one prolonged followed by two short blasts.
(d) A vessel engaged in fishing, when at anchor, and a vessel restricted in her ability to manoeuvre when carrying out her work at anchor, shall instead of the signals prescribed in paragraph (g) of this Rule sound the signal prescribed in paragraph (c) of this Rule.
(e) A vessel towed or if more than one vessel is towed the last vessel of the tow, if manned, shall at intervals of not more than 2 minutes sound four blasts in succession, namely one prolonged followed by three short blasts. When practicable, this signal shall be made immediately after the signal made by the towing vessel.
(f) When a pushing vessel and a vessel being pushed ahead are rigidly connected in a composite unit they shall be regarded as a power-driven vessel and shall give the signals prescribed in paragraphs (a) or (b) of this Rule.
(g) A vessel at anchor shall at intervals of not more than one minute ring the bell rapidly for about 5 seconds. In a vessel of 100 metres or more in length the bell shall be sounded in the forepart of the vessel and immediately after the ringing of the bell the gong shall be sounded rapidly for about 5 seconds in the after part of the vessel. A vessel at anchor may in addition sound three blasts in succession, namely one short, one prolonged and one short blast, to give warning of her position and of the possibility of collision to an approaching vessel.
(h) A vessel aground shall give the bell signal and if required the gong signal prescribed in paragraph (g) of this Rule and shall, in addition, give three separate and distinct strokes on the bell immediately before and after the rapid ringing of the bell. A vessel aground may in addition sound an appropriate whistle signal.
(i) A vessel of 12 metres or more but less than 20 metres in length shall not be obliged to give the bell signals prescribed in paragraphs (g) and (h) of this Rule. However, if she does not, she shall make some other efficient sound signal at intervals of not more than 2 minutes.
(j) A vessel of less than 12 metres in length shall not be obliged to give the above-mentioned signals but, if she does not, shall make some other efficient sound signal at intervals of not more than 2 minutes.
(k) A pilot vessel when engaged on pilotage duty may in addition to the signals prescribed in paragraphs (a), (b) or (g) of this Rule sound an identity signal consisting of four short blasts.
` },

  { id: 'r36', kind: 'rule', number: '36', title: 'Signals to attract attention', part: PARTS.D, text: `
If necessary to attract the attention of another vessel any vessel may make light or sound signals that cannot be mistaken for any signal authorized elsewhere in these Rules, or may direct the beam of her searchlight in the direction of the danger, in such a way as not to embarrass any vessel. Any light to attract the attention of another vessel shall be such that it cannot be mistaken for any aid to navigation. For the purpose of this Rule the use of high intensity intermittent or revolving lights, such as strobe lights, shall be avoided.
` },

  { id: 'r37', kind: 'rule', number: '37', title: 'Distress signals', part: PARTS.D, text: `
When a vessel is in distress and requires assistance she shall use or exhibit the signals described in Annex IV to these Regulations.
` },

  // (d) has no text of its own, only sub-paragraphs; the " " is the
  // space the label needs, written as an escape so editors do not strip it.
  { id: 'r38', kind: 'rule', number: '38', title: 'Exemptions', part: PARTS.E, text: `
Any vessel (or class of vessels) provided that she complies with the requirements of the International Regulations for Preventing Collisions at Sea, 1960, the keel of which is laid or which is at a corresponding stage of construction before the entry into force of these Regulations may be exempted from compliance therewith as follows:
(a) The installation of lights with ranges prescribed in Rule 22, until 4 years after the date of entry into force of these Regulations.
(b) The installation of lights with colour specifications as prescribed in Section 7 of Annex I to these Regulations, until 4 years after the date of entry into force of these Regulations.
(c) The repositioning of lights as a result of conversion from Imperial to metric units and rounding off measurement figures, permanent exemption.
(d) 
  (i) The repositioning of masthead lights on vessels of less than 150 metres in length, resulting from the prescriptions of Section 3(a) of Annex I to these Regulations, permanent exemption.
  (ii) The repositioning of masthead lights on vessels of 150 metres or more in length, resulting from the prescriptions of Section 3(a) of Annex I to these Regulations, until 9 years after the date of entry into force of these Regulations.
(e) The repositioning of masthead lights resulting from the prescriptions of Section 2(b) of Annex I to these Regulations, until 9 years after the date of entry into force of these Regulations.
(f) The repositioning of sidelights resulting from the prescriptions of Sections 2(g) and 3(b) of Annex I to these Regulations, until 9 years after the date of entry into force of these Regulations.
(g) The requirements for sound signal appliances prescribed in Annex III to these Regulations, until 9 years after the date of entry into force of these Regulations.
(h) The repositioning of all-round lights resulting from the prescription of Section 9(b) of Annex I to these Regulations, permanent exemption.
` },

  { id: 'r39', kind: 'rule', number: '39', title: 'Definitions', part: PARTS.F, text: `
(a) "Audit" means a systematic, independent and documented process for obtaining audit evidence and evaluating it objectively to determine the extent to which audit criteria are fulfilled.
(b) "Audit Scheme" means the IMO Member State Audit Scheme established by the Organization and taking into account the guidelines developed by the Organization.
(c) "Code for Implementation" means the IMO Instruments Implementation Code (III Code) adopted by the Organization by resolution A.1070(28).
(d) "Audit Standard" means the Code for Implementation.
` },

  { id: 'r40', kind: 'rule', number: '40', title: 'Application', part: PARTS.F, text: `
Contracting Parties shall use the provisions of the Code for Implementation in the execution of their obligations and responsibilities contained in the present Convention.
` },

  { id: 'r41', kind: 'rule', number: '41', title: 'Verification of compliance', part: PARTS.F, text: `
(a) Every Contracting Party shall be subject to periodic audits by the Organization in accordance with the audit standard to verify compliance with and implementation of the present Convention.
(b) The Secretary-General of the Organization shall have responsibility for administering the Audit Scheme, based on the guidelines developed by the Organization.
(c) Every Contracting Party shall have responsibility for facilitating the conduct of the audit and implementation of a programme of actions to address the findings, based on the guidelines developed by the Organization.
(d) Audit of all Contracting Parties shall be:
  (i) based on an overall schedule developed by the Secretary-General of the Organization, taking into account the guidelines developed by the Organization; and
  (ii) conducted at periodic intervals, taking into account the guidelines developed by the Organization.
` },
];
