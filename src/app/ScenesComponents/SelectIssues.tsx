import React from 'react';
import { css } from '@emotion/css';
import { SceneComponentProps, SceneObjectBase, sceneGraph } from '@grafana/scenes';
import { useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

import {
  getDataFrameFromSeries,
  getFieldByNameFromDataFrame,
  getIndexBy,
  extractRowByIndex,
  parseLabels,
} from 'app/utils/utils.data';
import { REQUEST_ISSUES_OPEN_REF } from 'app/constants';
import { IssueCard } from 'app/components/IssueCard';
import type { Issue } from 'app/models/issue';

export class SelectIssues extends SceneObjectBase {
  public static Component = SelectIssuesRenderer;
}

function SelectIssuesRenderer({ model }: SceneComponentProps<SelectIssues>) {
  const { data } = sceneGraph.getData(model).useState();
  const styles = useStyles2(getStyles);
  const dataFrame = getDataFrameFromSeries(data?.series, REQUEST_ISSUES_OPEN_REF);
  const created = getFieldByNameFromDataFrame(dataFrame, `createdAt`);
  const labels = getFieldByNameFromDataFrame(dataFrame, `labels`);
  const reactions = getFieldByNameFromDataFrame(dataFrame, `reactions`);

  const firstIndex = getIndexBy<number>(created, (against, current) => {
    if (typeof against === `number` && typeof current === `number`) {
      const againstDate = new Date(against).getTime();
      const currentDate = new Date(current).getTime();

      return againstDate < currentDate;
    }

    return false;
  });

  const latestIndex = getIndexBy<number>(created, (against, current) => {
    if (typeof against === `number` && typeof current === `number`) {
      const againstDate = new Date(against).getTime();
      const currentDate = new Date(current).getTime();

      return againstDate > currentDate;
    }

    return false;
  });

  const mostWcagViolationsIndex = getIndexBy<number>(labels, (against, current) => {
    if (typeof against === `string` && typeof current === `string`) {
      const againstLabels = parseLabels(against);
      const currentLabels = parseLabels(current);

      return againstLabels.wcagLabels.length > currentLabels.wcagLabels.length;
    }

    return false;
  });

  const mostReactionsIndex = getIndexBy<number>(reactions, (against, current) => {
    if (typeof against === `number` && typeof current === `number`) {
      return against > current;
    }

    return false;
  });

  const oldestIssue = typeof firstIndex === `number` ? (extractRowByIndex(dataFrame, firstIndex) as Issue) : null;
  const newestIssue = typeof latestIndex === `number` ? (extractRowByIndex(dataFrame, latestIndex) as Issue) : null;
  const wcagViolationsIssue =
    typeof mostWcagViolationsIndex === `number`
      ? (extractRowByIndex(dataFrame, mostWcagViolationsIndex) as Issue)
      : null;
  const mostReactionsIssue =
    typeof mostReactionsIndex === `number` ? (extractRowByIndex(dataFrame, mostReactionsIndex) as Issue) : null;

  if (data?.state === `Done`) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <IssueCard issue={oldestIssue} type="Oldest issue" />
          <IssueCard issue={newestIssue} type="Newest issue" />
          {mostReactionsIssue?.reactions ? <IssueCard issue={mostReactionsIssue} type="Most requested" /> : null}
          <IssueCard issue={wcagViolationsIssue} type="Most WCAG Violations" />
        </div>
      </div>
    );
  }

  return <div style={{ width: `100%`, height: `300px` }} />;
}

function getStyles(theme: GrafanaTheme2) {
  const cardWidth = 450;

  const containerName = `selectIssues`;
  const spacing = 1;
  const breakpoint = cardWidth * 4 + 8 * spacing * 3;
  const containerQuery = `@container ${containerName} (max-width: ${breakpoint}px)`;
  const mediaQuery = `@supports not (container-type: inline-size) @media (max-width: ${breakpoint}px)`;
  const rule = {
    gridTemplateColumns: `repeat(2, 1fr)`,
  };

  return {
    wrapper: css({
      containerName,
      containerType: `inline-size`,
      width: `100%`,
    }),
    container: css({
      width: `100%`,
      display: `grid`,
      gap: theme.spacing(spacing),
      gridTemplateColumns: `repeat(auto-fit, minmax(${cardWidth}px, 1fr))`,
      [containerQuery]: rule,
      [mediaQuery]: rule,
      [`@media (max-width: ${theme.breakpoints.values.md}px)`]: {
        gridTemplateColumns: `repeat(1, 1fr)`,
      },
    }),
  };
}
