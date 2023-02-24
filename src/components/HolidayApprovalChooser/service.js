import myRequest from '@/utils/myRequest';

export async function deptList(params) {
  return myRequest('/index/Expenses_Info/deptList', {...params}, false, 'POST', false);
}

