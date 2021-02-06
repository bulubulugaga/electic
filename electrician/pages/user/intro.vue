<template>
	<!-- 帮助与反馈 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		<!-- 内容 -->
		<view class="idea-form w-con">
			<textarea class="bg-white border-r-20 mt20 f26" 
				placeholder="请在此输入您的个人介绍(不超过200字)"
				placeholder-style="color:#999999;font-size:26rpx;letter-spacing:1rpx;" v-model="intro">				
			</textarea>
			
			<view class="mt30 f30">技能标签选择</view>
			<view class="intro-skill flex f28">
				<!-- <view>aaa</view>
				<view>bbb</view>
				<view>ccc</view>
				<view class="a">ddd</view> -->
				<view class="intro-skill-de" :class="{a:item.checked}" v-for="(item,index) in skill" @click="check(index)">
					{{item.name}}
				</view>
			</view>
			<button @click="submit()" class="white bg-con border-r-20 f28 mt30">提交</button>
		</view>
		
		<!-- 提交成功后弹窗 -->
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
	export default {
		data() {
			return {
				logo: '',
				
				intro: '',  //介绍
				
				isDis: false,  //弹窗是否显示
				msg: '',  //弹窗内容
				
				skill: []
				
			}
		},
		methods: {
			submit() { //提交
				if(this.$store.state.login == false) {
					uni.showToast({
						title: '您还没有登录。',
						icon: 'none',
						duration: 1200
					});
				}
				else if(this.$store.state.info.imageList.length == 0) {
					uni.showModal({
						title: '提示',
						content: '您需要注册实名认证后才能提交信息',
						confirmText: '去注册',
						cancelText: '暂不注册',
						success: function (res) {
						    if (res.confirm) {
								uni.navigateTo({
									url: '/pages/index/register'
								})
							}
						},fail(err) {
						  console.log(err);
					  }
					})
				}
				else if(this.$store.state.info.info) {
					if(this.$store.state.info.info.stateName == '审核中') {
						uni.showToast({
							title: '您的信息还在审核中，不能提交信息。',
							icon: 'none',
							duration: 1200
						});
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
										url: '/pages/index/register'
									})
								}
							},fail(err) {
							  console.log(err);
						  }
						})
					}
					else if(this.$store.state.info.info.stateName == '已审核') {
						let skillId =  [];  //选中的技能id
						this.skill.forEach(item=>{
							if(item.checked) {
								skillId.push(item.id);
							}
						})
						if(this.intro == '' || this.intro == null) {
							this.msg = '请填写个人介绍';
							this.isDis = true;
						}
						else if(skillId == [] || skillId == '' || skillId == null) {
							this.msg = '请选择技能';
							this.isDis = true;
						}
						else {
							let data = {
								expertiseIds: skillId,
								strongPoint: this.intro
							}
							let _this = this;
							this.$listapi.addSkill(this.$store.state.sessionId,data).then(res=>{
								_this.isDis = true; //弹窗显示
								if(res.data.code == 'success') {
									_this.msg = '个人介绍及技能提交成功';
								}
								else {
									_this.msg = '提交出现错误，请稍后再试。';
								}
							})
						}
					}
				}
			},
			getSkill() {  //获取技能列表
				this.$listapi.getSkill(this.$store.state.sessionId).then(res=>{
					this.skill = res.data.collection;
					this.skill.forEach(item=>{
						this.$set(item,'checked',false);  //添加是否选中
					})
					
					
					//获取用户介绍和技能
					this.$listapi.getIntro(this.$store.state.sessionId).then(res1=>{
						let intro = res1.data.collection[0];
						if(intro != null && intro != '') {
							if(intro.speciality != '' && intro.speciality != null) {
								this.intro = intro.speciality;
								this.skill.forEach(item=>{
									intro.skills.forEach(item1=>{
										// console.log(item);
										// console.log(item.name);
										// console.log(item1);
										if(item.name == item1) {
											item.checked = true;
										}
									})
								})
							}
						}
					})
					
					
				})
			},
			check(index) {
				this.skill[index].checked = !this.skill[index].checked;
			}
		},
		components: {
			Nav
		},
		onLoad() {
			// this.getBill('all');
			// this.getNews();
			this.$refs.son.a = '个人介绍';  //修改navigatorBarText
			this.logo = this.$store.state.logo;
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {
				
			}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '已审核') {
					let app = getApp();
					this.$loading(true);
					app.login(this).then(res => {
						this.getSkill();
						this.$loading(false);
					});
				}
			}
			this.$over();
		}
	}
</script>

<style>
	.idea-form textarea {
		padding: 16rpx 24rpx;
		height: 250rpx;
		width: 93%;
	}
	.idea-form button {
		height: 70rpx;
		padding: 0 24rpx;
		margin-top: 50rpx;
	}
	
	.intro-skill {
		flex-wrap: wrap;
	}
	
	.intro-skill>view {
		width: 30%;
		background: white;
		color: black;
		line-height: 60rpx;
		margin-top: 20rpx;
		text-align: center;
		border-radius: 10rpx;
		margin-right: 5%;
	}
	.intro-skill>view:nth-child(3n+3) {
		margin-right: 0;
	}
	.intro-skill>view.a {
		background: #4DA8E5;
		color: white;
	}
	
	
	/* 提交成功后的弹窗 */
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
		margin-top: 13rpx;
	}
	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 52rpx;
		margin-top: 34rpx;
	}
</style>
