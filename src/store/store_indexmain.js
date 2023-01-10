const module = {
    namespaced: true,
    state:{
        topActiveAd:0,//顶部菜单当前活跃项0
        systemIndexUrl:'/indexMain/SystemManagement/UnitManage'
    },
    mutations:{
        setTopActiveAd (state,data) {
            state.topActiveAd=data;
        },
        setSystemIndexUrl (state,data) {
            state.systemIndexUrl=data;
        },
    },
    actions:{

    }
}
export default module;