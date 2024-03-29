import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import "@/icons/index.js" // icon
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '../statis/css/index.css';
import xss from 'xss'
// 定义全局XSS解决方法
Object.defineProperty(Vue.prototype, '$xss', {
    value: xss
})

Vue.config.productionTip = false

Vue.use(ElementUI);
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
