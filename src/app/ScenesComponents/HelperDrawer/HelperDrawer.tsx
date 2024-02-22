import React, { useState } from 'react';
import { css } from '@emotion/css';
import { sceneGraph, SceneObjectBase, SceneComponentProps } from '@grafana/scenes';
import { Drawer, Tab, TabsBar, TabContent, useStyles2, IconButton } from '@grafana/ui';
import { GrafanaTheme2, PanelData } from '@grafana/data';

import { Stack } from 'app/components/Stack';
import { SuccessCriterionDesc } from 'app/components/SuccessCriterionDesc';
import { getSuccessCriterionByRefId } from 'assets/wcag';
import {
  extractRowByIndex,
  getDataFrameFromSeries,
  getFieldByNameFromDataFrame,
  parseLabels,
} from 'app/utils/utils.data';
import { REQUEST_ISSUES_OPEN_REF, TRANSFORM_LABELS_COUNT_REF, WCAG_LABEL_PREFIX } from 'app/constants';
import { useDrawer } from 'app/Contexts';
import { WCAGLevelBadge } from 'app/components/WCAGLevelBadge';
import { Issue } from 'app/models/issue';
import { IssuesTab } from './IssuesTab';
import { ActionButtons } from './ActionButtons';

export class HelperDrawer extends SceneObjectBase {
  public static Component = HelperDrawerRenderer;
}

function HelperDrawerRenderer({ model }: SceneComponentProps<HelperDrawer>) {
  const { close, content, isOpen, open } = useDrawer();
  const { data } = sceneGraph.getData(model).useState();
  const styles = useStyles2(getStyles);
  const [activeTab, setActiveTab] = useState(0);

  if (!isOpen || !data) {
    return null;
  }

  const sc = getSuccessCriterionByRefId(content);
  const { level, ref_id, title } = sc;
  const issues = getSCIssues(data, ref_id);

  return (
    <Drawer
      title={
        <div>
          <Stack alignItems={`flex-start`} className={styles.titleWrapper} justifyContent={`space-between`}>
            <div>
              <h1 className={styles.title}>Success Criterion {ref_id}</h1>
              <div className={styles.subTitle}>{title}</div>
            </div>
            <Stack alignItems={`center`}>
              <WCAGLevelBadge level={level} />
              <IconButton tooltip={`Close drawer`} name="times" onClick={close} />
            </Stack>
          </Stack>

          <TabsBar>
            <Tab label="Description" active={activeTab === 0} onChangeTab={() => setActiveTab(0)} />
            <Tab
              label={`Issues (${issues.filter(Boolean).length})`}
              active={activeTab === 1}
              onChangeTab={() => setActiveTab(1)}
            />
          </TabsBar>
        </div>
      }
      onClose={() => {
        close();
        setActiveTab(0);
      }}
      // size="sm"
      width={600}
    >
      <div className={styles.container}>
        <TabContent>
          {activeTab === 0 && <SuccessCriterionDesc successCriterion={sc} />}
          {activeTab === 1 && <IssuesTab issues={issues} />}
        </TabContent>
        <ActionButtons
          dataFrame={getDataFrameFromSeries(data.series, TRANSFORM_LABELS_COUNT_REF)}
          refId={ref_id}
          onNext={(refId) => {
            open(refId);
            setActiveTab(0);
          }}
          onPrev={(refId) => {
            open(refId);
            setActiveTab(0);
          }}
        />
      </div>
    </Drawer>
  );
}

function getSCIssues(data: PanelData, refId: string) {
  const dataFrame = getDataFrameFromSeries(data.series, REQUEST_ISSUES_OPEN_REF);

  const field = getFieldByNameFromDataFrame(dataFrame, `labels`);
  const values = field?.values || [];
  return values
    .map((label, i) => {
      const { wcagLabels } = parseLabels(label);
      if (wcagLabels.some((wl) => wl === `${WCAG_LABEL_PREFIX}${refId}`)) {
        return extractRowByIndex(dataFrame, i);
      }

      return null;
    })
    .filter(Boolean) as Issue[];
}

const getStyles = (theme: GrafanaTheme2) => {
  const psuedoType = `h2`;

  return {
    container: css({
      display: `flex`,
      flexDirection: `column`,
      height: `100%`,
      justifyContent: `space-between`,
      maxWidth: `600px`,
    }),
    titleWrapper: css({
      padding: theme.spacing(2, 2, 1),
    }),
    title: css({
      margin: 0,
      fontSize: theme.typography[psuedoType].fontSize,
      fontWeight: theme.typography[psuedoType].fontWeight,
      letterSpacing: theme.typography[psuedoType].letterSpacing,
      lineHeight: theme.typography[psuedoType].lineHeight,
    }),
    subTitle: css({
      color: theme.colors.text.secondary,
    }),
    actionsWrapper: css({
      padding: theme.spacing(2, 0),
    }),
  };
};
