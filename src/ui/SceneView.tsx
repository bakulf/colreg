import type { Scene } from '../core/types.ts';
import { LightScene } from './LightScene.tsx';
import { ShapeScene } from './ShapeScene.tsx';
import { BuoyScene } from './BuoyScene.tsx';
import { ScenarioScene } from './ScenarioScene.tsx';
import { SignalScene } from './SignalScene.tsx';
import { DistressScene } from './DistressScene.tsx';
import { CoastalLightScene } from './CoastalLightScene.tsx';
import { CompassRoseScene } from './CompassRoseScene.tsx';
import { DeviationCardScene } from './DeviationCardScene.tsx';
import { TidalDiamondScene, TidalPickScene, TidalTriangleScene } from './TidalScenes.tsx';
import { TideCurveScene, TideLevelsScene } from './TideScenes.tsx';
import { LuminousDiagramScene } from './LuminousDiagramScene.tsx';
import { CloudScene } from './CloudScene.tsx';
import { FrontStripScene, SynopticScene } from './WeatherScenes.tsx';
import { ClearingLineScene, CockedHatScene, LeadingMarksScene, PortSignalScene } from './PilotageScenes.tsx';

/** Maps a scene, which is plain data from `core`, to the component that draws it. */
export function SceneView({ scene, compact }: { scene: Scene; compact?: boolean }) {
  switch (scene.type) {
    case 'lights':
      return (
        <LightScene vessel={scene.vessel} aspectDeg={scene.aspectDeg} compact={compact} />
      );
    case 'shapes':
      return <ShapeScene vessel={scene.vessel} compact={compact} />;
    case 'buoy':
      return <BuoyScene kind={scene.kind} mode={scene.mode} compact={compact} />;
    case 'scenario':
      return <ScenarioScene scenario={scene.scenario} compact={compact} />;
    case 'signal':
      return <SignalScene signalId={scene.signalId} compact={compact} />;
    case 'distress':
      return <DistressScene visual={scene.visual} compact={compact} />;
    case 'coastal':
      return <CoastalLightScene character={scene.character} compact={compact} />;
    case 'compass-rose':
      return <CompassRoseScene rose={scene.rose} compact={compact} />;
    case 'deviation-card':
      return <DeviationCardScene card={scene.card} compact={compact} />;
    case 'tidal-diamond':
      return <TidalDiamondScene diamond={scene.diamond} highlight={scene.highlight} />;
    case 'tidal-triangle':
      return <TidalTriangleScene diagram={scene.diagram} compact={compact} />;
    case 'tidal-pick':
      return <TidalPickScene diagrams={scene.diagrams} />;
    case 'cloud':
      return <CloudScene genus={scene.genus} photo={scene.photo} compact={compact} />;
    case 'front-strip':
      return <FrontStripScene highlight={scene.highlight} />;
    case 'synoptic':
      return <SynopticScene system={scene.system} boatAt={scene.boatAt} tight={scene.tight} />;
    case 'cocked-hat':
      return <CockedHatScene danger={scene.danger} rotation={scene.rotation} />;
    case 'clearing-line':
      return (
        <ClearingLineScene line={scene.line} label={scene.label} dangerSide={scene.dangerSide} observed={scene.observed} />
      );
    case 'leading-marks':
      return <LeadingMarksScene rear={scene.rear} />;
    case 'port-signal':
      return <PortSignalScene signal={scene.signal} />;
    case 'luminous-diagram':
      return <LuminousDiagramScene mark={scene.mark} />;
    case 'tide-levels':
      return <TideLevelsScene levels={scene.levels} />;
    case 'tide-curve':
      return <TideCurveScene curve={scene.curve} />;
  }
}
