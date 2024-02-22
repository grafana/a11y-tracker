import { SceneFlexLayout, SceneFlexItem, VizPanel, SceneDataTransformer } from '@grafana/scenes';

import { convertStringForRegex } from 'app/utils/utils.data';
import { pickQueries } from 'app/dataTransformations/pickQueries';
import { TRANSFORM_LABELS_COUNT_REF, AREA_LABEL_PREFIX, WCAG_LABEL_PREFIX } from 'app/constants';

export function Labels(sceneData: SceneDataTransformer) {
  const escapedAreaLabelPrefix = convertStringForRegex(AREA_LABEL_PREFIX);
  const escapedWcagLabelPrefix = convertStringForRegex(WCAG_LABEL_PREFIX);

  return new SceneFlexLayout({
    direction: 'row',
    children: [
      new SceneFlexItem({
        body: new VizPanel({
          title: `Areas`,
          pluginId: 'piechart',
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
                          value: `^(${escapedAreaLabelPrefix}).*`,
                        },
                      },
                    },
                  ],
                  type: 'include',
                  match: 'any',
                },
              },
            ]
          ),
          options: {
            reduceOptions: {
              values: true,
            },
            legend: {
              placement: `right`,
              values: [`value`],
            },
          },
          // fieldConfig: {
          //   defaults: {
          //     links: [
          //       {
          //         targetBlank: false,
          //         title: 'Open Issues',
          //         url: window.location.href + '&onclick=${__data.fields[0]}',
          //       },
          //     ],
          //   },
          //   overrides: [],
          // },
        }),
        minHeight: 400,
      }),
      new SceneFlexItem({
        body: new VizPanel({
          title: `Labels`,
          pluginId: 'piechart',
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
                          value: `^(${escapedAreaLabelPrefix}|${escapedWcagLabelPrefix}|type/accessibility).*`,
                        },
                      },
                    },
                  ],
                  type: 'exclude',
                  match: 'any',
                },
              },
            ]
          ),
          options: {
            reduceOptions: {
              values: true,
            },
            legend: {
              placement: `right`,
              values: [`value`],
            },
          },
          // fieldConfig: {
          //   defaults: {
          //     links: [
          //       {
          //         targetBlank: false,
          //         title: 'Open Issues',
          //         url: window.location.href + '&onclick=${__data.fields[0]}',
          //       },
          //     ],
          //   },
          //   overrides: [],
          // },
        }),
        minHeight: 400,
      }),
    ],
  });
}
