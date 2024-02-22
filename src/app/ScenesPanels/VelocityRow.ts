import { PanelBuilders, SceneFlexLayout, SceneFlexItem, SceneDataTransformer } from '@grafana/scenes';
import { TooltipDisplayMode } from '@grafana/schema';

import { pickQueries } from 'app/dataTransformations/pickQueries';

import { IssuesTimeSeriesOverview } from 'app/ScenesComponents/IssuesTimeSeriesOverview';
import { Title } from 'app/ScenesComponents/Title';
import { TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF, TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF } from 'app/constants';

export function VelocityRow(sceneData: SceneDataTransformer) {
  return new SceneFlexLayout({
    direction: 'row',
    children: [
      new SceneFlexLayout({
        direction: 'column',
        children: [
          new Title({
            title: `Velocity`,
            description: `How many issues are being resolved and created per month`,
          }),
          new SceneFlexItem({
            minHeight: 150,
            body: new IssuesTimeSeriesOverview({}),
          }),
          new SceneFlexItem({
            $data: pickQueries(sceneData, [
              TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF,
              TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF,
            ]),
            minHeight: 600,
            body: PanelBuilders.timeseries()
              .setOption(`tooltip`, {
                mode: TooltipDisplayMode.Multi,
              })
              .build(),
          }),
        ],
      }),
    ],
  });
}
