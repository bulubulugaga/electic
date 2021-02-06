<template>
	<view class="content" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 顶部 -->
		<view class="index-header">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
		</view>
		
		<!-- 内容 -->
		<view class="bill-con w-con">
			<view class="bill-con-ti white flex-cover f26">
				<view @click="chooseDistri()">距离：{{distriArr[distriIndex]}}<image class="ml10" src="../../static/images/bill_b.png" mode=""></image></view>			
				<view @click="chooseType()">筛选：{{arr[arrIndex] || '全部'}}<image class="ml10" src="../../static/images/bill_b.png" mode=""></image></view>				
				<!-- <view @click="chooseType()">筛选：{{typeArr[typeIndex].typeName}}<image class="ml10" src="../../static/images/bill_b.png" mode=""></image></view>				 -->
			</view>
			
			<!-- 订单 -->
			<view class="bill-con-de bg-white mt20" v-for="(item,index) in bill" :key="index" @click="toDetail(item)">
				<view class="flex">
					<image class="bill-con-de-photo circle" :src="item.wxPhoto" mode=""></image>
					<view>
						<view class="person f26">{{item.name}}</view>
						<view class="type f30 colorCon">{{item.type}}</view>
					</view>
					<!-- <view class="state ml-auto f26 stateYellow">{{item.state}}</view> -->
					<view class="state ml-auto f26 stateYellow">等待接单</view>
				</view>
				<view class="time c999 f26">
					预约时间：{{item.orderdAt}}
				</view>
				<view class="adress c999 f26 flex">
					<view class="ad-max">预约地址：</view><view class="ad-max-2">{{item.address || '无'}}</view>
				</view>
				<view class="btn flex-cover">
					<view>
						<text class="c999 f26">距离用户：<text class="colorCon">{{item.distri}}</text></text>
					</view>
					<button class="white bg-con" @click.stop="cancelBill(item.id)">接单</button>
				</view>
			</view>
			
			
			<view class="f24 c999 txt-cen mt30">没有更多了~</view>
			
		</view>
		
		<!-- 订单类型选择 -->
		<view class="type-ch" v-show="typeDis" @click="typeDis=false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">选择订单类型</view>
						<view><image src="../../static/images/type_ch.png" mode=""></image></view>
					</view>
					<view class="type-items type-items-type">
						<view v-for="(item,index) in arr" :key="index">
						<!-- <view v-for="(item,index) in typeArr" :key="index"> -->
							<view class="type-item f28 flex-center flex-middle" @click="typeArrDis(index)">
								<!-- <view>{{item.title}}</view> -->
								<!-- <image src="../../static/images/type_ch.png" mode=""></image> -->
								
								<!-- <view>{{item.typeName}}</view> -->
								<view>{{item}}</view>
								
							</view>
							<!-- <view v-show="item.isDis" @click="typeChoose(index,i)" class="type-item-con f26 c999" v-for="(item2,i) in typeArr[index].con" :key="i">
								{{item2}}
							</view> -->
						</view>
					</view>
					<view class="type-ch-cancel" @click="typeDis=false">
						×
					</view>
				</view>
			</view>
		</view>
		
		<!-- 距离类型选择 -->
		<view class="type-ch" v-show="distriDis" @click="distriDis = false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">筛选接单距离</view>
						<view><image src="../../static/images/type_ch.png" mode=""></image></view>
					</view>
					<view class="type-items">
						<view class="type-item f28" v-for="(item,index) in distriArr" :key="index" @click="distriChoose(index)">
							{{item}}
						</view>
					</view>
					<view class="type-ch-cancel" @click="distriDis=false">
						×
					</view>
				</view>
			</view>
		</view>
		
		<!-- 审核 -->
		<view class="submit-su txt-cen" v-if="isDis" @click="isDis=false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{msg}}</view>
				<button @click.stop="sureCancel()" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import map from '../../static/map/qqmap-wx-jssdk.min.js';  //腾讯地图
	
	export default {
		data() {
			return {
				logo: this.$store.state.logo,
				ava: '',
				isDis: false,
				bill: [], //订单显示数据
				billBei: [],  //完整订单数据
				msg: '', //提示信息
				 
				typeDis: false, //订单类型选择显示
				// typeArr: [{},{},{},{},{id: 'aaa',parentId: '',remark: '',typeName: '全部'}], 
				typeArr: [], 
				typeIndex: 4, //选中的订单类型下标
				typeIndex2: 0, //选中的订单二级分类下标
				
				distriDis: false, //距离选择显示
				distriArr: ['3km内订单','5km内订单','10km内订单','全部'], //距离类型
				distriIndex: 3  ,//选中的距离类型下标
				
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
				endX: 0,
				
				arr: [],
				arrIndex: 0,
			}
		},
		onLoad() {
			
			this.$refs.son.a = '电工联盟';  //修改navigatorBarText
			this.$refs.son.indexSer = false;  //头部显示客服
			this.$refs.son.conBack = true;  //隐藏返回
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {
				uni.showModal({
					title: '提示',
					content: '您需要注册实名认证后才能接单',
					confirmText: '去注册',
					cancelText: '暂不注册',
					success: function (res) {
					    if (res.confirm) {
							uni.navigateTo({
								url: './register'
							})
						}
					},fail(err) {
					  console.log(err);
				  }
				})
			}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '审核中') {
					this.isDis = true;
					this.msg = '实名审核未通过，请耐心等待。'
				}
				else if(this.$store.state.info.info.stateName == '审核失败') {
					uni.showModal({
						title: '提示',
						content: '审核失败，需要重新注册',
						confirmText: '去注册',
						cancelText: '暂不注册',
						success: function (res) {
						    if (res.confirm) {
								uni.navigateTo({
									url: './register'
								})
							}
						},fail(err) {
						  console.log(err);
					  }
					})
				}
				else if(this.$store.state.info.info.stateName == '已审核') {
					this.ava = this.$store.state.avatarUrl;
					
					let app = getApp();
					let _this = this;
					this.$loading(true);
					app.login(this).then(res=> {
						_this.getBillState();
						_this.getBill(); //获取订单
						setTimeout(function(){_this.$loading(false);},Math.random()*2000);
					})
				}
			}
			this.$over();
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
					this.getType(this.typeArr);
				})
			},
			getType(typeArr) {
				let arr = [];
				for(let item of typeArr) {
					for(let item1 of item.con) {
						if(item1) {
							arr.push(item1);
						};
					}
				}
				this.arr = arr;
				this.arr.push('全部');
				this.arrIndex = this.arr.length - 1;
				
			},
			cancelBill(id) { //接单
				let _this = this;
				uni.requestSubscribeMessage({
				  tmplIds: ['nUjRFV6M3weNlxQYCvntqLDYnNgG33fLypYZYiSxepk','MjSfiwtkv8ywzrDKEHadn5QhErlNgbGM6P4gWVMOXW8','FXaoZq7sWeGz9QUXVXZ7u6ZdMpRA8Hhub-AAhFYpRYQ'],
				  success (res) {
					  if(res['nUjRFV6M3weNlxQYCvntqLDYnNgG33fLypYZYiSxepk'] == "reject" || res['MjSfiwtkv8ywzrDKEHadn5QhErlNgbGM6P4gWVMOXW8'] == "reject" || res['FXaoZq7sWeGz9QUXVXZ7u6ZdMpRA8Hhub-AAhFYpRYQ'] == "reject") {
						  uni.showToast({
							  icon: 'none',
							  duration: 3000,
						  	title: '为了让您及时接收到消息，请您同意发送消息'
						  })
					  }
					   else {
						   uni.showModal({
						       title: '提示',
						       content: '是否确认接此订单？',
						       success: function (res) {
						           if (res.confirm) {
						   
						 _this.$listapi.order(_this.$store.state.sessionId,id).then(res => {
						 	if(res.data.success == false) {
						 		if(res.data.message == '消息发送失败') {
						 			uni.reLaunch({
						 				url: '/pages/bill/bill'
						 			})
						 		}
						 		else {
						 			_this.msg = res.data.message;
						 			_this.isDis = true;
						 		}
						 		
						 	}
						 	else {
						 		uni.reLaunch({
						 			url: '/pages/bill/bill'
						 		})
						 	}
						 }) 
							          } else if (res.cancel) {
							              // console.log('用户点击取消');
							          }
							      }
							  });
					  }
					 
				  },
				  fail(err) {
					  console.log(err);
				  }
				})
				
			},
			sureCancel() {
				this.isDis = false;
			},
			getBill() { //获取订单信息
				let _this = this;
				let adder = [];
			
				let qqmapsdk = new map({
					key: _this.$store.state.mapKey //腾讯地图生成的key
				});
			
				this.$listapi.waitOrder(this.$store.state.sessionId).then(res => {
					if(res.data.message == '实名审核未通过，请耐心等待') {
						this.isDis = true;
						this.msg = '实名审核未通过，请耐心等待。'
					}
					this.bill = res.data.collection;
					this.bill.forEach(item=>{
						_this.$set(item, 'adLa', item.gpsLatitude); //存储地址信息
						_this.$set(item, 'adLo', item.gpsLongitude); //存储地址信息
						_this.$set(item, 'allAd', item.address + '-+-' + item.number); //存储完整地址信息
						item.orderdAt = item.orderdAt.replace(/T/g, " ");
						item.address = item.address.split('-*-')[1];
						item.state = '等待接单';
						item.stateYellow = true;
						_this.$set(item,'btn','接单');
						_this.$set(item, 'suDis', true);
						_this.$set(item, 'isRemark', false);
						
						_this.$set(item,'distri' ,'暂无距离');
						if(item.gps_latitude == null || item.gps_latitude == '' || item.gps_longitude == null || item.gps_longitude =='') {
							qqmapsdk.geocoder({
							      address: item.address, //用户地址
							      success: function(res) {//成功后的回调
									
							        var res = res.result;
							        item.gps_latitude = res.location.lat;
							        item.gps_longitude = res.location.lng;
									
									qqmapsdk.calculateDistance({
											to: [{ 
												latitude: item.gps_latitude,
												longitude: item.gps_longitude
											}],
									        success: function(res) {
									          item.distri = res.result.elements[0].distance / 1000 + 'km';
									        },
									        fail: function(error) {
									          console.log(error);
									        },
									        complete: function(res) {
									          // console.log(res);
									        }
									    });
									
							      }
							})
						}
						else {
							qqmapsdk.calculateDistance({
								//mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
								//from参数不填默认当前地址
								//获取表单提交的经纬度并设置from和to参数（示例为string格式）
								// from: e.detail.value.start || '', //若起点有数据则采用起点坐标，若为空默认当前地址
							   
							 
								to: [{  //终点坐标
									latitude: item.gps_latitude,
									longitude: item.gps_longitude
									
								}],
								success: function(res) {//成功后的回调
								  item.distri = res.result.elements[0].distance / 1000 + 'km';
								},
								fail: function(error) {
								  console.log(error);
								},
								complete: function(res) {
								  // console.log(res);
								}
							});
						}
						
						
					})
					this.billBei = this.bill;  //首次加载默认显示的订单
					this.distriIndex = 3;
				})
				
				
			},
			chooseType() { //筛选
				this.typeDis = true;
			},
			typeChoose(index,i) { //选择订单类型
				this.typeIndex = index;
				this.typeIndex2 = i;
				
				//选择的二级分类
				console.log(this.typeArr[this.typeIndex].con[this.typeIndex2]);
				this.typeDis = false;
			},
			typeArrDis(index) { //显示或关闭订单类型二级分类
				// this.typeArr[index].isDis = !this.typeArr[index].isDis;
				this.bill = [];
				if(index == (this.arr.length - 1)) {
				// if(index == (this.typeArr.length - 1)) {
					// this.bill = this.billBei;
					if(this.distriIndex == this.distriArr.length - 1) {
						this.bill = this.billBei;
					}
					else {
						this.distriChoose(this.distriIndex);
					}
				}
				else {
					this.billBei.forEach(item=>{
						if(this.distriIndex == this.distriArr.length - 1) {
							if(item.type == this.arr[index]) {
							// if(item.type == this.typeArr[index].typeName) {
								this.bill.push(item);
							}
						}
						else {
							if(item.type == this.arr[index] && Number(item.distri.replace(/km/,'')) <= Number(this.distriArr[this.distriIndex].replace(/km内订单/,''))) {
							// if(item.type == this.typeArr[index].typeName && Number(item.distri.replace(/km/,'')) <= Number(this.distriArr[this.distriIndex].replace(/km内订单/,''))) {
								this.bill.push(item);
							}
						}
					})
				}
				
				this.typeIndex = index;
				this.arrIndex = index;
				this.typeDis = false;
			},
			
			chooseDistri() { //距离
				this.distriDis = true;
			},
			distriChoose(index) { //选择距离
				this.distriIndex = index;
				this.distriDis = false;
				// console.log(this.bill);
				
				this.bill=[];
				
				if(index == this.distriArr.length - 1) {
					// this.bill = this.billBei;
					
					if((this.arrIndex + 1) == this.arr.length) {
					// if((this.typeIndex + 1) == this.typeArr.length) {
						this.bill = this.billBei;						
					}
					else {
						this.typeArrDis(this.arrIndex);
					}
				}
				else {
					let distri = this.distriArr[index].replace(/km内订单/,'');
					this.billBei.forEach(item=>{
						if((this.arrIndex + 1) == this.arr.length) {
							if(Number(item.distri.replace(/km/,'')) <= Number(distri)) {
								this.bill.push(item);
							}
						}
						else {
							if(Number(item.distri.replace(/km/,'')) <= Number(distri) && item.type == this.arr[this.arrIndex]) {
								this.bill.push(item);
							}
						}
						
					})
				}
			},
		
			
			
			toDetail(item) { //Id是订单编号，跳转到订单详情		
				// let item1 = JSON.stringify(item);
				uni.navigateTo({
				    url: '/pages/bill/detail?item='+item.id
				});
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
		},
		mounted() {
			
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
		height: 0;
		position: relative;
		z-index: 0;
	}
	.indexHBg {
		width: 100%;
		height: 100rpx;
	}
	
	/* 内容 */
	.bill-con {
		position: relative;
		z-index: 1;
		top: 25rpx;
	}
	.bill-con-ti image {
		width: 17rpx;
		height: 17rpx;
	}
	
	/* 订单 */
	.bill-con-de {
		padding: 14rpx 20rpx 24rpx;
		border-radius: 15rpx;
	}
	.bill-con-de-photo {
		width: 100rpx;
		height: 100rpx;
		margin-top: 6rpx;
	}
	.bill-con-de .person {
		margin-top: 14rpx;
		margin-left: 30rpx;
	}
	.bill-con-de .type {
		margin-left: 30rpx;
		border: 1rpx solid #4DA8E5;
		border-radius: 10rpx;
		padding: 0 10rpx;
		margin-top: 10rpx;
	}
	.bill-con-de .stateYellow {
		color: #ffd200;
	}
	.bill-con-de .stateGreen {
		color: #4DA8E5;
	}
	.bill-con-de .stateRed {
		color: #fb6464;
	}
	.bill-con-de .time {
		margin-top: 25rpx;
	}
	.bill-con-de .adress {
		margin-top: 15rpx;
	}
	.bill-con-de .btn {
		margin-top: 50rpx;
	}
	.bill-con-de button {
		width: 156rpx;
		height: 47rpx;
		font-size: 24rpx;
		line-height: 47rpx;
		margin-right: 0;
		border-radius: 16rpx;
		padding: 0 !important;
	}
	.priceCol {
		font-size: 30rpx;
		font-weight: bold;
		color: #fb6464;
	}
	.pricePhoto {
		color: #4DA8E4;
		font-size: 24rpx;
		border: 1rpx solid #4DA8E4;
		padding: 6rpx 10rpx;
		border-radius: 15rpx;
	}
	.mlAuto {
		margin-left: auto;
	}
	
	
	/* 订单类型选择 */
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
	.type-ch-title image,.type-item image {
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
		line-height: 60rpx;
	}
	.type-ch-cancel {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		color: #ccc;
		font-size: 65rpx;
		line-height: 0;
	}
	
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
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
		margin-top: 25rpx;
	}
	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 52rpx;
		margin-top: 50rpx;
	}
	
	.ad-max {
		width: 216rpx;
	}
	.ad-max-2 {
		width: 850rpx;
	}
</style>
