import type { ReactNode } from 'react';
import type { Domain } from '../core/types.ts';

/**
 * The subjects on the home page, in syllabus order, with how each is reached
 * and how it is drawn on its tile. The one place a new section is listed.
 */
export interface Subject {
  domain: Domain;
  hash: string;
  title: string;
  blurb: string;
  icon: ReactNode;
}

const INK = '#ffffff';

const icons: Record<Domain, ReactNode> = {
  // A vessel's lights head-on: masthead light over red and green sidelights.
  colreg: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M6 32 L24 42 L42 32 L38 27 L10 27 Z" fill={INK} opacity="0.85" />
      <line x1="24" y1="27" x2="24" y2="9" stroke={INK} strokeWidth="2.2" />
      <circle cx="24" cy="9" r="4.2" fill="#ffffff" />
      <circle cx="12" cy="22" r="4.6" fill="#ff5a4f" stroke={INK} strokeWidth="1.2" />
      <circle cx="36" cy="22" r="4.6" fill="#3ddc77" stroke={INK} strokeWidth="1.2" />
    </svg>
  ),
  // A north cardinal.
  iala: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <rect x="17" y="20" width="14" height="10" fill="#1b2229" stroke={INK} strokeWidth="1.2" />
      <rect x="17" y="30" width="14" height="10" fill="#f2c53d" stroke={INK} strokeWidth="1.2" />
      <path d="M18 17 L24 8 L30 17 Z M18 12 L24 3 L30 12 Z" fill={INK} />
      <path d="M6 42 Q12 39 18 42 T30 42 T42 42" stroke={INK} strokeWidth="2" fill="none" />
    </svg>
  ),
  // A lighthouse with its beam.
  coastal: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M26 12 L46 6 L46 20 Z" fill="#ffe28a" opacity="0.8" />
      <path d="M19 42 L21 16 L27 16 L29 42 Z" fill={INK} />
      <rect x="20" y="10" width="8" height="6" rx="1" fill="#ffe28a" />
      <path d="M19 10 L24 5 L29 10 Z" fill={INK} />
      <rect x="20.6" y="24" width="6.8" height="3" fill="#b4540a" />
      <rect x="20" y="32" width="8" height="3" fill="#b4540a" />
    </svg>
  ),
  // A vector triangle, with the stream's three arrows.
  tidal: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M8 38 L38 10" stroke={INK} strokeWidth="2.4" />
      <path d="M8 38 L20 40" stroke="#ffd08a" strokeWidth="2.4" />
      <path d="M20 40 L38 10" stroke={INK} strokeWidth="2.4" opacity="0.7" />
      <circle cx="8" cy="38" r="3.4" fill="none" stroke={INK} strokeWidth="1.8" />
      <rect x="35" y="7" width="6" height="6" fill="none" stroke={INK} strokeWidth="1.8" />
      <path d="M11 35 l2 -4 M14 33 l2 -4" stroke={INK} strokeWidth="1.6" />
    </svg>
  ),
  // A tidal curve over a sounding.
  tides: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <path d="M4 30 C 12 30, 14 12, 24 12 C 34 12, 36 30, 44 30" stroke={INK} strokeWidth="2.6" fill="none" />
      <line x1="4" y1="38" x2="44" y2="38" stroke={INK} strokeWidth="1.6" strokeDasharray="3 3" />
      <line x1="24" y1="14" x2="24" y2="38" stroke="#ffc2f2" strokeWidth="2" />
      <path d="M21 17 L24 13 L27 17 M21 35 L24 39 L27 35" stroke="#ffc2f2" strokeWidth="2" fill="none" />
    </svg>
  ),
  // A cloud with rain.
  weather: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="18" cy="22" r="8" fill={INK} />
      <circle cx="28" cy="18" r="10" fill={INK} />
      <circle cx="36" cy="24" r="6.5" fill={INK} />
      <rect x="12" y="22" width="30" height="8" rx="4" fill={INK} />
      <path d="M17 34 l-2 6 M25 34 l-2 6 M33 34 l-2 6" stroke="#bfe3ff" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  ),
  // A cocked hat: three position lines.
  position: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <line x1="6" y1="36" x2="42" y2="30" stroke={INK} strokeWidth="2.2" />
      <line x1="10" y1="8" x2="32" y2="44" stroke={INK} strokeWidth="2.2" />
      <line x1="40" y1="8" x2="16" y2="44" stroke={INK} strokeWidth="2.2" />
      <circle cx="24" cy="30" r="4" fill="none" stroke="#ffd08a" strokeWidth="2" />
    </svg>
  ),
  // Two leading marks in line.
  pilotage: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <line x1="24" y1="40" x2="24" y2="28" stroke={INK} strokeWidth="2.6" />
      <path d="M16 30 L32 30 L24 18 Z" fill={INK} />
      <line x1="24" y1="18" x2="24" y2="10" stroke={INK} strokeWidth="2" />
      <path d="M18 4 L30 4 L24 13 Z" fill="#ffd08a" />
      <path d="M6 42 Q12 39 18 42 T30 42 T42 42" stroke={INK} strokeWidth="2" fill="none" />
    </svg>
  ),
  // A compass rose.
  compass: (
    <svg viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="18" fill="none" stroke={INK} strokeWidth="2" />
      <path d="M24 6 L28 24 L24 42 L20 24 Z" fill={INK} />
      <path d="M24 6 L28 24 L20 24 Z" fill="#ff6b61" />
      <path d="M6 24 L24 20 L42 24 L24 28 Z" fill={INK} opacity="0.6" />
    </svg>
  ),
};

export const SUBJECTS: readonly Subject[] = [
  {
    domain: 'colreg',
    hash: '#/colreg',
    title: 'Collision Regulations',
    blurb: 'COLREG Parts A to F and the Annexes',
    icon: icons.colreg,
  },
  {
    domain: 'iala',
    hash: '#/iala',
    title: 'IALA Buoyage',
    blurb: 'Regions A and B, by day and by night',
    icon: icons.iala,
  },
  {
    domain: 'coastal',
    hash: '#/lights',
    title: 'Lights ashore',
    blurb: 'Characters, the chart, and range',
    icon: icons.coastal,
  },
  {
    domain: 'compass',
    hash: '#/compass',
    title: 'The magnetic compass',
    blurb: 'Variation, deviation, checks and types',
    icon: icons.compass,
  },
  {
    domain: 'tides',
    hash: '#/tides',
    title: 'Tides',
    blurb: 'Datums, twelfths, secondary ports, the Solent',
    icon: icons.tides,
  },
  {
    domain: 'tidal',
    hash: '#/streams',
    title: 'Tidal streams',
    blurb: 'Diamonds, course to steer, EP, races',
    icon: icons.tidal,
  },
  {
    domain: 'position',
    hash: '#/position',
    title: 'Position',
    blurb: 'Visual, radar and GNSS fixes, and how far to trust them',
    icon: icons.position,
  },
  {
    domain: 'pilotage',
    hash: '#/pilotage',
    title: 'Pilotage',
    blurb: 'Clearing lines, leading lines, soundings, port signals',
    icon: icons.pilotage,
  },
  {
    domain: 'weather',
    hash: '#/weather',
    title: 'Weather',
    blurb: 'Clouds, fronts, forecasts, fog and breezes',
    icon: icons.weather,
  },
];

export function subjectOf(domain: Domain): Subject {
  return SUBJECTS.find((s) => s.domain === domain) as Subject;
}
