<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="user-header pr">
			<view class="pa">
				<view class="flex-center">
					<view class="user-photo circle hide">
						<image :src="user1.avatarUrl" mode=""></image>
					</view>
					<view class="user-name">
						<text class="in-block FB">{{user1.userName}}</text>
						<view class="user-lv white f24" @click="toUpName()">{{btn}}</view>
					</view>
				</view>
			</view>
		</view>
		
		<!-- 内容 -->
		<view class="user-con w-con">
			<!-- 选项 -->
			<view class="user-con-ch flex-cover flex-middle bg-white border-r-20"> 
				<view @click="toToBill()">
					<image class="user-con-ch-wallet" src="../../static/images/user_con01.png"></image><br>
					<text class="">今日接单</text>
				</view>
				<view @click="toIncome()">
					<image class="user-con-ch-adress" src="../../static/images/user_con02.png"></image><br>
					<text class="">今日收入</text>
				</view>
				<view @click="toIncomeAll()">
					<image class="user-con-ch-adress" src="../../static/images/user_con04.png"></image><br>
					<text class="">全部收入</text>
				</view>
				<view @click="toWallet()">
					<image class="user-con-ch-msg" src="../../static/images/user_con03.png"></image><br>
					<text class="">我的钱包</text>
				</view>
			</view>
			
			<!-- 个人信息 -->
			<view class="other bg-white mt15 pl30 pr30 border-r-20">
				<view class="other-help flex-middle">					
					<text class="f30">等级</text>
					<view class="ml-auto flex">
						<view class="flex-middle"><image class="infor-gr" src="../../static/images/infor_gr.png" mode=""></image></view>
						<view class="flex-middle">LV {{user.currentLevel || 1}}</view>
					</view>
				</view>
				<view class="other-help flex-middle other-help-bdnone">
					<text class="f30">等级进度</text>
					<view class="ml-auto flex">
						<view class="flex-middle"><image class="infor-po" src="../../static/images/infor_po.png" mode=""></image></view>
						<!-- <view class="flex-middle">{{user.currentShip || 0}}/ {{user.totalShip || 0}}</view> -->
						<view class="flex-middle">{{user.currentShip || 0}}/ {{user.upgradeShip || 0}}</view>
					</view>
				</view>
			</view>
			
			<view class="other bg-white mt15 pl30 pr30 border-r-20">
				<view class="other-help flex-middle pr" @click="toServe">
					<text class="f30">客服 </text>
					<image class="other-img-more" src="../../static/images/more.png" mode=""></image>				
					<!-- <button class="service pa" open-type="contact" bindcontact="handleContact"></button> -->
				</view>
				<view class="other-help flex-middle" @click="toIntro()">
					<text class="f30">个人介绍及技能描述</text>
					<image class="other-img-more" src="../../static/images/more.png" mode=""></image>
				</view>
				<view class="other-help flex-middle" @click="toUpCard()">
					<text class="f30">修改电工证或身份证</text>
					<image class="other-img-more" src="../../static/images/more.png" mode=""></image>
				</view>
				<view class="other-help flex-middle" @click="toRanking()">					
					<text class="f30">排行榜</text>
					<image class="other-img-more" src="../../static/images/more.png" mode=""></image>
				</view>
				<view class="other-about flex-middle other-help-bdnone" @click="toMark()">
					<text class="f30">信用评价</text>
					<view class="star ml-auto flex-middle">
						<!-- <view class="flex-middle mt5"><uni-rate class="in-block" size='12' max="5" :value="user.star" active-color="#fecb01" margin="1" disabled></uni-rate></view>
						<view class="f24 flex-middle FB mr15">{{user.star.toFixed(1)}}</view> -->
						<view class="flex-middle mt5"><uni-rate class="in-block" size='12' max="5" :value="user.info.average" active-color="#fecb01" margin="1" disabled></uni-rate></view>
						<view class="f24 flex-middle FB mr15">{{user.info.average || '0.0'}}</view>
						<image class="other-img-more" src="../../static/images/more.png" mode=""></image>
					</view>
				</view>
			</view>
			
			<!-- <navigator open-type="exit" target="miniProgram"  class="exit bg-white f26 FB">退出登录</navigator> -->
			<!-- <button open-type='getUserInfo'  bindgetuserinfo='userinfo'>点击获取</button> -->
		</view>
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
import Nav from '../../components/navigationBar.vue';
import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	export default {
		components: {
			Nav,
			uniRate
		},
		data() {
			return {
				ava: '',
				name: '',
				user1: {
					userName: '用户名'
				},
				user: { //用户信息
					name: '用户名',
					img: '', //头像
					currentLevel: 1, //等级
					currentShip: 0,  //等级进度
					upgradeShip: 0, //等级升级基数
					info: {
						average: 0.0
					}
				},
				btn: '',
			}
		},		
		onLoad() {
			this.$refs.son.a = '我的';  //修改navigatorBarText
			this.$refs.son.conBack = false;  //隐藏返回
			this.$refs.son.indexSer = false;  //隐藏返回
			this.$loading(false);
			if(this.$store.state.login) {
				if(this.$store.state.info.imageList.length == 0) {
					this.btn = '注册';
				}
				else if(this.$store.state.info.info) {
					if(this.$store.state.info.info.stateName == '审核中') {
						this.btn = '审核中';
						// this.btn = '注册';
					}
					else if(this.$store.state.info.info.stateName == '审核失败') {
						this.btn = '注册';
					}
					else {
						this.btn = '点击修改名称';
					}
				}
			}
			else {
				this.btn = '登录';
			}
			
			let app = getApp();
			let _this = this;
			app.login(this).then(res => {
				_this.user1 = _this.$store.state; 
				_this.user = _this.$store.state.info; 
				if(_this.user.currentLevel == '' || _this.user.currentLevel == null) {
					_this.user.currentLevel = 1;
				}
				if(_this.user.currentShip == '' || _this.user.currentShip == null) {
					_this.user.currentShip = 0;
				}
				if(_this.user.totalShip == '' || _this.user.totalShip == null) {
					_this.user.totalShip = 0;
				}
				
				if(this.$store.state.login) {
					if(this.$store.state.info.imageList.length == 0) {
						this.btn = '注册';
					}
					else if(this.$store.state.info.info) {
						if(this.$store.state.info.info.stateName == '审核中') {
							this.btn = '审核中';
							// this.btn = '注册';
						}
						else if(this.$store.state.info.info.stateName == '审核失败') {
							this.btn = '注册';
						}
						else {
							this.btn = '点击修改名称';
						}
					}
				}
				else {
					this.btn = '登录';
				}
				
				// this.getNoneNew();
			});
			this.$over();
		},
		methods: {
			toServe() {
				if(this.$store.state.login) {
					let  _this = this;
					let plugin = requirePlugin("chatbot");
					let chat = plugin.getChatComponent();
					
					plugin.init({
						appid: "R3u4hL4U62WJe1DtnHeBYCXsq4hb3B",
						openid: _this.$store.state.info.wxOpenid, // 小程序的openid，必填项
						userHeader: "", // 用户头像
						userName: "", // 用户昵称
						robotHeader: _this.$store.state.logo1,
						textToSpeech: false,
						success: (res1) => {
							
						},
						fail: (err) => {},
						guideList: ["人工服务","平台抽成规则","钱包资金被冻结"],
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
				this.$listapi.noneNews(this.$store.state.sessionId,0,data).then(res=>{
					console.log(res);
				})
			},
			toUpName() { //跳转至修改昵称
				if(this.btn == '登录') {
					this.$anoLogin(true);
				}
				else if(this.btn == '注册') {
					uni.navigateTo({
					    url: '/pages/index/register'
					});
				}
				else if(this.btn == '审核中') {
					
				}
				else {
					uni.navigateTo({
					    url: './infor'
					});
				}
				
			},
			toIntro() {  //技能
				uni.navigateTo({
				    url: './intro'
				});
			},
			toWallet() { //跳转至钱包
				uni.navigateTo({
				    url: './wallet'
				});
			},
			toIncome() { //跳转至今日收入
				uni.navigateTo({
				    url: './income'
				});
			},
			toIncomeAll() { //全部收入
				uni.navigateTo({
				    url: './incomeAll'
				});
			},
			toToBill() { //跳转至今日接单
				uni.navigateTo({
				    url: './toBill'
				});
			},
			toRanking() { //排行榜
				uni.navigateTo({
				    url: './ranking'
				});
			},
			toUpCard() { //修改证件
				if(this.$store.state.login == false) {
					uni.showToast({
						title: '您还没有登录。',
						icon: 'none',
						duration: 1200
					});
				}
				else if(this.$store.state.info.imageList.length == 0) {
					uni.navigateTo({
					    url: '/pages/index/register'
					});
				}
				else if(this.$store.state.info.info) {
					if(this.$store.state.info.info.stateName == '审核中') {
						uni.showToast({
							title: '您的信息还在审核中，暂时不能查看。',
							icon: 'none',
							duration: 1200
						});
					}
					else if(this.$store.state.info.info.stateName == '审核失败') {
						uni.showToast({
							title: '您的信息还在审核失败，需要重新注册。',
							icon: 'none',
							duration: 1200
						});
					}
					else if(this.$store.state.info.info.stateName == '已审核') {
						uni.navigateTo({
						    url: './upCard'
						});
					}
				}
			},
			toMark() { //评价详情
				uni.navigateTo({
				    url: './mark'
				});
			},
			toExit() { //退出登录
				
			}
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#3C94CF,#429DDA) !important;
	}
	
	/* 头部 */
	.user-header {
		height: 230rpx;
		background: linear-gradient(to bottom,#429DDA,#4DA8E4) ;
	}
	.user-header>view {
		top: 55rpx;
		left: 50%;
		transform: translateX(-50%);		
	}
	.user-photo {
		width: 120rpx;
		height: 120rpx;
		margin-right: 5rpx;
		background: white;
	}
	.user-photo image {
		width: 100%;
		height: 100%;
	}
	.user-name {
		color: white;
	}
	.user-name text {
		font-size: 36rpx;
		margin-left: 30rpx;
	}
	.user-lv {
		width: 174rpx;
		height: 34rpx;
		margin-top: 20rpx;
		margin-left: 10rpx;
		font-size: 24rpx;
		line-height: 34rpx;
		border: 1rpx solid white;
		border-radius: 100rpx;
		text-align: center;
	}
	
	
	/* 主题内容 */
	.user-con {
		margin-top: 22rpx;
		font-size: 26rpx;
	}
	.user-con-ch {
		height: 236rpx;
	}
	.user-con-ch>view {
		width: 25%;
		text-align: center;
	}
	.user-con-ch image {
		height: 80rpx;	
		margin-bottom: 20rpx;
	}
	.user-con-ch-wallet {
		width: 50rpx;
	}
	.user-con-ch-adress {
		width: 80rpx;
	}
	.user-con-ch-msg {
		width: 76rpx;
	}
	
	/* 个人信息 */
	.other>view {
		height: 75rpx;
	}
	.other-img-more {
		width: 12rpx;
		height: 18rpx;
		margin-left: auto;
		margin-right: 0;
	}
	.other-help {
		border-bottom: 1rpx solid #E6E6E6;
	}
	.other-help-bdnone {
		border-bottom: none;
	}
	.infor-gr {
		width: 32rpx;
		height: 28rpx;
		margin-right: 16rpx;
	}
	.infor-po {
		width: 24rpx;
		height: 30rpx;
		margin-right: 10rpx;
	}
	.star {
		color: #FFBD01;
	}
	.star uni-rate {
		margin-right: 12rpx;
		margin-top: 9rpx;
	}
	.exit {
		height:  70rpx;
		line-height: 70rpx;
		border-radius: 30rpx;
		margin-top: 30rpx;
	}
	
	
	.service {
		width: 100%;
		height: 100%;
		background: red;
		opacity: 0;
	}
</style>
