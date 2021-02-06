<template>
	<!-- 修改用户名 -->
	<view class="content" @click="isWhy = false">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="wallet-header pr">
			<image src="../../static/images/wallet_h.png" mode=""></image>
			<view class="wallet-h-t pa flex-cover">
				<view class="txt-cen w">
					<view class="f30 white">未提现金额（元）</view>
					<view class="f70 white">
						{{allSa.toFixed(2)}}
					</view>
					<view class="white" @click.stop="isWhy = !isWhy">
						<text class="why in-block f24 circle">?</text>
						<text class="f24">未提现说明</text>
					</view>
					<view class="why-tip f24" v-show="isWhy" @click.stop>
						{{why}}
					</view>
				</view>
				<view class="txt-cen w">
					<view class="f30 white">可提现金额（元）</view>
					<view class="f70 white">{{couldSa.toFixed(2)}}</view>
				</view>
			</view>	
			
		</view>
		
		<!-- 内容 -->
		<view class="wallet-con txt-cen">
			<!-- <view class="f36 ccc">累计赚取金额：
				<text class="colorCon f48">{{salary}}</text>
				<text class="colorCon">元</text>
			</view> -->
			<button class="white bg-con" @click.stop="isDis1 = true">提现</button>
			<!-- <button class="white bg-con" @click.stop="this.isDis = true;this.tip = '暂未开通提现服务。';">提现</button> -->
		</view>
		
		<view class="f26 ccc mt30 txt-cen" @click.stop="toList">提现详情</view>
		
		<!-- 弹窗 -->
		<view class="submit-su txt-cen" v-show="isDis" @click="isDis = false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{tip}}</view>
				<button @click.stop="isDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>
		<view class="submit-su txt-cen" v-show="isDis1" @click="isDis1 = false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<input style="margin-top: 10rpx;" v-model="money" type="number" 
					placeholder="请输入提现金额" 
					placeholder-style="font-size: 28rpx;color: #ccc;" />
				<button @click.stop="cash()" class="white bg-con f28">确认</button>
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
				allSa: 0, //未体现金额
				fSa: 2,  //冻结金额
				couldSa: 0 , //可提取金额
				salary: 0  ,//累计赚取金额
				
				isWhy: false  ,//是否显示冻结原因
				
				money: '',  //提现金额
				
				isDis: false,
				tip: '',
				isDis1: false,
				logo: this.$store.state.logo
			}
		},
		computed: {
			why() {  //冻结原因
				if(this.fSa) {
					return '您有订单费用被冻结，如有疑问请联系客户。';
				}
				else {
					return '您的订单情况一切正常';
				}
			}
		},
		methods: { 
			isNull(data) { //判断是否为空
				if(data == null || data == '') {
					data = 0;
				}
				return Number(data);
			},
			getWallet() {  //获取钱包余额
				this.$listapi.walletSum(this.$store.state.sessionId).then(res => {
					this.allSa = this.isNull(res.data.collection[0].availableAmount + res.data.collection[0].frozenAmount);
					this.couldSa = this.isNull(res.data.collection[0].availableAmount);
					this.fSa = this.isNull(res.data.collection[0].frozenAmount);
				})
			},
			cash() { //提现
				this.isDis1 = false;
				if(this.money == '' || this.money < 0) {
					this.isDis = true;
					this.tip = '请正确输入提现金额';
				}
				else {
					this.$listapi.transfers(this.$store.state.sessionId,this.money).then(res => {
						this.isDis = true;
						if(res.data.code == 'success') {
							this.tip = '已提交提现申请，等待审核';
							// uni.reLaunch({
							// 	url: '/pages/user/wallet'
							// })
						}
						else {
							this.tip = res.data.message;
						}
					})
				}
				
				
			},
			toList() {
				//提现列表
				uni.navigateTo({
					url: '/pages/user/walletDetail'
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '我的钱包';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				_this.getWallet();
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			
			this.$over();
		}
	}
</script>

<style>
	page {
		background: white;
	}
	
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#3C94CF,#46A0DD) !important;
	}
	
	/* 头部 */
	.wallet-header image {
		width: 100%;
		height: 360rpx;
	}
	.wallet-h-t {
		top: 60rpx;
		width: 80%;
		left: 10%;
	}
	.f70 {
		font-size: 50rpx;
		margin-top: 20rpx;
	}
	.why {
		border: 1rpx solid #ddd;
		width: 30rpx;
		height: 30rpx;
		margin-right: 6rpx;
	}
	.why-tip {
		width: 230rpx;
		padding: 10rpx;
		background: white;
		color: #666;
		box-shadow: 1rpx 1rpx 10rpx rgba(100,100,100,.4);
		text-align: left;
		margin-top: 10rpx;
		margin-left: 20rpx;
	}
	
	/* 内容 */
	.wallet-con {
		margin-top: 60rpx;
	}
	.f36 {
		font-size: 36rpx;
	}
	.f48 {
		font-size: 48rpx;
	}
	.wallet-con button {
		width: 518rpx;
		height: 90rpx;
		line-height: 90rpx;
		border-radius: 100rpx;
		font-size: 36rpx;
		margin-top: 120rpx;
	}
	
	
	/* 弹窗 */
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
	.submit-su-con input {
		border-bottom: 2rpx solid #4DA8E4;
		margin-top: 27rpx;
	}
</style>
