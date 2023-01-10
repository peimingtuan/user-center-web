import http from '../http'
//登录信息判断
const loginWay = () => http.get('/api/v2/config/loginWay?systemName=chnsys-ums',{loading:true});
//账号登录
const goLogin = params => http.post('/api/v2/login',params,{loading:true});
//发送验证码
const getCode = (phone) => http.get(`/api/v2/code?phone=${phone}`,{loading:true});
//验证码校验
const checkCode = (phone,code,codeId) => http.get(`/api/v2/code/check?phone=${phone}&code=${code}&codeId=${codeId}`,{loading:true});
//手机号登录
const phoneLogin = params => http.post('/api/v2/phone',params,{loading:true});

export {
    loginWay,
    goLogin,
    getCode,
    checkCode,
    phoneLogin
}