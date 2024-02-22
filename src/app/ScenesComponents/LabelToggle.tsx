import React from 'react';
import {
  SceneComponentProps,
  SceneObjectBase,
  SceneObjectState,
  VariableDependencyConfig,
  // sceneGraph,
} from '@grafana/scenes';

// import { getDataFrameFromSeries } from 'app/utils/utils.data';
// import { TRANSFORM_LABELS_COUNT_REF } from 'app/constants';

interface LabelState extends SceneObjectState {
  labels?: string;
}

export class LabelToggle extends SceneObjectBase<LabelState> {
  public static Component = LabelToggleRenderer;

  protected _variableDependency = new VariableDependencyConfig(this, {
    statePaths: ['labels'],
  });
}

function LabelToggleRenderer({ model }: SceneComponentProps<LabelToggle>) {
  // const { labels } = model.useState();
  // const { variables } = sceneGraph.getVariables(model).useState();
  // const labelVariable = variables?.find((v) => v._state.name === `labels`);
  // console.log(labelVariable?.Component);
  // const mainDataFrame = data && getDataFrameFromSeries(data.series, TRANSFORM_LABELS_COUNT_REF);
  // const fields = mainDataFrame && mainDataFrame.fields;

  return (
    <div style={{ marginBottom: `8px` }}>
      <h2 className="h4" style={{ margin: 0, padding: `8px` }}>
        <button onClick={() => console.log(`sup`)}>DO STUFF</button>
      </h2>
    </div>
  );
}
