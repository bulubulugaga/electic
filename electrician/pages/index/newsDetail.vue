<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="newde-con w-con bg-white">
			<view class="new-title f36">{{news.title || ''}}</view>
			<view class="new-time c999 f26">
				<image class="new-time-img" src="../../static/images/index_time.png" mode="widthFix" />
				<text class="f28 c999">发布时间：{{news.time || ''}}</text>
			</view>
			<rich-text class="new-con f30 c999" :nodes="news.content"></rich-text>
			<view class="news-btn">
				<view class="ml-auto flex">
					<view class="news-btn-txt">
						阅读量：{{news.readCount || ''}}
					</view>
					<button class="news-share" open-type="share">分享</button>
				</view>
			</view>
		</view>
		
		<view class="blank"></view>
		<loading></loading>
		<popup></popup>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				news: {}
			}
		},
		methods: {			
			
		},
		components: {
			Nav
		},
		onLoad(options) {	
			if(options.kind == 1){ //修改navigatorBarText
				this.$refs.son.a = '新闻中心';
			}
			else {
				this.$refs.son.a = '通知中心';
			}
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				this.news = JSON.parse(decodeURIComponent(options.item));
				this.news.content = this.news.content.replace(/display:none;/g,'display:block;max-width:100%;');
				setTimeout(function(){
					_this.$loading(false);
				},500);
			});
			this.$over();
		}
	}
</script>

<style>
	
	.newde-con {
		padding: 30rpx;
		box-sizing: border-box;
		margin-top: 20rpx;
		border-radius: 20rpx;
	}
	.new-title {
	}
	.new-time-img {
		width: 34rpx;
		margin-right: 20rpx;
		vertical-align: middle;
	}
	.new-time {
		margin: 20rpx 0 25rpx;
	}
	.new-con-img {
		width: 50%;
	}
	.new-con {
		margin-top: 30rpx;
		line-height: 48rpx;
		padding-bottom: 30rpx;
	}
	
	.news-btn {
		display: flex;
		margin-top: 36rpx;
	}
	.news-share {
		background-color: white;
		background-image: url(../../static/images/share.png);
		background-size: 40rpx auto;
		background-repeat: no-repeat;
		width: 142rpx;
		padding-left: 40rpx;
		font-size: 28rpx;
		text-align: right;
		color: #999;
		line-height: 40rpx;
		margin-right: 0;
		margin-left: 30rpx;
	}
	.news-btn-txt {
		margin-right: 0;
		font-size: 28rpx;
		color: #999;
	}
	
	.blank {
		height: 20rpx;
	}
	
	
</style>
