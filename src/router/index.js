import Router from 'vue-router'
import Vue  from 'vue'

import ScanPrescription from '../pages/ScanPrescription/ScanPrescription'
import PayResults from '../pages/PayResults/PayResults'
// import PayIframe from '../pages/PayIframe/PayIframe'
Vue.use(Router)

export default new Router ({
  // mode: 'history',
  routes: [{
    path: "*", // 其他没有的页面都重定向到 home页面去
    redirect: "/ScanPrescription"
    },{
    path: '/',
    redirect: '/ScanPrescription'
  },{
    path: '/ScanPrescription',
    name: 'ScanPrescription',
    component: ScanPrescription
  },{
    path: '/PayResults',
    name: 'PayResults',
    component: PayResults
  }]
})
// {
//   path: '/PayIframe',
//   name: 'PayIframe',
//   component: PayIframe
// }