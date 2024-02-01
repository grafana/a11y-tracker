import { DataFrame, Field, FieldType } from '@grafana/data';
import { AREA_LABEL_PREFIX, BASELINE_LABEL, WCAG_LABEL_PREFIX } from 'app/constants';

export function getDataFrameFromSeries(dataFrames: DataFrame[] | undefined, refToFind: string): DataFrame | null {
  return dataFrames?.find((dataFrame) => dataFrame.refId === refToFind) || null;
}

export function getFieldByTypeFromDataFrame(dataFrame: DataFrame | null, type: FieldType): Field | null {
  const field = dataFrame?.fields.find((f) => f.type === type);

  return field || null;
}

export function getFieldByNameFromDataFrame(dataFrame: DataFrame | null, name: string): Field | null {
  const field = dataFrame?.fields.find((f) => f.name === name);

  return field || null;
}

export function getFieldValues(query: DataFrame | null, fieldName: string, filter?: (value: any) => boolean) {
  const field = getFieldByNameFromDataFrame(query, fieldName);
  const values = field ? field.values : null;

  if (values && filter) {
    return values.filter(filter);
  }

  return values;
}

export function getIndexBy<T>(
  field: Field | null,
  compare: (against: Field<T>, current: Field<T> | undefined) => boolean
) {
  if (!field) {
    return null;
  }

  let currentIndex = 0;

  for (let i = 1; i < field.values.length; i++) {
    if (compare(field.values[i], field.values[currentIndex])) {
      currentIndex = i;
    }
  }

  return currentIndex;
}

export function extractRowByIndex(query: DataFrame | null, index: number) {
  if (!query) {
    return null;
  }

  const row: Record<string, any> = {};

  for (const field of query.fields) {
    row[field.name] = field.values[index];
  }

  return row;
}

export function convertStringForRegex(input: string) {
  return input.replace(/\//g, `\\/`);
}

export function parseLabels(labels = ``) {
  let wcagLabels: string[] = [];
  let areaLabels: string[] = [];
  let otherLabels: string[] = [];

  labels.split(`,`).forEach((l) => {
    if (l === BASELINE_LABEL) {
      return;
    } else if (l.startsWith(WCAG_LABEL_PREFIX)) {
      wcagLabels.push(l);
    } else if (l.startsWith(AREA_LABEL_PREFIX)) {
      areaLabels.push(l);
    } else {
      otherLabels.push(l);
    }
  });

  return {
    wcagLabels,
    areaLabels,
    otherLabels,
  };
}
