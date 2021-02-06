<template>
	<view class="submit-su txt-cen" v-if="isShowLogin" @click="isNoneShow()">
		<view class="submit-su-con bg-white border-r-20" @click.stop>
			<image class="circle hide bg-con" :src="logo" mode=""></image>
			<view class="f28">提示</view>
			
			<view v-if="isCanUse" class="f24">电工联盟申请您微信授权登录。</view>
			<view v-if="!isCanUse" class="f24">您还没有登录哦。</view>
			
			<view class="flex-cover">
				<button v-if="true" class="w white bg-con f28" @click="isNoneShow()">暂不登录</button>
				<button v-if="isCanUse" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" class="w white bg-con f28">授权登录</button>
				<button v-if="!isCanUse" class="w white bg-con f28" @click="isFirst()">登录</button>
			</view>
			
			
			<!-- <view class="flex-cover">
				<button v-if="!isCanUse" class="w white bg-con f28" @click="isNoneShow()">暂不登录</button>
				
			</view> -->
		</view>
	</view>
</template>

<script>
	import * as ad from '../../common/getAdId.js';
    export default {
        data() {
            return {
                logo: this.$store.state.logo,
				isCanUse: false , //是否授权
            };
        },
        methods:{
            setisShowLogin(){
                // this.$store.commit("switch_loading")
            },
			isNoneShow() {
				this.$store.commit("setisShowLogin",false);
			},
			//第一授权获取用户信息===》按钮触发
			isFirst() { //判断是否授权
				let _this = this;
				uni.getUserInfo({
					provider: 'weixin',
					success: function(infoRes) {
						_this.isCanUse = false;
						_this.login();
						_this.$store.commit("setisShowLogin",false);
						
					},
					fail: function(err) {
						_this.isCanUse = true;
					},
				});
			},
			bindGetUserInfo: function(e) {
				// console.log(e);
				let info = e.detail.userInfo;
				if (info) {
					//用户按了允许授权按钮
			
					this.login();
			
					this.isCanUse = false;
					this.$store.commit("setisShowLogin",false);
			
				} else {
					//用户按了拒绝按钮
				}
			},
			//登录
			login() {
			
				let _this = this;
				// 1.wx获取登录用户code
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						let code = loginRes.code;
						let name = '';
						let photo = '';
			
						//调用后端登录获取信息
						uni.getUserInfo({
							provider: 'weixin',
							success: function(infoRes) {
								// console.log(infoRes);
			
								//获取用户信息后向调用信息更新方法
								_this.$store.commit('setUsername', infoRes.userInfo.nickName);
								_this.$store.commit('setAva', infoRes.userInfo.avatarUrl);
			
								name = _this.name = _this.$store.state.userName;
								photo = _this.ava = _this.$store.state.avatarUrl;
			
								// 2.将用户登录code传递到后台置换用户SessionKey、OpenId等信息
								_this.$listapi.login(code, name, photo).then(res => {
									// console.log(name);
									let se = res.data.collection[0];
			
									_this.$store.commit('set', se.sessionId); //存储身份凭证
									_this.$store.commit('setLogin', true);
									_this.$store.commit('setVip', se.isMember);
									_this.$store.commit('setVipTime', se.expiredAt);
									_this.$store.commit('setOpenId', se.wxOpenid);
									_this.$store.commit('setAder', se.adverts);
									_this.ader = se.adverts;
									
									
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
											
									// 	})
									// });
									
									// setTimeout(function() {
										uni.reLaunch({
											url: '/pages/index/index'
										})
									// },1000);
									
									
			
								})
							},
							fail(err) {
								console.log(err);
							}
						});
			
					}
				});
			}
        },
        //实测直接在标签属性里写  $store.state.XX  拿不到数据  所以这里通过 计算属性去监听一下
        computed:{
            isShowLogin(){
                return this.$store.state.isShowLogin;
            }
        },
		onLoad() {
			// console.log('a');
		}
    }
</script>

<style>
	/* 登录提示 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 99999999;
	}
	
	.submit-su-con {
		width: 54.67%;
		height: 278rpx;
		margin: 0 auto;
		margin-top: 486rpx;
	}
	
	.submit-su-con {
		padding: 0 20rpx;
	}
	
	.submit-su-con image {
		width: 95rpx;
		height: 95rpx;
		margin-top: -47.5rpx;
	}
	
	.submit-su-con .f24 {
		color: #999;
		margin-top: 25rpx;
	}
	
	.submit-su-con button.w {
		width: 40%;
		height: 52rpx;
		line-height: 52rpx;
		border-radius: 52rpx;
		margin-top: 50rpx;
	}
</style>