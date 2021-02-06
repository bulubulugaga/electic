<template>
	<!-- 修改用户名 -->
	<view class="content" @click="isPower=false;isGrade=false;">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		<!-- 头部 -->
		<view class="vip-header">
			<view class="vip-header-bg"></view>
			<view class="vip-header-con bg-con flex-middle">
				<view class="vip-header-photo bg-white circle hide">
					<image class="wh" :src="ava"></image>
				</view>
				<view class="vip-header-text white">
					<text class="f36 FB">{{name}}</text>
					<text class="f24 mt15">{{headTip}}</text>
				</view>
			</view>
			
			<!-- power -->
			<view class="vip-power w-con">
				<view class="vip-power-line bg-con"></view>
				<view class="vip-power-title f30 txt-cen"><text class="bg-f2">VIP特权</text></view>
				<view class="vip-power-con w-con flex-center">
					<view class="vip-power-con-de vip-power-con-de1 txt-cen f24 pr">
						<!-- <view @click.stop="isGrade = !isGrade;isPower = false"> -->
						<view>
							<image src="../../static/images/vip01.png"></image><br>
							<text>积分获得</text>
						</view>
						<!-- <view v-show="isGrade">
							<view class="vip-power-detail pa">
								<image class="vip-grade-img" src="../../static/images/vip_grade.png" mode=""></image>
							</view>
							<view class="vip-power-detail vip-power-detail1 pa">
								<view class="f24 mt30 txt-left">
									开通电工联盟VIP将获得积分<br />
									赠送:<br />
									开通月卡获得{{grade[0]}}点积分<br />
									开通季卡获得{{grade[1]}}点积分<br />
									开通年卡获得{{grade[2]}}点积分

								</view>
							</view>
						</view> -->
					</view>
					<view class="vip-power-con-de txt-cen f24 pr">
						<!-- <view @click.stop="isPower = !isPower;isGrade = false"> -->
						<view>
							<image src="../../static/images/vip05.png"></image><br>
							<text>会员特权</text>
						</view>
						<!-- <view v-show="isPower">
							<view class="vip-power-detail pa">
								<image class="vip-power-img" src="../../static/images/vip_power.png" mode=""></image>
							</view>
							<view class="vip-power-detail vip-power-detail1 pa">
								<view class="f24 mt30 txt-left">{{vipIntro}}</view>
							</view>
						</view> -->
					</view>
				</view>
				<view class="f26 mt30">
					<view>积分获得：开通电工联盟VIP将获得积分<br />
						  <text class="cf2">积分获得：</text>开通月卡获得{{grade[0]}}点积分<br />
						  <text class="cf2">积分获得：</text>开通季卡获得{{grade[1]}}点积分<br />
						  <text class="cf2">积分获得：</text>开通年卡获得{{grade[2]}}点积分</view>
					<view>特权说明：{{vipIntro}}</view>
				</view>
			</view>
			
		</view>
		
		<!-- 空格 -->
		<view class="blank">
			
		</view>
		
		<!-- 内容 -->
		<view class="vip-con mt20">
			<view class="w-con">
				<text class="f30">充值电盟会员</text>
				<view class="vip-con-de flex-cover">
					<view class="vip-con-de-item f36 txt-cen mt20" :class="{cur:item.active}" v-for="(item,index) in vip" 
						:key="index" @click="chooseVip(index)">
						<text class="in-block colorCon">￥{{item.price}}</text><br>
						<text class="in-block mt20">{{item.title}}</text>
					</view>
				</view>
				<button class="white bg-con f36" @click="payShow = true">{{btn}}</button>
				<view class="radio colorCon flex f28">
					<radio @click="isCheck = !isCheck" :checked="isCheck" color="#31D8B6"></radio><text>{{xu}}</text>
				</view>
			</view>
		</view>
		
		<!-- 开通弹窗 -->
		<view class="submit-su txt-cen" v-show="isDis" @click="isDis = false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{isDisTip}}</view>
				<button @click.stop="isDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<van-popup :show="payShow" closeable position="bottom"
		  custom-style="height: 20%" @close="payShow=false" round=true>
			<view class="pay-choose">
				<view @click="becomeVip(2)">账户余额支付</view>
				<view @click="becomeVip(1)">微信支付</view>
			</view>
		</van-popup>
		
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				logo: '',
				isDis: false,
				isDisTip: '',
				
				isPower: false, //是否显示会员特权内容
				isGrade: false, //是否显示积分获得内容
				
				name: '',
				ava: '', //
				vip: [ //充值类别
					{title: '电盟月卡',price: 0,active: true},
					{title: '电盟季卡',price: 0,active: false},
					{title: '电盟年卡',price: 0,active: false}
				],
				index: 0,
				grade: [0,0,0],  //积分显示
				
				payShow: false,  //显示支付方式
				isCheck: false, //是否选择
				xu: '开通自动续费'  ,//按钮下单选框
				// xu: '关闭自动续费'
				vipIntro: '',  //特权说明
			}
		},
		computed: {
			headTip() { //是否开通会员描述
				if(this.$store.state.isVip) {
					return '会员到期时间：' + this.$store.state.vipTime.split('T')[0];
				}
				else {
					return '开通电盟会员，享受更多优惠';
				}
			},
			btn() {
				if(this.$store.state.isVip) {
					return '立即续费';
				}
				else {
					return '立即开通';
				}
			}
		},
		watch: {
			grade(e) {
				console.log(e);
			}
		},
		methods: {
			getMsg() {
				this.$listapi.getVipMo(this.$store.state.sessionId,1).then(res => {
					this.vip[0].price = res.data.collection[0];
				})
				this.$listapi.getVipMo(this.$store.state.sessionId,2).then(res => {
					this.vip[1].price = res.data.collection[0];
				})
				this.$listapi.getVipMo(this.$store.state.sessionId,3).then(res => {
					this.vip[2].price = res.data.collection[0];
				})
				this.$listapi.getVipGrade(this.$store.state.sessionId,1).then(res => {
					this.grade[0] = res.data.collection[0];
				})
				this.$listapi.getVipGrade(this.$store.state.sessionId,2).then(res => {
					this.grade[1] = res.data.collection[0];
				})
				this.$listapi.getVipGrade(this.$store.state.sessionId,3).then(res => {
					this.grade[2] = res.data.collection[0];
				})
			},
			chooseVip(index) { //选择某类电盟卡
				this.vip.forEach(item=>{
					item.active = false;
				})
				this.vip[index].active = true;
				this.index = index;
			},
			becomeVip(payment) {
				if(!this.$store.state.login) {
					this.isDisTip = '您还没有登录。';
					this.payShow = false;
					this.isDis = true;
				}
				else {
					let type = this.index + 1;
					let memberAutoCharg = 0;
					if(this.isCheck) {
						memberAutoCharg = 1;
					}
					let data = {
						payment,
						type,
						memberAutoCharg
					}
					
					console.log(data);
					
					this.$listapi.payVip(this.$store.state.sessionId,data).then(res => {
						let _this = this;
						this.payShow = false;
						_this.$loading(true);
						setTimeout(() => {
							_this.$loading(false);
							if(payment != 1) {
								_this.isDis = true;
								if(res.data.code == 'success') {
									_this.isDisTip = '账户余额支付成功。';
									this.getTime();
								}
								else {
									_this.isDisTip = res.data.message;
								}
							}
							else {
								this.getTime();
							}
						},1000)
						
					})
				}				
				
			},
			getTime() {
				let _this = this;
				this.$listapi.getVipTime(this.$store.state.sessionId).then(res =>{
					if(res.data.code == 'success') {
						_this.$store.commit('setVip', true);
						_this.$store.commit('setVipTime', res.data.collection[0]);
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 前一个页面
						beforePage.onLoad();
					}
				})
			},
			getVipIntro() {
				this.$listapi.getVipIntro(this.$store.state.sessionId).then(res =>{
					this.vipIntro = res.data.collection[0].tips;
					
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {
			
			this.$refs.son.a = '会员中心';  //修改navigatorBarText
			this.logo = this.$store.state.logo;
			
			this.$loading(false);
			this.$loading(true);
			let app = getApp();
			let _this = this;
			app.login(this).then(res => {
				this.ava = this.$store.state.avatarUrl;
				this.name = this.$store.state.userName;
				this.getMsg();
				this.getTime();
				this.getVipIntro();
				this.$loading(false);
			});
			this.$over();
		}
	}
</script>

<style>
	page {
		background: #F2F2F2;
	}
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#23d5b1,#20CCA9) !important;
	}
	
	/* 头部 */
	.vip-header {
		padding-bottom: 48rpx;
	}
	.vip-header-bg {
		height: 170rpx;
		background: linear-gradient(to bottom,#20CCA9,#1CC09E);
	}
	.vip-header-con {
		width: 89.6%;
		height: 228rpx;
		margin: -93rpx auto 0;
		box-shadow: 0.01rpx 0.01rpx 10rpx rgba(0,0,0,.15),
					-0.01rpx -0.01rpx 10rpx rgba(0,0,0,.15);
	}
	.vip-header-photo {
		width: 112rpx;
		height: 112rpx;
		margin-left: 40rpx;
		margin-right: 30rpx;
	}
	.vip-header-text text {
		display: block;
	}
	/* 特权 */
	.vip-power-line {
		height: 1rpx;
		width: 306rpx;
		margin: 46rpx auto 0;
	}
	.vip-power-title {
		margin-top: -23rpx;
	}
	.vip-power-title text {
		display: inline-block;
		padding: 0 15rpx;
	}
	.bg-f2 {
		background-color: #F2F2F2;
	}
	.vip-power-con {
		margin-top: 39rpx;
	}
	.vip-power-con-de1 {
		margin-right: 100rpx;
	}
	.vip-power-con-de image {
		width: 70rpx;
		height: 70rpx;
	}
	.vip-power-detail {
		top: 114rpx;
		left: -128%;
		width: 356rpx;
		height: 146rpx;
	}
	.vip-power-detail1 {
		box-sizing: border-box;
		padding: 0 15rpx;
	}
	.vip-power-con-de image.vip-power-img {
		width: 356rpx;
		height: 146rpx;
	}
	.vip-power-con-de image.vip-grade-img {
		width: 356rpx;
		height: 210rpx;
	}
	.txt-left {
		text-align: left;
	}
	
	/* 空格 */
	.blank {
		height: 20rpx;
		background: #DFDFDF;
	}
	
	/* 开通vip */
	
	.vip-con-de-item {
		width: 198rpx;
		height: 185rpx;
		border: 1rpx solid #31D8B6;
		border-radius: 18rpx;
		padding-top: 45rpx;
	}
	.vip-con-de-item.cur {
		background: #31D8B6;
	}
	.vip-con-de-item.cur>text{
		color: white;
	}
	.vip-con button {
		width: 390rpx;
		height: 80rpx;
		line-height: 80rpx;
		border-radius: 80rpx;
		margin-top: 80rpx;
	}
	.vip-con .radio {
		margin-top: 20rpx;
		justify-content: center;
	}
	.vip-con .radio radio {
		transform:scale(0.7);
	}
	.vip-con .radio text {
		display: inline-block;
		margin-top: 5rpx;
	}
	
	/* 取消订单弹窗 */
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
	
	/* 支付选择 */
	.pay-choose {
		padding: 60rpx 40rpx 40rpx;
	}
	.pay-choose>view {
		font-size: 30rpx;
		line-height: 80rpx;
		border-bottom: 1rpx solid #e7e7e7;
		text-align: center;
	}
	.pay-choose>view:last-child {
		border: none;
	}
</style>
