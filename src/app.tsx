import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import { notification } from 'antd';
import type { RequestConfig } from 'umi';
import { history } from 'umi';
import type { ResponseError } from 'umi-request';
import { getLogininfo, getCompanyinfo, authenticationGetInfo } from './services/login';
import defaultSettings from '../config/defaultSettings';
import { getTitle } from '@/services/globalServices';
import { toArrayIfPossible } from '@/utils/utils';

const loginPath: string = '/user/login';
interface MenuItem {
  id: number
  name: string
  pid: number
}
interface MenuResponse {
  code: number
  data?: any
  msg?: string
}
interface User {
  name: string
  avatar: string
  cid: number
  userid: number
  address: string
  phone: string
  vip: string
  authStatus: string
  authMsg: string
  authData: any
}

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading size="large"/>,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.CurrentUser;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  const fetchMenu = async (): Promise<MenuItem[]> => {
    const menuRes: MenuResponse = await getTitle(undefined);//BBB
    const menu = menuRes.data ? toArrayIfPossible(menuRes.data).filter((one: MenuItem): MenuItem => one) : [];
    return menu;
  }

  const fetchUserInfo = async ():Promise<User> => {
    try {
      const loginRes: {status: number, info: any} = await getLogininfo();
      const companyRes: {data: any, status: number, url: string} = await getCompanyinfo();
      const authRes: {data: any, code: number, msg: string} = await authenticationGetInfo();
      if (loginRes.status != 1) {
        throw "not-logged-in";
      } else {
        let info = Object.assign({}, loginRes.info);
        if (info.uheadimg === "null") {
          info.uheadimg = null;
        }
        info.isStaffManager = info.username == "13801742936";// user is only a staff manager

        let large: any;
        if (companyRes.data.logo) {
          large = companyRes.data.logo.slice(0, 4) === "http" ? companyRes.data.logo.replace("http:", "https:") : ("rootUrlBBB" + "/Uploads/b_" + companyRes.data.logo);
        } else {
          large = require("@/img/user-male.jpg");
        }

        const currentUser = {
          name: loginRes.info.username,
          avatar: large,
          cid: loginRes.info.cid,
          userid: loginRes.info.companyid,
          address: companyRes.data.address,
          phone: companyRes.data.phone,
          vip: loginRes.info.vip,
          authStatus: authRes.code,
          authMsg: authRes.msg,
          authData: authRes.data || {},
        }
        return currentUser;
      }
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        // history.push(loginPath);
      } else {
        // window.location = `${SERVERIP}/home.html`;
      }
    }
    return undefined;
  };

  // 如果是登录页面，不执行
  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    const menu = await fetchMenu();
    // let menuAvailable = menu.map(item => item.name);
    return {
      fetchUserInfo,
      currentUser,
      fetchMenu,
      menu,
      // menuAvailable,
      settings: {},
    };
  }
  return {
    fetchUserInfo,
    fetchMenu,
    settings: defaultSettings,
  };
}

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }

  if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  throw error;
};

// https://umijs.org/zh-CN/plugins/plugin-request
export const request: RequestConfig = {
  errorHandler,
};
