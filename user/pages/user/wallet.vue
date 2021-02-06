<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		<!-- 头部 -->
		<view class="wa-header bg-white">
			<!-- 余额 -->
			<!-- <view class="balance txt-cen white">
				<text class="f30">钱包总余额（元）</text><br>
				<text class="f60">￥&nbsp;{{ba}}</text>
			</view> -->
			<!-- 白框 -->
			<view class="wa-h-more flex-center">
				<view class="wa-h-more-l txt-cen">
					<view class="f30 c999 mt30">钱包总余额（元）</view>
					<view class="f60">{{salary}}</view>
					<!-- <button class="f28 colorCon">提现</button> -->
				</view>
				<!-- <view class="wa-h-more-r txt-cen">
					<text class="f24 c999">电盟积分</text><br>
					<view class="flex">
						<image src="../../static/images/wa_in.png" mode=""></image>
						<text class="in-block f36 colorCon mt20">{{integral}}</text>
					</view>
				</view> -->
			</view>
			
			<!-- 白框阴影 -->
			<view class="wa-blank1"></view>
			<view class="wa-blank2"></view>
						
		</view>
		
		
		<!-- 充值 -->
		<view class="wa-con mt50 txt-cen">
			<button class="white bg-con border-r-20 f36" @click="toRecharge()">充值</button>
			<text class="f28 c999" @click="toReDetail()">流水明细</text>
		</view>
		
		<!-- 开通弹窗 -->
		<view class="submit-su txt-cen" v-show="isDis" @click="isDis = false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">暂未开通提现服务。</view>
				<button @click.stop="isDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<popup></popup>
		<loading></loading>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				logo: '',
				ba: 0 , //余额
				salary: 0, //可提现金额
				integral: 10, //电盟积分
				
				isDis: false
			}
		},
		methods: {
			toRecharge() { //充值
				uni.navigateTo({
				    url: './recharge'
				});
			},
			toReDetail() { //充值明细
				uni.navigateTo({
				    url: './reDetail'
				});			
			},
			getWalletSum() {
				this.$listapi.getWalletSum(this.$store.state.sessionId).then(res=> {
					this.salary = Number(res.data.collection[0].cash).toFixed(2);
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '钱包';  //修改navigatorBarText
			this.logo = this.$store.state.logo;
			
			
			this.$loading(false);
			let app = getApp();
			let _this = this;			
			this.$loading(true);
			app.login(this).then(res => {
				setTimeout(function(){
					_this.getWalletSum();
					_this.$loading(false);
				},800);
			});
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#23d5b1,#22D0AD) !important;
	}
	
	/* 头部 */
	.wa-header {
		position: relative;
		height: 366rpx;
		background: linear-gradient(to bottom,#22D0AD,#1CC09E);
		border-bottom-left-radius: 50rpx;
		border-bottom-right-radius: 50rpx;
		padding-top: 50rpx;
	}
	.wa-h-more,.wa-blank2,.wa-blank1 {
		position: absolute;
		width: 65.7%;
		height: 215rpx;
		bottom: 100rpx;
		left: 7.735%;
		background: white; 
		border-radius: 15rpx;
		z-index: 3;
	}
	.wa-h-more-l {
		line-height: 48rpx;
	}
	.wa-h-more-l .f60 {
		margin: 20rpx 0;
	}
	.wa-h-more {
		/* padding: 8rpx 9.4%; */
		padding: 8rpx 9.4%;
		height: 200rpx;
	}
	.wa-blank1 {
		width: 80%;
		bottom: 110rpx;
		left: 10%;
		opacity: 0.4;
		z-index: 2;
	}
	.wa-blank2 {
		width: 74%;
		bottom: 120rpx;
		left: 13%;
		opacity: 0.3;
		z-index: 1;
	}	
	.wa-h-more button {
		height: 40rpx;
		line-height: 36rpx;
		border-radius: 40rpx;
		border: 1rpx solid #31D8B6;
		background: none;
		margin-top: 7rpx;
	}
	.wa-h-more-r image {
		width: 30rpx;
		height: 40rpx;
		margin: 27rpx 20rpx 0 0;
	}
	
	/* 充值 */
	.wa-con button {
		width: 73.33%;
		height: 85rpx;
		line-height: 85rpx;
		margin-bottom: 10rpx;
	}
	
	/* 取消订单弹窗 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 999;
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
