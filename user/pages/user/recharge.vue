<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 充值 -->
		<view class="rech-con w-con">
			<!-- 充值方式 -->
			<view class="rech-mode flex-cover bg-white mt17 border-r-20">
				<view class="f30 flex-middle pl20">充值方式：</view>
				<view class="flex-middle">
					<image class="wx" src="../../static/images/wx.png" mode=""></image>
					<text class="f24 c999 pr20">微信充值</text>
					<!-- <image class="more pr20" src="../../static/images/rech.png" mode=""></image> -->
				</view>
			</view>
			
			<!-- 充值金额 -->
			<view class="rech-sa bg-white mt17 border-r-20">
				<text class="f30">充值金额：</text>
				<label class="in-block flex">￥<input type="digit" value="" v-model="charge" /></label>
			</view>
			
			<button class="white bg-con mt17 f36 border-r-20" @click="submit()">确认充值</button>
			
		</view>
		
		<!-- 开通弹窗 -->
		<view class="submit-su txt-cen" v-show="isDis" @click="isDis = false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{tip}}</view>
				<button @click.stop="isDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	
	export default {
		data() {
			return {
				logo: '',
				charge: ''  ,//输入的充值金额
				isDis: false,
				
				tip: ''
			}
		},
		methods: {
			submit() { //确认充值
			    if(!this.$store.state.login) {
					this.tip = '您还没有登录。';
					this.isDis = true;
				}
				else {
					if(this.charge == '' || this.charge == 0) {
						this.tip = '请输入充值金额';
						this.isDis = true;
					}
					else {
						let data = {
							fee: this.charge,
							payment: 1
						}
						this.$listapi.payRecharge(this.$store.state.sessionId,data).then(res => {
							let pages = getCurrentPages(); // 当前页面
							let beforePage = pages[pages.length - 2]; // 前一个页面
							beforePage.onLoad({key:'user'});
						})
					}
				}								
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '余额充值';  //修改navigatorBarText
			
			this.$loading(false);
			this.logo = this.$store.state.logo
		}
	}
</script>

<style>
	.mt17 {
		margin-top: 17rpx;
	}
	.rech-mode {
		height: 72rpx;
	}
	.rech-mode .wx {
		width: 50rpx;
		height: 40rpx;
		margin-right: 15rpx;
	}
	.rech-mode .more {
		width: 16rpx;
		height: 28rpx;
		margin-left: 15rpx;
	}
	/* 充值 */
	.rech-sa {
		padding: 10rpx 20rpx 30rpx;
	}
	.rech-sa label {
		font-size: 48rpx;
		border-bottom: 1rpx solid #E6E6E6;
		padding: 26rpx 0 5rpx;
	}
	.rech-sa label input {
		width: 88%;
		height: 60rpx;
	}
	
	.rech-con button {
		height: 70rpx;
		line-height: 70rpx;
	}
	
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 1;
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
	
	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 57rpx;
		margin-top: 50rpx;
	}
</style>
