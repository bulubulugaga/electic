<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 消息 -->
		<view class="news-con w-con bg-white border-r-20 hide mt20" @click="toNewsDetail(item)" v-for="(item,index) in news" :key="index"
			 @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend($event,item.id,index)"
			 v-if="item.isShow">
			<view class="news-ti flex-middle">
				<image class="news-icon" src="../../static/images/news01.png" mode=""></image>
				<view class="f30">{{item.title}}</view>
				<view class="time f24 c999">{{item.time}}</view>
			</view>
			<view class="news-detail">
				
				<view class="f26 c999">
					<rich-text :nodes="item.content"></rich-text>
				</view>
			</view>
		</view>
		<view class="news-tip txt-cen c999 f24">
			左滑可删除信息~
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
				news:[  //消息内容
					
				],
				
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
				endX: 0,
				
				show:true,
				styleobj :{
					fontSize:'30px',
					color:'red'
				}
					
			}
		},
		methods: {
			getNews () {  //获取消息
				let _this = this;
				let ad = this.$store.state.addrId;
				let data= {
					page: 1,
					perPage: 90
				}
				this.$listapi.allNews(this.$store.state.sessionId,0,ad,data).then(res => {
					_this.news = res.data.collection;
					_this.news.forEach(item=>{
						_this.$set(item,'time',item.createdAt.replace(/T/,' ')); 
						_this.$set(item,'isShow',true); 
						item.content = item.content.replace(/style/g,'class').replace(/<img/g,'<img style="display:none;"')
					})
				})
			},
			toNewsDetail(item) { //新闻详情

				let item1 = encodeURIComponent(JSON.stringify(item));	
				uni.navigateTo({
					url: '/pages/index/newsDetail?item=' + item1 + '&kind=' + 3
				})
			},
			handletouchmove: function(event) {
						if (this.flag !== 0) {
							return;
						}
						let currentX = event.touches[0].pageX;
						let currentY = event.touches[0].pageY;
						let tx = currentX - this.lastX;
						
						let ty = currentY - this.lastY;
						let text = '';
						let flag = 0;
						this.mindex = -1;
						//左右方向滑动
						if (Math.abs(tx) > Math.abs(ty)) {
							if (tx < 0) {
								text = '向左滑动';
								flag = 1;
							//	this.getList();  //调用列表的方法
							} else if (tx > 0) {
								text = '向右滑动';
								flag = 2;
							}
						}
						//上下方向滑动
						else {
							if (ty < 0) {
								text = '向上滑动';
								flag = 3;
							//	this.getList();  //调用列表的方法
							} else if (ty > 0) {
								text = '向下滑动';
								flag = 4;
							}
						}
			
						//将当前坐标进行保存以进行下一次计算
						this.lastX = currentX;
						this.lastY = currentY;
						this.text = text;
						this.flag = flag;
					},
					handletouchstart: function(event) {
						this.endX = 0;
						this.lastX = event.touches[0].pageX;
						this.lastY = event.touches[0].pageY;
					},
					handletouchend: function(event,id,index) {
						this.endX = event.changedTouches[0].clientX;
						let _this = this;
						if(this.flag == 1) {
							if(this.lastX - this.endX >= 150) {
								this.$listapi.delNews(this.$store.state.sessionId,id).then(res=>{
									if(res.data.code = 'success') {
										_this.news[index].isShow = false;
									}
								})
							}
						}
						
						
						
						this.flag = 0;
						this.text = '没有滑动';
					},
			 
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '消息';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res => {
				this.getNews();			
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			});
			this.$over();
			
		}
	}
</script>

<style>
	.news-ti {
		height: 74rpx;
		background-color: #E0E0E0;
	}
	.news-ti .time {
		margin-left: auto;
		margin-right: 15rpx;
	}
	.news-icon {
		width: 32rpx;
		height: 32rpx;
		margin: 0 15rpx 0 20rpx;
	}
	.news-detail {
		padding: 10rpx 20rpx 20rpx;
		line-height: 38rpx;
	}
	.news-detail rich-text {
		max-height: 119rpx;
		display: block;
		overflow: hidden;
	}
	.news-detail>view:first-child {
		margin-bottom: 5rpx;
	}
	.news-tip {
		line-height: 70rpx;
	}
	
	.test {
		width: 100%;
		height: 100rpx;
		background: pink;
	}
	
</style>
