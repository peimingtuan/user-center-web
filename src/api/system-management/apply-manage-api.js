import http from '../../http'
import httpForm from '../../http/form-data-ajax'
//查询
const getConfig = () => http.get('/api/v2/config?systemName=chnsys-ums',{loading:true});
//添加
const saveConfig = params => http.post('/api/v2/config',params,{loading:true, selSucMsg: "保存成功",});
//注册信息上传
const upload = params => httpForm.post('/api/v2/register/agreement/upload',params,{loading:true, selSucMsg: "上传成功",});
export {
    getConfig,
    saveConfig,
    upload,
}