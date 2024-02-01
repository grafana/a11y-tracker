import { DataFrame, FieldType } from '@grafana/data';

import { TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF, TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF } from 'app/constants';
import { getFieldValues } from 'app/utils/utils.data';

type TimeUnit = `hour` | `day` | `week` | `month` | `year`;
type Time = number;

export function issuesByDate(createdQuery: DataFrame, closedQuery: DataFrame): DataFrame[] {
  const createdAtValues = getFieldValues(createdQuery, 'createdAt', Boolean) || [];
  const closedAtValues = getFieldValues(closedQuery, 'closedAt', Boolean) || [];
  const timeUnit = `month`;
  const adjustedDateEntries = groupByDate(timeUnit, createdAtValues, closedAtValues);

  return [
    createDataFrame({
      timeUnit,
      name: `Issues Created`,
      entries: adjustedDateEntries,
      dateValues: createdAtValues,
      refID: TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF,
    }),
    createDataFrame({
      timeUnit,
      name: `Issues Closed`,
      entries: adjustedDateEntries,
      dateValues: closedAtValues,
      refID: TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF,
    }),
  ];
}

function groupByDate(timeUnit: TimeUnit, ...args: Time[][]) {
  const combinedDates: Time[] = [];

  [...args].map((field) => {
    if (field) {
      combinedDates.push(...field);
    }
  });

  const uniqueDates = [...new Set(combinedDates.map((date) => adjustTimeToStartOfTimeUnit(date, timeUnit)))];
  return Array.from(uniqueDates).sort();
}

type CreateDataFrameArgs = {
  timeUnit: TimeUnit;
  name: string;
  entries: Time[];
  dateValues: Time[];
  refID: string;
};

function createDataFrame({ timeUnit, name, entries, dateValues, refID }: CreateDataFrameArgs): DataFrame {
  const countValues = assignAdjustedDates(timeUnit, dateValues, entries);

  return {
    fields: [
      {
        config: {},
        name: `reset date`,
        type: FieldType.time,
        values: entries,
      },
      {
        config: {},
        name,
        type: FieldType.number,
        values: countValues,
      },
    ],
    length: entries.length,
    name: ``,
    refId: refID,
  };
}

function adjustTimeToStartOfTimeUnit(time: number, unit: TimeUnit): number {
  const date = new Date(time);

  switch (unit) {
    case `hour`:
      date.setMinutes(0, 0, 0);
      break;
    case `day`:
      date.setHours(0, 0, 0, 0);
      break;
    case `week`:
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - date.getDay());
      break;
    case `month`:
      date.setHours(0, 0, 0, 0);
      date.setDate(1);
      break;
    case `year`:
      date.setHours(0, 0, 0, 0);
      date.setMonth(0, 1);
      break;
  }

  return date.getTime();
}

function assignAdjustedDates(timeUnit: TimeUnit, dates: number[], adjustedDateEntries: number[]) {
  const dateMap = createDateMap(adjustedDateEntries);

  dates.forEach((date) => {
    const adjustedDate = adjustTimeToStartOfTimeUnit(date, timeUnit);
    const dateCount = dateMap.get(adjustedDate) ?? 0;
    dateMap.set(adjustedDate, dateCount + 1);
  });

  return Array.from(dateMap.values());
}

function createDateMap(dates: number[]) {
  return new Map(dates.map((date) => [date, 0]));
}
