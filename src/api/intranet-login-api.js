import http from '../http'
//单位
const getUnits = () => http.get('/api/v2/units?search&page=0&pageSize=1000',{loading:true});
//登录
const goLogin = params => http.post('/api/v2/login',params,{loading:true});

export {
    getUnits,
    goLogin
}