<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 新闻中心  -->
		<view class="news bg-white">
			<view class="flex-middle">
				<view class="news-title flex-cover">
					<text class="in-block f30 mr30 c999" :class="{borderB:item.color}" v-for="(item,index) in newsType" :key="index"
					 @click="newsSwitch(index)">{{item.title}}</text>
				</view>
			</view>
			<view class="news-con-a bg-con">
				<view class="news-con" v-show="index < page * perpage" v-for="(item,index) in news" :key="index" @click="toNewsDetail(item)">
					<text class="news-con-ti f30 FB">{{item.title}}</text><br>
					<rich-text class="news-con-de f26 c999" :nodes="item.content"></rich-text>
					<view class="mt15">
						<image class="time-img" src="../../static/images/index_time.png" mode="widthFix" />
						<text class="f26 c999">发布时间：{{item.time}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="f24 c999 txt-cen mt30">{{tip}}</view>
		<loading></loading>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				newsType: [ //消息分类
					{
						title: '通知中心',
						color: true
					},
					{
						title: '新闻中心',
						color: false
					},
				],
				newsKind: 0, // 0 通知  1新闻
				news: [], //显示的新闻或通知
				newsBei: [],
				
				page: 1,
				perpage: 8,
				tip: '没有更多了~'
					
			}
		},
		methods: {
			getNews (type) {  //获取消息
				let _this = this;
				this.$loading(false);
				this.$loading(true);
				let data = {
					page: 1,
					perPage: 99999
				}
				let ad = this.$store.state.addrId;
				this.$listapi.allNews(this.$store.state.sessionId,type,ad,data).then(res => {
					_this.news = res.data.collection;
					_this.news.forEach(item=>{
						_this.$set(item,'time',item.createdAt.replace(/T/,' ')); 
							item.content = item.content.replace(/style/g,'class').replace(/<img/g,'<img style="display:none;"')
					})
					_this.newsBei = _this.news;
					_this.$loading(false);
					
					if(_this.news.length/_this.perpage > 1) {
						_this.tip = '加载中……';
					}else {
						_this.tip = '没有更多了~';
					}
				})
				this.$over();
			},
			newsSwitch(index) { //切换消息类别
				//修改样式
				this.page = 1;
				this.newsType.forEach(item => {
					item.color = false;
				})
				this.newsType[index].color = true;
			
				//通过类别获取消息
				// this.getNews(this.newsType[index].title);
				
				if(this.$store.state.login) {
					this.getNews(index+1);
				}
				
			
				this.newsKind = index;
			},
			toNewsDetail(item) { //新闻详情
				let item1 = encodeURIComponent(JSON.stringify(item));	
				uni.navigateTo({
					url: './newsDetail?item=' + item1 + '&kind=' + this.newsKind
				})
			},
			 
		},
		onReachBottom() {
			let _this = this;
			let total = Math.ceil(this.newsBei.length / this.perpage);
			if(this.page < total) {
				_this.tip = '加载中……';
				setTimeout(function() {
					_this.page++;
				},1000);
			}
			else {
				this.tip = '没有更多了~';
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '通知和新闻';  //修改navigatorBarText
			
			let app = getApp();
			let _this = this;
			app.login(this).then(res => {
				
				if(this.$store.state.login) {
					this.getNews(1);
				}
				
			});
			this.$over();
		}
	}
</script>

<style>
	/* 新闻 */
	.news-con {
		/* margin: 30rpx auto 0; */
		padding: 10rpx 30rpx 48rpx;
		/* background-color: #F2F2F2; */
		border-radius: 20rpx;
		margin-bottom: 30rpx;
		box-sizing: border-box;
		border-bottom: 1rpx solid #f2f2f2;
	}
	
	.news-title {
		line-height: 75rpx;
	}
	
	.news-title text {
		width: 200rpx;
		text-align: center;
	}
	
	.news-con-a {
		padding: 30rpx 30rpx 10rpx;
		background: white;
		border-top: 1rpx solid #f2f2f2;
		margin-top: -2rpx;
	}
	
	.news-con-ti {
		text-decoration: underline;
		color: #555;
	}
	
	.mr30 {
		margin-right: 30rpx;
	}
	
	.news .time-img {
		width: 40rpx;
		margin-right: 20rpx;
		vertical-align: middle;
	}
	
	.news-con-de {
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		margin-top: 10rpx;
		line-height: 40rpx;
		max-height: 120rpx;
	}
	
	.borderB {
		color: #31D8B6;
		font-weight: bold;
		/* border-top: 1rpx solid #4da8e5;
		border-right: 1rpx solid #4da8e5;
		border-left: 1rpx solid #4da8e5;
		border-bottom: 1rpx solid white;
		background: white; */
	}
	.news-title {
		width: 70%;
		margin-left: 15%;
	}
	.aa {
		width: 10rpx;
		height: 17rpx;
	}
</style>
