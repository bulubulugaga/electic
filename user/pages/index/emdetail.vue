<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="enDe-header">
			<view class="enDe-header-con bg-white border-r-20">
				<view class="flex-MC">
					<view>
						<image class="em-photo circle" :src="em.wxPhoto" mode=""></image>
					</view>
					<view class="f30 FB">{{em.name}}</view>
					<!-- <view class="f22 ml-auto">拉黑</view> -->
				</view>
				<view class="flex-middle mt40">
					<view class="f30 ml10">接单量：{{em.completeCount}}</view>
					<view class="star ml-auto flex-middle">
						<text class="f30">信用评价：</text>
						<uni-rate size='11' max="5" :value="em.average" active-color="#fecb01" margin="1" disabled></uni-rate>
						<text class="f18">{{em.average}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 电工介绍-->
		<view class="em-card bg-white border-r-20" v-if="em.skillAndSpeciality != '' && em.skillAndSpeciality != null">
			<view class="f30 FB mb">电工介绍</view>
			<view class="f28 mt20">{{em.skillAndSpeciality.speciality}}</view>
			<view class="skill flex f26">
				<view v-for="(item,index) in em.skillAndSpeciality.skills" :key="index">{{item}}</view>
			</view>
		</view>
		
		<!-- 电工证件 -->
		<view class="em-card bg-white border-r-20">
			<view class="f30 FB mb">电工证件</view>
			<view class="flex-cover f26" v-for="(item,index) in em.card" :key="index">
				<view>{{item}}</view>
				<view class="colorCon flex-middle">
					<image class="right" src="../../static/images/right.png" mode=""></image>
					已认证
				</view>
			</view>
		</view>
		
		<!-- 电工评价 -->
		<view class="em-remark bg-white border-r-20" v-if="tip == '用户评价'">
			<view class="f30 FB">{{tip}}</view>
			<view class="em-remark-con" v-for="(item,index) in remark" :key="index" v-if="index < 2">
				<view class="flex mt20">
					<view><image class="user-img circle" :src="item.wxPhoto" mode=""></image></view>
					<view>
						<view class="f28">{{item.wxName}}</view>
						<view class="f24 c999">{{item.createdAt}}</view>
					</view>
				</view>
				<view class="f26 c999 mt10">{{item.remark}}</view>
				<view v-if="item.imageList[0].url != null && item.imageList[0].url != ''"><image class="remark-img" :src="item.imageList[0].url" mode=""></image></view>
			</view>
		</view>
		
		<view class="blank">
			
		</view>
		
		<!-- 底部 -->
		<view class="order-footer bg-white flex-middle" v-if="prev=='index'">
			<button class="white bg-con f30" @click="backOrder()">选他下单</button>
		</view>
		
		
		<loading></loading>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	export default {
		data() {
			return {
				tip: '',
				em: { },
				remark: [ //用户评价,选取最近2-3条
					
				],
				
				emRadio: 0,
				prev: ''  //上上个页面
					
			}
		},
		methods: {
			getRemark(id) {
				this. remark = [];
				let _this = this;
				this.$listapi.getRemark(this.$store.state.sessionId,id).then(res=>{
					if(res.data.collection.length > 0) {
						_this.tip = '用户评价';
						res.data.collection.forEach(item=> {
							item.createdAt = item.createdAt.replace(/T/,' ');
						})
						_this.remark = res.data.collection;
						this.remark.sort((a, b)=>{ return Date.parse(b.createdAt.replace(/-/g, "/").replace(/T/g, " ")) - Date.parse(a.createdAt.replace(/-/g, "/").replace(/T/g, " ")); });
					}
					else {
						_this.tip = '暂无评价';
					}
					
				})
			},
			backOrder() { //选择电工后接单							
				uni.navigateTo({
					url: './order?em=' + this.em.id + '&emRadio=' +this.emRadio + '&aa=' + 0
				})
			},
		},
		components: {
			Nav
		},
		onLoad(option) {			
			this.$refs.son.a = '电工主页';  //修改navigatorBarText
			this.prev = option.prev;
			if(option.emRadio) {
				this.emRadio = option.emRadio;
			}
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				this.em = JSON.parse(decodeURIComponent(option.item));  //接收到的电工
				this.$set(this.em,'card',['身份证','电工证']);
				this.getRemark(this.em.id);
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			
			this.$over();
			
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#23d5b1,#22D0AC) !important;
	}
	/* 头部 */
	.enDe-header {
		background: linear-gradient(to bottom,#22D0AC,#1CC09E);
		width: 100%;
		height: 290rpx;
		padding-top: 30rpx;
	}
	.enDe-header-con {
		box-sizing: border-box;
		padding: 20rpx 20rpx 30rpx;
		width: 91%;
		margin: 0 auto;
		height: 245rpx;
	}
	.em-photo {
		width: 100rpx;
		height: 100rpx;
		margin-right: 30rpx;
	}
	.star uni-rate {
		display: inline-block;
	}
	.star .f18 {
		display: inline-block;
		font-size: 20rpx;
		color: #fecb01;
		margin-left: 15rpx;
		font-weight: bold;
	}
	
	/* 电工评价 */
	.em-remark {
		width: 91%;
		margin: 45rpx auto 28rpx;
		box-sizing: border-box;
		padding: 20rpx 40rpx 0 20rpx;
	}
	.em-remark-con {
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	.em-remark-con:last-child {
		border-bottom: none;
	}
	.user-img {
		width: 58rpx;
		height: 58rpx;
		margin-right: 20rpx;
	}
	.mt5 {
		margin-top: 7rpx;
	}
	.remark-img {
		width: 180rpx;
		height: 140rpx;
		border-radius: 20rpx;
		margin-top: 10rpx;
	}
	
	/* 电工证件 */
	.em-card {
		width: 91%;
		margin: 32rpx auto 28rpx;
		box-sizing: border-box;
		padding: 20rpx;
	}
	.em-card .flex-cover {
		line-height: 46rpx;
	}
	.em-card .mb {
		margin-bottom: 10rpx;
	}
	.em-card .right {
		width: 33rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	
	.blank {
		width: 100%;
		height: 130rpx;
	}
	/* 底部 */
	.order-footer {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0;
		z-index: 3;
	}
	.order-footer button {
		width: 275rpx;
		height: 63rpx;
		line-height: 63rpx;
		border-radius: 100rpx;
	}
	
	.skill {
		flex-wrap: wrap;
	}
	.skill>view {
		width: 30%;
		background: #31D8B6;
		color: white;
		line-height: 52rpx;
		margin-top: 20rpx;
		text-align: center;
		border-radius: 10rpx;
		margin-right: 5%;
	}
	.skill>view:nth-child(3n+3) {
		margin-right: 0;
	}
</style>
