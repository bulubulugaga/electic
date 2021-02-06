<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 地图 -->
		<view class="map-con w">
			<map style="width: 750rpx; height: 890rpx;" :polyline="polyline" :latitude="latitude" :longitude="longitude" :markers="covers">
			</map>
		</view>
		
		<!-- 地址显示 -->
		<view class="map-infor">
			<view class="f36 FB">用户地址</view>
			<view class="f26 c999">{{adress}}</view>
			<button class="white bg-con" @click="mapRou()">查看路线</button>
		</view>
		
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
				
				adress: '', //用户地址
				
				polyline: [] //路线	
			}
		},
		methods: {			
			mapRou() { //线路规划
				let that = this;
				let _this = this;
				uni.getSystemInfo({
					success(res) {
						var isopendingwei = res.locationEnabled;
						if (isopendingwei == false) {
							uni.showToast({
								title: '请先开启手机GPS定位,然后重新刷新',
								icon: 'none',
								duration: 1200
							});
							return 0;
						}
					}
				})
				let qqmapsdk = new map({
				    key: that.$store.state.mapKey //腾讯地图生成的key
				});
				uni.getLocation({
				    type: 'gcj02', //返回可以用于uni.openLocation的经纬度
				    success: function (res) {
						const latitude = Number(that.latitude);
				        const longitude = Number(that.longitude);
				        uni.openLocation({
				            latitude: latitude,
				            longitude: longitude,
				            success: function () {
				                console.log('success');
				            }
				        });
				    },
					fail: function() {
						uni.getSetting({
							success: function(res) {
								let statu = res.authSetting;
								if (!statu['scope.userLocation']) {
									uni.showModal({
										title: '是否授权当前位置',
										content: '需要获取您的地理位置，请确认授权，否则地图功能将无法使用',
										success: function(tip) {
											if (tip.confirm) {
												uni.openSetting({
													success: function(data) {
														if (data.authSetting["scope.userLocation"] === true) {
															uni.showToast({
																title: '授权成功',
																icon: 'success',
																duration: 1000
															})
															//授权成功之后，再调用chooseLocation选择地方
															uni.chooseLocation({
																success: function(res) {
																	const latitude = Number(that.latitude);
																	const longitude = Number(that.longitude);
																	uni.openLocation({
																	    latitude: latitude,
																	    longitude: longitude,
																	    success: function () {
																	        console.log('success');
																	    }
																	});
																},
															})
														} else {
															uni.showToast({
																title: '授权失败',
																icon: 'success',
																duration: 1000
															})
														}
													}
												})
											}
										}
									})
								}
							},
							fail: function(res) {
								uni.showToast({
									title: '调用授权窗口失败',
									icon: 'success',
									duration: 1000
								})
							}
						})
					}
				});
			}
		},
		components: {
			Nav
		},
		onLoad(options) {			
			this.$refs.son.a = '用户地址';  //修改navigatorBarText
			
			this.adress = options.ad;
			this.latitude = this.covers[0].latitude = options.la;
			this.longitude = this.covers[0].longitude = options.lo;
			// this.getLocation(options.ad);
			
		}
	}
</script>

<style>
	.map-infor {
		padding: 0 32rpx;
		margin-top: 30rpx;
	}
	.map-infor .f26 {
		margin-top: 20rpx;
	}
	.map-infor button {
		width: 342rpx;
		height: 80rpx;
		line-height: 80rpx;
		font-size: 36rpx;
		border-radius: 100rpx;
		margin-top: 65rpx;
	}
</style>
