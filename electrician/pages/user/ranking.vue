<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="ran-h colorCon flex-cover flex-middle f26">
			<view>我的排名：<text class="f30">{{rank}}</text>名</view>
			<view class="colorCon flex" @click="isChDate = true">
				<view>{{arr[index]}}</view>
				<view class="flex-middle"><image src="../../static/images/san.png" mode=""></image></view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="ran-con w-con">
			<view class="ran-de flex-middle f30" v-for="(item,index1) in emList" :key="index1">
				 <view>
					 <view class="ran-top" v-if="index1 < 3">
						 <image :src="img[index1]" mode=""></image>
					 </view>
					 <view>NO.{{index1+1}}</view>
				 </view>
				 <view><image class="user-img circle" :src="item.wxPhoto" mode=""></image></view>
				 <view>{{item.name}}</view>
				 <view class="ml-auto">
					 <!-- <text class="f26">今日接单：</text>{{item.num}}单 -->
					 
					 <text class="f26">{{arr[index]}}接单：</text>{{item.completeCount}}单
				 </view>
			</view>
		</view>
		<view class="calendar-bg" v-show="isChDate" @click="isChDate = false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">选择日期分类</view>
						<view><image src="../../static/images/type_ch.png" mode=""></image></view>
					</view>
					<view class="type-items">
						<view class="type-item f28" v-for="(item,index) in arr" :key="index" @click="typeChoose(index)">
							{{item}}
						</view>
					</view>
					<view class="type-ch-cancel" @click="isChDate=false">
						×
					</view>
				</view>
			</view>
		</view>
		<loading></loading>
		<popup></popup>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue' //日历组件
	export default {
		data() {
			return {
				rank: '未进入排行榜', //我的排名
				img: [ //排名前3标志
					'../../static/images/cou01.png',
					'../../static/images/cou02.png',
					'../../static/images/cou03.png'
				],
				emList: [
					
				],
				
				isChDate: false  ,//选择日期
				arr: ['今日','本月','今年'],  //选项
				index: 0  //选项下标
			}
		},
		methods: {			
			typeChoose(index) { //选择分类
				this.index = index;
				this.isChDate = false;
				
				this.getRanking(index);
			},
			toDouble(data) {  //补两位
				if(data < 10) {
					return '0' + data;
				}
				else {
					return data;
				}
			},
			getRanking(index) {  //获取日期内的排行榜
				let date = new Date();
				let year = date.getFullYear();
				let month = this.toDouble(date.getMonth() + 1);
				let day = this.toDouble(date.getDate());
				let st = '';  //开始时间
				let et = '';  //截止时间
				switch(index) {
					case 0: 
						st = year + '-' + month + '-' + day + ' ' + '00:00:00';
						et = year + '-' + month + '-' + day + ' ' + '23:59:59';
						break;
					case 1: 
						st = year + '-' + month + '-' + '01' + ' ' + '00:00:00';
						
						if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12") {
						    et = year + "-" + month + "-" + 31 + ' ' + '23:59:59';
						} else if (month == "02") {
						    if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
						        et = year + "-" + month + "-" + 29 + ' ' + '23:59:59';
							} else {
						        et = year + "-" + month + "-" + 28 + ' ' + '23:59:59';
						    }
						} else {
							et = year + "-" + month + "-" + 30 + ' ' + '23:59:59';
						}
						
						break;
					case 2: 
						st = year + '-' + '01' + '-' + '01' + ' ' + '00:00:00';
						et = year + '-' + '12' + '-' + '31' + ' ' + '23:59:59';
						break;
				}
				let _this = this;
				let data = {
					page: 1,
					perPage: 200
				};
				this.$listapi.getRanking(this.$store.state.sessionId,st,et,data).then(res=>{
					this.emList = [];
					res.data.collection.forEach(item=>{
						if(item.name) {
							this.emList.push(item);
						}
					})
					this.emList.sort(function(a,b){return b.completeCount - a.completeCount});
					
					try {  //用抛出异常的方式结束循环
					    this.emList.forEach((item,index)=>{
							if(item.id == _this.$store.state.id) {
								_this.rank = index + 1;
								throw new Error("EndIterative");
							}
					    })
					    
					} catch(e) {
					    if(e.message!="EndIterative") throw e;
					};
					
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '排行榜';  //修改navigatorBarText
			
			let app = getApp();
			let _this = this;
			this.$loading(false);
			app.login(this).then(res => {
			
				if(this.$store.state.info.imageList.length == 0) {
					uni.showModal({
						title: '提示',
						content: '您需要注册实名认证后才能查看电工排行榜',
						confirmText: '去注册',
						cancelText: '暂不注册',
						success: function (res) {
							if (res.confirm) {
								uni.navigateTo({
									url: '/pages/index/register'
								})
							}
						},fail(err) {
						  console.log(err);
					  }
					})
				}
				else if(this.$store.state.info.info) {
					if(this.$store.state.info.info.stateName == '审核中') {
						uni.showToast({
							title: '您的信息还在审核中，暂时不能查看排行榜。',
							icon: 'none',
							duration: 1200
						});
					}
					else if(this.$store.state.info.info.stateName == '审核失败') {
						uni.showToast({
							title: '您的信息还在审核失败，需要重新注册。',
							icon: 'none',
							duration: 1200
						});
					}
					else if(this.$store.state.info.info.stateName == '已审核') {
						let _this = this;
						
						this.$loading(true);
						setTimeout(function (){
							_this.getRanking(0);
							_this.$loading(false);
						},1200)
					}
				}
			})
			this.$over();
		}
	}
</script>

<style>
	page {
		background: white;
	}
	/* 顶部 */
	.ran-h {
		width: 100%;
		height: 60rpx;
		background: #F2F2F2;
		box-sizing: border-box;
		padding: 0 20rpx;
	}
	.ran-h image {
		width: 18rpx;
		height: 10rpx;
		margin-left: 6rpx;
	}
	
	
	/* 内容 */
	.ran-de {
		padding: 20rpx 20rpx;
		border-bottom: 1rpx solid #F0F0F0;
	}
	.user-img {
		width: 75rpx;
		height: 75rpx;
		margin: 0 20rpx;
	}
	.ran-top {
		width: 52rpx;
		height: 70rpx;
		margin-left: 10rpx;
		margin-bottom: 6rpx;
	}
	.ran-top image {
		width: 100%;
		height: 100%;
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
	
	.type-ch-con {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 395rpx;
		background: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-sizing: border-box;
		padding: 10rpx 0;
	}
	.type-ch-title image {
		width: 18rpx;
		height: 13rpx;
		margin-left: 8rpx;
		vertical-align: middle;
		margin-top: -5rpx;
	}
	.type-items {
		width: 80%;
		margin: 27rpx auto 0;
		overflow: scroll;
	}
	.type-item {
		height: 70rpx;
		line-height: 70rpx;
		border-bottom: 1rpx solid #E5E5E5;
	}
	.type-item:last-child {
		border-bottom: none;
	}
	.type-ch-cancel {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		color: #ccc;
		font-size: 65rpx;
		line-height: 0;
	}
</style>
