const module = {
    namespaced: true,
    state:{
        defaultActive:'1',//左侧菜单当前活跃项1
    },
    mutations:{
        setDefaultActive (state,data) {
            state.defaultActive=data;
        },
    },
    actions:{
        saveActive({commit},data){
            commit('setDefaultActive',data)
        }
    }
}
export default module;