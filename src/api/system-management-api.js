import http from '../http'

// 单位树
const getUnitTree = () => http.get(`/api/v2/units/tree`, {loading: false});
// 单位部门树
const getDeptsTree = () => http.get(`/api/v2/depts/units/trees`, {loading: false});

// 单位管理api
const getBaseUnitData = (search) => http.get(`/api/v2/units/basis?search=${search}&page=1&pageSize=20`, {loading: false});
const getUnitInfo = params => http.get(`/api/v2/units`, {params}, {loading: false});
const insertUnitInfo = unitInfo => http.post(`/api/v2/units`, unitInfo, {loading: false});
const updateUnitInfo = (unitId, unitInfo) => http.patch(`/api/v2/units/${unitId}`, unitInfo, {loading: false});
const deleteUnitInfo = unitId => http.delete(`/api/v2/units/${unitId}`, {loading: false});

// 部门管理api
const getDeptInfo = params => http.get(`/api/v2/depts`, {params}, {loading: false});
const saveDeptInfo = deptsInfo => http.post(`/api/v2/depts`, deptsInfo, {loading: false});
const updateDeptInfo = (deptId, deptsInfo) => http.patch(`/api/v2/depts/${deptId}`, deptsInfo, {loading: false});
const deleteDeptInfo = deptId => http.delete(`/api/v2/depts/${deptId}`, {loading: false});

// 职务管理api
const getJobInfo = params => http.get(`/api/v2/jobs`, {params}, {loading: false});
const saveJobInfo = jobInfo => http.post(`/api/v2/jobs`, jobInfo, {loading: false});
const updateJobInfo = (jobId, jobInfo) => http.patch(`/api/v2/jobs/${jobId}`, jobInfo, {loading: false});
const deleteJobInfo = jobId => http.delete(`/api/v2/jobs/${jobId}`, {loading: false});

// 团队管理api
const getStaffByGroupId = groupId => http.get(`/api/v2/groups/${groupId}`, {loading: true});
const getGroup = params => http.get(`/api/v2/groups`, {params}, {loading: false});
const saveGroup = groupInfo => http.post(`/api/v2/groups`, groupInfo, {loading: false});
const updateGroup = (groupId, groupInfo) => http.patch(`/api/v2/groups/${groupId}`, groupInfo, {loading: false});
const deleteGroup = groupId => http.delete(`/api/v2/groups/${groupId}`, {loading: false});

//角色管理api
const saveRolePortals = (roleId, ids) => http.post(`/api/v2/portals/role/add`,{'roleId': roleId, 'ids': ids},{loading: false});
const delRolePortals = (rolePortletIds) => http.post(`/api/v2/portals/role/del`,{'rolePortletIds': rolePortletIds},{loading: false});
const getRolePortals = roleId => http.get(`/api/v2/portals/role/${roleId}`,{loading: false});
const saveRoleLnks = (roleId, ids) => http.post(`/api/v2/lnks/role`,{'roleId': roleId, 'ids': ids},{loading: false});
const getRoleLnks = roleId => http.get(`/api/v2/lnks/role/${roleId}`,{loading: false});

// 人员管理api
const getStaff = params => http.get(`/api/v2/staffs`, {params}, {loading: false});
const getStaffById = staffId => http.get(`/api/v2/staffs/${staffId}`, {loading: false});
const saveStaff = staffInfo => http.post(`/api/v2/staffs`, staffInfo, {loading: false});
const updateStaff = (staffId, staffInfo) => http.patch(`/api/v2/staffs/${staffId}`, staffInfo, {loading: false});
const deleteStaff = staffId => http.delete(`/api/v2/staffs/${staffId}`, {loading: false});
const downloadStaffDemo = () => http.get(`/api/v2/staffs/demo`, {responseType: 'blob', loading: false});
const importStaffExcel = params => http.post(`/api/v2/staffs/import`, params, {loading: false});
const exportStaffExcel = url => http.get(`${url}`, {responseType: 'blob', loading: false});

//用户管理api
const getUserInfo = params => http.get(`/api/v2/users`, {params}, {loading: false});
const getUserInfoById = userId => http.get(`/api/v2/users/${userId}`, {loading: false});
const saveUserInfo = userInfo => http.post(`/api/v2/users`, userInfo, {loading: false});
const updateUserInfo = (userId, userInfo) => http.patch(`/api/v2/users/${userId}`, userInfo, {loading: false});
const deleteUserInfo = userId => http.delete(`/api/v2/users/${userId}`, {loading: false});

// 接口管理api
const searchInterface = params => http.get('/api/v2/interfaces', {params:params}, {loading: true});
const insertInterface = params => http.post('/api/v2/interfaces', params, {loading: true, selSucMsg: "添加成功"});
const updateInterface = params => http.patch('/api/v2/interfaces/' + params.id, params, { loading: true, selSucMsg: "修改成功"});
const delInterface = params => http.delete('/api/v2/interfaces/' + params, {loading: true, selSucMsg: "删除成功"});

// 接口用户管理api
const searchIUser = params => http.get('/api/v2/interfaceusers', {params:params}, {loading: true});
const insertIUser = params => http.post('/api/v2/interfaceusers', params, {loading: true, selSucMsg: "添加成功"});
const updateIUser = params => http.patch('/api/v2/interfaceusers/' + params.iUserId, params, { loading: true, selSucMsg: "修改成功"});
const delIUser = params => http.delete('/api/v2/interfaceusers/' + params, {loading: true, selSucMsg: "删除成功"});
const searchAuth = params => http.get('/api/v2/interfaceusers/' + params + '/auth', {loading: true});
const insertAuth = (iUserId,params) => http.post('/api/v2/interfaceusers/' + iUserId + '/auth', params, {loading: true, selSucMsg: "添加成功"});
const validate = (userId, password) => http.get('/api/v2/users/validate/' + userId + '?password=' + password, {loading: true});
const getSecretKey = (iUserId) => http.get('/api/v2/interfaceusers/' + iUserId + '/secretKey', {loading: true});
const generateKey = (iUserId) => http.post('/api/v2/interfaceusers/' + iUserId + '/secretKey', {loading: true});

//数据同步api
const getTimeTask = params => http.get(`/api/v2/sync`, {params}, {loading: false});
const insertTimeTask = form => http.post(`/api/v2/sync`, form, {loading: false});
const updateTimeTask = (id, form) => http.patch(`/api/v2/sync/${id}`, form, {loading: false});
const deleteTimeTask = id => http.delete(`/api/v2/sync/${id}`, {loading: false});

// portal管理api
const getPortalData = params => http.get(`/api/v2/portals`, {params}, {loading: false});
const savePortalData = params => http.post(`/api/v2/portals`, params, {loading: false});
const updatePortalData = (id, params) => http.patch(`/api/v2/portals/${id}`, params, {loading: false});
const deletePortalData = id => http.delete(`/api/v2/portals/${id}`, {loading: false});

//快捷方式api
const getFastWayData = params => http.get(`/api/v2/lnks`, {params}, {loading: false});
const saveFastWayData = params => http.post(`/api/v2/lnks`, params, {loading: false});
const updateFastWayData = (id, params) => http.patch(`/api/v2/lnks/${id}`, params, {loading: false});
const deleteFastWayData = id => http.delete(`/api/v2/lnks/${id}`, {loading: false});
const getFastWayLogo = id => http.get(`/api/v2/lnks/logo/${id}`, {responseType: 'arraybuffer', loading: false});

// 应用管理api
const searchApp = params => http.get('/api/v2/apps', {params:params}, {loading: true});
const searchAppAndIntTree = params => http.get('/api/v2/apps/interfaces', {params:params}, {loading: true});

export {
    getUnitTree,
    getDeptsTree,
    
    getBaseUnitData,
    getUnitInfo,
    insertUnitInfo,
    updateUnitInfo,
    deleteUnitInfo,
    
    getDeptInfo,
    saveDeptInfo,
    updateDeptInfo,
    deleteDeptInfo,
    
    getJobInfo,
    saveJobInfo,
    updateJobInfo,
    deleteJobInfo,
    
    getStaffByGroupId,
    getGroup,
    saveGroup,
    updateGroup,
    deleteGroup,
    
    saveRolePortals,
    delRolePortals,
    getRolePortals,
    saveRoleLnks,
    getRoleLnks,
    
    getStaff,
    getStaffById,
    saveStaff,
    updateStaff,
    deleteStaff,
    downloadStaffDemo,
    importStaffExcel,
    exportStaffExcel,
    
    getUserInfo,
    getUserInfoById,
    saveUserInfo,
    updateUserInfo,
    deleteUserInfo,
    
    searchInterface,
    insertInterface,
    updateInterface,
    delInterface,

    searchIUser,
    insertIUser,
    updateIUser,
    delIUser,
    searchAuth,
    insertAuth,
    validate,
    getSecretKey,
    generateKey,
    
    searchApp,
    searchAppAndIntTree,
    
    getTimeTask,
    insertTimeTask,
    updateTimeTask,
    deleteTimeTask,
    
    getPortalData,
    savePortalData,
    updatePortalData,
    deletePortalData,
    
    getFastWayData,
    saveFastWayData,
    updateFastWayData,
    deleteFastWayData,
    getFastWayLogo
}