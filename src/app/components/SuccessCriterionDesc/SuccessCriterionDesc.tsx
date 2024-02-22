import React from 'react';
import { css } from '@emotion/css';
import { Alert, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

import { Stack } from 'app/components/Stack';
import { ExternalLink } from 'app/components/ExternalLink';

import type { SuccessCriterion } from 'assets/wcag';

export const SuccessCriterionDesc = ({ successCriterion }: { successCriterion: SuccessCriterion }) => {
  const { description, notes, references, ref_id, special_cases, title } = successCriterion;
  const styles = useStyles2(getStyles);

  return (
    <Stack direction={`column`} gap={2}>
      <div>{description}</div>
      {special_cases && (
        <dl>
          {special_cases.map((special_case, i) => {
            return (
              <>
                <dt key={special_case.title}>{special_case.title}</dt>
                <dd className={styles.dd}>{special_case.description}</dd>
              </>
            );
          })}
        </dl>
      )}
      {notes?.map((note, i) => {
        return (
          <Alert key={note.content} title={`Note ${i + 1}`} severity="info">
            {note.content}
          </Alert>
        );
      })}
      <Stack direction={`column`}>
        {references.map((reference) => {
          const { url } = reference;
          return (
            <ExternalLink key={reference.title} url={url}>
              {reference.title.replace(ref_id, title)}
            </ExternalLink>
          );
        })}
      </Stack>
    </Stack>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  dd: css({
    marginLeft: theme.spacing(3),
  }),
});
