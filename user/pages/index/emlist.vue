<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 地图 -->
		<view class="list-map">
			<map style="width: 750rpx; height: 600rpx;" :latitude="latitude" :longitude="longitude" 
			:markers="covers">
			</map>
		</view>
		
		<!-- 内容 -->
		<view class="emlist-con w-con">
			<view class="emlist-ch flex">
				<view class="ml-auto flex-middle" @click="isDis = true">
					<view class="colorCon f30">{{Arr[index]}}</view>
					<view class="flex-middle"><image class="san" src="../../static/images/san.png" mode=""></image></view>
				</view>
			</view>
			<radio-group>
				<view class="emlist-con-de bg-white flex-middle mt15 border-r-20" :class="{emChecked:item.issoso}" v-for="(item,index) in list" :key="index" 
					@click="toEmDetail(item,index)">
					<view @click.stop = "radioChange(index)"><radio :checked="item.issoso" color="#00b896" /></view>
					<view><image class="photo circle" :src="item.wxPhoto" mode=""></image></view>
					<view class="emlist-con-de-de pr">
						<view class="f30 pa">{{item.name}}</view>
						<view class="f26 c999 pa">接单量：{{item.completeCount}}</view>
						<view class="star">
							<!-- <uni-rate size='11' max="5" :value="item.star" active-color="#fecb01" margin="1" disabled></uni-rate>
							<text class="f18">{{item.star.toFixed(1)}}</text> -->
							
							<uni-rate size='11' max="5" :value="item.average" active-color="#fecb01" margin="1" disabled></uni-rate>
							<text class="f18">{{item.average}}</text>
						</view>
					</view>
					<view class="more">
						<image src="../../static/images/more.png" mode=""></image>
					</view>
				</view>
			</radio-group>
		</view>
		
		<view class="blank">
			
		</view>
		
		<!-- 底部 -->
		<view class="order-footer bg-white flex-middle" v-if="prev=='order'">
			<button class="white bg-con f30" @click="backOrder()">确认选择电工</button>
		</view>
		
		<!-- 筛选 -->
		<view class="type-ch" v-show="isDis" @click="isDis=false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">选择电工分配类型</view>
						<view><image src="../../static/images/type_ch.png" mode=""></image></view>
					</view>
					<view class="type-items">
						<view class="type-item f28" v-for="(item,index) in Arr" :key="index" @click="change(index)">
							{{item}}
						</view>
					</view>
					<view class="type-ch-cancel" @click="isDis=false">
						×
					</view>
				</view>
			</view>
		</view>
		<!-- <loading></loading> -->
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	import map from '../../static/map/qqmap-wx-jssdk.min.js';  //腾讯地图
	
	export default {
		data() {
			return {
				list: [],  //电工列表
				listBei: [],  //电工备份
				current: 0  ,//当前选中的电工
				prev: '', //上一个页面
				
				isDis: false, //筛选窗口
				Arr: ['全部','接单量排序','已有服务'], //筛选选项
				index: 0, //已选下标
				
				latitude: 39.909,  //经纬度
				longitude: 116.39742,
				covers: [ //标记显示的位置
					
				],
				
			}
		},
		onLoad(option) {
			
			this.$refs.son.a = '电工列表';  //修改navigatorBarText
			this.$refs.son.indexSer = false;  //头部隐藏客服
			this.$refs.son.conBack = true;  //显示返回
			
			this.current = option.emRadio;
			this.prev = option.prev;
			
			this.$loading(false);	
			let app = getApp();
			let _this = this;
			this.$loading(true);	
			app.login(this).then(res=> {
				
				this.ava = this.$store.state.avatarUrl;
				this.name = this.$store.state.userName;
				
				_this.getList();
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			this.$over();
			
		},        
		methods: {
			radioChange: function(index) {  //单选框选中值改变
				this.current = index;
				this.list.forEach(item=>{
					item.issoso = false;
				});
				this.list[index].issoso = true;
			},
			getList() {
				let _this = this;
				uni.getLocation({
					type: 'gcj02',
					success: function(res) {
						console.log(res);
						_this.latitude = res.latitude;
						_this.longitude = res.longitude;
					}
				})
				
				this.$listapi.getEm(this.$store.state.sessionId).then(res=>{
					this.list = [];
					res.data.collection.forEach(item=>{
						if(item.name == '' || item.name == null || !item.name) {
							
						}
						else {
							this.list.push(item);
						}
					})
					let cover = {};
					this.list.forEach(item=>{
						item.average = Number(item.average).toFixed(1);
						this.$set(item,'issoso',false);
						cover =  {
							latitude: item.gpsLatitude,
							longitude: item.gpsLongitude,
							iconPath: item.wxPhoto,
							width: '60rpx',
							height: '60rpx',
							callout: {
								content: item.name
							}
						}
						this.covers.push(cover);
					})
					this.list[this.current].issoso = true;
					this.listBei = this.list;
				})
			},
			toEmDetail(item,index) { //电工列表详情
				let item1 = encodeURIComponent(JSON.stringify(item));	
				if(this.prev == 'index') {
					this.radioChange(index);
				}
				uni.navigateTo({
					url: './emdetail?item='+item1 + '&prev=' + this.prev + '&emRadio=' + this.current
				})
			},
			backOrder() { //选择电工后返回上一页
				if(this.list == [] || this.list == '' || this.list == null) {
					uni.showToast({
						title: '您没有选择电工',
						icon: 'none',
						duration: 1200
					})
				}
				else {
					let pages = getCurrentPages();             //获取所有页面栈实例列表
					let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
					
					prevPage.$vm.emDis = true;
					prevPage.$vm.em = this.list[this.current];
					prevPage.$vm.emRadio = this.current;
					prevPage.$vm.distriIndex = 1;
					
					uni.navigateBack({
						delta: 1
					})
				}
			},
			change(index) { //选择分类
				this.index = index;
				this.list = [];
				
				//传参调取接口
				switch(index) {
					case 0: this.list = this.listBei;break;  //全部
					case 1:   //单量排序
						this.list = this.listBei;
						this.list.sort(function(a,b){return (b.completeCount - a.completeCount)});
						break;
					case 2:  //已有服务
						let _this = this;
						this.listBei.forEach(item=>{
							this.$listapi.getRemark(this.$store.state.sessionId,item.id).then(res=>{
								let l = res.data.collection;
								// console.log(l);
								try {  //用抛出异常的方式结束循环
								    l.forEach(item1=>{
										let ph1 = item1.wxPhoto.split('https://wx.qlogo.cn/')[1];
										let ph2 = _this.$store.state.avatarUrl.split('https://thirdwx.qlogo.cn/')[1];
										
										// if(item1.wxName == _this.$store.state.userName && ph1 == ph2) {
										if(item1.wxName == _this.$store.state.userName) {
											_this.list.push(item);
											throw new Error("EndIterative");
										}
								    })
								    
								} catch(e) {
								    if(e.message!="EndIterative") throw e;
								};
							})
						})
					
				}
				
				
				this.isDis = false;
			}
		},
		components: {
			Nav
		},
		mounted() {
			
		}
	}
</script>

<style>
	
	.list-map {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw; 
		height: 600rpx;
		z-index: -1;
	}
	.list-map map {
		z-index: -1;
	}
	
	
	/* 内容 */
	.emlist-ch {
		position: fixed;
		top: 600rpx;
		height: 64rpx;
		width: 94.93%;
	}
	.emlist-ch .san {
		width: 22rpx;
		height: 14rpx;
		margin-top: 2rpx;
		margin-left: 8rpx;
	}
	
	radio-group {
		position: fixed;
		top: 660rpx;
		width: 94.93%;
		height: calc(100vh - 614rpx - 50rpx);
		overflow: scroll;
	}
	
	.emlist-con-de:first-child {
		margin-top: 0;
	}
	.emlist-con-de {
		box-sizing: border-box;
		height: 152rpx;
	}
	.emChecked {
		background-color: #31D8B6;
		color: white;
	}
	.emChecked .c999 {
		color: white;
	}
	.emlist-con-de radio {
		transform: scale(0.7);
		margin-left: 10rpx;
	}
	.emlist-con-de image.photo {
		width: 100rpx;
		height: 100rpx;
	}
	.emlist-con-de-de {
		width: 340rpx;
		height: 100%;
		margin-left: 25rpx;
	}
	.emlist-con-de-de .f30 {
		top: 36rpx;
	}
	.emlist-con-de-de .f26 {
		top: 95rpx;
	}
	.emlist-con-de .more {
		margin-left: auto;
		margin-right: 26rpx;
	}
	.emlist-con-de .more image {
		width: 12rpx;
		height: 24rpx;
	}
	.star uni-rate {
		display: inline-block;
		
	}
	.star {
		position: absolute;
		top: 29rpx;
		left: 116rpx;
	}
	.star .f18 {
		display: inline-block;
		font-size: 20rpx;
		color: #fecb01;
		margin-left: 15rpx;
		font-weight: bold;
	}
	
	.blank {
		width: 100%;
		height: 130rpx;
	}
	
	/* 底部 */ 
	.order-footer {
		width: 100%;
		height: 100rpx;
		position: fixed;
		bottom: 0;
		z-index: 3;
	}
	.order-footer button {
		width: 275rpx;
		height: 63rpx;
		line-height: 63rpx;
		border-radius: 100rpx;
	}
	
	/* 筛选 */
	.type-ch {
		position: fixed;
		top: 0;
		background: rgba(0,0,0,.5);
		width: 100%;
		height: 100%;
		z-index: 10;
	}
	.type-ch-con {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 395rpx;
		background: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-sizing: border-box;
		padding: 10rpx 0;
	}
	.time-ch-con {
		height: 500rpx;
	}
	.type-ch-title image {
		width: 18rpx;
		height: 13rpx;
		margin-left: 8rpx;
		vertical-align: middle;
		margin-top: -5rpx;
	}
	.type-items {
		width: 80%;
		height: 300rpx;
		margin: 27rpx auto 0;
		overflow: scroll;
	}
	.type-item {
		height: 70rpx;
		line-height: 70rpx;
		border-bottom: 1rpx solid #E5E5E5;
	}
	.type-item:last-child {
		border-bottom: none;
	}
	.type-items-type view:last-child .type-item {
		border-bottom: none;
	}
	.type-item-con {
		line-height: 44rpx;
	}
	.type-ch-cancel {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		color: #ccc;
		font-size: 65rpx;
		line-height: 0;
	}
	
</style>
