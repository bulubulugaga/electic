import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({  
    state: {  
		logo: '../../static/images/logo_white.png',
		logo1: '../../static/images/logo.png',
        login: false, 
		sessionId: '11', //唯一身份凭证
        avatarUrl: '',  
        userName: ''  ,
		id: '',
		
		loading: false,
		info: {},
		isShowLogin: false,  //是否展示登录
		isShowLogin1: 0,
		
		url: 'https://api.cdhyzh.com/union/v1/',
		mapKey: 'GXGBZ-WA33K-LYKJ3-AJY4A-5LLTJ-KUBRD',  //地图key,
		
		addrId: 1000000,  //地区id
    },  
    mutations: {
    	 //修改sessionId
    	set(state,value) { 
    		state.sessionId = value;
    	},
		
		//存储信息  
		setInfo(state,value) {
			state.info = value;
		},
		
		//修改Id
		setId(state,value) { 
			state.id = value;
		},
    	
    	//修改用户信息
    	setUsername(state,value) {
    		state.userName = value;
    	},
    	setAva(state,value) {
    		state.avatarUrl = value;
    	},
    	
    	//修改登录信息
    	setLogin(state,value) {
    		state.login = value;
    	},
		
		//修改登录信息
		setisShowLogin(state,value) {
			if(value) {
				state.isShowLogin1 = 1;
			}
			state.isShowLogin = value;
		},
    	
    	
    	//tf作为主动控制的参数
    	switch_loading(state,tf){
    		state.loading = tf;
    	},
		
		//修改地区id
		setAd(state,value) {
			state.addrId = value;
		}
    } 
})  
export default store