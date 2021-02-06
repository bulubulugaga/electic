<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="user-header pr">
			<image src="../../static/images/user_h.png" mode=""></image>
			<view class="user-photo pa">
				<view class="w pr">
					<image v-if="isVip == true" class="vip w pa" src="../../static/images/vip_tou.png" mode=""></image>
					<image class="w pa circle" :src="ava" mode=""></image>
				</view>
			</view>
			<view class="user-name pa">
				<text class="FB">{{name}}</text>
				<button @click="toUpName()">{{btn}}</button>
			</view>
			<view class="user-vip pa flex-middle">
				<view class="user-vip-v"><image class="wh" src="../../static/images/user_v.png" mode=""></image></view>
				<view class="user-vip-lt"><text class="user-vip-lt f30 <FB></FB>">电盟会员</text></view>
				<view class="user-vip-r flex-middle">
					<text class="f24" v-if="isVip == false">开通即享会员折扣</text>
					<text class="f24" v-if="isVip == true">{{time}}到期</text>
					<button class="f26 bg-black white" @click="toVip()">会员中心</button>
				</view>
			</view>
		</view>
		
		<!-- 内容 -->
		<view class="user-con w-con">
			<!-- 选项 -->
			<view class="user-con-ch flex-MC bg-white border-r-20"> 
				<view @click="toWallet()">
					<image class="user-con-ch-wallet" src="../../static/images/user_con01.png"></image><br>
					<text>钱包</text>
				</view>
				<view @click="toGrade()">
					<image class="user-con-ch-grade" src="../../static/images/user_con02.png"></image><br>
					<text>积分</text>
				</view>
				<view @click="toCoupon()">
					<image class="user-con-ch-coupon" src="../../static/images/user_con03.png"></image><br>
					<text>优惠券</text>
				</view>
				<view @click="toAdress()">
					<image class="user-con-ch-adress" src="../../static/images/user_con04.png"></image><br>
					<text>地址</text>
				</view>				
				<!-- <view @click="toServ()">
					<image class="user-con-ch-ques" src="../../static/images/user_con04.png"></image><br>
					<text>客服</text>
				</view> -->
			</view>
			
			<!-- 帮助和反馈 -->
			<view class="other bg-white mt15 pl30 pr30 border-r-20 f26">
				<!-- <view class="other-help flex-middle pr" @click="toServe()"> -->
				<view class="other-help flex-middle pr" @click="toServe">
					<image src="../../static/images/user_con05.png"></image>
					<text>客服</text>
					<image class="other-img-more" src="../../static/images/user_more.png"></image>
					<!-- <button class="service pa" open-type="contact" bindcontact="handleContact"></button> -->
				</view>
				<view class="other-help flex-middle" @click="toNews()">
					<image src="../../static/images/user_news.png"></image>
					<text>消息</text>
					<view class="flex-middle ml-auto">
						<view class="red f100" v-if="isRed">·</view>
						<view>
							<image class="other-img-more other-img-more1" src="../../static/images/user_more.png"></image>
						</view>
					</view>
					
				</view>
				<view class="other-help flex-middle" @click="toHelp()">
					<image src="../../static/images/user_help.png"></image>
					<text>帮助</text>
					<image class="other-img-more" src="../../static/images/user_more.png"></image>
				</view>
				<view class="other-help flex-middle" @click="toUs()">
					<image src="../../static/images/user_con07.png"></image>
					<text>留言反馈</text>
					<image class="other-img-more" src="../../static/images/user_more.png"></image>
				</view>
				<view class="other-about flex-middle" @click="toUs1()">
					<image src="../../static/images/user_about.png"></image>
					<text>关于电工联盟</text>
					<image class="other-img-more" src="../../static/images/user_more.png"></image>
				</view>
			</view>
			<!-- <button class="exit bg-white border-r-20 mt15 f24">退出登录</button> -->
		</view>
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
import Nav from '../../components/navigationBar.vue';
	export default {
		components: {
			Nav
		},
		data() {
			return {
				 //用户信息
				isVip: false, //是否是会员
				name: '用户名',
				ava: '', //头像
				time: '开通即享会员折扣', //会员到期时间
				
				btn: '点击修改名称',
				
				isRed: false  //是否有未读消息
			}
		},
		onLoad() {
			this.$refs.son.a = '我的';  //修改navigatorBarText
			this.$refs.son.conBack = false;  //隐藏返回
			this.$refs.son.indexSer = false;  //隐藏客服
			this.$loading(false);
			
			if(this.$store.state.login) {
				this.btn = '点击修改名称';
			}
			else {
				this.btn = '登录';
			}
			
			let app = getApp();
			let _this = this;
			app.login(this).then(res => {
				this.ava = this.$store.state.avatarUrl;
				this.name = this.$store.state.userName;
				this.isVip = this.$store.state.isVip;
				if(this.isVip) {
					this.time = this.$store.state.vipTime.split('T')[0];
				}
				
				
				if(this.$store.state.login) {
					this.btn = '点击修改名称';
				}
				else {
					this.btn = '登录';
				}
				
				this.getNoneNew();
			});
		},
		methods: {
			toServe() {
				if(this.$store.state.login) {
					let  _this = this;
					let plugin = requirePlugin("chatbot");
					let chat = plugin.getChatComponent();
					
					plugin.init({
						appid: "uf8iW7joHj8J9CC1qO4Im4id7BrXaj",
						openid: _this.$store.state.opendId, // 小程序的openid，必填项
						userHeader: "", // 用户头像
						userName: "", // 用户昵称
						robotHeader: _this.$store.state.logo1,
						textToSpeech: false,
						success: (res1) => {
							// console.log(res1);
							// chat.setGuideList(["菜单栏","人工服务","菜单一","菜单二"]);
							// chat.setWelcome("你好，请问有什么可以帮助您的");
							// chat.setRobotHeader(_this.$store.state.logo1);
						},
						fail: (err) => {},
						guideList: ["人工服务","怎么获取积分","积分抵扣规则"],
						welcome: "你好，请问有什么可以帮助您的"
					});
					
					
					uni.navigateTo({
						url: './serve'
					})
				}
				else {
					this.$anoLogin(true);
				}
				
			},
			getNoneNew() {
				let data = {
					page: 1,
					perPage: 99
				}
				let _this = this;
				this.isRed = false;
				let ad = this.$store.state.addrId;
				this.$listapi.noneNews(this.$store.state.sessionId,0,ad,data).then(res=>{
					let list = res.data.collection;
					
					try {  //用抛出异常的方式结束循环
					    list.forEach(item=>{
					    	if(item.type == 0) {
					    		_this.isRed = true;
					    		throw new Error("EndIterative");
					    	}
					    })
					    
					} catch(e) {
					    if(e.message!="EndIterative") throw e;
					};
					
				})
			},
			toHelp() { //跳转至帮助与反馈
				uni.navigateTo({
				    url: './help'
				});
			},
			toUpName() { //跳转至修改昵称
				if(this.btn == '登录') {
					this.$anoLogin(true);
				}
				else {
					uni.navigateTo({
					    url: './upName'
					});
				}
				
			},
			toVip() { //跳转至会员中心
				uni.navigateTo({
				    url: './vip'
				});
			},
			toWallet() { //跳转至钱包
				uni.navigateTo({
				    url: './wallet'
				});
			},
			toGrade() { //跳转至积分
				uni.navigateTo({
				    url: './grade'
				});
			},
			toCoupon() { //跳转至优惠券
				uni.navigateTo({
				    url: './coupon'
				});
			},
			toAdress() { //跳转至地址
				uni.navigateTo({
				    url: './adress?key=user'
				});
			},
			toNews() { //跳转至消息
				uni.navigateTo({
				    url: './news'
				});
			},
			toUs1() { //跳转至关于我们
				uni.navigateTo({
				    url: './aboutUs'
				});
			},
			toService() { //客服
				// uni.navigateTo({
				// 	url: './servRobot'
				// })
			},
			toUs(){
				uni.navigateTo({
				    url: './idea'
				});
			}
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#23d5b1,#27C3A3) !important;
	}
	
	/* 头部 */
	.user-header {
		height: 130rpx;
		background: linear-gradient(to bottom,#27C3A3,#2CAD92) ;
	}
	.user-header image {
		position: absolute;
		width: 100%;
		height: 240rpx;
		top: 30rpx;
	}
	.user-photo {
		width: 120rpx;
		height: 120rpx;
		background: white;
		border-radius: 50%;
		top: 30rpx;
		left: 30.67%
	}
	.user-header .user-photo image {
		top: 0;
		height: 120rpx;
		z-index: 1;
	}
	.user-header .user-photo image.vip {
		top: -34rpx;
		width: 136rpx;
		left: -15rpx;
		height: 155rpx;
		z-index: 2;
	}
	.user-name {
		top: 35rpx;
		left: 50.4%;
		color: white;
	}
	.user-name text {
		font-size: 36rpx;
		margin-top: 10rpx;
	}
	.user-name button {
		background: none;
		border: 2rpx solid white !important;
		border-radius: 50rpx;
		width: 174rpx;
		height: 36rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		color: white;
		margin-top: 15rpx;
	}
	.user-vip {
		width: 94.67%;
		margin-left: 4%;
		height: 104rpx;
		background: linear-gradient(to right,#DEC291,#F0DDB8);
		top: 185rpx;
		border-top-left-radius: 15rpx;
		border-top-right-radius: 15rpx;
	}
	.user-vip-v {
		width: 60rpx;
		height: 50rpx;
	}
	.user-vip-v image {
		width: 60rpx;
		height: 50rpx;
		margin-left: 25rpx;
	}
	.user-vip-lt {
		margin-left: 20rpx;
	}
	.user-vip-r {
		/* flex: 1;
		text-align: right;
		padding-left: 86rpx; */
		margin-left: auto;
	}
	.bg-black {
		background: black;
	}
	.user-vip-r button {
		width: 170rpx;
		height: 50rpx;
		line-height: 50rpx;
		border-radius: 20rpx;
		margin-right: 10rpx;
		margin-left: 20rpx;
	}
	
	/* 主题内容 */
	.user-con {
		margin-top: 200rpx;
		font-size: 26rpx;
	}
	.user-con-ch {
		height: 190rpx;
	}
	.user-con-ch>view {
		width: 25%;
		text-align: center;
	}
	.user-con-ch image {
		height: 70rpx;		
	}
	.user-con-ch-wallet {
		width: 80rpx;
	}
	.user-con-ch-adress {
		width: 50rpx;
	}
	.user-con-ch-grade {
		width: 70rpx;
	}
	.user-con-ch-coupon {
		width: 70rpx;
	}
	
	/* 帮助和反馈 */
	.other>view {
		height: 84rpx;
	}
	.other image {
		width: 42rpx;
		height: 42rpx;
		margin-right:24rpx;
	}
	.other image.other-img-more {
		width: 12rpx;
		height: 18rpx;
		margin-left: auto;
		margin-right: 0;
	}
	.other-help {
		border-bottom: 1rpx solid #E6E6E6;
	}
	.exit {
		height:  93rpx;
		line-height: 93rpx;
	}
	
	
	.service {
		width: 100%;
		height: 100%;
		background: red;
		opacity: 0;
	}
	.f100 {
		font-size: 100rpx;
		line-height: 84rpx;
		margin-top: -12rpx;
		margin-right: 10rpx;
	}
</style>
