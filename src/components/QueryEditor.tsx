import React from 'react';
import { InlineField, Select } from '@grafana/ui';
import { QueryEditorProps, SelectableValue } from '@grafana/data';
import { DataSource } from 'datasource';
import { MyDataSourceOptions, MyQuery } from 'types';

type Props = QueryEditorProps<DataSource, MyQuery, MyDataSourceOptions>;

export function QueryEditor({ query, onChange, onRunQuery }: Props) {
  const onQueryTypeChange = (value: SelectableValue) => {
    onChange({ ...query, queryType: value.value });
    // executes the query

    if ([`issues_all`, `labels`].includes(value.value)) {
      onRunQuery();
    }
  };

  const { queryType } = query;

  return (
    <div className="gf-form">
      <InlineField label="Query Type">
        <Select
          onChange={onQueryTypeChange}
          options={[
            { label: `Issues`, value: `issues_all` },
            { label: `Issues Created`, value: `issues_created` },
            { label: `Issues Closed`, value: `issues_closed` },
            { label: `Issues Open`, value: `issues_open` },
          ]}
          value={queryType}
        />
      </InlineField>
    </div>
  );
}
