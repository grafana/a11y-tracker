import React from 'react';
import {
  SceneComponentProps,
  SceneObjectBase,
  //sceneGraph
} from '@grafana/scenes';

// import { getDataFrameFromSeries } from 'app/utils/utils.data';
// import { TRANSFORM_LABELS_COUNT_REF } from 'app/constants';

export class LabelToggle extends SceneObjectBase {
  public static Component = LabelToggleRenderer;
}

function LabelToggleRenderer({ model }: SceneComponentProps<LabelToggle>) {
  // const { data } = sceneGraph.getData(model).useState();
  // const mainDataFrame = data && getDataFrameFromSeries(data.series, TRANSFORM_LABELS_COUNT_REF);
  // const fields = mainDataFrame && mainDataFrame.fields;

  return (
    <div style={{ marginBottom: `8px` }}>
      <h2 className="h4" style={{ margin: 0, padding: `8px` }}>
        Toggle Labels
      </h2>
    </div>
  );
}
