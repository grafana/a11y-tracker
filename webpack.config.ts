import path from 'path';
import { type Configuration } from 'webpack';
import ReplaceInFileWebpackPlugin from 'replace-in-file-webpack-plugin';
import grafanaConfig from './.config/webpack/webpack.config';
import { getPackageJson } from './.config/webpack/utils';
import { DIST_DIR, SOURCE_DIR } from './.config/webpack/constants';

const config = async (env): Promise<Configuration> => {
  const baseConfig = await grafanaConfig(env);
  const appPluginJson = () => require(path.resolve(process.cwd(), `${SOURCE_DIR}/app/plugin.json`));

  return {
    ...baseConfig,
    plugins: [
      // @ts-expect-error
      ...baseConfig.plugins,
      new ReplaceInFileWebpackPlugin([
        {
          dir: `${DIST_DIR}/app`,
          files: ['plugin.json'],
          rules: [
            {
              search: /\%VERSION\%/g,
              replace: getPackageJson().version,
            },
            {
              search: /\%TODAY\%/g,
              replace: new Date().toISOString().substring(0, 10),
            },
            {
              search: /\%PLUGIN_ID\%/g,
              replace: appPluginJson().id,
            },
          ],
        },
      ]),
    ],
  };
};

export default config;
