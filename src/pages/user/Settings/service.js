import myRequest from '@/utils/myRequest';

export async function getList(params) {
  return myRequest('/index/Jurisdiction/getList', params, false, 'POST');
}

export async function relieveJurisdiction(params) {
  return myRequest('/index/Jurisdiction/relieveJurisdiction', params, false, 'POST');
}

export async function authenticationAdd(params) {
  return myRequest('/index/Authentication/add', params, false, 'POST');
}

export async function getInjuryProportion(params) {
  return myRequest('/Customer/Staffssinfo/getInjuryProportion', params, false, 'GET', true, rootUrl);
}

export async function getAddress(params) {
  return myRequest('/shop/Address/getAddress', params, false, 'POST', true, marketUrl);
}

export async function uploadBusinessLicense(params) {
  return myRequest('/index/Authentication/uploadBusinessLicense', params, false, 'POST');
}

export async function checkPassword(params) {
  return myRequest('/Customer/Company/checkPassword', params, false, 'POST', false, rootUrl);
}

export async function savePassword(params) {
  return myRequest('/Customer/Company/savePassword', params, false, 'POST', true, rootUrl);
}

export async function invitation(params) {
  return myRequest('/index/Jurisdiction/invitation', params, false, 'POST', false);
}

export async function getTelephoneIntervalNumber(params) {
  return myRequest('/shop/address/getTelephoneIntervalNumber', params, false, 'GET', false, marketUrl);
}


