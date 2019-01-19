// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
//兼容到 ie9
import 'babel-polyfill'
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import api from '@/utils/api'
import store from '@/vuex/store'
// 引入echarts
import echarts from 'echarts'

//兼容到 ie9 版本 解决es6 的新特性，比如说 Number 对象的 parseInt 和 parseFloat 方法
if(Number.parseInt===undefined) Number.parseInt=window.parseInt
if(Number.parseFloat===undefined) Number.parseInt=window.parseFloat

Vue.prototype.$echarts = echarts 

// import VueAxios from 'vue-axios'
// import Qs from 'qs'

// Vue.use(VueAxios, api)

Vue.config.productionTip = false
Vue.use(ElementUI)


Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
/* eslint-disable no-new */

new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
