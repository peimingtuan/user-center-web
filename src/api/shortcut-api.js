import http from '../http'
//应用导航快捷方式查询
const getUserSelect = (userId) => http.get(`/api/v2/lnks/user/${userId}`,{loading:true});
//下载图片
const getImg = (id) => http.get(`/api/v2/lnks/logo/${id}`,{responseType: 'arraybuffer'})
export {
    getUserSelect,
    getImg
}