import http from '../http'
//获取用户
const getUserName=userId=>http.get(`/api/v2/users/${userId}`);
//修改密码
const changePassword = (params,userId) => http.post(`/api/v2/change-password/${userId}`,params,{loading:true});
//退出
const logout = () => http.get('/api/v2/logout',{loading:true});
//系统管理菜单权限
const systemLeftMenu = (userId) => http.get(`/api/v2/users/${userId}/modules`,{loading:true});
export {
    getUserName,
    changePassword,
    logout,
    systemLeftMenu
}