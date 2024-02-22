import pluginJson from './plugin.json';
import datasourcePluginJson from '../plugin.json';

export const PLUGIN_BASE_URL = `/a/${pluginJson.id}`;

export enum ROUTES {
  Home = 'home',
  WithTabs = 'page-with-tabs',
  WithDrilldown = 'page-with-drilldown',
  HelloWorld = 'hello-world',
}

export const DATASOURCE_REF = {
  uid: datasourcePluginJson.name,
  type: 'testdata',
};

export const TEST_DATASOURCE_REF = {
  uid: 'grafana-testdata-datasource',
  type: 'testdata',
};

export const DEFAULT_TIMERANGE = {
  from: 'now-6M',
  to: 'now',
};

// BASELINE LABEL
export const BASELINE_LABEL = `type/accessibility`;
export const WCAG_LABEL_PREFIX = `wcag/`;
export const AREA_LABEL_PREFIX = `area/`;

// ACTUAL
export const REQUEST_MAIN_QUERY_REF = `MAIN_QUERY`;
export const REQUEST_ISSUES_CREATED_REF = `ISSUES_CREATED`;
export const REQUEST_ISSUES_CLOSED_REF = `ISSUES_CLOSED`;
export const REQUEST_ISSUES_OPEN_REF = `ISSUES_OPEN`;

// TRANSFORMED
export const TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF = `ISSUES_CREATED_DATES`;
export const TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF = `ISSUES_CLOSED_DATES`;

export const TRANSFORM_LABELS_COUNT_REF = `LABELS_OPEN_COUNTS`;

export type RefIDs =
  | typeof REQUEST_MAIN_QUERY_REF
  | typeof REQUEST_ISSUES_CREATED_REF
  | typeof REQUEST_ISSUES_CLOSED_REF
  | typeof REQUEST_ISSUES_OPEN_REF
  | typeof TRANSFORM_ISSUES_CREATED_DATES_COUNT_REF
  | typeof TRANSFORM_ISSUES_CLOSED_DATES_COUNT_REF
  | typeof TRANSFORM_LABELS_COUNT_REF;
