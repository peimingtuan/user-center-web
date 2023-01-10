import Vue from 'vue'
import VueRouter from 'vue-router'
import { routes } from './routes'
import store from '@/store'
Vue.use(VueRouter)

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.meta.requireAuth){
    if(store.state.userId){
      next()
    }else{
      if(sessionStorage.getItem('loginType')){
        if(sessionStorage.getItem('loginType')==1){
          next({path:'/Login'})
        }else{
          next({path:'/IntranetLogin'})
        }
      }else{
        next({path:'/IntranetLogin'})
      }
    }
  }else{
    next()
  }
})
export default router
