<template>
	<view class="content" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 顶部 -->
		<view class="index-header bg-white">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
			<view class="indexH-swiper">
				<swiper circular="true" indicator-dots="true" indicator-color="white" indicator-active-color="#4DA8E5" autoplay="true">
					<swiper-item v-for="(item,index) in ader" :key="index">
						<image class="border-r-20" :src="item.imagePath" alt="">
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<!-- 功能选项 -->
		<view class="fun-choice bg-white">
			<view class="fun-choice-item" @click="toOrder()">
				<image src="../../static/images/index_fun01.png" mode=""></image>
				<text>
					开始接单
				</text>
			</view>
			<view class="fun-choice-item" @click="toIncome()">
				<image src="../../static/images/index_fun02.png" mode=""></image>
				<text>今日收入</text>
			</view>
			<view class="fun-choice-item" @click="toBill()">
				<image src="../../static/images/index_fun03.png" mode=""></image>
				<text>今日接单</text>
			</view>
			<view class="fun-choice-item" @click="toInfor()">
				<image src="../../static/images/index_fun04.png" mode=""></image>
				<text>排行榜</text>
			</view>
		</view>
		
		<!-- 数据统计 -->
		<view class="index-data bg-white w-con border-r-20 mt20 flex-cover">
			<view class="index-data1">
				<view class="f28">总接单量</view>
				<view class="colorCon f30">{{billNum}}单</view>
			</view>
			<view class="index-data1">
				<view class="f28">订单总收入</view>
				<view class="colorCon f30">{{Salary}}元</view>
			</view>
		</view>
		
		<!-- 订单 -->
		<view class="index-bill" v-if="isOn">
			
			<!-- 订单选择 -->
			<view class="index-bill-nav flex">  
				<view class="index-bill-nav-item active">
					<text>进行中订单</text>
				</view>
			</view>
			
			<!-- 订单内容 -->
			<view class="index-bill-con">
				<view v-if="item.state!='已完成' && item.state!= '已取消'" class="index-bill-con-de bg-white w-con flex" v-for="(item,index) in billDetail" :key="index" @click="toDetail(item)">
					<view class="img ml20 circle hide">
						<image class="wh" :src="item.wxPhoto"></image>
					</view>
					<view class="person f26 ml15">
						<text>{{item.name}}</text>
					</view>
					<view class="type colorCon f26 ml15">
						<text>{{item.type}}</text>
					</view>
					<view class="state f26 mr15 c999 colorCon">
						<text>{{item.state}}</text>
						<!-- <text>{{进行中}}</text> -->
						<image class="ml10" src="../../static/images/more.png" />
					</view>
				</view>
			</view>
		</view>
		
		<!-- 新闻中心  -->
		<view class="news mt20 bg-white">
			<view class="flex-middle">
				<view class="news-title flex">
					<text class="in-block f30 mr30 c999" :class="{borderB:item.color}" v-for="(item,index) in newsType" :key="index"
					 @click="newsSwitch(index)">{{item.title}}</text>
				</view>
				<view class="f24 ml-auto mr30 c999" @click="allNews()">
					更多
					<image class="aa ml10" src="../../static/images/more.png"></image>
				</view>
				
			</view>
			<view class="news-con-a bg-con">
				<view class="news-con" v-for="(item,index) in news" :key="index" @click="toNewsDetail(item)">
					<text class="news-con-ti f30 FB">{{item.title}}</text><br>
					<rich-text class="news-con-de f26 c999" :nodes="item.content"></rich-text>
					<view class="mt15">
						<image class="time-img" src="../../static/images/index_time.png" mode="widthFix" />
						<text class="f26 c999">发布时间：{{item.time}}</text>
					</view>
				</view>
			</view>
		</view>
		
		
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import map from '../../static/map/qqmap-wx-jssdk.min.js'; //腾讯地图

	export default {
		data() {
			return {	
				billDetail: [ //订单
					
				],
				newsType: [ //消息分类
					{title: '通知中心',color: true},
					{title: '新闻中心',color: false},
				],
				newsKind: 0, // 0 通知  1新闻
				
				news: [], //新闻列表
				loadMore1: '加载更多',  //底部文字
				loadMore2: '加载更多',
				perPage: 5  ,//每页加载条数
				
				city: '四川',
				
				isOn: false,  //进行中订单是否显示
				
				billNum: 0, //接单量
				Salary: 0, //收入
				
				ader: []  ,//轮播图
				
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
				endX: 0,
			}
		},
		onLoad() {
			this.$refs.son.a = '电工联盟';  //修改navigatorBarText
			this.$refs.son.indexSer = false;  //头部显示客服
			this.$refs.son.conBack = false;  //隐藏返回
			this.$refs.son.indexAd = true;
			
			this.getLocation();
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				
				if(this.$store.state.info.imageList.length == 0) {
					
				}
				else if(this.$store.state.info.info) {
					
					
					if(this.$store.state.info.info.stateName == '已审核') {
						_this.getBill(); //获取订单
						_this.getNews(1);
						_this.newsType = [
							{title: '通知中心',color: true},
							{title: '新闻中心',color: false},
						],
						_this.newsKind = 0;
					}
				}
				
				
				
				this.ader = this.$store.state.info.adverts;
				setTimeout(function(){_this.$loading(false);},1000);
			})
			this.$over();
				
		},        
		methods: {
			isNull(data) { //判断是否为空
				if(data == null || data == '') {
					data = 0;
				}
				return Number(data);
			},
			getWallet() {  //获取钱包余额
				this.$listapi.walletSum(this.$store.state.sessionId).then(res => {
					this.Salary = this.isNull(res.data.collection[0].addUpAmount);
				})
			},
			getNews(type) { //获取未读消息
				let _this = this;
				let news = [];
				// this.$listapi.noneNews(this.$store.state.sessionId,type).then(res => {				
				// 	news = res.data.collection;
				this.$loading(true);
				let data= {
					page: 1,
					perPage: 2
				}
				let ad = this.$store.state.addrId;
					_this.$listapi.allNews(_this.$store.state.sessionId,type,ad,data).then(res1 => {						
						news.push.apply(news,res1.data.collection);	
						news.forEach(item=>{
							_this.$set(item,'time',item.createdAt.replace(/T/,' ')); 
							item.content = item.content.replace(/style/g,'class').replace(/<img/g,'<img style="display:none;"')
						})
						_this.news = news;
						_this.$loading(false);
					})			
				// })
			},
			getBill() { //获取订单信息
				let _this = this;
				let bill = [];
				this.$listapi.getBill(this.$store.state.sessionId).then(res => {
					bill = res.data.collection;
					_this.billNum = bill.length;
					_this.Salary = 0;
					bill.forEach(item => {
						_this.$set(item, 'adLa', item.gpsLatitude); //存储地址信息
						_this.$set(item, 'adLo', item.gpsLongitude); //存储地址信息
						_this.$set(item, 'allAd', item.address + '-+-' + item.number); //存储完整地址信息
						item.orderdAt = item.orderdAt.replace(/T/g, " ");
						item.address = item.address.split('-*-')[1];
						this.$set(item, 'isRemark', false);  //是否评价
						switch(item.state) {
							case -1: 
							case 0: {
								item.state = '等待接单';
								this.$set(item, 'priceDis', false);
								this.$set(item, 'btn', '取消订单');
								this.$set(item, 'isBtn', true);
								this.$set(item,'stateGreen' ,false); //状态颜色绿色
								this.$set(item,'stateYellow' ,true);
								this.$set(item,'stateRed' ,false);
								break;
							}
							case 1: {
								item.state = '等待验证服务码';
								this.$set(item, 'priceDis', false);
								this.$set(item, 'btn', '输入服务码');
								this.$set(item,'stateGreen' ,false); //状态颜色绿色
								this.$set(item,'stateYellow' ,true);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'pricePhoto' ,false);
								this.$set(item,'adDis' ,false);
								this.$set(item,'suDis' ,true);
								this.$set(item,'quDis' ,true);
								break;
							}
							case 2: {
								item.state = '费用报价';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '输入费用');
								this.$set(item, 'price', '上传现场照');
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'pricePhoto' ,true);
								this.$set(item,'adDis' ,false);
								this.$set(item,'suDis' ,true);
								this.$set(item,'quDis' ,true);
								break;
							}
							case 3: {
								item.state = '等待支付';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '修改费用');
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'pricePhoto' ,false);
								this.$set(item,'adDis' ,false);
								this.$set(item,'suDis' ,false);
								this.$set(item,'quDis' ,true);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
								break;
							}
							case 9: {
								item.state = '支付完成';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '确认订单');
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'pricePhoto' ,false);
								this.$set(item,'adDis' ,false);
								this.$set(item,'suDis' ,true);
								this.$set(item,'quDis' ,false);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
								_this.Salary = _this.Salary + item.doorFee + item.serviceFee;
								break;
							}
							case 10:
							case 11:
							case 12: {
								item.state = '已完成';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '评价订单');
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'pricePhoto' ,false);
								this.$set(item,'adDis' ,false);
								this.$set(item,'suDis' ,false);
								this.$set(item,'quDis' ,false);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
								break;
							}
							case -100: {
								item.state = '已取消';
								this.$set(item, 'priceDis', false);
								this.$set(item, 'btn', '');
								this.$set(item,'stateGreen' ,false); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,true);
								this.$set(item,'pricePhoto' ,false);
								this.$set(item,'adDis' ,false);
								this.$set(item,'suDis' ,false);
								this.$set(item,'quDis' ,false);
								break;
							}
						}
					})
					
					let l = 0;
					bill.forEach(item=> {
						if(item.state != '已完成' && item.state != '已取消') {
							l++;
						}
					})
					if(l == 0) {
						_this.isOn = false;
					}
					else {
						_this.isOn = true;
					}
					_this.billDetail = bill;
					if(_this.Salary == 0) {
						_this.Salary = '0.00';
					}
					else {
						_this.Salary = parseFloat(_this.Salary).toFixed(2);
					}
					
				})
			},
			toIncome() { //跳转至会员中心
				uni.navigateTo({
					url: '/pages/user/income'
				})
			},
			toInfor() { //跳转至排行榜
				uni.navigateTo({
					url: '/pages/user/ranking'
				})
			},
			toOrder() { //跳转至接单页面
				uni.navigateTo({
					url: './order'
				})
			},
			toBill() { //跳转至今日订单
				uni.navigateTo({
					url: '/pages/user/toBill'
				})
			},
			toDetail(item) { //Id是订单编号，跳转到订单详情
				// let item1 = encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: '/pages/bill/detail?item='+item.id
				});
			},
			newsSwitch(index) { //切换消息类别
				//修改样式
				this.newsType.forEach(item=>{
					item.color = false;
				})
				this.newsKind = index;
				this.newsType[index].color = true;
				
				if(this.$store.state.info.imageList.length == 0) {
					
				}
				else if(this.$store.state.info.info) {
					if(this.$store.state.info.info.stateName == '已审核') {
						this.getNews(index+1);
					}
				}
				
			},
			toNewsDetail(item) { //新闻详情
				let item1 = encodeURIComponent(JSON.stringify(item));	
				uni.navigateTo({
					url: './newsDetail?item=' + item1 + '&kind=' + this.newsKind
				})
			},
			getLocation() {
				let that = this;
			
				let qqmapsdk = new map({
					key: that.$store.state.mapKey //腾讯地图生成的key
				});
			
				uni.getLocation({ //uniapp获取经纬度
					type: 'gcj02',
					success: function(res) {
						let latitude = res.latitude;
						let longitude = res.longitude;
			
						qqmapsdk.reverseGeocoder({ //腾讯题图逆解析地址
							location: {
								latitude: latitude,
								longitude: longitude
							},
							success(res) {
								that.$refs.son.city = res.result.address_component.district;
								// console.log(that.$refs.son.city);
							},
							fail(err) {
								console.log(err);
							}
						})
			
					},
					fail(err) {
						console.log(err);
					}
				});
			
			},
			allNews() { //查看所有信息
				uni.navigateTo({
					url: './allNews'
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
			handletouchend: function(event) {
				this.endY = event.changedTouches[0].clientY;
				let _this = this;
				if(this.flag == 4) {
					if(this.endY - this.lastY >= 80) {
						let pages = getCurrentPages();
						let beforePage = pages[pages.length - 1]; // 当前页面
						beforePage.onLoad();
					}
				}
			}
		},
		components: {
			Nav
		}
	}
</script>

<style>
	.content {
		min-height: 90vh;
	}
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#3C94CF,#419FDC) !important;
	}
	/* 顶部 */
	.index-header {
		width: 100%;
		height: 312rpx;
		position: relative;
		z-index: 0;
	}
	.indexHBg {
		width: 100%;
		height: 100rpx;
	}
	.indexH-swiper {
		position: absolute;
		top: 17rpx;
		width: 94.93%;
		left: 2.535%;
		height: 300rpx;
	}
	.indexH-swiper swiper {
		height: 300rpx;
	}
	.indexH-swiper swiper swiper-item image {
		width: 100%;
		height: 300rpx;
		border-radius: 20rpx;
	}
	
	/* 功能选项 */
	.fun-choice {
		/* width: 100%; */
		padding-left: 2.535%;
		padding-right: 2.535%;
		height: 150rpx;
		padding-top: 28rpx;
		padding-bottom: 28rpx;
		display: flex;
	}
	.fun-choice-item {
		width: 25%;
	}
	.fun-choice-item image {
		width: 100rpx;
		height: 100rpx;
		margin-left: 40rpx;
	}
	.fun-choice-item text{
		display: block;
		text-align: center;
		font-size: 30rpx;
		margin-top: 6rpx;
	}
	
	/* 订单 */
	.index-bill-nav {
		margin-top: 20rpx;
		line-height: 66rpx;
		font-size: 28rpx;
		background: white;
		padding-left: 6.2%;
	}
	.index-bill-nav-item {
		display: inline-block;
		margin-right: 54rpx;
		color: #999999;
	}
	.index-bill-nav-item.active {
		color: #4DA8E5;
	}
	.index-bill-nav .img {
		width: 30rpx;
		height: 20rpx;
		margin-left: 274rpx;
	}
	.index-bill-con-de {
		height: 82rpx;
		margin-top: 10rpx;
		border-radius: 20rpx;
		align-items: center;
	}
	.index-bill-con-de .img {
		width: 60rpx;
		height: 60rpx;	
	}
	.index-bill-con-de .person {
		line-height: 82rpx;
	}
	.index-bill-con-de .type {
		border: 1rpx solid #4DA8E5;
		line-height: 47rpx;
		height:47rpx;
		padding: 0 18rpx;
		border-radius: 10rpx;
	}
	.index-bill-con-de .state {
		flex: 1;
		text-align: right;
	}
	.index-bill-con-de .state image,.aa {
		width: 10rpx;
		height: 17rpx;
	}
	.index-bill-con-de .colorCon {
		color: #4da8e5;
	}
	
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
		width: 163rpx;
		text-align: center;
	}
	
	.news-title text:first-child {
		margin-left: 40rpx;
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
		color: #4da8e5;
		font-weight: bold;
		/* border-top: 1rpx solid #4da8e5;
		border-right: 1rpx solid #4da8e5;
		border-left: 1rpx solid #4da8e5;
		border-bottom: 1rpx solid white;
		background: white; */
	}
	/* .borderB {
		color: white;
		border-top: 1rpx solid #ccc;
	} */
	
	.news-title {
		width: 70%;
		/* margin-left: 15%; */
	}
	
	
	/* 数据统计 */
	.index-data {
		height: 150rpx;
		padding: 24rpx 0;
		box-sizing: border-box;
	}
	.index-data>view {
		width: 50%;
		text-align: center;
	}
	.index-data1 {
		border-right: 1rpx solid #f2f2f2;
	}
	.index-data>view .f30 {
		margin-top: 14rpx;
		font-size: 32rpx;
	}
	
</style>
