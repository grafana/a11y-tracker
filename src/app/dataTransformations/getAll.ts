import { SceneDataTransformer, SceneQueryRunner, CustomTransformOperator } from '@grafana/scenes';
import { DataFrame } from '@grafana/data';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { REQUEST_ISSUES_CLOSED_REF, REQUEST_ISSUES_CREATED_REF, REQUEST_ISSUES_OPEN_REF } from 'app/constants';
import { getDataFrameFromSeries } from 'app/utils/utils.data';
import { issuesByDate } from 'app/dataTransformations/getTimeSeriesIssues';
import { labelDataFrame } from 'app/dataTransformations/labelDataFrame';

export function getAll(queryRunner: SceneQueryRunner) {
  return new SceneDataTransformer({
    $data: queryRunner,
    transformations: [convertQueries],
  });
}

const convertQueries: CustomTransformOperator = () => (source: Observable<DataFrame[]>) => {
  return source.pipe(
    mergeMap((data: DataFrame[]) => {
      const createdQuery = getDataFrameFromSeries(data, REQUEST_ISSUES_CREATED_REF);
      const closedQuery = getDataFrameFromSeries(data, REQUEST_ISSUES_CLOSED_REF);
      const openQuery = getDataFrameFromSeries(data, REQUEST_ISSUES_OPEN_REF);

      if (!createdQuery || !closedQuery) {
        return [];
      }

      const frames = [...data, ...issuesByDate(createdQuery, closedQuery), labelDataFrame(openQuery)];

      return [frames];
    })
  );
};
