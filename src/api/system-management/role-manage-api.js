import http from '../../http'
//树
const getTree = () => http.get(`/api/v2/apps/modules`, {loading: true});
//单位树
const getUnitTree = () => http.get(`/api/v2/units/tree?root=false`, {loading: true});
//部门树
const getDepartTree = () => http.get(`/api/v2/units/dept/tree?unitIds=`, {loading: true});
//承办人员树
const getUndertakerTree = () => http.get(`/api/v2/units/dept/staff/tree`, {loading: true});
//查询操作权限接口
const getModuleApps = params => http.get(`/api/v2/modules?parentModuleId=${params.parentModuleId}&moduleType=2&pageSize=1000&page=1`,{loading:true});
//所有角色权限查看
const allCheckPowers = roleId => http.get(`/api/v2/roles/${roleId}/powers`,{loading: true});
//当前角色权限查看
const checkPowers = (roleId,moduleId) => http.get(`/api/v2/roles/${roleId}/powers?moduleId=${moduleId}`,{loading: true});
//角色授权
const rolePowers = (params,roleId) => http.post(`/api/v2/roles/${roleId}/powers`,params,{loading: true});
//查看角色用户
const checkRoleUsers = roleId => http.get(`api/v2/roles/${roleId}/users`,{loading: true});
//角色添加用户
const addRoleUsers = (params,roleId) => http.post(`/api/v2/roles/${roleId}/users`,params,{loading: true});
export {
    getTree,
    getUnitTree,
    getDepartTree,
    getUndertakerTree,
    getModuleApps,
    allCheckPowers,
    checkPowers,
    rolePowers,
    checkRoleUsers,
    addRoleUsers
}