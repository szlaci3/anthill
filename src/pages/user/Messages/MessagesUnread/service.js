import myRequest from '@/utils/myRequest';

export async function getAllInform(params) {
  return myRequest('/Customer/Inform/getAllInform', params, false, 'GET', true, rootUrl);
}

export async function getFnorItem(params) {
  return myRequest('/Customer/Inform/getFnorItem', params, false, 'GET', true, rootUrl);
}

export async function getFnorCount(params) {
  return myRequest('/Customer/Inform/getFnorCount', params, false, 'GET', true, rootUrl);
}

