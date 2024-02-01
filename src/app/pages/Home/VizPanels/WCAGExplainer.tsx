import React from 'react';
import { css } from '@emotion/css';
import { Badge, Button, Drawer, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { SceneComponentProps, SceneObjectBase, sceneGraph } from '@grafana/scenes';

import { Stack } from 'app/components/Stack';
import { getDataFrameFromSeries, getFieldValues } from 'app/utils/utils.data';
import { TRANSFORM_LABELS_COUNT_REF } from 'app/constants';

import wcag from 'assets/wcag.json';

export class WCAGExplainer extends SceneObjectBase {
  public static Component = WCAGExplainerRenderer;
}

const colorMap = {
  A: `red`,
  AA: `purple`,
  AAA: `blue`,
} as const;

function WCAGExplainerRenderer({ model }: SceneComponentProps<WCAGExplainer>) {
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const { data } = sceneGraph.getData(model).useState();
  const styles = useStyles2(getStyles);
  const dataFrame = getDataFrameFromSeries(data?.series, TRANSFORM_LABELS_COUNT_REF);
  const labels = getFieldValues(dataFrame, `label`);
  const counts = getFieldValues(dataFrame, `issues_open`);

  return (
    <div style={{ width: `100%` }}>
      <h3>WCAG Success Criterion Explained</h3>
      <Stack direction={`column`}>
        {labels?.map((label, i) => {
          const refId = label.split(`/`)[1];
          const [principleRef, guidelineRef, scRef] = refId.split(`.`);
          const sc = wcag[principleRef - 1].guidelines[guidelineRef - 1].success_criteria[scRef - 1];
          const level = sc.level as `A` | `AA` | `AAA`;

          return (
            <Stack key={label}>
              <Button className={styles.button} variant="primary" onClick={() => setOpenDrawer(true)}>
                <div className={styles.sc}>
                  <span>
                    {refId} {sc.title}
                  </span>
                  <span>({counts![i]} issues)</span>
                </div>
              </Button>
              <Badge className={styles.badge} text={sc.level} color={colorMap[level]} />
            </Stack>
          );
        })}
      </Stack>
      {openDrawer && (
        <Drawer title="Success Criterion" subtitle="SC 1.1.1 Non-text Content" onClose={() => setOpenDrawer(false)}>
          sup
        </Drawer>
      )}
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  sc: css({
    display: `flex`,
    justifyContent: `space-between`,
  }),
  button: css({
    flex: 1,

    ['> span']: {
      display: `block`,
      flex: 1,
    },
  }),
  badge: css({
    justifyContent: `center`,
    width: `40px`,
  }),
});
