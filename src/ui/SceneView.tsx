import type { Scene } from '../core/types.ts';
import { LightScene } from './LightScene.tsx';
import { ShapeScene } from './ShapeScene.tsx';
import { BuoyScene } from './BuoyScene.tsx';
import { ScenarioScene } from './ScenarioScene.tsx';
import { SignalScene } from './SignalScene.tsx';
import { DistressScene } from './DistressScene.tsx';

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
  }
}
