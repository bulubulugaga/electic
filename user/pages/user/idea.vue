<template>
	<!-- 帮助与反馈 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		<!-- 内容 -->
		<view class="idea-form w-con">
			<textarea class="bg-white border-r-20 mt20 f26" maxlength="-1"
				placeholder="请您留下宝贵的意见或建议,我们将努力改进(不少于5个字)"
				placeholder-style="color:#999999;font-size:26rpx;letter-spacing:1rpx;" v-model="idea">				
			</textarea>
			<input class="bg-white mt20 border-r-20 f26" type="number" v-model="phone"
				placeholder-style="color:#999999;font-size:26rpx;letter-spacing:2rpx;"
			    placeholder="方便的话请留下手机号码,以便我们回复您"/>
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
		
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				logo: '',
				
				idea: '',  //意见
				phone: '',  //电话
				
				isDis: false  ,//弹窗是否显示
				msg: ''  //弹窗内容
			}
		},
		methods: {
			submit() { //提交
				if(this.$store.state.login) {
					if(this.idea.length < 5) {
						this.msg = '输入的内容不能少于5个字';
						this.isDis = true;
					}
					else if(this.phone != '') {
						if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone))) {
							this.msg = '请正确填写手机号';
							this.isDis = true;
						}
						else {
							let data = {
								message: this.idea,
								name: this.$store.state.userName,
								phone: this.phone
							}
							let _this = this;
							this.$listapi.addIdea(this.$store.state.sessionId,data).then(res=>{
								_this.isDis = true; //弹窗显示
								if(res.data.code == 'success') {
									_this.msg = '感谢您的提供的宝贵意见，我们会加以改进~谢谢';
								}
								else {
									_this.msg = '提交出现错误，请稍后再试。';
								}
							})
						}
					}
					else {
						let data = {
							message: this.idea,
							name: this.$store.state.userName,
							phone: this.phone
						}
						let _this = this;
						this.$listapi.addIdea(this.$store.state.sessionId,data).then(res=>{
							_this.isDis = true; //弹窗显示
							if(res.data.code == 'success') {
								_this.msg = '感谢您的提供的宝贵意见，我们会加以改进~谢谢';
							}
							else {
								_this.msg = '提交出现错误，请稍后再试。';
							}
						})
					}
				}
				else {
					this.$anoLogin(true);
				}
				
			}
		},
		components: {
			Nav
		},
		onLoad() {
			// this.getBill('all');
			// this.getNews();
			this.$refs.son.a = '留言反馈';  //修改navigatorBarText
			this.logo = this.$store.state.logo;
			
			this.$loading(false);
			let app = getApp();
			app.login(this).then(res => {
				
			});
			
		}
	}
</script>

<style>
	.idea-form textarea {
		padding: 16rpx 24rpx;
		height: 250rpx;
		width: 93%;
	}
	.idea-form input,.idea-form button {
		height: 70rpx;
		padding: 0 24rpx;
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
