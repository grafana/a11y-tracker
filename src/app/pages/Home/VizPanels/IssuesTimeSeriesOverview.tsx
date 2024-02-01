import React, { ReactNode } from 'react';
import { FieldType, GrafanaTheme2, PanelData } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { SceneComponentProps, SceneObjectBase, sceneGraph } from '@grafana/scenes';
import { css } from '@emotion/css';

import { getDataFrameFromSeries, getFieldByNameFromDataFrame, getFieldByTypeFromDataFrame } from 'app/utils/utils.data';
import {
  REQUEST_ISSUES_CLOSED_REF,
  TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF,
  TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF,
} from 'app/constants';
import { Stack } from 'app/components/Stack';

export class IssuesTimeSeriesOverview extends SceneObjectBase {
  public static Component = IssuesTimeSeriesOverviewRenderer;
}

function IssuesTimeSeriesOverviewRenderer({ model }: SceneComponentProps<IssuesTimeSeriesOverview>) {
  const { data } = sceneGraph.getData(model).useState();
  const closedIssuesSum = getSum(data, TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF);
  const createdIssuesSum = getSum(data, TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF);
  const averageDuration = getAverageDuration(data);
  const styles = useStyles2(getStyles);

  return (
    <Stack
      className={styles.container}
      direction={{
        md: `row`,
        xs: `column`,
      }}
    >
      <IndividualPanel title="Created Issues" value={createdIssuesSum} color="#f7909c " />
      <IndividualPanel title="Closed Issues" value={closedIssuesSum} color="#619e5a" />
      <IndividualPanel
        title="Closure Rate"
        value={Number((closedIssuesSum / createdIssuesSum).toPrecision(2))}
        color="#f2cc0c"
      />
      <IndividualPanel title="Avg. issue duration" value={averageDuration} color="#3d71d9" />
    </Stack>
  );
}

function getSum(data: PanelData | undefined, queryName: string) {
  if (!data) {
    return 0;
  }

  const dataFrame = getDataFrameFromSeries(data.series, queryName);

  if (!dataFrame) {
    return 0;
  }

  const query = getFieldByTypeFromDataFrame(dataFrame, FieldType.number);

  if (!query) {
    return 0;
  }

  return query.values.reduce((acc, curr) => acc + curr, 0);
}

function getAverageDuration(data: PanelData | undefined) {
  if (!data) {
    return `N/A`;
  }

  const dataFrame = getDataFrameFromSeries(data.series, REQUEST_ISSUES_CLOSED_REF);
  const values = getFieldByNameFromDataFrame(dataFrame, `duration`);
  const total = values?.values.reduce((acc, curr) => acc + curr, 0);
  const averageInDays = Math.round(total / (values?.values?.length || 1));

  return `${averageInDays} days`;
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    height: `100%`,
  }),
});

type PanelProps = {
  color: string;
  title: string;
  value: ReactNode;
};

const IndividualPanel = ({ title, value, color }: PanelProps) => {
  const styles = useStyles2(getPanelStyles);

  return (
    <div className={styles.container} style={{ borderBottom: `5px solid ${color}` }}>
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
