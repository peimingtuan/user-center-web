import 'babel-polyfill'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
require("./assets/css/style.less")
import './ui/element-ui'
import './util/echats-resize.js'
import './assets/js/parent-message.js'
//import './mock/index.js'
import {successMsg,errorMsg,warningMsg,openLoading, closeLoading} from './ui'
Vue.config.productionTip = false
Vue.prototype.$msgS=successMsg
Vue.prototype.$msgE=errorMsg
Vue.prototype.$msgW=warningMsg
Vue.prototype.$openLoading=openLoading
Vue.prototype.$closeLoading=closeLoading

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
