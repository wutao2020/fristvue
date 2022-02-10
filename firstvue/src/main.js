import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import request from "./axios";
import iconPicker from 'e-icon-picker';
import "e-icon-picker/lib/symbol.js"; //基本彩色图标库
import 'e-icon-picker/lib/index.css'; // 基本样式，包含基本图标
import 'font-awesome/css/font-awesome.min.css'; //font-awesome 图标库
import 'element-ui/lib/theme-chalk/icon.css'; //element-ui 图标库
import $ from 'jquery'

window.$ = $
Vue.use(iconPicker, { eIcon: false, ElementUI: true, FontAwesome: true, eIconSymbol: true });
import global from './globalFun'
import fa from "element-ui/src/locale/lang/fa";
Vue.prototype.$axios = request
// main.js
//require('./mock.js');

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
