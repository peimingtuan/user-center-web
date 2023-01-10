import http from '../http'

const generateAesKey = params => http.post('/generateAesKey.action',params,{loading:true});

export {
    generateAesKey,
}