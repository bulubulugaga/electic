<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 地图 -->
		<view class="map-con w">
			<map style="width: 750rpx; height: 890rpx;" :latitude="latitude" :longitude="longitude" :markers="covers">
			</map>
		</view>
		
		<!-- 地址显示 -->
		<view class="map-infor">
			<view class="f36 FB">用户地址</view>
			<view class="f24 c999">{{adress}}</view>
			<button class="white bg-con" @click="toAddress()">确认</button>
		</view>
		
		<loading></loading>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import map from '../../static/map/qqmap-wx-jssdk.min.js';  //腾讯地图
	export default {
		data() {
			return {
				id: 0, // 使用 marker点击事件 需要填写id
				title: 'map',
				latitude: 39.909,  //经纬度
				longitude: 116.39742,
				covers: [{  //标记显示的位置
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../static/images/location.png',
					width: '56rpx', 
					height: '67rpx'
				}],
				
				adress: '',
				title: ''
					
			}
		},
		methods: {
			getLocation(){
				let that = this;
				
				let qqmapsdk = new map({
				    key: that.$store.state.mapKey //腾讯地图生成的key
				});
				
				this.$loading(false);
				this.$loading(true);
				uni.getLocation({  //uniapp获取经纬度
				    type: 'gcj02',
				    success: function (res) {
				        // console.log('当前位置的经度：' + res.longitude);
				        // console.log('当前位置的纬度：' + res.latitude);
						that.latitude = that.covers[0].latitude = res.latitude;
						that.longitude = that.covers[0].longitude = res.longitude;
				    
						qqmapsdk.reverseGeocoder({  //腾讯题图逆解析地址
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success(res) {
								// console.log(res.result);
								that.adress = res.result.address;
								that.title = res.result.address_component.district + res.result.address_component.street;
								that.$loading(false);
							},
							fail(err) {
								console.log(err);
							}
						})
				   
					},
					fail(err) {
						console.log(err);
						if(err.errMsg = "getLocation:fail auth deny") {
							that.$loading(false);
							uni.showToast({
								title: '您没有开启定位服务，需要在设置中打开才能使用',
								icon: 'none',
								duration: 3000
							})
						}
					}
				});
				
			},
			toAddress() { //返回定位地址
				let pages = getCurrentPages();             //获取所有页面栈实例列表
				let nowPage = pages[ pages.length - 1];    //当前页页面实例
				let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
				
				prevPage.$vm.ader.ad = this.adress;             //修改上一页面的 couponNumber 参数值为 value
				prevPage.$vm.ader.ti = this.title;              //修改上一页面的 couid 参数值为 vid
				prevPage.$vm.ader.la = this.latitude;
				prevPage.$vm.ader.lo = this.longitude;
				
				
				
				uni.navigateBack({                         //uni.navigateTo跳转的返回，默认1为返回上一级
				    delta: 1
				});
				
				
			
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '用户地址';  //修改navigatorBarText
			
			this.getLocation();
			
		}
	}
</script>

<style>
	.map-infor {
		padding: 0 32rpx;
		margin-top: 30rpx;
	}
	.map-infor .f24 {
		margin-top: 20rpx;
		height: 60rpx;
	}
	.map-infor button {
		width: 342rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 36rpx;
		border-radius: 100rpx;
		margin-top: 46rpx;
	}
</style>
