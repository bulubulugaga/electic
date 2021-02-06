// 在main.js中注册全局组件
import loading from './components/loading/loading.vue'
import popup from './components/popup/popup.vue'
import store from './store/store.js'

//是否显示加载中 的方法 调用store中的mutations方法
function loadd(tf) {
	if (tf) {
		store.commit("switch_loading", tf)
	} else {
		store.commit("switch_loading")
	}
}
function anoLogin(value) {
	store.commit('setisShowLogin',value);
}

//封装uni.request
let baseURL = store.state.url;

function myRequest(options) {
	// loadd();
	return new Promise((res, rej) => {
		uni.request({
			url: baseURL + options.url,
			method: options.method || 'POST',
			data: options.data,
			success(data) {
				let num = Math.random(); //获取0-1之间的随机数
				let second = num * 2000; //0-2000随机毫秒数
				// setTimeout(function() {
					// loadd(false);
					
					if (data['statusCode'] == 200) {
						res(data)//异步成功之后执行的函数
					}
					else {
						res(data);
						if(data.data.message == "请重新登录" || data.data.message == "会话已过期") {
							anoLogin(true);
						}
						// wx.showToast({
						// 	title: data.data.message || '请求出错',
						// 	icon: 'none',
						// 	duration: 2000,
						// 	mask: true
						// })
						res(data);
					}
				// }, second);
			},
			fail(err) {
				// console.log(err);
				// rej()
				// wx.showToast({
				// 	title: err || '网络出错',
				// 	icon: 'none',
				// 	duration: 2000,
				// 	mask: true
				// })
				rej('网络出错');
			}
		})
	})
}

//登录
export const login = (code,name,ava) => myRequest({ 
	url: 'common/electrician-login.json',
	data: {
		code: code,
		name,
		photo: ava
	},
});

//注册
export const register = (se,data) => myRequest({ 
	url: 'common/'+se+'/electrician-register.json',
	data: data,
});

//获取订单类型
export const getBillState = (se)=>myRequest({ 
	url: 'electrician/'+se+'/getordertypelistelectrician.json',
	method: 'GET',
	data: {
		sessionId: se,
	}
});


//等待接单
export const waitOrder = (se) => myRequest({ 
	url: 'electrician/'+se+'/querwaitrecvdorderlist.json',
	
	method: 'GET',
	data: {
		page: 1,
		perPage: 99999
	}
});

//接单
export const order = (se,id)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/recvorder.json',
});

//获取订单
export const getBill = (se)=>myRequest({ 
	url: 'electrician/'+se+'/queryelectricianorderlist.json',
	method: 'GET',
	data: {
		page: 1,
		perPage: 99999
	}
});

//验证服务码
export const serCode = (se,id,code)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/'+code+'/servicecode.json',
});

//费用报价
export const serPrice = (se,id,fee,img)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/'+fee+'/modifyserverfee.json',
	data: [{
			id: img,
			sortIndex: 888
		}]
});

//确认订单
export const sureBill = (se,id,data)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/completeorder.json',
	data: data
});

//取消订单
export const quBill = (se,id,r)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'electriciancancleorder.json?reason=' + r
});

//获取未读消息
export const noneNews = (se,type,ad,data)=>myRequest({ 
	url: 'electrician/'+se+'/'+type+'/'+ad+'/electrician-noread-notice-details.json',
	method: 'GET'
});

//获取所有消息
export const allNews = (se,type,ad,data)=>myRequest({ 
	url: 'electrician/'+se+'/'+type+'/'+ad+'/electrician-all-notice-details.json',
	method: 'GET',
	data,
});

//获取证件
export const allCard = (se)=>myRequest({ 
	url: 'electrician/'+se+'/electrician-image-list.json',
	method: 'GET'
});

//電工列表
export const getEmList = (se)=>myRequest({ 
	url: 'electrician/'+se+'/elect-list.json',
	method: 'GET',
	data: {
		page: 1,
		perPage: 99999
	}
});

//添加电工图片
export const addCard = (se,data)=>myRequest({ 
	url: 'electrician/'+se+'/electrician-add-image.json',
	data
});

//修改电工图片
export const upCard = (se,id,newID)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/'+newID+'/electrician-modify-image.json'
});

//删除电工图片
export const delCard = (se,id)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/electrician-delete-image.json'
});

//修改用户名
export const upName = (se,name)=>myRequest({ 
	url: 'electrician/'+se+'/'+name+'/modify-electrician-name.json'
});

//评价列表
export const getRemark1 = (se,data)=>myRequest({ 
	url: 'electrician/'+se+'/elect-appraise-list.json',
	method: 'GET',
	data
});

//订单评价
export const getRemark = (se,id)=>myRequest({ 
	url: 'common/'+se+'/'+id+'/appraise-info.json',
	method: 'GET'
});

//获取技能列表
export const getSkill = (se)=>myRequest({ 
	url: 'electrician/'+se+'/electrician-expertise-list.json',
	method: 'GET'
});

//上传个人介绍
export const addSkill = (se,data)=>myRequest({ 
	url: 'electrician/'+se+'/electrician-edit-expertise.json',
	data,
});

//获取个人介绍
export const getIntro = (se)=>myRequest({ 
	url: 'electrician/'+se+'/electrician-expertise-info.json',
	method: 'GET'
});

//电工排行榜
export const getRanking = (se,st,et,data)=>myRequest({ 
	url: 'common/'+se+'/'+st+'/'+et+'/elect-best-list.json',
	method: 'GET',
	data
});

//上传图片
export const upImg = (remark, session) => {
	return new Promise((res, rej) => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], //从相册选择
			success: function(res1) {
				uni.uploadFile({
					url: baseURL + 'common/' + session + '/uploadFile.json',
					filePath: res1.tempFilePaths[0],
					name: 'file',
					formData: {
						remark: remark
					},
					success: (uploadFileRes) => {
						// console.log(uploadFileRes.data);
						res({data:JSON.parse(uploadFileRes.data),img:res1.tempFilePaths[0]});
					},
					fail(err) {
						console.log(err);
					}
				});
			}
		});
	})
}




//二期
//获取订单详情
export const getBillDetail = (se,id)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/electrician-query-order-info.json',
	method: 'GET'
});
//获取子级地区列表
export const getArea = (se,id)=>myRequest({ 
	url: 'common/'+se+'/'+id+'/child-area-list.json',
	method: 'GET'
});

//上传gps位置信息
export const uploadGPS = (se) => {
	uni.getLocation({ //发送位置
		type: 'gcj02',
		success: function(res) {
			let lat = res.latitude;
			let lon = res.longitude;
			return myRequest({ 
				url: 'electrician/'+se+'/'+lon+'/'+lat+'/update-electrician-gps.json'
			});
		},
	})
}

//查看用户是否是会员
export const getUserVip = (se,id)=>myRequest({ 
	url: 'electrician/'+se+'/'+id+'/get-order-custom-member.json',
	method: 'GET'
});

//上传地址
export const updateAd = (se,ad)=>myRequest({ 
	url: 'common/'+se+'/'+ad+'/update-areaInfo.json'
});

//提现
export const transfers = (se,amount)=>myRequest({ 
	url: 'electrician/'+se+'/pick-record-create.json',
	data: {
		amount,
		page: 1,
		perPage: 1
	}
});

//提现明细列表
export const transferDe = (se,data)=>myRequest({ 
	url: 'electrician/'+se+'/get-pick-list.json',
	data,
	method: 'GET'
});

//提现明细
export const getransferDe = (se,id)=>myRequest({ 
	url: 'electrician/'+se+ '/' + id + '/pick-record-info.json',
	method: 'GET'
});

//钱包明细
export const walletDetail = (se)=>myRequest({ 
	url: 'electrician/'+se+'/electrician-wallet-charge-detail.json',
	method: 'GET'
});

//钱包余额
export const walletSum = (se)=>myRequest({ 
	url: 'electrician/'+se+'/get-electrician-wallet.json',
	method: 'GET'
});

//收入明细
export const incomeDetail = (se,type,start,end)=>myRequest({ 
	url: 'electrician/'+se+'/'+type+'/'+start+'/'+end+'/get-electrician-fiter-wallet.json',
	method: 'GET'
});
