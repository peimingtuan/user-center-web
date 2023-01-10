let getEnv = process.env.NODE_ENV;
export default function (url) {
    let protocol = ''
    let host = getEnv === 'development' ? '/api/wj-ums' : '/wj-ums'
    const route = /^\//.test(url) ? url : '/' + url
    return protocol + host + route
}