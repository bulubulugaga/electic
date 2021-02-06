<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 地址 -->
		<view class="adress-con w-con">
			<radio-group @change="radioChange">
				<view class="adress-con-de border-r-20 bg-white flex-middle mt23" 
						v-for="(item,index) in adr" :key="index" @click.stop="toEdit(item.id,item,index)">
					<view class="adress-con-de-radio">
						<radio v-if="afterPage != 'user'" color="#31D8B6" :checked="index == current" ></radio>
					</view>
					<view class="adress-con-de-txt">
						<view class="f28">{{item.address}}</view>
						<view class="f24 c999">{{item.name}}&emsp;{{item.phone}}</view>
					</view>
					<view class="adress-con-de-more">
						<image src="../../static/images/user_more.png"></image>
					</view>
				</view>	
			</radio-group>
		</view>
		
		<!-- 新增地址 -->
		<view  class="ader-add1"></view>
		<view class="ader-add bg-white flex-middle f28" @click.stop="toEdit('new')">
			<image src="../../static/images/ader_add.png" mode=""></image>
			<text>新增地址</text>
		</view>
		
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import * as getAdderId from '@/common/getAdId.js'
	export default {
		data() {
			return {
				adr: [], //地址内容
				current: 0 ,//当前选中地址下标
				
				afterPage: ''  //上一个跳转页面
			}
		},
		methods: {
			getAdder() {  //获取地址列表
				this.$listapi.getAdderss(this.$store.state.sessionId).then(res=>{
					this.adr = res.data.collection;
					this.adr.forEach(item=>{  //电话中间4位*号
						item.phone = item.phone.substr(0, 3) + '****' + item.phone.substr(7)
						item.address = item.address.split('-*-')[1];
					})
				})
			},
			toEdit(id,ad,index) { 
				this.current = index;
				if(this.afterPage == 'user') { //跳转到编辑页面
					uni.navigateTo({
					    url: './aderEdit?id=' + id +'&key=' + this.afterPage
					});
				}
				else {  //跳转到编辑页面
					if(id == 'new') {
						uni.navigateTo({
						    url: './aderEdit?id=new' +'&key=' + this.afterPage
						});
						// let pages = getCurrentPages();             //获取所有页面栈实例列表
						// let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
						
						// console.log(prevPage);
						 
					}
					else { //返回订单
						let pages = getCurrentPages();             //获取所有页面栈实例列表
						let prevPage = pages[ pages.length - 2 ];  //上一页页面实例
						
						prevPage.$vm.ad = ad;             //修改上一页面的 couponNumber 参数值为 value
						
						getAdderId.getLocation(this,ad.gpsLongitude,ad.gpsLatitude).then(res => {  //上门费
							this.$listapi.getDoor(this.$store.state.sessionId,res).then(res1 => {
								prevPage.$vm.doorPrice = res1.data.collection[0].doorFee;
								prevPage.$vm.preDoorFee = res1.data.collection[0].preDoorFee;
							})
						});
						
						prevPage.$vm.radio = this.current;
						uni.navigateBack({
							
						});
					}
					
				}
				
			},
			radioChange: function(evt) { //选择地址发生改变时
				for (let i = 0; i < this.adr.length; i++) {
					if (this.adr[i].value === evt.target.value) {
						this.current = i;
						break;
					}
				}
			},
			getRadio(radio) {
				this.current = radio;
			}
		},
		components: {
			Nav
		},
		onLoad(option) {			
			this.$refs.son.a = '地址';  //修改navigatorBarText			
			this.current = option.radio;
			
			if(option.key)
				this.afterPage = option.key;
			else
				this.afterPage = 'user';
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				this.getAdder();
				this.getRadio(option.radio || 0);
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			this.$over();
		}
	}
</script>

<style>
	.adress-con-de {
		padding: 0 0 20rpx 0;
	}
	.mt23 {
		margin-top: 23rpx;
	}
	.adress-con-de-radio {
		margin: 0 0 0 25rpx;
	}
	.adress-con-de radio {
		transform:scale(0.7);
	}
	.adress-con-de-txt .f28 {
		padding: 24rpx 0 8rpx 6rpx;
		width: 556rpx;
	}
	.adress-con-de-txt .f24 {
		padding-left: 6rpx;
		margin-top: 4rpx;
	}
	.adress-con-de-more {
		margin-left: auto;
		padding-right: 15rpx;
	}
	.adress-con-de-more image {
		width: 14rpx;
		height: 24rpx;
	}
	
	/* 新增地址 */
	.ader-add1 {
		width: 100%;
		height: 123rpx;
	}
	.ader-add {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 100rpx;
		justify-content: center;
	}
	.ader-add image {
		width: 48rpx;
		height: 48rpx;
		margin-right: 10rpx;
	}
</style>
