import { SceneFlexLayout, SceneFlexItem, PanelBuilders, SceneDataTransformer } from '@grafana/scenes';
import { WCAGExplainer } from 'app/ScenesComponents/WCAGExplainer';
import { WCAGLevelsOverview } from 'app/ScenesComponents/WCAGLevelsOverview';
import { VizOrientation } from '@grafana/data';
import { pickQueries } from 'app/dataTransformations/pickQueries';

import { convertStringForRegex } from 'app/utils/utils.data';
import { Title } from 'app/ScenesComponents/Title';
import { TRANSFORM_LABELS_COUNT_REF, WCAG_LABEL_PREFIX } from 'app/constants';

export function WCAGRow(sceneData: SceneDataTransformer) {
  const escapedWcagLabelPrefix = convertStringForRegex(WCAG_LABEL_PREFIX);

  return new SceneFlexLayout({
    direction: 'column',
    children: [
      new Title({
        title: `WCAG Violations`,
        description: `How many issues are violating WCAG Success Criterion`,
      }),
      new SceneFlexItem({
        minHeight: `150px`,
        body: new WCAGLevelsOverview({}),
      }),
      new SceneFlexLayout({
        $data: pickQueries(
          sceneData,
          [TRANSFORM_LABELS_COUNT_REF],
          [
            {
              id: 'filterByValue',
              options: {
                filters: [
                  {
                    fieldName: 'label',
                    config: {
                      id: 'regex',
                      options: {
                        value: `^(${escapedWcagLabelPrefix}).*`,
                      },
                    },
                  },
                ],
                type: 'include',
                match: 'any',
              },
            },
            {
              id: `sortBy`,
              options: {
                fields: {},
                sort: [
                  {
                    field: `label`,
                  },
                ],
              },
            },
          ]
        ),
        children: [
          new SceneFlexItem({
            minHeight: 150,
            maxWidth: `30%`,
            body: new WCAGExplainer({}),
          }),
          new SceneFlexLayout({
            direction: 'column',
            children: [
              new SceneFlexItem({
                minHeight: 600,
                body: PanelBuilders.barchart().setOption(`orientation`, VizOrientation.Horizontal).build(),
              }),
            ],
          }),
        ],
      }),
    ],
  });
}
