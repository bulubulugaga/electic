import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
const store = new Vuex.Store({  
    state: {  
		logo: '../../static/images/logo_white.png',
		logo1: '../../static/images/logo.png',
        login: false, 
		sessionId: '', //唯一身份凭证
        avatarUrl: '',  
        userName: '',
		isVip: false,
		vipTime: '',
		opendId: '',
		ader: [],
		
		loading: false,
		isShowLogin: false,  //是否展示登录
		isShowLogin1: 0 ,
		
		url: 'https://api.cdhyzh.com/union/v1/',
		mapKey: 'GXGBZ-WA33K-LYKJ3-AJY4A-5LLTJ-KUBRD',  //地图key
		
		addrId: 1000000,  //地区id
    },  
    mutations: { 
		 //修改sessionId
		set(state,value) {
			state.sessionId = value;
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
		
		//修改vip
		setVip(state,value) {
			state.isVip = value;
		},
		
		//修改vip到期时间
		setVipTime(state,value) {
			state.vipTime = value;
		},
		
		//修改opendId
		setOpenId(state,value) {
			state.opendId = value;
		},
		
		//轮播图
		setAder(state,value) {
			state.ader = value;
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