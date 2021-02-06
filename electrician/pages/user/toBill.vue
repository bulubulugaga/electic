<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="tobill-con w-con">
			<view class="mt40 f26 c999 txt-cen" v-if="bill == [] || bill == '' || bill == null">您今日还没有接单</view>
			<view class="tobill-con-de mt20 bg-white border-r-20" v-for="(item,index) in bill" :key="index" @click="toDetail(item)">
				<view class="flex">
					<view>
						<image class="user-photo circle" :src="item.wxPhoto" mode=""></image>
					</view>
					<view>
						<view class="f30">{{item.name}}</view>
						<view class="tobill-con-type f26 colorCon">{{item.type}}</view>
					</view>
					<view class="ml-auto f28" :class="{colorCon:item.stateGreen,colorYellow:item.stateYellow,colorRed:item.stateRed}">{{item.state}}</view>
				</view>
				<view class="tobill-con-time f28 c999">预约时间: {{item.orderdAt}}</view>
				<view class="tobill-con-ad f28 c999 flex-cover">
					<view class="tobill-con-ad-l">预约地址: </view>
					<view class="tobill-con-ad-r">{{item.address}}</view>
				</view>
			</view>
		</view>
		<loading></loading>
		<popup></popup>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				bill: []	
			}
		},
		methods: {
			getBill() { //获取订单信息
				// this.bill = bill; 
				let _this = this;
				let adder = [];
				let bill = [];
			
				this.$listapi.getBill(this.$store.state.sessionId).then(res => {
			
					bill = res.data.collection;
			
					bill.forEach(item => {
						this.$set(item, 'allAd', item.address + '-+-' + item.number); //存储完整地址信息
						this.$set(item, 'adLa', item.gpsLatitude); //存储地址信息
						this.$set(item, 'adLo', item.gpsLongitude);
						item.orderdAt = item.orderdAt.replace(/T/g, " ");
						item.address = item.address.split('-*-')[1];
						this.$set(item, 'isRemark', false);  //是否评价
						switch (item.state) {
							case -1:
							case 0:
								{
									item.state = '等待接单';
									this.$set(item, 'priceDis', false);
									this.$set(item, 'btn', '取消订单');
									this.$set(item, 'isBtn', true);
									this.$set(item, 'stateGreen', false); //状态颜色绿色
									this.$set(item, 'stateYellow', true);
									this.$set(item, 'stateRed', false);
									break;
								}
							case 1:
								{
									item.state = '等待验证服务码';
									this.$set(item, 'priceDis', false);
									this.$set(item, 'btn', '输入服务码');
									this.$set(item, 'stateGreen', false); //状态颜色绿色
									this.$set(item, 'stateYellow', true);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', true);
									this.$set(item, 'quDis', true);
									break;
								}
							case 2:
								{
									item.state = '费用报价';
									this.$set(item, 'priceDis', true);
									this.$set(item, 'btn', '输入费用');
									this.$set(item, 'price', '上传现场照');
									this.$set(item, 'stateGreen', true); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', true);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', true);
									this.$set(item, 'quDis', true);
									break;
								}
							case 3:
								{
									item.state = '等待支付';
									// this.$set(item, 'priceDis', false);
									this.$set(item, 'priceDis', true);
									this.$set(item, 'btn', '修改费用');
									this.$set(item, 'stateGreen', true); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', false);
									this.$set(item, 'quDis', true);
									this.$set(item, 'price', '￥' + item.serviceFee);
									this.$set(item, 'priceCol', true);
									break;
								}
							case 9:
								// {
								// 	item.state = '支付完成';
								// 	this.$set(item, 'priceDis', true);
								// 	this.$set(item, 'btn', '确认订单');
								// 	this.$set(item, 'stateGreen', true); //状态颜色绿色
								// 	this.$set(item, 'stateYellow', false);
								// 	this.$set(item, 'stateRed', false);
								// 	this.$set(item, 'pricePhoto', false);
								// 	this.$set(item, 'adDis', false);
								// 	this.$set(item, 'suDis', true);
								// 	this.$set(item, 'quDis', false);
								// 	this.$set(item, 'price', '￥' + item.serviceFee);
								// 	this.$set(item, 'priceCol', true);
								// 	break;
								// }
							case 10:
							case 11:
							{
								item.state = '已完成';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '评价订单');
								this.$set(item, 'stateGreen', true); //状态颜色绿色
								this.$set(item, 'stateYellow', false);
								this.$set(item, 'stateRed', false);
								this.$set(item, 'pricePhoto', false);
								this.$set(item, 'adDis', false);
								this.$set(item, 'suDis', false);
								this.$set(item, 'quDis', false);
								this.$set(item, 'price', '￥' + item.serviceFee);
								this.$set(item, 'priceCol', true);
								break;
							}
							case 12:
								{
									item.state = '已完成';
									this.$set(item, 'priceDis', true);
									this.$set(item, 'btn', '评价订单');
									this.$set(item, 'stateGreen', true); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', false);
									this.$set(item, 'quDis', false);
									this.$set(item, 'price', '￥' + item.serviceFee);
									this.$set(item, 'priceCol', true);
									item.isRemark = true;
									break;
								}
							case -100:
								{
									item.state = '已取消';
									this.$set(item, 'priceDis', false);
									this.$set(item, 'btn', '');
									this.$set(item, 'stateGreen', false); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', true);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', false);
									this.$set(item, 'quDis', false);
									break;
								}
						}
			
					})
					
					_this.bill = [];
					let billDay = '';
					
					let today = this.getToday();
					
					bill.forEach(item=>{
						if(item.selectdAt != '' && item.selectdAt != null) {
							billDay = item.selectdAt.split('T')[0];
							if(today == billDay) {
								_this.bill.push(item);
							}
						}
					})
					
				})
			
			
			},
			getToday() { //获取今天的日期
				let day = new Date();
				let today = day.getFullYear() + '-' + this.toDouble(day.getMonth() + 1) + '-' + this.toDouble(day.getDate());
				return today;
			},
			toDouble(num) { //缺位补零
				 if(num < 10) {
					 num = '0' + num;
				 }
				 return num;
			},
			toDetail(item) { //Id是订单编号，跳转到订单详情
				let item1 = encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: '/pages/bill/detail?item='+item.id
				});
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '今日接单';  //修改navigatorBarText
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {
				
			}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '已审核') {
					let app = getApp();
					let _this = this;
					this.$loading(true);
					app.login(this).then(res => {
						_this.getBill(); //获取订单
						
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
	.tobill-con-de {
		box-sizing: border-box;
		padding: 16rpx 20rpx 22rpx 16rpx;
	}
	.tobill-con-de:first-child {
		margin-top: 20rpx;
	}
	.user-photo {
		width: 87rpx;
		height: 87rpx;
		margin-right: 20rpx;
	}
	.tobill-con-type {
		border: 1rpx solid #4da8e5;
		border-radius: 10rpx;
		padding: 1rpx 8rpx;
		margin-top: 6rpx;
	}
	.colorYellow {
		color: #ffd200;
	}
	.colorRed {
			color: red;
	}
	.tobill-con-de .c999 {
		line-height: 37rpx;
	}
	.tobill-con-time {
		margin-top: 24rpx;
		margin-bottom: 6rpx;
	}
	.tobill-con-ad {
		margin-top: 10rpx;
	}
	.tobill-con-ad-l {
		width: 224rpx;
	}
	.tobill-con-ad-r {
		width: 892rpx;
	}
</style>
