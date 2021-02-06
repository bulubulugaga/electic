<template>
	<view>
		<view class="guide" @click="toIndex()">
			<image src="../../static/images/guide.png" mode=""></image>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: ''
			}
		},
		methods: {
			toIndex() { //手动点击跳转
				clearInterval(this.timer);
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		},
		onLoad() { //5s后自动跳转
			this.timer = setTimeout(function() {
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},2000);	
		}
	}
</script>

<style>
	.guide {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
	}

	.guide image {
		width: 100%;
		height: 99%;
	}

	/* 登录提示 */
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
		height: 52rpx;
		line-height: 57rpx;
		border-radius: 52rpx;
		margin-top: 50rpx;
	}
</style>
