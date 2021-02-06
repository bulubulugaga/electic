<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 分类 -->
		<view class="mt15 flex-cover" :style="'height: calc(100vh - ' + h + 'px)' ">
			<van-sidebar :active-key="firstIndex">
				
			  <van-sidebar-item v-for="(item, index) in typeArr" :key="index" @click="onChange(index)" :title="item.title" />
			  
			</van-sidebar>
			<view class="ca-con">
				<van-divider contentPosition="center" customStyle="padding: 0 120rpx;font-size: 28rpx;">
				  {{typeArr[firstIndex].title || ''}}
				</van-divider>
				<scroll-view scroll-y :scroll-top="scrollTop" :style="'height: calc(100vh - ' + h + 'px - 54px)' " @scroll="scroll">
					
					<view class="ca-con-de flex">
						<view class="ca-con-detail f28 txt-cen" v-for="(item, index) in typeArr[firstIndex].con" :key="index" @click="toOrder(index)">
							<!-- <image class="ca-img" src="../../static/images/indexHBg.png" mode=""></image> -->
							<view>{{item}}</view>
						</view>						
					</view>
					
				</scroll-view>
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
				h: 0,  //导航高度
				oldScrollTop: 0,
				scrollTop: 0,
				typeArr: [],
				firstIndex: 0,
				
				type: ''
			}
		},
		methods: {
			getBillState() { //获取订单类型
				this.$listapi.getBillState(this.$store.state.sessionId).then(res => {
					let arr = res.data.collection;
					let i = 0;
					arr.forEach((item, index) => {
						if (item.parentId == null || item.parentId == '') {
							this.typeArr.push({
								title: item.typeName,
								con: [],
								isDis: false
							});
							arr.forEach(item1 => {
								if (item.id == item1.parentId) {
									this.typeArr[i].con.push(item1.typeName);
								}
							})
							i++;
						}
					})
					
					let pages = getCurrentPages();
					let bpage = pages[pages.length - 2];
					console.log(bpage);
					if(bpage.route == "pages/index/order") {
						// this.firstIndex = i;
					}
					else {
						this.getFirstIndex(this.typeArr);
					}
				})
			},
			onChange(index) {  //切换一级分类
				this.firstIndex = index;
				this.scrollTop = this.oldScrollTop;
				this.$nextTick(function() {
					this.scrollTop = 0
				});
			},
			scroll(e) {
				this.oldScrollTop = e.detail.scrollTop;
			},
			getFirstIndex(typeArr) {  //获取默认选择的分类
				console.log(this.type);
				console.log(typeArr);
				if(this.type == 0) {
					this.firstIndex = 0;
				}
				else {
					for(let i in typeArr) {
						if(typeArr[i].title == this.type) {
							this.firstIndex = i;
							return 0;
						}
					}
				}
			},
			
			
			toOrder(index) {  //下单
				let aa = this.typeArr[this.firstIndex].con[index];
				console.log(aa);
				
				let pages = getCurrentPages();
				let bpage = pages[pages.length - 2];
				console.log(bpage);
				if(bpage.route == "pages/index/order") {
					bpage.$vm.szType = aa;
					bpage.$vm.cfIndex = this.firstIndex;
					bpage.$vm.csIndex = index;
					uni.navigateBack()
				}
				else {
					uni.reLaunch({
						url: '/pages/index/order?aa=' + aa + '&cfIndex=' + this.firstIndex + '&csIndex=' + index
					})
				}
			}
			 
		},
		components: {
			Nav
		},
		onLoad(options) {			
			this.$refs.son.a = '订单分类';  //修改navigatorBarText
			
			const demo = uni.getMenuButtonBoundingClientRect()
			this.h = demo.top + demo.height + 12.5
			
			this.type = options.type;
			if(options.cfIndex) {
				this.firstIndex = options.cfIndex
			}
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res => {
				this.getBillState();			
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			});
			this.$over();
			
		}
	}
</script>

<style>
	@import "/wxcomponents/vant/dist/common/index.wxss";
	van-sidebar {
		height: 100% !important;
		background: white;
		overflow: scroll;
	}
	.ca-con {
		width: 540rpx;
		background: white;
	}
	.ca-con-de {
		flex-wrap: wrap;
		/* overflow: scroll; */
	}
	.ca-img {
		width: 100%;
		height: 190rpx;
	}
	.ca-con-detail {
		box-sizing: border-box;
		width: 50%;
		line-height: 80rpx;
		padding: 0 10rpx;
	}
</style>
