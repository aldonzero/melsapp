import { stringify } from 'qs';
import request from '@/utils/request';

export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}


//设备管理--machinery
export async function queryMachinery(params) {
  return request(`/api/machinery?${stringify(params)}`);
}

//设备类别管理--machineryType
export async function queryMachineryType(params) {
  return request(`/api/machineryType?${stringify(params)}`);
}

export async function updateMachineryType(params) {
  return request(`/api/machineryType`, {
    method: 'PUT',
    data: params,
  });
}

//完工结算管理--bill
export async function queryBill(params) {
  return request(`/api/bill`,{
    method: 'GET',
    data: params,
  });
}

export async function querybillById(id) {
  return request(`/api/bill/${id}`);
}

export async function addBill(params) {
  return request(`/api/bill`, {
    method: 'POST',
    data: params,
  });
}

export async function updateBill(params) {
  return request(`/api/bill`, {
    method: 'PUT',
    data: params,
  });
}

export async function removeBill(id) {
  return request(`/api/bill/${id}`,{
    method:'DELETE'
  });
}

export async function apiQuery(url,params) {
  return request(`/api/`+url+`?${stringify(params)}`);
}

export async function apiQueryById(url,id) {
  return request(`/api/`+url+`/${id}`);
}

export async function apiAdd(url,params) {
  return request(`/api/`+url, {
    method: 'POST',
    data: params,
  });
}

export async function apiUpdate(url,params){
  return request(`/api/`+url, {
    method: 'PUT',
    data: params,
  });
}

export async function apiRemove(url,id) {
  return request(`/api/`+url+`/${id}`,{
    method:'DELETE'
  });
}

export async function login(params) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}