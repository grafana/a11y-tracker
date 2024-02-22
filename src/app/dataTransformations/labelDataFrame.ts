import { DataFrame, FieldType } from '@grafana/data';

import { TRANSFORM_LABELS_COUNT_REF, RefIDs } from 'app/constants';
import { getFieldValues } from 'app/utils/utils.data';

export function labelDataFrame(...dataFrames: Array<DataFrame | null>) {
  return createDataFrame({}, TRANSFORM_LABELS_COUNT_REF, ...dataFrames);
}

type ParseOptions = {
  include?: string[];
  exclude?: string[];
};

function createDataFrame(parseOptions: ParseOptions, refId: RefIDs, ...dataFrames: Array<DataFrame | null>): DataFrame {
  const combinedMap = new Map<string, number[]>();

  const realFrames: DataFrame[] = dataFrames.filter((frame) => frame !== null) as DataFrame[];

  realFrames.forEach((dataFrame, i) => {
    if (dataFrame) {
      const labels = extractLabels(dataFrame, parseOptions);

      labels.forEach((value, key) => {
        if (combinedMap.has(key)) {
          combinedMap.set(key, [...(combinedMap.get(key) ?? []), value]);
        } else {
          combinedMap.set(key, [...new Array(i).fill(0), value]);
        }
      });
    }
  });

  const labelKeys = Array.from(combinedMap.keys());
  const values = Array.from(combinedMap.values());

  return {
    fields: [
      {
        config: {},
        name: `label`,
        type: FieldType.string,

        values: labelKeys,
      },
      ...realFrames.map((frame, i) => ({
        config: {},
        name: frame.name ?? ``,
        type: FieldType.number,
        values: values.map((value) => value[i] ?? 0),
      })),
    ],
    length: labelKeys.length,
    name: ``,
    refId,
  };
}

function extractLabels(dataFrame: DataFrame, parseOptions: ParseOptions) {
  const labelValues = getFieldValues(dataFrame, `labels`, Boolean);
  const labelMap = new Map();

  if (!labelValues) {
    return labelMap;
  }

  labelValues.forEach((labels) => {
    labels
      .toLowerCase()
      .split(`,`)
      .forEach((label: string) => {
        labelMap.has(label) ? labelMap.set(label, labelMap.get(label) + 1) : labelMap.set(label, 1);
      });
  });

  return labelMap;
}
