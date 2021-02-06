//封装api

import myRequest from './request.js'
import store from './store/store.js'

//登录
export const login = (code,name,photo)=>myRequest({ 
	url: 'common/client-login.json',
	data: {
		code: code,
		name,
		photo
	},
});


//获取订单类型
export const getBillState = (se)=>myRequest({ 
	url: 'customer/'+se+'/getordertypelist.json',
	method: 'GET',
	data: {
		sessionId: se,
	}
});

//下单
export const order = (se,data)=>myRequest({ 
	url: 'customer/'+se+'/createorder.json',
	data: data
});

export const emMsg = (se,id)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'/electinfo.json',
	method: 'GET'
});

//电工列表
export const getEm = (se)=>myRequest({ 
	url: 'customer/'+se+'/elect-list.json',
	method: 'GET',
	data: {
		name: '',
		page: 1,
		perPage: 999999
	}
});

//获取订单列表
export const getBill = (se)=>myRequest({ 
	url: 'customer/'+se+'/quercustomorderlist.json',
	method: 'GET',
	data: {
		sessionId: se,
		page: 1,
		perPage: 999999
	}
});

//订单详情
export const getBillD = (se,id)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'/custom-query-order-info.json',
	method: 'GET'
});


//获取地址列表
export const getAdderss = (se)=>myRequest({ 
	url: 'customer/'+se+'/getaddress.json',
	method: 'GET',
	data: {
		sessionId: se,
	}
});

//增加地址
export const addAdderss = (se,data)=>myRequest({ 
	url: 'customer/'+se+'/createaddress.json',
	data: data,
});

//修改地址
export const upAdderss = (se,id,data)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'/modify-address.json',
	data: data,
});

//删除地址
export const delAdderss = (se,ad)=>myRequest({ 
	url: 'customer/'+se+'/'+ad+'/deladdress.json',
});

//评价订单
export const reBill = (se,id,data)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'appraiseorder.json',
	data
});

//获取电工评价
export const getRemark = (se,emId)=>myRequest({ 
	url: 'customer/'+se+'/'+emId+'/elect-appraise-list.json',
	method: 'GET',
	data: {
		page: 1,
		perPage: 100
	}
});

//获取订单评价
export const getRemark1 = (se,orId)=>myRequest({ 
	url: 'common/'+se+'/'+orId+'/appraise-info.json',
	method: 'GET'
});

//取消订单
export const celBill = (se,id,r)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'cancleorder.json?reason=' + r,
	data: {
		reason: r
	}
});

//获取未读消息
export const noneNews = (se,type,ad,data)=>myRequest({ 
	url: 'customer/'+se+'/'+type+'/'+ad+'/custom-noread-notice-details.json',
	method: 'GET'
});

//获取所有消息
export const allNews = (se,type,ad,data)=>myRequest({ 
	url: 'customer/'+se+'/'+type+'/'+ad+'/custom-all-notice-details.json',
	method: 'GET',
	data
});

//设置消息已读
export const setRead = (se,id)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'/custom-set-notice-read-state.json'
});

//删除消息
export const delNews = (se,id)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'/custom-delete-notice.json'
});

//意见反馈
export const addIdea = (se,data)=>myRequest({ 
	url: 'common/'+se+'/add-advise.json',
	data
});

//获取订单协议
export const getAgreement = (se)=>myRequest({ 
	url: 'common/'+se+'/agreement-list.json',
	method: 'GET'
});

//支付下单
export const orderPay = (se,data)=>myRequest({ 
	url: 'customer/'+se+'/pay/unified-order.json',
	data
});

//帮助列表
export const getHelp = (se)=>myRequest({ 
	url: 'common/'+se+'/helper-list.json',
	method: 'GET',
	data: {
		page: 1,
		perPage: 99999
	}
});

//修改用户名
export const upName = (se,name)=>myRequest({ 
	url: 'customer/'+se+'/'+name+'/modify-customer-name.json'
});

//获取上门费
export const getDoor = (se,areaId)=>myRequest({ 
	url: 'common/'+se+'/'+areaId+'/door-fee-no-null.json',
	method: 'GET'
});

//上传图片
export const upImg = (remark, session) => {
	return new Promise((res, rej) => {
		uni.chooseImage({
			count: 1, //默认9
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], //从相册选择
			success: function(res1) {
				// console.log(res1);
				uni.uploadFile({
					url: store.state.url + 'common/' + session + '/uploadFile.json',
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


//上传多图
export const upImg2 = (remark, session,count) => {
	return new Promise((res, rej) => {
		uni.chooseImage({
			count, //默认9
			sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
			sourceType: ['album', 'camera'], //从相册选择
			success: function(res1) {
				let imgPath = res1.tempFilePaths;
				let imgs = [];
				for(let i in imgPath) {
					
					uni.uploadFile({
						url: store.state.url + 'common/' + session + '/uploadFile.json',
						filePath: res1.tempFilePaths[i],
						name: 'file',
						formData: {
							remark: remark
						},
						success: (uploadFileRes) => {
							imgs.push(JSON.parse(uploadFileRes.data).collection[0]);
							
							if(i == imgPath.length-1) {
								res({imgId: imgs,img:imgPath,is:true});
							}
						},
						fail(err) {
							console.log(err);
						}
					}); 
				}
				
			}
		});
	})
}



//二期
//获取优惠卷列表
export const getCoupon = (se,data)=>myRequest({ 
	url: 'customer/'+se+'/get-coupon-list.json',
	data,
	method: 'GET'
});

//使用优惠卷
export const useCoupon = (se,id)=>myRequest({ 
	url: 'customer/'+se+'/'+id+'/use-customer-coupon.json'
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
				url: 'customer/'+se+'/'+lon+'/'+lat+'/update-customer-gps.json'
			});
		},
	})
}

//支付
function pay(res) {
	return new Promise((resolve,reject) => {
		let data = res.data.collection[0];
		uni.requestPayment({
			timeStamp: data.unifiedOrder.timeStamp,
			nonceStr: data.unifiedOrder.nonceStr,
			package: data.unifiedOrder.package,
			signType: data.unifiedOrder.signType,
			paySign: data.unifiedOrder.paySign,
			success: function (res) {
					resolve('success')
			},
			fail: function (err) {
				// uni.showToast({
				// 	title: err.errMsg,
				// 	icon: 'none',
				// 	duration: 1200
				// })
			}
		});
	})
}

//支付订单
export const unOrder = (se, data) => {
	return new Promise((resolve,reject) => {
		myRequest({
			url: 'customer/'+se+'/pay/unified-order.json',
			data,
		}).then(res => {
			if(data.payment == 1) {
				pay(res).then(res1 => {
					resolve(res1);
				})
			}
			else {
				resolve(res);
			}
		})
	})
}

//购买会员
export const payVip = (se,data)=> { 
	return new Promise((resolve,reject) => {
		myRequest({
			url: 'customer/'+se+'/pay/pay-vip-member.json',
			data
		}).then(res => {
			if(data.payment == 1) {
				pay(res).then(res1 => {
					resolve(res1);
				})
			}
			else {
				resolve(res);
			}
		})
	})
};

//充值
export const payRecharge = (se,data)=> { 
	return new Promise((resolve,reject) => {
		myRequest({
			url: 'customer/'+se+'/pay/customer-recharge.json',
			data
		}).then(res => {
			pay(res).then(res1 => {
				resolve(res1);
			})
		})
	})
};

//上传地址
export const updateAd = (se,ad)=>myRequest({ 
	url: 'common/'+se+'/'+ad+'/update-areaInfo.json'
});

//积分明细
export const getGrade = (se,data)=>myRequest({ 
	url: 'customer/'+se+'/customer-ship-detail.json',
	data,
	method: 'GET'
});

//钱包明细
export const getWallet = (se,data)=>myRequest({ 
	url: 'customer/'+se+'/customer-wallet-charge-detail.json',
	data,
	method: 'GET'
});

//获取会员到期时间
export const getVipTime = (se)=>myRequest({ 
	url: 'customer/'+se+'/get-customer-vip-time.json',
	method: 'GET'
});

//获取钱包余额
export const getWalletSum = (se)=>myRequest({ 
	url: 'customer/'+se+'/get-customer-wallet.json',
	method: 'GET'
});

//获取积分
export const getGradeSum = (se)=>myRequest({ 
	url: 'customer/'+se+'/get-customer-ship.json',
	method: 'GET'
});

//获取会员费用
export const getVipMo = (se,type)=>myRequest({ 
	url: 'customer/'+se+'/'+type+'/get-custom-vip-fee-config.json',
	method: 'GET'
});

//获取会员积分
export const getVipGrade = (se,type)=>myRequest({ 
	url: 'customer/'+se+'/'+type+'/get-custom-vip-ship-config.json',
	method: 'GET'
});

//获取评价积分
export const getRemarkGrade = (se)=>myRequest({ 
	url: 'customer/'+se+'/get-custom-order-ship-config.json',
	method: 'GET'
});

//获取积分抵扣规则
export const getGradeRule = (se)=>myRequest({ 
	url: 'customer/'+se+'/get-custom-deduc-ship-config.json',
	method: 'GET'
});

//积分抵扣
export const getGradek = (se, data)=>myRequest({ 
	url: 'customer/'+se+'/order-ship-purpose.json',
	data,
	method: 'GET'
});

//特权说明
export const getVipIntro = (se, data)=>myRequest({ 
	url: 'customer/'+se+'/get-custom-vip-explain-config.json',
	method: 'GET'
});