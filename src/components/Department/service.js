import myRequest from '@/utils/myRequest';

export async function deptData() {
  return myRequest('/Department/data', {}, false, 'GET', true, rootUrl);
}


