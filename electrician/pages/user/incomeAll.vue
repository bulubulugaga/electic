<template>
	<!-- 修改用户名 -->
	<view class="content" @click="currentIndex = -1">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="income-h txt-cen white">
			<view class="f30">总收入（元）</view>
			<view class="f48">{{sunSa}}</view>
		</view>
		
		<!-- 内容 -->
		<view class="tobill-con w-con">
			<view class="tobill-con-ch flex">
				<view class="ml-auto f30 colorCon flex" @click="isChDate = true">
					<view>{{dateSure}}</view>
					<view><image src="../../static/images/san.png" mode=""></image></view>
				</view>
			</view>
			
			
			<view class="tobill-con-de mt15 bg-white border-r-20" v-for="(item,index) in bill" :key="index" @click="toDetail(item.orderId)">
				<view class="flex">
					<view class="flex-middle" >
						<view class="tobill-con-type f28 colorCon FB flex-middle">{{item.bill.type}}</view>
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
			
			
			
		</view>
		<view class="calendar-bg" v-show="isChDate" @click="isChDate = false">
			<view class="calendar" @click.stop>
				<uni-calendar 
					:insert="true"
					:start-date="'2020-01-01'"
					:end-date="'2020-01-01'"
					@change="change"
					 />
				<button class="white bg-con" @click="chDate()">确定</button>
			</view>
		</view>
		
		<popup></popup>
		<loading></loading>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue' //日历组件
	export default {
		data() {
			return {
				bill: [],
				sunSa: 0  ,//总收入
				currentIndex: -1,
				
				isChDate: false  ,//选择日期
				date: '',  //日期
				dateSure: '今日'  //确认选择的日期（默认今日）
				
				
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
			isNull(data) { //判断是否为空
				if(data == null || data == '') {
					data = 0;
				}
				return Number(data);
			},
			getWallet() {  //获取钱包余额
				this.$listapi.walletSum(this.$store.state.sessionId).then(res => {
					this.sunSa = this.isNull(res.data.collection[0].addUpAmount);
				})
			},
			getIncome(s,e) {
				this.$listapi.incomeDetail(this.$store.state.sessionId,3,s,e).then(res => {
					this.bill = res.data.collection[0].detailList;
					this.bill.forEach(item => {
						item.createdAt = item.createdAt.replace(/T/,' ');
						this.$listapi.getBillDetail(this.$store.state.sessionId,item.orderId).then(res1 => {
							this.$set(item,'bill',res1.data.collection[0]);
							item.bill.address = item.bill.address.split('-*-')[1];
							
						})
					})
				})
			},
			change(e) {
				this.date = e.fulldate;  //先将选择的日期存起来
			},
			chDate() { //选择日期
				this.dateSure = this.date;
			
				let oDate = new Date();
				let year = oDate.getFullYear();
				let month = oDate.getMonth() + 1;
				month = this.toDouble(month);
				let day = oDate.getDate();
				day = this.toDouble(day);
				
				let date = year + '-' + month + '-' + day;
				
				if(date == this.date) {  //展示的日期，传递数据可以使用this.date
					this.dateSure = '今天';
				}
				if(this.date == '') { //点开日历没有选择日期
					this.dateSure = '今天',
					this.date = date;
				}
				
				
				this.isChDate = false; //隐藏日历
				
				let s = this.date + ' 00:00:00';
				let e = this.date + ' 23:59:59';
				this.getIncome(s,e);
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
			}
		},
		components: {
			Nav,
			uniCalendar
		},
		onLoad() {			
			this.$refs.son.a = '全部收入';  //修改navigatorBarText
			
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {
				
			}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '已审核') {
					let app = getApp();
					let _this = this;
					this.$loading(true);
					app.login(this).then(res => {
						
						let oDate = new Date();
						let year = oDate.getFullYear();
						let month = oDate.getMonth() + 1;
						month = this.toDouble(month);
						let day = oDate.getDate();
						day = this.toDouble(day);
						
						let s = year + '-' + month + '-' + day + ' 00:00:00';
						let e = year + '-' + month + '-' + day + ' 23:59:59';
						
						_this.getIncome(s,e);
						_this.getWallet();
						
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
	.tobill-con-ch {
		line-height: 70rpx;
	}
	.tobill-con-ch image {
		width: 22rpx;
		height: 16rpx;
		margin-left: 10rpx;
	}
	.tobill-con-de {
		box-sizing: border-box;
		padding: 14rpx 20rpx 14rpx 16rpx;
	}
	.tobill-con-de:first-child {
		margin-top: 0;
	}
	.tobill-con-de .f26 {
		margin-top: 8rpx;
	}
	.tobill-con-de .f26 image {
		width: 32rpx;
		height: 32rpx;
		margin-right: 14rpx;
	}
	
	.calendar-bg {
		position: absolute;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
	}
	.calendar {
		position: fixed;
		bottom: 0;
		width: 100%;
		/* height: 780rpx; */
		height: 940rpx;
		background: white;
	}
	.calendar button {
		height: 90rpx;
		line-height: 90rpx;
		width: 700rpx;
		border-radius: 100rpx;
		font-size: 32rpx;
		margin-top: 20rpx;
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
