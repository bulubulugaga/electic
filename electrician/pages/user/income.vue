<template>
	<!-- 修改用户名 -->
	<view class="content" @click="currentIndex = -1">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="income-h txt-cen white">
			<view class="f30">今日收入（元）</view>
			<view class="f48">{{sunSa}}</view>
		</view>
		
		<!-- 内容 -->
		<view class="tobill-con-de mt15 bg-white border-r-20 w-con" v-for="(item,index) in bill" :key="index" @click="toDetail(item.orderId)">
			<view class="flex">
				<view class="flex-middle">
					<view class="tobill-con-type f28 colorCon FB">{{item.bill.type}}</view>
					<view v-if="item.feeType == 0" class="f26 c999 ml10 flex-middle" style="margin-top: 0;">上门费</view>
					<view v-else class="f26 c999 ml10 flex-middle" style="margin-top: 0;">服务费</view>
				</view>
				<view class="ml-auto f28 colorCon FB" >实际收入：{{item.amount}}</view>
			</view>
			<view class="f26 ccc flex">
				<view><image src="../../static/images/time.png" mode=""></image></view>
				<view>{{item.createdAt}}</view>
			</view>
			<view class="f26 ccc flex">
				<image src="../../static/images/adre.png" mode=""></image>
				<view class="ad">{{item.bill.address}}</view>
				<view class="pr ml-auto">
					<image @click.stop="showTip(index)" src="../../static/images/ser_info.png" mode=""></image>
					<view @click.stop class="fen-tip pa" v-if="index == currentIndex">
						订单总收入：{{item.userAmount}}元，
						平台收入：{{item.userAmount - item.amount}}元，
						余额：{{item.amount}}元
					</view>
				</view>
				<view>+{{item.userAmount}}</view>
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
				bill: [],
				sunSa: 0,  //总收入
				currentIndex: -1
			}
		},
		methods: {
			showTip(index) {
				if(this.currentIndex == -1) {
					this.currentIndex = index;
				}
				else {
					this.currentIndex = -1;
				}
			},
			toDouble(key) { //缺位补零
				if(key < 10) {
					key = '0' + key;
				}
				return key;
			},
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/bill/detail?item='+id
				})
			},
			getIncome() {
				
				let oDate = new Date();
				let year = oDate.getFullYear();
				let month = oDate.getMonth() + 1;
				month = this.toDouble(month);
				let day = oDate.getDate();
				day = this.toDouble(day);
				let s = year + '-' + month + '-' + day + ' 00:00:00';
				let e = year + '-' + month + '-' + day + ' 23:59:59';
				
				this.$listapi.incomeDetail(this.$store.state.sessionId,3,s,e).then(res => {
					this.sunSa = res.data.collection[0].availableAmount;
					this.bill = res.data.collection[0].detailList;
					this.bill.forEach(item => {
						item.createdAt = item.createdAt.replace(/T/,' ');
						this.$listapi.getBillDetail(this.$store.state.sessionId,item.orderId).then(res1 => {
							this.$set(item,'bill',res1.data.collection[0]);
							item.bill.address = item.bill.address.split('-*-')[1];
							
						})
					})
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '今日收入';  //修改navigatorBarText
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {
				
			}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '已审核') {
					let app = getApp();
					let _this = this;
					this.$loading(true);
					app.login(this).then(res => {
						
						_this.getIncome(); //获取订单
						
						setTimeout(function() {
							_this.$loading(false);
						}, Math.random() * 2000);
					})
				}
			}
			this.$over();
			
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#3C94CF,#419AD5) !important;
	}
	/* 顶部 */
	.income-h {
		width: 100%;
		height: 250rpx;
		background: linear-gradient(to bottom,#419AD5,#419FDC);
		box-sizing: border-box;
		padding-top: 50rpx;
	}
	.f48 {
		font-size: 48rpx;
		margin-top: 20rpx;
	}
	/* 内容 */
	.tobill-con-de {
		box-sizing: border-box;
		padding: 14rpx 20rpx 14rpx 16rpx;
	}
	.tobill-con-de:first-child {
		margin-top: 20rpx;
	}
	.tobill-con-de .f26 {
		margin-top: 8rpx;
	}
	.tobill-con-de .f26 image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 14rpx;
	}
	
	
	.tobill-con-de .f26 .ad {
		max-width: 530rpx;
	}
	.fen-tip {
		width: 250rpx;
		transform: translateX(-60%);
		background: white;
		box-shadow: 2rpx 2rpx 10rpx rgba(0,0,0,.1);
		padding: 8rpx;
	}
	
</style>
