import React from 'react';
import { css } from '@emotion/css';
import { useStyles2, FilterPill } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

import { parseLabels } from 'app/utils/utils.data';
import type { Issue } from 'app/models/issue';
import { Stack } from 'app/components/Stack';

type IssueCardProps = {
  issue: Issue | null;
  type?: string;
};

export const IssueCard = ({ issue, type }: IssueCardProps) => {
  const styles = useStyles2(getStyles);
  const { otherLabels, areaLabels, wcagLabels } = parseLabels(issue?.labels);

  return (
    <div className={styles.container}>
      {issue && (
        <Stack justifyContent={`space-between`} direction={`column`}>
          <Stack direction={`column`}>
            <Stack justifyContent={`space-between`}>
              {type && <div className={styles.type}>{type}</div>}
              <div>
                {issue.reactions} {`reaction${issue.reactions === 1 ? `` : `s`}`}
              </div>
            </Stack>
            <h4 className={styles.title}>{issue.title}</h4>
            <div>
              Created {new Date(issue.createdAt).toLocaleDateString()} by {issue.author}
            </div>

            <Stack wrap={'wrap'}>
              {otherLabels.map((label) => (
                <FilterPill key={label} label={label} selected={false} onClick={() => console.log(label)} />
              ))}
            </Stack>
          </Stack>
          <Stack direction={`column`} justifyContent={`space-between`}>
            <div>
              <Stack>
                {wcagLabels.map((label) => (
                  <FilterPill key={label} label={label} selected={false} onClick={() => console.log(label)} />
                ))}
              </Stack>
            </div>
            <Stack>
              {areaLabels.map((label) => (
                <FilterPill key={label} label={label} selected={false} onClick={() => console.log(label)} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      )}
    </div>
  );
};

const fauxHeading = `h4`;

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    border: `1px solid ${theme.colors.border.weak}`,
    padding: theme.spacing(2),
    width: `100%`,
  }),
  info: css({
    flexGrow: 1,
  }),
  title: css({
    fontSize: theme.typography[fauxHeading].fontSize,
    fontWeight: theme.typography[fauxHeading].fontWeight,
    letterSpacing: theme.typography[fauxHeading].letterSpacing,
    lineHeight: theme.typography[fauxHeading].lineHeight,
    marginBottom: theme.spacing(2),
  }),
  type: css({
    color: theme.colors.text.secondary,
    fontSize: theme.typography.body.fontSize,
    marginBottom: theme.spacing(1),
  }),
});
