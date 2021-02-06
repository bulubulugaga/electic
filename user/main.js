import Vue from 'vue'
import App from './App'

//引入vuex仓库
import store from './store/store.js'  
Vue.prototype.$store = store  

//调用封装接口
import myRequest from './request.js'
Vue.prototype.$myRequest = myRequest

//调用api(api 身上有很多的方法，那个api.js所有的方法都在listapi上)
import * as listapi from './api.js';
//挂载到原型上
Vue.prototype.$listapi=listapi;


// 在main.js中注册全局组件
import loading from './components/loading/loading.vue'
//是否显示加载中 的方法 调用store中的mutations方法
function loadd(tf){
     store.commit("switch_loading",tf)
}
Vue.prototype.$loading = loadd;
function overTime() {  //超时加载
	setTimeout(function(){
		if(store.state.loading){
			// uni.showToast({
			// 	title: '加载失败，请稍后再试。',
			// 	icon: 'none',
			// 	duration: 2000
			// });
			loadd(false);
		}
	},10000);
}
Vue.prototype.$over = overTime;


import popup from './components/popup/popup.vue'
function anoLogin(value) {
	store.commit('setisShowLogin',value);
}
Vue.prototype.$anoLogin = anoLogin;



Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
	store,
	myRequest
})
app.$mount()
