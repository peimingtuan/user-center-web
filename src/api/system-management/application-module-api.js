import http from '../../http'
import httpForm from '../../http/form-data-ajax'
// 树
const getTree = () => http.get(`/api/v2/apps/modules?root=true`, {loading: true});
//应用查询
const getApps = params => http.get(`/api/v2/apps/?page=${params.pageIndex}&pageSize=${params.pageSize}`,{loading:true});
//应用添加
const saveApps = params => httpForm.post('/api/v2/apps',params,{loading:true});
//应用修改
const savePatchApps = (params,appId) => httpForm.patch('/api/v2/apps/'+appId,params,{loading:true});
//应用导入
const appImport = (params) => httpForm.post('/api/v2/apps/import',params,{loading:true,selSucMsg:'导入成功！'});
//应用图片下载
const getAppsImg = appLogo => http.get(`/api/v2/apps/file/${appLogo}`, {responseType: 'blob'},{loading: true});
//应用删除
const deleteInfo = params => http.delete('/api/v2/apps/'+params,{loading:true});
//模块查询
const getModuleApps = params => http.get(`/api/v2/modules?appId=${params.appId}&pageSize=${params.pageSize}&page=${params.pageIndex}`,{loading:true});
const getParentModuleApps = params => http.get(`/api/v2/modules?appId=${params.appId}&parentModuleId=${params.parentModuleId}&pageSize=${params.pageSize}&page=${params.pageIndex}`,{loading:true});
//模块添加
const saveModuleApps = params => httpForm.post('/api/v2/modules',params,{loading:true});
//模块修改
const getModulesImg = imgArrd => http.get(`/api/v2/modules/file/${imgArrd}`, {responseType: 'blob'},{loading: true});
//模块图片下载
const savePatchModuleApps = (params,moduleId) => httpForm.patch('/api/v2/modules/'+moduleId,params,{loading:true});
//模块删除
const deleteModuleInfo = params => http.delete('/api/v2/modules/'+params,{loading:true});
export {
    getTree,
    getApps,
    saveApps,
    savePatchApps,
    appImport,
    getAppsImg,
    deleteInfo,
    getModuleApps,
    getParentModuleApps,
    saveModuleApps,
    getModulesImg,
    savePatchModuleApps,
    deleteModuleInfo
}