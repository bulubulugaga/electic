<template name="navi">
	<!-- 导航 -->
	<view class="prohibition">
		<view class="demo" :style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:10rpx'">
			<view class="left" :style="'top:' + demo.top + 'px'">
				<view class="iconfont icon-xiaoxi">
					
					<!-- 订单头部地址 -->
					<view class="index-ad flex" v-if="indexAd">
						<view><image src="../static/images/ader01.png" mode="widthFix"></image></view>
						<view class="f26">{{city}}</view>
					</view>
					
					<!-- 首页头部客服头像 -->
					<view class="navi-img" v-if="indexSer" @click="toSer()"><image style="width:40rpx;height:48rpx;" src="../static/images/service.png" mode=""></image></view>
					
					<!-- 内页返回 -->
					<view class="navi-img" v-if="conBack" @click="back()"><image style="width:20rpx;height:34rpx;" src="../static/images/back.png" mode=""></image></view>
				
				</view>
			</view>
			<text id="navigationText">{{a}}</text>
			
		</view>
		
		<!-- 占位 -->
		<view :style="'height:' +  demo.height + 'px;' + 'padding-top:' + demo.top + 'px;padding-bottom:10rpx'">
			
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				demo: {
					top: 0,
					height: 0
				},
				a: '测试' ,//navigatorBarText,
				indexSer: false,  //首页客服
				indexAd: false, //首页地区
				conBack: true  ,//返回按钮
				city: '四川'
			}
		},
		methods: {
			back() {
				try{
				//正常执行的代码
				//如果出错，抛出错误
					let pages = getCurrentPages();  //获取所有页面栈实例列表
					let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					
					if(!prevPage) {
						uni.switchTab({
							url: '/pages/index/index'
						})
					}
					else {
						uni.navigateBack();
					}
				}catch(err){
					//处理错误
					console.log('err');
					uni.switchTab({
						url: '/pages/index/index'
					})
				}
			},
			toSer() { //客服
				// uni.navigateTo({
				// 	url: '/pages/user/servRobot'
				// })
			}
		},
		created () {  //确认导航高度
            const demo = uni.getMenuButtonBoundingClientRect()
            this.demo.top = demo.top
            this.demo.height = demo.height
			
			let navHeight = demo.top + demo.height;
			// console.log(this.demo.top);
        },
		// mounted() {
		// 	document.querySelector('.index-header').style.offsetTop = navHeight + 'px';
		// }
	}
</script>

<style>
	/* 通用 固定导航栏 */
	.demo{
		position: fixed;
		width: 100vw;
		display: flex;
		align-items: center;
		justify-content: center;
		background:linear-gradient(to bottom,#3C94CF,#4DA8E4);
		font-size: 36rpx;
		z-index: 999;
		color: white;	
	}
    .demo .left{
		float: left;
		position: absolute;
		width: max-content;
		height: max-content;
		top: 0;
		bottom: 0;
		left: 20rpx;
		margin: auto;
	}
    .demo #navigationText{
		color: white;	            
	}
	.navi-img {
		width: 70rpx;
	}
	.index-ad {
		margin-top: 26rpx;
	}
	.index-ad image {
		width: 30rpx;
		margin-right: 12rpx;
	}
</style>
