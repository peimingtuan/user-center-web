import http from '../http'
import httpForm from '../http/form-data-ajax'
//注册信息
const agreement=()=> http.get(`/api/v2/register/agreement`,{loading:true});
//判断是否开启密码复杂度检查
const passwordCheck = () => http.get(`/api/v2/config/passwordCheck?systemName=chnsys-ums`,{loading:true});
//判断是否开启实名认证
const realNameSwitch = () => http.get(`/api/v2/config/realNameSwitch?systemName=chnsys-ums`,{loading:true});
//发送验证码
const getCode = (phone) => http.get(`/api/v2/code?phone=${phone}`,{loading:true});
//验证码校验
const checkCode = (phone,code,codeId) => http.get(`/api/v2/code/check?phone=${phone}&code=${code}&codeId=${codeId}`,{loading:true});
//注册
const goRegist = params => http.post('/api/v2/register',params,{loading:true});
//实名认证
const certification = params => httpForm.post('/api/v2/realNameRegister',params,{loading:true});
export {
    agreement,
    passwordCheck,
    realNameSwitch,
    getCode,
    checkCode,
    goRegist,
    certification
}