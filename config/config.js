// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  // umi4: avoids duplicated esbuild helper names across chunks
  esbuildMinifyIIFE: true,
  // umi 4 moves antd / dva / locale into @umijs/plugins
  plugins: [
    '@umijs/plugins/dist/antd',
    '@umijs/plugins/dist/dva',
    '@umijs/plugins/dist/locale',
    '@umijs/plugins/dist/initial-state',
    '@umijs/plugins/dist/model',
  ],
  antd: {},
  dva: {},
  history: {
    type: 'browser',
  },
  locale: {
    // default zh-CN
    default: 'en-US',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
