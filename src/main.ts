import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import axios from 'axios'

/*******引入全局css******/
import 'element-ui/lib/theme-chalk/index.css'
import '@/common/css/extra-el-ui.styl'
import router from './router'

Vue.config.productionTip = false
Vue.prototype.axios = axios
Vue.use(ElementUI)

/* eslint-disable no-new */
const app = new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
