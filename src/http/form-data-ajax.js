import axios from 'axios';
import router from '@/router'
import {successMsg, warningMsg, errorMsg, openLoading, closeLoading} from '../ui';

let selFn = null;
let selErrMsg = null;
let selSucMsg = null;
let pendingArr = [];

// 收集发起的请求
const addPendingArr = beforeUrl => {
  pendingArr.push(beforeUrl);
}

// 删除完成的请求
const removePendingArr = response => {
  if(response){
    const finishUrl = response.config.baseURL + response.config.url;
    const finishParams = response.config.params ? response.config.params : response.config.data;
    const finishObj = JSON.stringify({
      url: finishUrl,
      params: finishParams
    })
    pendingArr.splice(pendingArr.indexOf(finishObj), 1);
  }
}

// 状态提示函数
const showStatus = status => ({
  400: '请求错误 (400)',
  401: '未授权，请重新登录 (401)',
  403: '拒绝访问 (403)',
  404: '请求出错 (404)',
  408: '请求超时 (408)',
  500: '服务器错误 (500)',
  501: '服务未实现 (501)',
  502: '网络错误 (502)',
  503: '服务不可用 (503)',
  504: '网络超时 (504)',
  505: 'HTTP版本不受支持 (505)'
})[status] || `连接出错${ status }`;

// 创建axios实例
let httpForm = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/wj-ums' : '/api/wj-ums',//根据实际请求路径自定义
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  timeout: 30000*2
});

// 请求拦截器
httpForm.interceptors.request.use( config => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  config.cancelToken = source.token;
  let token = window.localStorage.getItem('tokenKey')
  if (token)config.headers.Authorization = `Bearer ${token}`;
  // 先判断该请求是否在正在请求的数组中
  const pendingUrl = config.baseURL + config.url;
  const pendingParams = config.params ? config.params : config.data;
  const pendingObj = JSON.stringify({
    url: pendingUrl,
    params: pendingParams
  })
  pendingArr.indexOf(pendingObj) > -1 ? source.cancel() : addPendingArr(pendingObj);
  config.fn ? selFn = config.fn : selFn = null;
  config.loading ? openLoading() : false;
  config.selErrMsg ? selErrMsg = config.selErrMsg : selErrMsg = null;
  config.selSucMsg ? selSucMsg = config.selSucMsg : selSucMsg = null;
  return config;
});

// 响应拦截器
httpForm.interceptors.response.use( response => {
  // 请求成功，将该请求从正在请求的数组中删除
  removePendingArr(response);
  // 关闭loading
  response.config.loading ? closeLoading() : null;
  selFn ? selFn() : null;
  const { data } = response;
  if (data.code === 200) {
    // 状态码code为200，表示拿到正确数据，判断是否显示提示
    if(response.headers.newtoken){
      let token = response.headers.newtoken;
      localStorage.setItem('tokenKey',token)
    }
    selSucMsg ? successMsg(selSucMsg) : false;
    return data;
  } else {
    // 状态码不为200，表示拿到错误数据，判断显示自定义或默认提示
    selErrMsg ? warningMsg(selErrMsg) : warningMsg(data.message);
    if(data.code===40616){
      if(sessionStorage.getItem('loginType')==1)router.push({path: "/Login"})
      else router.push({path: "/IntranetLogin"})
      return
    }
    return Promise.reject(response.config.url)
  }
}, error => {
  const { response } = error;
  // 请求成功，将该请求从正在请求的数组中删除
  removePendingArr(response);
  // 关闭loading
  response ? response.config.loading ? closeLoading() : null : closeLoading();
  selFn ? selFn() : null;
  response && errorMsg(showStatus(response.status));
  return Promise.reject('服务器错误!');
});

export default httpForm