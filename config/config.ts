// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';

import defaultSettings from './defaultSettings';
import proxy from './proxy';
import routes from './routes';

const { REACT_APP_ENV } = process.env;

const SERVERIP = '/api';
const rootApi = SERVERIP;
const extendApi = SERVERIP;
const xlsExtendApi = SERVERIP;
const taxDeductApi = SERVERIP;
const marketApi = SERVERIP;
const cmsApi = SERVERIP;

const cloud = "http://rh4301xca.hn-bkt.clouddn.com/";
const qiniuUploadApi = "https://up.qbox.me/";

export default defineConfig({
  publicPath: './',
  history: {type: 'hash'},
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  // https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: false,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes,
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: '珺才人力',// used when not logged in
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  define: {
    SERVERIP: SERVERIP,
    rootUrl: rootApi,
    extendUrl: extendApi,
    xlsExtendUrl: xlsExtendApi,
    taxDeductUrl: taxDeductApi,
    marketUrl: marketApi,
    cmsUrl: cmsApi,
    cloud: cloud,
    qiniuUploadUrl: qiniuUploadApi,

    forceShowGuide: false,
  }
});
