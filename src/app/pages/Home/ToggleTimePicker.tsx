import React from 'react';
import { SceneComponentProps, SceneObjectState, SceneTimeRange, SceneTimePicker } from '@grafana/scenes';
// import { Button } from '@grafana/ui';
// import { dateTime } from '@grafana/data';

// import { DEFAULT_TIMERANGE } from 'app/constants';
import { Stack } from 'app/components/Stack';

export interface CustomSceneObjectState extends SceneObjectState {
  timeRange: SceneTimeRange;
}

export class ToggleTimePicker extends SceneTimePicker {
  public static Component = ToggleTimePickerRenderer;
}

function ToggleTimePickerRenderer({ model }: SceneComponentProps<ToggleTimePicker>) {
  // const timeRange = useMemo(() => sceneGraph.getTimeRange(model), [model]);
  // const buttonRef = React.useRef<HTMLButtonElement>(null);
  // const { hidePicker } = model.useState();
  // const enableText = `Enable time picker`;
  // const disableText = `Disable time picker`;

  return (
    <Stack gap={0}>
      {/* <Button
        aria-label={hidePicker ? enableText : disableText}
        onClick={() => {
          const newState = !hidePicker;
          model.setState({ hidePicker: newState });
          timeRange.onTimeRangeChange(handleTimeRangeChange(newState));

          requestAnimationFrame(() => {
            if (buttonRef.current) {
              buttonRef.current.focus();
            }
          });
        }}
        icon={hidePicker ? `eye` : `eye-slash`}
        tooltip={hidePicker ? undefined : disableText}
        variant="secondary"
        ref={buttonRef}
      >
        {hidePicker ? enableText : ``}
      </Button> */}
      <SceneTimePicker.Component model={model} />
    </Stack>
  );
}

// function handleTimeRangeChange(hidePicker?: boolean) {
//   const second = 1000;
//   const minute = 60 * second;
//   const hour = 60 * minute;
//   const day = 24 * hour;
//   const year = 365 * day;

//   if (hidePicker) {
//     const thirtyYears = new Date().getTime() - 30 * year;

//     return {
//       from: dateTime(thirtyYears),
//       to: dateTime(new Date()),
//       raw: {
//         from: 'now-30y',
//         to: 'now',
//       },
//     };
//   }

//   const month = 30.4375 * day; // correct assumption? TODO: Look up how Grafana calculates this
//   const sixMonths = new Date().getTime() - month * 6;

//   return {
//     from: dateTime(sixMonths),
//     to: dateTime(new Date()),
//     raw: DEFAULT_TIMERANGE,
//   };
// }
