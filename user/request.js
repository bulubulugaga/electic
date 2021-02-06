// 在main.js中注册全局组件
import loading from './components/loading/loading.vue'
import popup from './components/popup/popup.vue'
import store from './store/store.js'  

//是否显示加载中 的方法 调用store中的mutations方法
function loadd(tf){
    if(tf){
        store.commit("switch_loading",tf)
    }else{
        store.commit("switch_loading")
    }
}
function anoLogin(value) {
	store.commit('setisShowLogin',value);
}


//封装uni.request
let baseURL=store.state.url;
function myRequest(options){
	
	//loadd();
	
	return new Promise((resolve,reject)=>{
		uni.request({
			url: baseURL + options.url,
			method: options.method || 'POST',
			data: options.data || '',
			header: {
				'content-type': 'application/json'
			},			
			success(res) {
				let num = Math.random(); //获取0-1之间的随机数
				let second = num * 2000; //0-2000随机毫秒数
				//setTimeout(function (){
					//loadd(false);
				
					if (res['statusCode'] == 200) {
						resolve(res)//异步成功之后执行的函数
					}
					else {
						resolve(res);
						// console.log(res.data);
						if(res.data.message == "请重新登录" || res.data.message == "会话已过期") {
							anoLogin(true);
						}
						// wx.showToast({
						// 	title: res.data.message || '请求出错',
						// 	icon: 'none',
						// 	duration: 2000,
						// 	mask: true
						// })
						// reject(res.ErrorMsg);
					}
				//},second);
			},
			fail(err) {
				// setTimeout(function (){
					// loadd(false);
					// wx.showToast({
					// 	title: err || '网络出错',
					// 	icon: 'none',
					// 	duration: 2000,
					// 	mask: true
					// })
					reject('网络出错');
				// },2000)
			},
			complete(res) {
				// setTimeout(function (){
				// 	loadd(false);
				// },2000)
				// loadd(false);
			}
		})
	})
	
}
export default myRequest;