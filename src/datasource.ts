import { DataSourceInstanceSettings, CoreApp } from '@grafana/data';
import { DataSourceWithBackend, getTemplateSrv, type TemplateSrv } from '@grafana/runtime';

import { MyQuery, MyDataSourceOptions } from './types';

type FormatQuery = Omit<MyQuery, 'labels'> & {
  labels?: string[];
};

export class DataSource extends DataSourceWithBackend<MyQuery, MyDataSourceOptions> {
  constructor(
    instanceSettings: DataSourceInstanceSettings<MyDataSourceOptions>,
    private readonly templateSrv: TemplateSrv = getTemplateSrv()
  ) {
    super(instanceSettings);
  }

  getDefaultQuery(_: CoreApp): Partial<MyQuery> {
    return {
      queryType: 'issues_all',
      project: 'grafana/grafana',
    };
  }

  applyTemplateVariables(query: MyQuery, scopedVars: any) {
    const newQuery: FormatQuery = {
      ...query,
      project: this.templateSrv.replace(query.project, scopedVars),
      labels: [], // Initialize labels as an empty array
    };

    if (query.labels) {
      const labelsStr = this.templateSrv.replace(query.labels, scopedVars);
      const labels = labelsStr.split(',').map((label: string) => label.trim());
      newQuery.labels = labels;
    }

    return newQuery;
  }
}
