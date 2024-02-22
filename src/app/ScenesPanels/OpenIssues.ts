import { SceneFlexLayout, SceneDataTransformer } from '@grafana/scenes';
import { Labels } from 'app/ScenesPanels/Labels';

export function OpenIssues(sceneData: SceneDataTransformer) {
  return new SceneFlexLayout({
    direction: 'row',
    children: [Labels(sceneData)],
  });
}
