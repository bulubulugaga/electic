<script>
	import map from './static/map/qqmap-wx-jssdk.min.js'; //腾讯地图
	import * as ad from './common/getAdId.js';
	export default {
		onLaunch: function() {
			// console.log('App Launch')
			
		},
		onShow: function() {
			// console.log('App Show')
		},
		onHide: function() {
			// console.log('App Hide')
		},
		// 监听错误
		onError: function(err) {
			// 上报错误
			// swan.request({
			// 	url: "https://url", // 自行定义报告服务器
			// 	method: "POST",
			// 	errMsg: err
			// })
		},
		methods: {
			login(that) {
				let _this = that;
				let t = this;
				// console.log(this);
				// console.log(t);
				return new Promise((ress, rej) => {
					//第一授权获取用户信息===》按钮触发
					
					//判断是否授权
					uni.getUserInfo({
						provider: 'weixin',
						success: function(infoRes) {
							console.log('已授权');
							uni.checkSession({
								success() {
									console.log('已登录');
									// t.login1(_this);	
									if (!_this.$store.state.login) {
										// 1.wx获取登录用户code
							
										uni.login({
											provider: 'weixin',
											success: function(loginRes) {
												let code = loginRes.code;
							
												// console.log(code);
												//调用后端登录获取信息
												uni.getUserInfo({
													provider: 'weixin',
													success: function(infoRes) {
														// console.log(infoRes);
							
														//获取用户信息后向调用信息更新方法
														
														_this.$store.commit('setAva', infoRes.userInfo.avatarUrl);
							
														// 2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
														// _this.$listapi.login(code,infoRes.userInfo.nickName,infoRes.userInfo.avatarUrl).then(res => {
														_this.$listapi.login(code,infoRes.userInfo.nickName,infoRes.userInfo.avatarUrl).then(res => {
															let se = res.data.collection[0];
															// console.log(res);
							
															_this.$store.commit('set', se.sessionId); //存储身份凭证
															_this.$store.commit('setUsername', se.wxName);
															_this.$store.commit('setLogin', true);
															_this.$store.commit('setVip', se.isMember);
															_this.$store.commit('setVipTime', se.expiredAt);
															_this.$store.commit('setOpenId', se.wxOpenid);
															_this.$store.commit('setAder', se.adverts);
															
															
															//发送位置
															_this.$listapi.uploadGPS(se.sessionId);
															
															setInterval(() => {  
																_this.$listapi.uploadGPS(se.sessionId);
															}, 1800000)
															
															//获取地区id
															// ad.getLocation(_this).then(res => {
															// 	_this.$store.commit('setAd',res);
															// 	_this.$listapi.updateAd(se.sessionId,res).then(res1 => {
															// 		// console.log(res1);
																	
															// 		ress('ok');
															// 	})
															// });
															
															ress('ok');
															
														})
														
													},
													fail(err) {
														console.log(err);
													}
							
												});
											},
											fail(res) {
												wx.showToast({
													title: res.data.message || '请重新登录',
													icon: 'none',
													duration: 2000,
													mask: true
												})
											}
										})
									} 
									
									else {
										ress('isLogin');
									}
							
								},
								fail(err) {
									// wx.showToast({
									// 	title: err.errMsg || '请重新登录',
									// 	icon: 'none',
									// 	duration: 2000,
									// 	mask: true
									// })
									_this.$anoLogin(true);
									_this.$loading(false);
								}
							})
						},
						fail: function(err) {
							console.log('未授权');
							if(!_this.$store.state.isShowLogin1) {
								_this.$anoLogin(true);
							}
							_this.$loading(false);
						},
					})
					
				})
			}
			
		}

	}
</script>

<style>
	/*每个页面公共css */
	page {
		background-color: #F2F2F2;
		letter-spacing: 1rpx;
		/* font-family:Monospaced Number,Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif!important; */
	}

	.w-con {
		/*页面内容居中*/
		width: 94.93%;
		margin-left: 2.535%;
	}

	.w {
		width: 100%;
	}

	/* 字体 */
	.FB {
		font-weight: bold;
	}

	.f16 {
		font-size: 16rpx;
	}

	.f18 {
		font-size: 18rpx;
	}

	.f20 {
		font-size: 20rpx;
	}

	.f22 {
		font-size: 22rpx;
	}

	.f24 {
		font-size: 24rpx;
	}

	.f26 {
		font-size: 26rpx;
	}

	.f28 {
		font-size: 28rpx;
	}

	.f30 {
		font-size: 30rpx;
	}

	.f36 {
		font-size: 36rpx;
	}

	.f40 {
		font-size: 40rpx;
	}

	.f60 {
		font-size: 60rpx;
	}

	.txt-cen {
		text-align: center;
	}
	
	.txt-line-through {
		text-decoration: line-through;
	}

	/* 定位 */
	.pr {
		position: relative;
	}

	.pa {
		position: absolute;
	}

	.block {
		display: block;
	}

	.in-block {
		display: inline-block;
	}

	.flex {
		display: flex;
		display: -webkit-flex;
	}

	.flex-middle {
		/* 垂直居中 */
		display: flex;
		display: -webkit-flex;
		align-items: center;
	}

	.flex-center {
		/* 水平居中 */
		display: flex;
		display: -webkit-flex;
		justify-content: center;
	}

	.flex-MC {
		/* 居中 */
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: center;
	}

	.flex-cover {
		/* 平铺 */
		display: flex;
		display: -webkit-flex;
		justify-content: space-between;
	}


	/* 大小 */
	image.wh {
		width: 100%;
		height: 100%;
	}

	/* 边距 */
	.m10 {
		margin: 10rpx;
	}

	.ml-auto {
		margin-left: auto;
	}

	.mt10 {
		margin-top: 10rpx;
	}

	.mt15 {
		margin-top: 15rpx;
	}

	.mt20 {
		margin-top: 20rpx;
	}

	.mt30 {
		margin-top: 30rpx;
	}

	.mt40 {
		margin-top: 40rpx;
	}

	.mt50 {
		margin-top: 50rpx;
	}

	.ml10 {
		margin-left: 10rpx;
	}

	.ml15 {
		margin-left: 15rpx;
	}

	.ml20 {
		margin-left: 20rpx;
	}

	.mr15 {
		margin-right: 15rpx;
	}

	.mr30 {
		margin-right: 30rpx;
	}


	.p10 {
		padding: 10rpx;
	}

	.pt15 {
		padding-top: 15rpx;
	}

	.pb20 {
		padding-bottom: 20rpx;
	}

	.pl20 {
		padding-left: 20rpx;
	}

	.pl30 {
		padding-left: 30rpx;
	}

	.pr20 {
		padding-right: 20rpx;
	}

	.pr30 {
		padding-right: 30rpx;
	}



	/* 颜色 */
	.white {
		color: white;
	}

	.red {
		color: #fb6464;
	}

	.bg-white {
		background-color: white;
	}

	.colorCon {
		/* 页面常用绿色 */
		color: #31D8B6;
	}

	.bg-con {
		background-color: #31D8B6;
	}

	.c999 {
		color: #999;
	}
	.cf2 {
		color: #F2F2F2;
	}

	/* 圆角 */
	.circle {
		border-radius: 50%;
	}

	.border-r-20 {
		border-radius: 20rpx;
	}

	.hide {
		overflow: hidden;
	}

	/* checkbox样式 */
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		color: white;
		background: #31D8B6;
	}

	button {
		padding: 0 !important;
		border: none !important;
	}

	button::after {
		border: none !important;
	}
</style>
