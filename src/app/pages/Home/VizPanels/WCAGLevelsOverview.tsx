import React, { ReactNode } from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { SceneComponentProps, SceneObjectBase, sceneGraph } from '@grafana/scenes';
import { css } from '@emotion/css';

import { Stack } from 'app/components/Stack';
import { getDataFrameFromSeries, getFieldValues } from 'app/utils/utils.data';
import { REQUEST_ISSUES_OPEN_REF } from 'app/constants';

export class WCAGLevelsOverview extends SceneObjectBase {
  public static Component = WCAGLevelsOverviewRenderer;
}

const WCAG_LEVELS = [`A`, `AA`, `AAA`] as const;

function WCAGLevelsOverviewRenderer({ model }: SceneComponentProps<WCAGLevelsOverview>) {
  const { data } = sceneGraph.getData(model).useState();
  const styles = useStyles2(getStyles);
  const openFrame = getDataFrameFromSeries(data?.series, REQUEST_ISSUES_OPEN_REF);

  return (
    <div style={{ marginBottom: `8px` }}>
      <Stack
        className={styles.container}
        direction={{
          md: `row`,
          xs: `column`,
        }}
      >
        {WCAG_LEVELS.map((level) => {
          const values = getFieldValues(openFrame, `wcag level ${level}`, Boolean);
          return <IndividualPanel key={level} title={`Level ${level} Issues`} value={values?.length} />;
        })}
      </Stack>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    height: `100%`,
  }),
});

const IndividualPanel = ({ title, value }: { title: string; value: ReactNode }) => {
  const styles = useStyles2(getPanelStyles);

  return (
    <div className={styles.container}>
      <h2 className="h4">{title}</h2>
      <div className={styles.content}>{value}</div>
    </div>
  );
};

const getPanelStyles = (theme: GrafanaTheme2) => ({
  container: css({
    border: `1px solid ${theme.colors.border.weak}`,
    display: `flex`,
    flexDirection: `column`,
    alignItems: `center`,
    justifyContent: `center`,
    padding: theme.spacing(2),
    width: `100%`,
  }),
  content: css({
    fontSize: theme.typography.h1.fontSize,
  }),
});
