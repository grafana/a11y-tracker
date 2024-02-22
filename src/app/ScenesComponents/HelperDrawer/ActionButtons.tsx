import React from 'react';
import { css } from '@emotion/css';
import { Icon, useStyles2, Button } from '@grafana/ui';
import { DataFrame, GrafanaTheme2 } from '@grafana/data';

import { Stack } from 'app/components/Stack';

import { getFieldValues } from 'app/utils/utils.data';
import { WCAG_LABEL_PREFIX } from 'app/constants';
import { getSuccessCriterionByRefId } from 'assets/wcag';

type ActionButtonsProps = {
  dataFrame: DataFrame | null;
  refId: string;
  onNext: (ref: string) => void;
  onPrev: (ref: string) => void;
};

export const ActionButtons = ({ dataFrame, onNext, onPrev, refId }: ActionButtonsProps) => {
  const styles = useStyles2(getStyles);

  const labels = (getFieldValues(dataFrame, `label`, (l) => l.includes(WCAG_LABEL_PREFIX)) || [])
    .map((l) => l.split(`/`)[1])
    .sort();
  const currentLabelIndex = labels.findIndex((label) => label === refId);
  const prevSCRef = labels[currentLabelIndex - 1];
  const nextSCRef = labels[currentLabelIndex + 1];
  const prevSC = currentLabelIndex !== 0 && getSuccessCriterionByRefId(prevSCRef);
  const nextSC = currentLabelIndex < labels.length - 1 && getSuccessCriterionByRefId(nextSCRef);

  return (
    <Stack className={styles.actionsWrapper} gap={2} justifyContent={`space-between`} wrap={`wrap`}>
      {prevSC && (
        <div>
          <Button
            onClick={() => {
              onPrev(prevSC.ref_id);
            }}
          >
            <Icon name="angle-left" />
            {prevSC.title} {prevSC.ref_id}
          </Button>
        </div>
      )}
      {nextSC && (
        <div>
          <Button
            onClick={() => {
              onNext(nextSC.ref_id);
            }}
          >
            {nextSC.title} {nextSC.ref_id}
            <Icon name="angle-right" />
          </Button>
        </div>
      )}
    </Stack>
  );
};

const getStyles = (theme: GrafanaTheme2) => {
  const psuedoType = `h2`;

  return {
    container: css({
      display: `flex`,
      flexDirection: `column`,
      height: `100%`,
      justifyContent: `space-between`,
      maxWidth: `600px`,
    }),
    titleWrapper: css({
      padding: theme.spacing(2, 2, 1),
    }),
    title: css({
      margin: 0,
      fontSize: theme.typography[psuedoType].fontSize,
      fontWeight: theme.typography[psuedoType].fontWeight,
      letterSpacing: theme.typography[psuedoType].letterSpacing,
      lineHeight: theme.typography[psuedoType].lineHeight,
    }),
    subTitle: css({
      color: theme.colors.text.secondary,
    }),
    actionsWrapper: css({
      padding: theme.spacing(2, 0),
    }),
  };
};
