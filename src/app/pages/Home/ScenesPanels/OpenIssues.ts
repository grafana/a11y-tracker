import { SceneFlexLayout, SceneFlexItem, VizPanel, SceneDataTransformer } from '@grafana/scenes';
import { Labels } from 'app/pages/Home/ScenesPanels/Labels';

export function OpenIssues(sceneData: SceneDataTransformer) {
  return new SceneFlexLayout({
    direction: 'row',
    children: [Labels(sceneData)],
  });
}
