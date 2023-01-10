import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import * as api from "@/api/home-page-api"
Vue.use(Vuex)
import indexmain from './store_indexmain'
import systemmanagement from './store_systemmanagement'
import logmanagement from './store_logmanagement'
export default new Vuex.Store({
  state: {
    userId:'',
    userName:'',
    systemNameValue:'',//系统名声
    selectList:[{id:1,name:'是'},{id:2,name:'否'}],
    titleMenuList:[],//顶部菜单栏
    systemLeftMenuList:[],//系统菜单栏列表
    logmanageLeftMenuList:[],//日志管理菜单栏列表
    updatePortal:false,
    portalList:[],//portal列表
    hidePortalList:[],//隐藏的portal列表
    portalInfo:{
      id:null,
      width:null,
      heigh:null,
    }
  },
  mutations: {
    setUserId(state,data){
      state.userId=data
    },
    setUserName(state,data){
      state.userName=data
    },
    setSystemNameValue(state,data){
      state.systemNameValue=data
    },
    setTitleMenuList(state,data){
      state.titleMenuList=data
    },
    setSystemLeftMenuList(state,data){
      state.systemLeftMenuList=data
    },
    setLogmanageLeftMenuList(state,data){
      state.logmanageLeftMenuList=data
    },
    setUpdatePortal(state,data){
      state.updatePortal=data
    },
    setPortalList(state,data){
      state.portalList=data
    },
    setHidePortalList(state,data){
      state.hidePortalList=data
    },
    setPortalInfo(state,data){
      state.portalInfo.id = data.id
      state.portalInfo.width = data.width
      state.portalInfo.heigh = data.heigh
    }
  },
  actions: {
    editPortal({state,commit},param){
      let arr=state.portalList.map((item,i)=>{
        return {
          id:item.userPortletId,
          userId:state.userId,
          name:item.name,
          width:param.type==='X'&&param.userPortletId===item.userPortletId?Number(param.length.split('%')[0]):item.width,
          heigh:param.type==='Y'&&param.userPortletId===item.userPortletId?Number(param.length.split('px')[0]):item.heigh,
          sortOrder:item.sortOrder,
          valid:item.valid,
          isDisplay:item.isDisplay
        }
      })
      api.editPortal(arr)
    },
    async addPortal({state,commit},array){
      let arr=state.portalList.map((item,i)=>{
        return {
          id:item.userPortletId,
          userId:state.userId,
          name:item.name,
          width:item.width,
          heigh:item.heigh,
          sortOrder:item.sortOrder,
          valid:item.valid,
          isDisplay:array.includes(item.userPortletId)?1:item.isDisplay
        }
      })
      await api.editPortal(arr)
      commit('setUpdatePortal',true)
    },
  },
  modules: {
    indexmain,
    systemmanagement,
    logmanagement,
  },
  plugins: [createPersistedState({
    storage: window.sessionStorage
  })]
})
