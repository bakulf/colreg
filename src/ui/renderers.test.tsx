import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { LightScene } from './LightScene.tsx';
import { ShapeScene } from './ShapeScene.tsx';
import { BuoyScene } from './BuoyScene.tsx';
import { ScenarioScene } from './ScenarioScene.tsx';
import { SignalScene } from './SignalScene.tsx';
import { VESSEL_POOL } from '../core/vessels.ts';
import { CANONICAL_ASPECTS } from '../core/lights/generator.ts';
import { hasDaySignal } from '../core/shapes/model.ts';
import { ALL_MARKS } from '../core/buoyage/model.ts';
import { ALL_SIGNALS } from '../core/signals/model.ts';
import { SPECS, composeScenarioDrill } from '../core/scenarios/generator.ts';
import { createRng } from '../core/rng.ts';

/**
 * Smoke tests for the renderers.
 *
 * They do not check that a picture looks right — that needs eyes. They check
 * the two things that can go wrong silently: a renderer throwing on some
 * configuration nobody tried by hand, and a drawing leaking its own answer
 * into the markup where a screen reader would read it out.
 */

const ANSWER_WORDS = [
  'trawl',
  'not under command',
  'restricted in her ability',
  'constrained by her draught',
  'pilot',
  'aground',
  'at anchor',
  'towing',
  'cardinal',
  'isolated danger',
  'safe water',
  'wreck',
];

function assertNoAnswerLeak(markup: string, where: string) {
  const text = markup.toLowerCase();
  for (const word of ANSWER_WORDS) {
    expect(text, `${where} leaks "${word}"`).not.toContain(word);
  }
}

describe('LightScene', () => {
  it('renders every vessel at every standard bearing without throwing', () => {
    for (const vessel of VESSEL_POOL) {
      for (const aspect of CANONICAL_ASPECTS) {
        const markup = renderToStaticMarkup(
          <LightScene vessel={vessel} aspectDeg={aspect} />,
        );
        expect(markup, `${vessel.kind} at ${aspect}`).toContain('<svg');
      }
    }
  });

  it('names the bearing but never the vessel', () => {
    const markup = renderToStaticMarkup(
      <LightScene vessel={VESSEL_POOL[0]!} aspectDeg={45} />,
    );
    expect(markup).toContain('STARBOARD BOW');
    assertNoAnswerLeak(markup, 'LightScene');
  });
});

describe('ShapeScene', () => {
  it('renders every vessel that has a day signal', () => {
    for (const vessel of VESSEL_POOL.filter(hasDaySignal)) {
      const markup = renderToStaticMarkup(<ShapeScene vessel={vessel} />);
      expect(markup, vessel.kind).toContain('<svg');
      assertNoAnswerLeak(markup, `ShapeScene ${vessel.kind}`);
    }
  });
});

describe('BuoyScene', () => {
  it('renders every mark by day and by night', () => {
    for (const mark of ALL_MARKS) {
      for (const mode of ['day', 'night'] as const) {
        const markup = renderToStaticMarkup(<BuoyScene kind={mark.kind} mode={mode} />);
        expect(markup, `${mark.kind} ${mode}`).toContain('<svg');
      }
    }
  });

  it('never writes the chart abbreviation or the answer into the markup', () => {
    // The accessible label may carry the observation — a screen reader user
    // has no other way to perceive the flashing — but not the shorthand the
    // student is being drilled to produce, and never the name of the mark.
    for (const mark of ALL_MARKS) {
      for (const mode of ['day', 'night'] as const) {
        const markup = renderToStaticMarkup(<BuoyScene kind={mark.kind} mode={mode} />);
        expect(markup, `${mark.kind} ${mode}`).not.toContain(mark.light.label);
        assertNoAnswerLeak(markup, `BuoyScene ${mark.kind} ${mode}`);
      }
    }
  });

  it('still describes the rhythm at night, so the drill is answerable by ear', () => {
    for (const mark of ALL_MARKS) {
      const markup = renderToStaticMarkup(<BuoyScene kind={mark.kind} mode="night" />);
      expect(markup, mark.kind).toContain(mark.light.spoken);
    }
  });
});

describe('ScenarioScene', () => {
  it('renders every situation', () => {
    const rng = createRng(3);
    for (const spec of SPECS) {
      const { scenario } = composeScenarioDrill(spec, rng);
      const markup = renderToStaticMarkup(<ScenarioScene scenario={scenario} />);
      expect(markup, spec.concept).toContain('<svg');
    }
  });

  it('draws no hull for a contact in fog', () => {
    const fog = SPECS.find((s) => s.concept === 'scenario:restricted-visibility')!;
    const { scenario } = composeScenarioDrill(fog, createRng(5));
    const markup = renderToStaticMarkup(<ScenarioScene scenario={scenario} />);
    expect(markup).toContain('NOT IN SIGHT');
    // Own vessel is one hull; a second would contradict Rule 19.
    expect(markup.match(/<path/g)?.length).toBe(2); // hull and heading arrowhead
  });
});

describe('SignalScene', () => {
  it('renders every signal without throwing', () => {
    for (const signal of ALL_SIGNALS) {
      const markup = renderToStaticMarkup(<SignalScene signalId={signal.id} />);
      expect(markup, signal.id).toContain('<svg');
    }
  });

  it('renders nothing for an unknown signal rather than throwing', () => {
    expect(renderToStaticMarkup(<SignalScene signalId="no-such-signal" />)).toBe('');
  });

  it('describes the blasts but never what they mean', () => {
    // The notation is the observable — it is what the timeline draws, and a
    // screen reader needs it to perceive the signal at all. The meaning is
    // the answer, and must not appear.
    for (const signal of ALL_SIGNALS) {
      const markup = renderToStaticMarkup(<SignalScene signalId={signal.id} />);
      expect(markup, signal.id).toContain(signal.notation);
      expect(markup.toLowerCase(), signal.id).not.toContain(
        signal.meaning.toLowerCase(),
      );
      assertNoAnswerLeak(markup, `SignalScene ${signal.id}`);
    }
  });
});

describe('CoastalLightScene', () => {
  it('draws every character without naming it', async () => {
    const { CoastalLightScene } = await import('./CoastalLightScene.tsx');
    const { CATALOGUE, notation } = await import('../core/coastal/model.ts');
    for (const c of CATALOGUE) {
      const markup = renderToStaticMarkup(<CoastalLightScene character={c} />);
      expect(markup, notation(c)).toContain('<svg');
      expect(markup.includes(`>${notation(c)}<`), notation(c)).toBe(false);
      expect(markup.includes(`"${notation(c)}"`), notation(c)).toBe(false);
    }
  });
});

describe('compass renderers', () => {
  it('draws the rose with its printed variation, and the card with every heading', async () => {
    const { CompassRoseScene } = await import('./CompassRoseScene.tsx');
    const { DeviationCardScene } = await import('./DeviationCardScene.tsx');
    const { makeCard } = await import('../core/compass/model.ts');
    const rose = renderToStaticMarkup(
      <CompassRoseScene rose={{ minutes: -255, year: 2009, annualMinutes: 8 }} />,
    );
    // React escapes the minute sign in markup.
    expect(rose).toContain('4°15&#x27;W');
    expect(rose).toContain('(8&#x27;E)');
    const card = renderToStaticMarkup(<DeviationCardScene card={makeCard(5, 40, 0)} />);
    for (const h of ['000°C', '090°C', '180°C', '330°C']) expect(card).toContain(h);
  });
});

describe('tidal renderers', () => {
  it('draws the table, a triangle and a pick of four', async () => {
    const { TidalDiamondScene, TidalTriangleScene, TidalPickScene } = await import('./TidalScenes.tsx');
    const { makeDiamond, ctsDiagram, epDiagram, fromPolar } = await import('../core/tidal/model.ts');
    const d = makeDiamond('C', 'Portmoor', 70, 2.6, 0);
    const table = renderToStaticMarkup(<TidalDiamondScene diamond={d} highlight={2} />);
    expect(table).toContain('HW Portmoor');
    expect(table).toContain('class="lit"');
    const stream = fromPolar(150, 1.4);
    const tri = renderToStaticMarkup(<TidalTriangleScene diagram={ctsDiagram(40, 8, 6, stream)} />);
    expect(tri).toContain('<svg');
    const pick = renderToStaticMarkup(
      <TidalPickScene diagrams={[ctsDiagram(40, 8, 6, stream), epDiagram(40, 6, stream), ctsDiagram(40, 8, 6, stream), epDiagram(40, 6, stream)]} />,
    );
    expect(pick.match(/<svg/g)).toHaveLength(4);
  });
});
