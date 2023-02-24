import myRequest from '@/utils/myRequest';

export async function giveJurisdiction(params) {
  return myRequest('/index/Jurisdiction/giveJurisdiction', {...params}, false, 'POST');
}

