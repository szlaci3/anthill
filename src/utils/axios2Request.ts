import axios from 'axios';
import { message } from 'antd';
import { goToLoginTriage } from '@/components/RightContent/AvatarDropdown';

/**
 * Requests a URL, returning a promise.
 *
 */
export default function myRequest(
  urlArg: string,
  body = {},
  addToken: boolean = true,
  method: string = 'POST',
  pipeErrorHandling: boolean = true,
  urlMain: string = "extendUrlBBB",
  contentType?: string,
  /* contentType: default is null. Can be "json", "x-www-form-urlencoded".
   * If null, in case of POST, FormData is used.
   * The response of form-data APIs is readable if use FormData. - At least in DEV
   */
): Promise<any> {
  let url: string = urlMain + urlArg;

  interface Options {
    method?: string;
    credentials?: string;
    headers?: any;
  }

  const defaultOptions: Options = {
    method,
    credentials: 'include',
  };
  const newOptions: Options = { ...defaultOptions };
  let newBody = body;

  if (addToken) {
    newOptions.headers = {Authorization: "Bearer " + sessionStorage.getItem('logintoken') || ''};
  }

  const makeUrlSearch = (body: any) => {
    let _urlSearch: string = '';
    Object.keys(body).map((param: string, i: number): number => {
      let val: string | null | undefined = body[param];
      if (val !== null && typeof val !== "undefined") {
        _urlSearch += `${i ? '&' : ''}${param}=${body[param]}`; // i ? (Whether not 0)
      }
      return 0;
    });
    return _urlSearch;
  }

  const makeUrlEncoded = (body = {}): string => {
    let _urlSearch: string = '';
    Object.keys(body).map((param: string, i: number): number => {
      let val: string = body[param];
      if (val !== null && typeof val !== "undefined") {
        if (body[param].map) {
          _urlSearch += body[param].map((item: string, j: number): string => `${i || j ? '&' : ''}${param}%5B%5D=${encodeURIComponent(item)}`).join("");
        } else {
          _urlSearch += `${i ? '&' : ''}${param}=${encodeURIComponent(body[param])}`; // i ? (Whether not 0)
        }
      }
      return 0;
    });
    return _urlSearch;
  }

  if (method === 'GET') {
    newOptions.method = 'GET';
    let urlSearch: string = makeUrlSearch(newBody);
    url += `?${urlSearch}`;
  } else if (!contentType) {
    let bodyFormData: FormData = new FormData();
    let i: string;
    for (i in body) {
      if (body[i] !== null && typeof body[i] !== "undefined") {
        bodyFormData.append(i, body[i]);
      }
    }
    newBody = bodyFormData;
  }

  if (contentType === "x-www-form-urlencoded") {
    newBody = makeUrlEncoded(newBody);

    newOptions.headers = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,und;q=0.6',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      Pragma: 'no-cache',
      ...newOptions.headers,
    };
  } else if (!(newBody instanceof FormData) && method !== 'GET') {
    newOptions.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      ...newOptions.headers,
    };
    newBody = JSON.stringify(newBody);
  } else {
    newOptions.headers = {
      Accept: 'application/json, text/javascript, */*; q=0.01',
      ...newOptions.headers,
    };
  }

  return (method === "GET" ?
    axios.get(url) :
    axios.post(url, newBody, newOptions))
    .then(({data: res}) => {

      if (typeof res !== "object") {
        message.error("请求错误。");
        return {code: 0, status: 0, htmlRes: 1};
      }

      if (res.code == 0 || res.status == 0) {
        if ("请登录" === (res.msg || res.info)) {
          goToLoginTriage();
          return;
        }

        if (pipeErrorHandling) {
          message.error(res.msg || res.info || "请求错误~");
        }
      }

      return res;      
    })
    .catch(e => {
      const status = e.name;
      if (status === "TypeError") { // user may be offline
        message.error(`请求错误`);
      }
      return {code: 0, status: 0};
    });
}