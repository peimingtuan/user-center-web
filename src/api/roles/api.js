import http from '../../http'

const search = params => http.get('/api/v2/roles', {params: params}, {loading: true});

const insert = params => http.post('/api/v2/roles', params, {loading: true, selSucMsg: "添加成功"});

const update = params => http.patch('/api/v2/roles/' + params.roleId, params, {loading: true, selSucMsg: "修改成功"});

const del = params => http.delete('/api/v2/roles/' + params, {loading: true, selSucMsg: "删除成功"});

export {
    search, insert, update, del
}