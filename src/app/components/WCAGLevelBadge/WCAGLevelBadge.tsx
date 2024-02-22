import React, { type HTMLAttributes } from 'react';
import { Badge } from '@grafana/ui';

import { WCAGLevel } from 'assets/wcag';

const colorMap = {
  A: `red`,
  AA: `purple`,
  AAA: `blue`,
} as const;

type WCAGLevelBadgeProps = HTMLAttributes<HTMLDivElement> & { level: WCAGLevel };

export const WCAGLevelBadge = ({ level, ...rest }: WCAGLevelBadgeProps) => {
  return <Badge text={level} {...rest} color={colorMap[level]} />;
};
