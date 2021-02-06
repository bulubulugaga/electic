<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="cou">
			<view class="cou-de pr w-con hide" v-for="(item,index) in coupon" :key="index">
				<image v-if="item.state === 0" class="pa" src="../../static/images/coupon_bg.png" mode=""></image>
				<image v-else class="pa" src="../../static/images/coupon_bg2.png" mode=""></image>
				<view class="pa flex">
					<view class="cou-de-l flex-middle white flex-center">
						<view class="f30">{{item.name}}</view>
					</view>
					<view class="cou-de-r flex-middle flex-cover f24">
						<view class="ml20">
							<view>{{item.notes}}</view>
							<view class="mt15">有效日期：<br/>{{item.startdAt + '-' + item.enddAt}}</view>
						</view>
						<view>
							<button v-if="item.state === 0" @click="useCou(item)" class="white f22 bgBlue">立即使用</button>
							<button v-else-if="item.state === 1" class="white f22 bgGrey">已使用</button>
							<button v-else class="white f22 bgGrey">已过期</button>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="f24 c999 txt-cen mt30">{{tip}}</view>
		
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	
	export default {		
		data() {
			return {
				coupon: [], //优惠券
				
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
					_this.getCou();
				},1000);
			}
			else {
				this.tip = '没有更多了~';
			}
		},
		methods: {
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
			useCou(item) { //使用优惠券
				let id = 0;
				this.$listapi.useCoupon(this.$store.state.sessionId,item.id).then(res => {
					if(res.data.code == 'success') {
						item.state = 1;
						this.getTime();
					}
					else {
						uni.showToast({
							title: res.data.message,
							icon: 'none',
							duration: 1200
						})
					}
				})
				
				
			},
			getCou() { //获取优惠券
				this.$listapi.getCoupon(this.$store.state.sessionId,this.data).then(res => {
					let _this = this;
					let coupon = res.data.collection;
					
					coupon.forEach(item=>{
						item.startdAt = item.startdAt.split('T')[0].replace(/-/g,'.');
						item.enddAt = item.enddAt.split('T')[0].replace(/-/g,'.');
						
						_this.coupon.push(item);
					})
					
					
				})
			}
			
		},
		components: {
			Nav
		},
		onLoad() {	
			this.$refs.son.a = '优惠券';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			this.$loading(true);
			app.login(this).then(res => {
				let _this = this;
				this.getCou();
				this.$listapi.getCoupon(this.$store.state.sessionId,this.data).then(res => {
					this.total_pages = res.data.meta.pagination.total_pages;
				});
				// _this.getDate();
				setTimeout(function(){_this.$loading(false);},800);
			});
		}
	}
</script>

<style>
	.cou-de {
		height: 180rpx;
		margin-top: 25rpx;
	}
	.cou-de>image,.cou-de>view {
		width: 100%;
		height: 100%;
	}
	.cou-de-l {
		width: 224rpx;
		height: 100%;
	}
	.cou-de-r {
		height: 100%;
		padding: 0 20rpx;
	}
	.cou-de-r button {
		width: 112rpx;
		height: 40rpx;
		line-height: 40rpx;
		border-radius: 100rpx;
		margin-left: 34rpx;
	}
	.bgBlue {
		background: #31D8B6;
	}
	.bgGrey {
		background: #CCCCCC;
	}
</style>
