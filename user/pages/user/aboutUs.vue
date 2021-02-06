<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="us-con txt-cen">
			<view class="img"><image :src="us.img" mode="heightFix"></image></view>
			<text class="FB f40">{{us.name}}</text>
			<view class="c999 f24">版本号：{{us.version}}</view>
			<text class="c999 f24">更新时间：{{us.time}}</text>
		</view>
		
		<!-- 底部版权 -->
		<view class="us-tip txt-cen c999 f26">
			版权归电工联盟所有
		</view>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				us: {
					name: '电工联盟',
					img: this.$store.state.logo1,
					version: 'v2.0.0 正式版',
					time: '2020-07-26'
				}
			}
		},
		methods: {
			
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '关于电工联盟';  //修改navigatorBarText
			
			let app = getApp();
			let _this = this;
			// app.login(this).then(res=> {
				// _this.us = {
				// 	name: '电工联盟',
				// 	img: _this.$store.state.logo1,
				// 	version: 'v2.0.0 正式版',
				// 	time: '2020-07-26'
				// }
				// console.log(_this.us);
			// })
			
		}
	}
</script>

<style>
	.us-con {
		position: absolute;
		width: 100%;
		top: 250rpx;
		line-height: 45rpx;
	}
	.us-con .img {
		width: 240rpx;
		height: 240rpx;
		background-color: white;
		border-radius: 40rpx;
		margin: 0 auto;
		padding: 20rpx 10rpx 20rpx 30rpx;
	}
	.us-con image {
		width: 213rpx;
		height: 240rpx;
	}
	.us-con .FB {
		display: block;
		margin: 18rpx 0 12rpx 0;
	}
	.us-tip {
		position: absolute;
		width: 100%;
		bottom: 62rpx;
	}
</style>
