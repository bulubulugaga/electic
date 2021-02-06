<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="remark w-con">
			<view class="remark-de bg-white border-r-20 mt20" v-for="(item,index) in remark">
				<view class="user-infor flex">
					<view class="user-img bg-con circle hide">
						<image class="wh" :src="item.wxPhoto" mode=""></image>
					</view>
					<view>
						<view class="f30">{{item.wxName}}</view>
						<view class="f24 c999">{{item.createdAt}}</view>
					</view>
				</view>
				<view class="star-remark f26 flex-middle" v-for="(star,i) in item.stars" :key="i">
					<view class="star-title">{{star.title}}</view>
					<view class="star-num flex-middle mt5">
						<uni-rate class="in-block" size='18' max="5" :value="star.num" active-color="#fecb01" margin="7" disabled></uni-rate>
					</view>
					<view class="star-con">{{star.de}}</view>
				</view>
				<view class="remark-con f26">{{item.remark}}</view>
			</view>
		</view>
		
		<view class="f24 c999 txt-cen mt30">{{tip}}</view>
		
		<loading></loading>
		<popup></popup>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	export default {
		data() {
			return {
				remark: [ //评价
					
				],
				data: {
					page: 1,
					perPage: 10
				},
				total_pages: 0,
				tip: '没有更多了~'
			}
		},
		onReachBottom() {
			let _this = this;
			if(this.data.page < this.total_pages) {
				_this.tip = '加载中……';
				setTimeout(function() {
					_this.data.page++;
					_this.getRemark();
				},1000);
			}
			else {
				this.tip = '没有更多了~';
			}
		},
		methods: {
			getRemark() {
				let _this = this;
				this.$listapi.getRemark1(this.$store.state.sessionId,this.data).then(res=>{
					_this.total_pages = res.data.meta.pagination.total_pages;
					let remark = res.data.collection;
					remark.forEach(item=>{
						item.createdAt = item.createdAt.replace(/T/,' ');
						_this.$set(item,'stars',[
							{title: '准时上门',num: item.allSatisfied,de: ''},
							{title: '服务态度',num: item.attitude,de: ''},
							{title: '技术能力',num: item.skill,de: ''}
						])
						item.stars.forEach(item1=>{
							switch(item1.num) {  //动态改变星级评价
								case 1: item1.de = '很差';break;
								case 2: item1.de = '差';break;
								case 3: item1.de = '一般';break;
								case 4: item1.de = '好';break;
								case 5: item1.de = '非常好';break;
							}
						})
						this.remark.push(item);
					})
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '信用评价';  //修改navigatorBarText
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '已审核') {
					let app = getApp();
					let _this = this;
					this.$loading(true);
					app.login(this).then(res => {
						this.getRemark();
						setTimeout(function(){_this.$loading(false);},Math.random()*1500);
					});
				}
			}
			this.$over();
		}
	}
</script>

<style>
	.remark-de {
		padding: 15rpx 15rpx 30rpx;
	}
	.user-img {
		width: 70rpx;
		height: 70rpx;
		margin-right: 20rpx;
	}
	.user-infor {
		margin-bottom: 23rpx;
	}
	.star-remark {
		height: 44rpx;
	}
	.star-num {
		margin: 12rpx 30rpx 0 20rpx;
	}
	
	.remark-con {
		margin-top: 30rpx;
	}
	
</style>
