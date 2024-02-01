import { SceneDataTransformer, CustomTransformOperator } from '@grafana/scenes';
import { DataTransformerConfig } from '@grafana/data';

import { RefIDs } from 'app/constants';

export function pickQueries(
  queryRunner: SceneDataTransformer,
  refs: RefIDs[],
  customTransformations?: Array<DataTransformerConfig | CustomTransformOperator>
) {
  return new SceneDataTransformer({
    $data: queryRunner,
    transformations: [
      {
        id: 'filterByRefId',
        options: {
          include: refs.join(`|`),
        },
      },
      ...(customTransformations || []),
    ],
  });
}
