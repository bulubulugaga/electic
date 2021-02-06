<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>

		<!-- 编辑地址 -->
		<view class="adress-con w-con">
			<view class="flex" @click="toMap()">
				<view class="f30">服务地址：</view>
				<view class="adress-con-ad">
					<text class="f26">{{ader.ti}}</text>
					<text class="f22 c999">{{ader.ad}}</text>
				</view>
				<view class="img flex-middle">
					<image src="../../static/images/ader.png" mode=""></image>
				</view>
			</view>
			<view class="flex-middle">
				<view class="f30">门牌号：</view>
				<input class="f26" type="text" value="" v-model="ader.num" />
			</view>
			<view class="flex-middle">
				<view class="f30">联系人：</view>
				<input class="f26" type="text" value="" v-model="ader.person" />
			</view>
			<view class="flex-middle">
				<view class="f30">联系电话：</view>
				<input class="f26" type="text" value="" v-model="ader.phone" />
			</view>

			<!-- 按钮 -->
			<button class="white bg-con border-r-20 f30" @click="inserAd()">保存地址</button>
			<button v-if="delDis" class="colorCon border-r-20 f30" @click="delAd()">删除地址</button>

		</view>

		<!-- 提交后弹窗 -->
		<view class="submit-su txt-cen" v-if="isDis" @click="isDis = false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{msg}}</view>
				<button @click="isDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>

		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import map from '../../static/map/qqmap-wx-jssdk.min.js'; //腾讯地图
	import * as getAdderId from '@/common/getAdId.js'
	export default {
		data() {
			return {
				id: 0, //地址编号

				ader: { //服务地址
					ti: '', //服务地址大字
					ad: '', //详细地址
					num: '', //门牌号
					person: '', //联系人
					phone: '', //联系电话
					la: 0, //纬度
					lo: 0 //经度
				},

				delDis: false, //是否显示删除按钮
				isInsert: 0, //0--新增地址， 1--修改地址

				key: '', //进入地址的页面

				isDis: false, //弹窗
				logo: '',
				msg: ''

			}
		},
		methods: {
			getAdInfor(id) { //获取地址信息
				if (id != 'new') {
					let adder = [];
					this.$listapi.getAdderss(this.$store.state.sessionId).then(res => {
						adder = res.data.collection;
						adder.some(item => {
							if (item.id == this.id) {
								this.ader = {
									ti: item.address.split('-*-')[0],
									ad: item.address.split('-*-')[1],
									num: item.number,
									person: item.name,
									phone: item.phone
								};
								return true;
							}
						})
					});

				} else {
					this.getLocation();
				}
			},
			getLocation() {
				let that = this;

				let qqmapsdk = new map({
					key: that.$store.state.mapKey //腾讯地图生成的key
				});

				uni.getLocation({ //uniapp获取经纬度
					type: 'gcj02',
					success: function(res) {
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);


						qqmapsdk.reverseGeocoder({ //腾讯题图逆解析地址
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success(res1) {
								that.ader.ad = res1.result.address;
								that.ader.ti = res1.result.address_component.district + res1.result.address_component.street;
								that.ader.la = res.latitude,
									that.ader.lo = res.longitude
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
			inserAd() { //保存或修改地址

				if (this.$store.state.login) {
					if (this.ader.ad == '' || this.ader.num == '' || this.ader.phone == '' || this.ader.person == '') {
						this.msg = '请完整输入信息';
						this.isDis = true;
					} else if (!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.ader.phone))) {
						this.msg = '请正确输入手机号码';
						this.isDis = true;
					} else {
						if (this.ader.ad == '' || this.ader.ad == '' || !this.ader.ad) {
							this.ader.ad = this.ader.ti;
						}

						new Promise((resolve, reject) => {
							getAdderId.getLocation(this, this.ader.lo, this.ader.la).then(res => {
								resolve(res);
							});
						}).then(res => {
							let data = {
								address: this.ader.ti + '-*-' + this.ader.ad,
								areaId: res,
								gps_latitude: this.ader.la,
								gps_longitude: this.ader.lo,
								name: this.ader.person,
								number: this.ader.num,
								phone: this.ader.phone
							}
							let _this = this;
							if (this.isInsert == 0) { //新增地址
								this.$listapi.addAdderss(this.$store.state.sessionId, data).then(res => {
									if (res.data.success) {
										let pages = getCurrentPages(); // 页面栈
										let beforePage = pages[pages.length - 2]; // 前一个页面
										let beforePage2 = pages[pages.length - 3];

										beforePage.onLoad({
											key: 'user'
										});

										if (_this.key == 'order') {
											_this.$listapi.getAdderss(_this.$store.state.sessionId).then(res1 => {
												// if(res1.data.collection.length == 1) {

												beforePage2.$vm.ad = res1.data.collection[0]; //修改上一页面的 couponNumber 参数值为 value

												getAdderId.getLocation(_this, res1.data.collection[0].gpsLongitude, res1.data.collection[0].gpsLatitude)
													.then(ress => { //上门费
														_this.$listapi.getDoor(_this.$store.state.sessionId, ress).then(ress1 => {
															beforePage2.$vm.doorPrice = ress1.data.collection[0].doorFee;
															beforePage2.$vm.preDoorFee = ress1.data.collection[0].preDoorFee;
														})
													});

												beforePage2.$vm.ad.address = res1.data.collection[0].address.split('-*-')[1]; //修改上一页面的 couponNumber 参数值为 value
												beforePage2.$vm.ad.phone = beforePage2.$vm.ad.phone.substr(0, 3) + '****' + beforePage2.$vm.ad.phone.substr(
													7)

												beforePage2.$vm.radio = 0;
												// }
											})
										}
										beforePage.$vm.afterPage = _this.key;
										uni.navigateBack({
											delta: 1
										});
									};
								})
							} else {
								this.$listapi.upAdderss(this.$store.state.sessionId, this.id, data).then(res => {
									if (res.data.success) {
										let pages = getCurrentPages(); // 当前页面
										let beforePage = pages[pages.length - 2]; // 前一个页面

										beforePage.onLoad({
											key: 'user'
										});
										uni.navigateBack({
											delta: 1
										});
									};
								})
							}
						})
					}
				} else {
					this.$anoLogin(true);
				}



			},
			delAd() { //删除地址
				this.$listapi.delAdderss(this.$store.state.sessionId, this.id).then(res => {
					if (res.data.success) {
						let pages = getCurrentPages(); // 当前页面
						let beforePage = pages[pages.length - 2]; // 前一个页面

						beforePage.onLoad({
							key: 'user'
						});
						uni.navigateBack({
							delta: 1
						});
					};
				})
			},
			toMap() { //用户地图
				// uni.navigateTo({
				// 	url: './map'
				// })
				let _this = this;
				uni.chooseLocation({
					success: function(res) {
						_this.ader.ad = res.address;
						_this.ader.ti = res.name;
						_this.ader.la = res.latitude;
						_this.ader.lo = res.longitude;
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
																	_this.ader.ad = res.address;
																	_this.ader.ti = res.name;
																	_this.ader.la = res.latitude;
																	_this.ader.lo = res.longitude;
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
		onLoad: function(option) { //option为object类型，会序列化上个页面传递的参数
			let id = this.id = option.id;
			this.key = option.key;
			this.logo = this.$store.state.logo;
			this.$loading(true);
			
			let _this = this;
			uni.getSystemInfo({
				success(res) {
					var isopendingwei = res.locationEnabled;
					if (isopendingwei == false) {
						_this.isDis = true;
						_this.msg = '请先开启手机GPS定位,然后重新刷新';
					}
				}
			})


			if (option.id == 'new') { //如果是新增地址
				this.$refs.son.a = '新增地址'; //修改navigatorBarText
				this.isInsert = 0;

				this.$loading(false);
				let app = getApp();
				app.login(this).then(res => {
					this.getAdInfor(id);
					setTimeout(function() {
						_this.$loading(false);
					}, Math.random() * 2000);
				})
			} else {
				this.$refs.son.a = '编辑地址'; //修改navigatorBarText
				this.isInsert = 1;
				this.delDis = true; //显示删除按钮
				//修改输入框绑定的值，如下

				this.$loading();
				let app = getApp();
				app.login(this).then(res => {
					this.getAdInfor(id);
					setTimeout(function() {
						_this.$loading(false);
					}, Math.random() * 2000);
				})


			}
			this.$over();

		}
	}
</script>

<style>
	.f18 {
		font-size: 18rpx;
	}

	.adress-con>view {
		border-bottom: 1rpx solid #E5E5E5;
		padding: 18rpx 0;
	}

	.adress-con>view view:first-child {
		width: 172rpx;
	}

	.adress-con-ad {
		max-width: 480rpx;
	}

	.adress-con-ad text {
		display: block;
	}

	.adress-con-ad text.f26 {
		line-height: 44rpx;
	}

	.adress-con .img {
		margin-left: auto;
	}

	.adress-con image {
		width: 30rpx;
		height: 40rpx;
	}

	.adress-con input {
		width: 74%;
	}

	.adress-con button {
		height: 80rpx;
		line-height: 80rpx;
		margin-top: 50rpx;
		border: none;
	}

	.adress-con button.colorCon {
		margin-top: 20rpx;
		background: #E5E5E5;
	}


	/* 提交后的弹窗 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 1;
	}

	.submit-su-con {
		width: 54.67%;
		height: 278rpx;
		margin: 0 auto;
		margin-top: 486rpx;
	}

	.submit-su-con {
		padding: 0 20rpx;
	}

	.submit-su-con image {
		width: 95rpx;
		height: 95rpx;
		margin-top: -47.5rpx;
	}

	.submit-su-con .f24 {
		color: #999;
		margin-top: 13rpx;
	}

	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 52rpx;
		margin-top: 34rpx;
	}
</style>
