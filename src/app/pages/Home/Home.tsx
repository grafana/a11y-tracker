import React, { useMemo } from 'react';

import { SceneApp, SceneAppPage } from '@grafana/scenes';
import { getBasicScene } from './scenes';
import { prefixRoute } from '../../utils/utils.routing';
import { DATASOURCE_REF, ROUTES } from '../../constants';
import { config } from '@grafana/runtime';
import { Alert } from '@grafana/ui';

import { DrawerContextProvider } from 'app/Contexts';

const getScene = () => {
  return new SceneApp({
    pages: [
      new SceneAppPage({
        title: 'Accessibility Issue Tracker',
        subTitle: 'Track accessibility issues for Grafana and Grafana plugins.',
        url: prefixRoute(ROUTES.Home),
        getScene: () => {
          return getBasicScene();
        },
      }),
    ],
  });
};

export const HomePage = () => {
  const scene = useMemo(() => getScene(), []);

  return (
    <>
      {!config.datasources[DATASOURCE_REF.uid] && (
        <Alert title={`Missing ${DATASOURCE_REF.uid} datasource`}>
          These demos depend on <b>testdata</b> datasource: <code>{JSON.stringify(DATASOURCE_REF)}</code>. See{' '}
          <a href="https://github.com/grafana/grafana/tree/main/devenv#set-up-your-development-environment">
            https://github.com/grafana/grafana/tree/main/devenv#set-up-your-development-environment
          </a>{' '}
          for more details.
        </Alert>
      )}

      <DrawerContextProvider>
        <scene.Component model={scene} />
      </DrawerContextProvider>
    </>
  );
};
