import http from '../http'
//基于用户查询
const getPortals = params => http.get(`/api/v2/portals/user/${params.userId}`,{loading:true});
//基于用户修改、移除
const editPortal = params => http.patch(`/api/v2/portals/user`,params,{loading:true});
//基于portletId查询body
const getModuleBody = id => http.get(`/api/v2/portals/${id}/body`);
export {
    getPortals,
    editPortal,
    getModuleBody
}