import myRequest from '@/utils/myRequest';

export async function clockDeptList(params) {
  return myRequest('/index/Clock_Info/deptList', {...params}, false, 'POST', false);
}

export async function clockImport(params) {
  return myRequest('/index/Clock_Info/clockImport', {...params}, false, 'POST');
}

