import type { Question } from '../types.ts';
import { mcq } from './helpers.ts';

/**
 * Meteorology: what the generated drills do not ask. Arranged by the items of
 * section 12 of the RYA Coastal Skipper / Yachtmaster Offshore syllabus.
 * Forecast terms are the Met Office's; wording is original.
 */
export const WEATHER_QUESTIONS: Question[] = [
  // --- basic terms -----------------------------------------------------------
  mcq({
    id: 'wx-def-isobar',
    topic: 'weather-terms',
    concept: 'weather:def:isobar',
    difficulty: 1,
    prompt: 'What is an isobar?',
    answer: 'A line on a weather chart joining places of equal pressure',
    distractors: [
      'A line joining places of equal temperature',
      'The boundary between two air masses',
      'A line joining places with the same wind speed',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Isobars are drawn usually every 4 hPa. The wind blows roughly along them, and the closer together they are the stronger it blows. A boundary between air masses is a front.',
  }),

  // --- air masses ------------------------------------------------------------
  mcq({
    id: 'wx-air-tm',
    topic: 'weather-airmasses',
    concept: 'weather:air:tropical-maritime',
    difficulty: 1,
    prompt: 'A mild, damp south-westerly, low cloud, drizzle and poor visibility. Which air mass?',
    answer: 'Tropical maritime — warm, moist air from over the Atlantic to the south-west',
    distractors: [
      'Polar maritime — cool air from the north-west',
      'Polar continental — cold, dry air from the east',
      'Tropical continental — hot, dry air from the south-east',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'An air mass takes the character of where it formed. Tropical maritime air is warm and moist; cooled from below over a colder sea it gives low stratus, drizzle, poor visibility and sea fog. It is the air of the warm sector.',
  }),
  mcq({
    id: 'wx-air-pm',
    topic: 'weather-airmasses',
    concept: 'weather:air:polar-maritime',
    difficulty: 1,
    prompt: 'Behind a cold front: a fresh north-westerly, heaped clouds, showers, and excellent visibility between them. Which air mass?',
    answer: 'Polar maritime — cool air from the north-west, warmed from below by the sea',
    distractors: [
      'Tropical maritime — warm, moist air from the south-west',
      'Tropical continental — hot, dry air from the south-east',
      'Polar continental — very cold, dry air from the east',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Cool air moving over a warmer sea is heated from below and becomes unstable: cumulus, showers, gusty winds, and very clear air between the showers.',
  }),
  mcq({
    id: 'wx-air-tc',
    topic: 'weather-airmasses',
    concept: 'weather:air:tropical-continental',
    difficulty: 2,
    prompt: 'In summer, a hot, dry south-easterly off the continent, with haze. Which air mass?',
    answer: 'Tropical continental',
    distractors: ['Polar continental', 'Tropical maritime', 'Polar maritime'],
    ruleRefs: ['Meteorology'],
    explanation:
      'Air that has come over hot land is hot and dry, and carries dust and pollution: haze, poor visibility without fog, and thundery weather when it breaks down. Polar continental is its winter opposite: bitterly cold easterlies.',
  }),
  mcq({
    id: 'wx-air-what',
    topic: 'weather-airmasses',
    concept: 'weather:air:definition',
    difficulty: 1,
    prompt: 'What makes a body of air an "air mass"?',
    answer: 'It is large and has much the same temperature and humidity throughout, taken from where it formed',
    distractors: [
      'It is the air inside a depression',
      'It is the air above 5,000 metres',
      'It is any wind stronger than force 6',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Air that sits over an ocean or a continent takes on its temperature and moisture: maritime or continental, polar or tropical. Where two air masses meet is a front.',
  }),

  // --- clouds ----------------------------------------------------------------
  mcq({
    id: 'wx-cloud-halo',
    topic: 'weather-clouds',
    concept: 'weather:cloud:halo',
    difficulty: 1,
    prompt: 'You see a ring of light, a halo, around the sun. Which cloud causes it, and what does it suggest?',
    answer: 'Cirrostratus, made of ice crystals — a warm front and rain may be on the way',
    distractors: [
      'Altostratus — rain is already falling',
      'Cumulonimbus — thunder is imminent',
      'Stratus — fog is lifting',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'A halo needs ice crystals, so it needs thin high cloud: cirrostratus. Behind altostratus the sun is only a blur, with no halo. A thickening veil with a halo and a falling barometer is the classic warning of a warm front, often with rain within about twelve hours.',
  }),

  // --- pressure and fronts ---------------------------------------------------
  mcq({
    id: 'wx-sys-high',
    topic: 'weather-systems',
    concept: 'weather:sys:high',
    difficulty: 1,
    prompt: 'What weather does a slow-moving high usually bring in summer?',
    answer: 'Light winds, fine weather, and a chance of fog or haze',
    distractors: [
      'Gales and heavy rain',
      'Squally showers',
      'Steady rain and poor visibility',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Air sinks in a high, suppressing cloud: fine and settled, with light winds, sea breezes on the coast, and fog or haze in still air. Winds blow clockwise round it and are strongest on its edges, where the isobars close up.',
  }),
  mcq({
    id: 'wx-sys-occlusion',
    topic: 'weather-systems',
    concept: 'weather:sys:occlusion',
    difficulty: 2,
    prompt: 'What is an occluded front?',
    answer: 'Where the cold front has caught up with the warm front and lifted the warm sector off the ground',
    distractors: [
      'A front that has stopped moving',
      'The line of a high-pressure ridge',
      'A front between two highs',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Cold fronts move faster than warm ones and catch them up, starting near the centre of the depression. The occlusion brings weather of both — cloud and rain, then a clearance — and marks a depression that is ageing.',
  }),

  // --- forecasts -------------------------------------------------------------
  mcq({
    id: 'wx-src-msi',
    topic: 'weather-forecasts',
    concept: 'weather:src:coastguard',
    difficulty: 1,
    prompt: 'How does HM Coastguard broadcast forecasts on VHF?',
    answer: 'It announces them on channel 16 and broadcasts them on a working channel it names',
    distractors: [
      'It reads them on channel 16',
      'Only on request, by DSC',
      'On channel 70, as a digital message',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Maritime Safety Information — inshore forecasts, gale and strong wind warnings — is announced on channel 16 and read on a working channel. Channel 16 is kept clear for distress and calling; channel 70 is for DSC only.',
  }),
  mcq({
    id: 'wx-src-navtex',
    topic: 'weather-forecasts',
    concept: 'weather:src:navtex',
    difficulty: 2,
    prompt: 'What is NAVTEX?',
    answer: 'An automatic receiver of printed or displayed safety messages, including forecasts and gale warnings',
    distractors: [
      'A VHF channel for weather',
      'A satellite weather picture',
      'A computer forecast file for a chart plotter',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'NAVTEX receives navigational and meteorological warnings and forecasts on 518 kHz, in English, without anyone having to listen at the right time. The computer file for a plotter is a GRIB file: raw model output, with no forecaster’s judgement, which tends to understate gusts and local effects.',
  }),
  mcq({
    id: 'wx-src-order',
    topic: 'weather-forecasts',
    concept: 'weather:src:shipping-order',
    difficulty: 2,
    prompt: 'In what order does the shipping forecast give its information?',
    answer: 'Gale warnings, the general synopsis, then each sea area: wind, sea state, weather, visibility',
    distractors: [
      'Each sea area first, then the synopsis at the end',
      'Visibility, weather, wind, then the synopsis',
      'Only the areas with gales',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Warnings first so they are not missed; the general synopsis — where the lows and highs are and where they are going — then area by area: wind, sea state, weather, visibility. Write it down in that order.',
  }),
  mcq({
    id: 'wx-fax-fronts',
    topic: 'weather-forecasts',
    concept: 'weather:fax:front-symbols',
    difficulty: 1,
    prompt: 'On a synoptic chart or weatherfax, how is a cold front drawn?',
    answer: 'A line with triangles on the side it is moving towards',
    distractors: [
      'A line with semicircles on the side it is moving towards',
      'A line with triangles and semicircles on the same side',
      'A dashed line with no symbols',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Cold front: triangles (blue in colour). Warm front: semicircles (red). Occluded front: both on the same side (purple). The symbols point the way the front is moving.',
  }),
  mcq({
    id: 'wx-sat-comma',
    topic: 'weather-forecasts',
    concept: 'weather:sat:comma',
    difficulty: 2,
    prompt: 'On a satellite picture, what does a large comma-shaped band of white cloud over the Atlantic usually show?',
    answer: 'A depression with its fronts',
    distractors: ['A high-pressure area', 'Fog over the sea', 'A sea breeze front'],
    ruleRefs: ['Meteorology'],
    explanation:
      'Frontal cloud is thick and high, so it shows bright white, curling in a comma round the low’s centre. Behind the cold front, a speckle of small cells is showery polar air; a high shows as largely clear or with low, grey cloud.',
  }),

  // --- breezes ---------------------------------------------------------------
  mcq({
    id: 'wx-breeze-when',
    topic: 'weather-breezes',
    concept: 'weather:breeze:conditions',
    difficulty: 1,
    prompt: 'Which conditions favour a sea breeze?',
    answer: 'A sunny day, land warming faster than the sea, and little gradient wind',
    distractors: [
      'An overcast day with a strong offshore gradient wind',
      'A clear, calm night',
      'Any day with a falling barometer',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'The land has to get warmer than the sea, so it needs sun, and the gradient wind must be light enough not to swamp it. It builds late morning, peaks mid-afternoon — often force 3 or 4 near the coast — and dies at dusk. At night the land cools and a weaker land breeze may blow off it.',
  }),

  // --- fog -------------------------------------------------------------------
  mcq({
    id: 'wx-fog-sea',
    topic: 'weather-fog',
    concept: 'weather:fog:sea',
    difficulty: 1,
    prompt: 'How does sea fog form?',
    answer: 'Warm, moist air moving over a colder sea is cooled until its moisture condenses',
    distractors: [
      'Land cools on a clear night and the fog drifts out to sea',
      'Cold air moves over a warm sea and steams',
      'Rain evaporates as it falls into dry air',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Sea fog is advection fog: moist air cooled from below by a colder sea, typically in spring and early summer when the sea is still cold. It can persist in a moderate wind and does not burn off with the sun; only a change of air mass clears it.',
  }),
  mcq({
    id: 'wx-fog-radiation',
    topic: 'weather-fog',
    concept: 'weather:fog:radiation',
    difficulty: 1,
    prompt: 'After a clear, still night, the harbour and river are thick with fog at dawn, while the sea outside is clear. What is it, and what will it do?',
    answer: 'Radiation fog, formed over the land; it usually clears as the sun warms the ground',
    distractors: [
      'Sea fog; it will persist all day',
      'Frontal fog; it will clear when the rain starts',
      'Advection fog; it will thicken as the wind rises',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'Land loses heat fast on a clear, calm night and cools the air above it to its dew point. The fog lies over land and drifts into harbours and estuaries, rarely far to sea, and usually burns off by mid-morning. A breeze tends to lift it.',
  }),
  mcq({
    id: 'wx-fog-wind',
    topic: 'weather-fog',
    concept: 'weather:fog:wind',
    difficulty: 2,
    prompt: 'A fresh breeze gets up. Which kind of fog can still persist?',
    answer: 'Sea fog',
    distractors: ['Radiation fog', 'Neither: any wind clears fog', 'Both equally'],
    ruleRefs: ['Meteorology'],
    explanation:
      'Radiation fog needs calm and lifts or clears as the wind rises. Sea fog is brought by the wind itself — warm, moist air over cold water — and can persist in winds of force 4 or more until the air mass changes.',
  }),

  // --- barometer -------------------------------------------------------------
  mcq({
    id: 'wx-baro-log',
    topic: 'weather-barometer',
    concept: 'weather:baro:log',
    difficulty: 1,
    prompt: 'Why log the barometer every hour on passage?',
    answer: 'Because the rate of change matters more than the reading: a quick fall warns of wind',
    distractors: [
      'Because the reading gives the wind direction',
      'Because the Coastguard asks for it',
      'Because a high reading always means fine weather',
    ],
    ruleRefs: ['Meteorology'],
    explanation:
      'A barometer at 1000 hPa and steady says little; one that has fallen 4 hPa in three hours says a lot. Hourly entries show the trend. A quick rise after a low also brings strong, gusty winds for a while.',
  }),
];
