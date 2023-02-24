import myRequest from '@/utils/myRequest';

export async function expensesDeptList(params) {
  return myRequest('/index/Expenses_Info/deptList', {...params}, false, 'POST', false);
}

export async function clockDeptList(params) {
  return myRequest('/index/Clock_Info/deptList', {...params}, false, 'POST', false);
}

