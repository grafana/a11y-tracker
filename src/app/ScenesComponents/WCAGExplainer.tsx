import React from 'react';
import { css } from '@emotion/css';
import { Button, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { SceneComponentProps, SceneObjectBase, sceneGraph } from '@grafana/scenes';

import { Stack } from 'app/components/Stack';
import { getDataFrameFromSeries, getFieldValues } from 'app/utils/utils.data';
import { TRANSFORM_LABELS_COUNT_REF } from 'app/constants';

import { getSuccessCriterionByRefId } from 'assets/wcag';
import { useDrawer } from 'app/Contexts';
import { WCAGLevelBadge } from 'app/components/WCAGLevelBadge';

export class WCAGExplainer extends SceneObjectBase {
  public static Component = WCAGExplainerRenderer;
}

function WCAGExplainerRenderer({ model }: SceneComponentProps<WCAGExplainer>) {
  const { data } = sceneGraph.getData(model).useState();
  const styles = useStyles2(getStyles);
  const dataFrame = getDataFrameFromSeries(data?.series, TRANSFORM_LABELS_COUNT_REF);
  const labels = getFieldValues(dataFrame, `label`);
  const counts = getFieldValues(dataFrame, `issues_open`);
  const { open } = useDrawer();

  return (
    <div style={{ width: `100%` }}>
      <h3>WCAG Success Criterion Explained</h3>
      <Stack direction={`column`}>
        {labels?.map((label, i) => {
          const refId = label.split(`/`)[1];
          const sc = getSuccessCriterionByRefId(refId);

          return (
            <Stack key={label}>
              <Button className={styles.button} variant="primary" onClick={() => open(refId)}>
                <div className={styles.sc}>
                  <span>
                    {refId} {sc.title}
                  </span>
                  <span>({counts![i]} issues)</span>
                </div>
              </Button>
              <WCAGLevelBadge className={styles.badge} level={sc.level} />
            </Stack>
          );
        })}
      </Stack>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => {
  const badgeSize = `40px`;

  return {
    sc: css({
      display: `flex`,
      justifyContent: `space-between`,
    }),
    button: css({
      flex: 1,
      minWidth: `calc(100% - ${badgeSize} - ${theme.spacing(1)})`,

      ['> span']: {
        display: `block`,
        flex: 1,
      },
    }),
    badge: css({
      justifyContent: `center`,
      width: badgeSize,
    }),
  };
};
