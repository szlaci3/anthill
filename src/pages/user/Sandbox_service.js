import myRequest from '@/utils/myRequest';

export async function checkSubscription(params) {
  return myRequest('/index/Article_Info/getArticleCMS', params, false, 'GET', true);
}

export async function addSubscription(params) {
  return myRequest('/Customer/SocialSecurityAgency/subscription.html', params, false, 'POST', true);
}
