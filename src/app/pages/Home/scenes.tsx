import {
  CustomVariable,
  EmbeddedScene,
  PanelBuilders,
  SceneControlsSpacer,
  SceneFlexItem,
  SceneFlexLayout,
  SceneQueryRunner,
  SceneRefreshPicker,
  SceneTimePicker,
  SceneTimeRange,
  SceneVariableSet,
  VariableValueSelectors,
} from '@grafana/scenes';

import {
  DATASOURCE_REF,
  DEFAULT_TIMERANGE,
  REQUEST_ISSUES_CREATED_REF,
  REQUEST_ISSUES_CLOSED_REF,
  REQUEST_MAIN_QUERY_REF,
  REQUEST_ISSUES_OPEN_REF,
} from 'app/constants';
import { getAll } from 'app/dataTransformations/getAll';
import { Labels } from 'app/pages/Home/ScenesPanels/Labels';
import { WCAGRow } from 'app/pages/Home/ScenesPanels/WCAGRow';
import { VelocityRow } from 'app/pages/Home/ScenesPanels/VelocityRow';
import { SelectIssues } from 'app/pages/Home/VizPanels/SelectIssues';

const repoOptions = {
  'grafana/grafana': `grafana/grafana`,
  'grafana/grafana-k6-app': `grafana/k6-cloud`,
};

export function getBasicScene() {
  const timeRange = new SceneTimeRange(DEFAULT_TIMERANGE);

  // Variable definition, using Grafana built-in TestData datasource
  const VAR_PROJECT = `project`;
  const VAR_PROJECT_INTERPOLATE = `\${${VAR_PROJECT}}`;

  const project = new CustomVariable({
    name: VAR_PROJECT,
    label: 'Project to show',
    value: 'grafana/grafana',
    query: Object.entries(repoOptions)
      .map(([value, label]) => `${label} : ${value}`)
      .join(`, `),
  });

  const queryRunner = new SceneQueryRunner({
    datasource: DATASOURCE_REF,
    queries: [
      {
        refId: REQUEST_MAIN_QUERY_REF,
        queryType: `issues_all`,
        project: VAR_PROJECT_INTERPOLATE,
        labels: '${labelDrilldown}',
      },
      {
        refId: REQUEST_ISSUES_CREATED_REF,
        queryType: `issues_created`,
        project: VAR_PROJECT_INTERPOLATE,
        labels: '${labelDrilldown}',
      },
      {
        refId: REQUEST_ISSUES_CLOSED_REF,
        queryType: `issues_closed`,
        project: VAR_PROJECT_INTERPOLATE,
        labels: '${labelDrilldown}',
      },
      {
        refId: REQUEST_ISSUES_OPEN_REF,
        queryType: `issues_open`,
        project: VAR_PROJECT_INTERPOLATE,
        labels: '${labelDrilldown}',
      },
    ],
  });

  const sceneData = getAll(queryRunner);

  return new EmbeddedScene({
    $timeRange: timeRange,
    $variables: new SceneVariableSet({ variables: [project] }),
    $data: sceneData,
    controls: [
      new VariableValueSelectors({}),
      new SceneControlsSpacer(),
      new SceneTimePicker({}),
      new SceneRefreshPicker({
        intervals: ['30m', '1h'],
        isOnCanvas: true,
      }),
    ],
    body: new SceneFlexLayout({
      direction: 'column',
      children: [
        Labels(sceneData),
        new SelectIssues({}),
        WCAGRow(sceneData),
        VelocityRow(sceneData),
        new SceneFlexItem({
          minHeight: 600,
          body: PanelBuilders.table().setTitle(VAR_PROJECT_INTERPOLATE).build(),
        }),
      ],
    }),
  });
}
