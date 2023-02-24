// https://umijs.org/config/
import { defineConfig } from 'umi';

const SERVERIP = '/api';
const rootApi = SERVERIP;
const extendApi = SERVERIP;
const xlsExtendApi = SERVERIP;
const taxDeductApi = SERVERIP;
const marketApi = SERVERIP;
const cmsApi = SERVERIP;

const cloud = "http://rh4301xca.hn-bkt.clouddn.com/";
const qiniuUploadApi = "http://up-z2.qiniup.com/";

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
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

    forceShowGuide: true,
  },
});
