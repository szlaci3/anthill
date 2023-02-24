import myRequest from '@/utils/myRequest';

export async function deptData() {
  return myRequest('/Customer/Dept/data', {}, false, 'GET', true, rootUrl);
}


