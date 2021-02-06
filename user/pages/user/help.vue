<template>
	<!-- 帮助与反馈 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		<!-- 内容 -->
		<view class="help-con bg-white" v-for="(item,index) in help" :key="index" @click="change(index)">
			<view class="help-de-ti f28 flex">
				<image class="why" src="../../static/images/help_why.png"></image>
				<view class="txt"><text>{{item.title}}</text></view>
				<image class="dis" :src="item.img"></image>
			</view>
			<view class="help-de-con f26" v-show="item.isCur">
				<rich-text :nodes="item.content"></rich-text>
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
				help: [  //内容
					
				]
			}
		},
		methods: {
			change(index) { //切换效果
				if(this.help[index].isCur) { //展开时
					this.help[index].img = '../../static/images/help_b.png';
				}
				else {
					this.help[index].img = '../../static/images/help_t.png';
				}
				this.help[index].isCur = !this.help[index].isCur;
			},
			getHelp() {
				let _this = this;
				this.$listapi.getHelp(this.$store.state.sessionId).then(res=>{
					_this.help = res.data.collection;
					_this.help.forEach(item=>{
						_this.$set(item,'isCur',false);
						_this.$set(item,'img','../../static/images/help_b.png');
					})
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {
			// this.getBill('all');
			// this.getNews();
			this.$refs.son.a = '帮助';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res => {
				_this.getHelp();				
				setTimeout(function(){_this.$loading(false);},800);
			});
			this.$over();
		}
	}
</script>

<style>
	/* 内容 */
	.help-de-ti {
		padding: 26rpx 0;
		border-bottom: 1rpx solid #F2F2F2;
	}
	.help-de-ti image.why {
		width: 28rpx;
		height: 28rpx;
		margin: 4rpx 12rpx 0 23rpx;
	}
	.help-de-ti .txt {
		width: 84%;
	}
	.help-de-ti image.dis {
		width: 20rpx;
		height: 11rpx;
		margin: 12rpx 20rpx 0 0;
		margin-left: auto;
	}	
	.help-de-con {
		background-color: #F2F2F2;
		padding: 20rpx 43rpx 20rpx 62rpx;
		line-height: 36rpx;
	}
	
	/* 意见 */
	.idea {
		width: 100%;
		height: 80rpx;
	}
	.idea image {
		width: 28rpx;
		height: 28rpx;
		margin: 0 12rpx 0 23rpx;
	}
	.idea image.more {
		width: 11rpx;
		height: 20rpx;
		margin-right: 24rpx;
		margin-left: auto;
	}
</style>
