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
];

export function subjectOf(domain: Domain): Subject {
  return SUBJECTS.find((s) => s.domain === domain) as Subject;
}
