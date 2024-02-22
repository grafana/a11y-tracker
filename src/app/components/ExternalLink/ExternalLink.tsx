import React from 'react';
import { css } from '@emotion/css';
import { Icon, useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';

export const ExternalLink = ({ url, children, ...props }: { url: string; children: React.ReactNode }) => {
  const styles = useStyles2(getStyles);

  return (
    <a className={styles.container} href={url} target="_blank" rel="noopener noreferrer" {...props}>
      <Icon aria-hidden name="external-link-alt" className={styles.icon} />
      {children}
    </a>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    display: `flex`,
    gap: theme.spacing(1),
    color: theme.colors.text.link,
    textDecoration: `underline`,

    ['&:hover']: {
      textDecoration: `none`,
    },
  }),
  icon: css({
    alignSelf: `flex-start`,
    color: theme.colors.text.primary,
  }),
});
