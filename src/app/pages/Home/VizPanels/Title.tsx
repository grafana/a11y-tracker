import React from 'react';
import { css } from '@emotion/css';
import { useStyles2 } from '@grafana/ui';
import { GrafanaTheme2 } from '@grafana/data';
import { SceneComponentProps, SceneObjectBase, SceneObjectState } from '@grafana/scenes';

interface TitleState extends SceneObjectState {
  title: string;
  description: string;
}

export class Title extends SceneObjectBase<TitleState> {
  public static Component = TitleRenderer;
}

function TitleRenderer({ model }: SceneComponentProps<Title>) {
  const { description, title } = model.useState();
  const styles = useStyles2(getStyles);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      <div className="h4">{description}</div>
    </div>
  );
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css({
    margin: theme.spacing(4, 0),
    textAlign: `center`,
    // position: `relative`,

    // ['&:before,&:after']: {
    //   content: `''`,
    //   display: `block`,
    //   height: `3px`,
    //   width: `10%`,
    //   background: theme.colors.border.weak,
    //   position: `absolute`,
    //   top: `50%`,
    //   transform: `translateY(-50%)`,
    // },
    // ['&:before']: {
    //   left: `20%`,
    // },
    // ['&:after']: {
    //   right: `20%`,
    // },
  }),
  title: css({
    fontSize: theme.spacing(4.5),
    fontWeight: theme.typography.h1.fontWeight,
    lineHeight: theme.typography.h1.lineHeight,
    letterSpacing: theme.typography.h1.letterSpacing,
  }),
});
