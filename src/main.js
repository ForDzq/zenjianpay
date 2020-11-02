import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './api/index'
import './assets/iconfont/iconfont.css'
import 'mint-ui/lib/style.css'
// import 'vant/lib/index.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router
}).$mount('#app')
