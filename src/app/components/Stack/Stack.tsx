import React from 'react';
import { GrafanaTheme2 } from '@grafana/data';
import { useStyles2 } from '@grafana/ui';
import { css, cx } from '@emotion/css';
import { AlignItems, Direction, FlexProps, JustifyContent, ThemeSpacingTokens, Wrap } from './types';
import { getResponsiveStyle, ResponsiveProp } from './responsiveness';

interface StackProps extends FlexProps, React.HTMLAttributes<HTMLElement> {
  gap?: ResponsiveProp<ThemeSpacingTokens>;
  alignItems?: ResponsiveProp<AlignItems>;
  justifyContent?: ResponsiveProp<JustifyContent>;
  direction?: ResponsiveProp<Direction>;
  wrap?: ResponsiveProp<Wrap>;
  children?: React.ReactNode;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    className,
    gap = 1,
    alignItems,
    justifyContent,
    direction,
    wrap,
    children,
    grow,
    shrink,
    basis,
    flex,
    ...rest
  } = props;
  const styles = useStyles2((theme) =>
    getStyles(theme, gap, alignItems, justifyContent, direction, wrap, grow, shrink, basis, flex)
  );

  return (
    <div ref={ref} className={cx(className, styles.flex)} {...rest}>
      {children}
    </div>
  );
});

Stack.displayName = 'Stack';

const getStyles = (
  theme: GrafanaTheme2,
  gap: StackProps['gap'],
  alignItems: StackProps['alignItems'],
  justifyContent: StackProps['justifyContent'],
  direction: StackProps['direction'],
  wrap: StackProps['wrap'],
  grow: StackProps['grow'],
  shrink: StackProps['shrink'],
  basis: StackProps['basis'],
  flex: StackProps['flex']
) => {
  return {
    flex: css([
      {
        display: 'flex',
      },
      getResponsiveStyle(theme, direction, (val) => ({
        flexDirection: val,
      })),
      getResponsiveStyle(theme, wrap, (val) => ({
        flexWrap: val,
      })),
      getResponsiveStyle(theme, alignItems, (val) => ({
        alignItems: val,
      })),
      getResponsiveStyle(theme, justifyContent, (val) => ({
        justifyContent: val,
      })),
      getResponsiveStyle(theme, gap, (val) => ({
        gap: theme.spacing(val),
      })),
      getResponsiveStyle(theme, grow, (val) => ({
        flexGrow: val,
      })),
      getResponsiveStyle(theme, shrink, (val) => ({
        flexShrink: val,
      })),
      getResponsiveStyle(theme, basis, (val) => ({
        flexBasis: val,
      })),
      getResponsiveStyle(theme, flex, (val) => ({
        flex: val,
      })),
    ]),
  };
};
