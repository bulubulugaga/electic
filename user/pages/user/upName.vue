<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		<view class="upName-con w-con">
			<text class="upName-con-ti c999 f30">用户名：</text>
			<input type="text" v-model="name" />
			<text class="upName-con-tip f24">以英文字母或汉字开头，限4-16个字符，一个汉字为2个字符</text>
			<button class="white bg-con border-r-20 f30" @click="submit()">确认</button>
		</view>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				name: this.$store.state.userName
			}
		},
		methods: {
			IsOK(str) {  //条件判断
			  var ta=str.split(""),str_l=0;
			  var str_fa=Number(ta[0].charCodeAt());
			  if((str_fa>=65&&str_fa<=90)||(str_fa>=97&&str_fa<=122)||(str_fa>255)) {
			    for(var i=0;i<=ta.length-1;i++) {
			      str_l++;
			      if(Number(ta[i].charCodeAt())>255){str_l++;}
			    }
			    if(str_l>=4&&str_l<=16){return true;}
			  }
			  return false;
			},
			submit() { //提交信息
			    let _this = this;
				if(this.name == '' || this.name == null) {
					uni.showToast({
						title: '用户名不能为空',
						icon: 'none',
						duration: 2000,
						mask: true
					})
				}
				else if(this.IsOK(this.name)) {
					this.$listapi.upName(this.$store.state.sessionId,this.name).then(res=> {
						if(res.data.code == "success") {
						console.log('res');
							_this.$store.commit('setUsername',_this.name);
							uni.reLaunch({
								url: '/pages/user/user'
							})
						}
						else if(res.data.message == "系统中已存在此名称") {
							uni.showToast({
								title: '此用户名已被使用',
								icon: 'none',
								duration: 2000,
								mask: true
							})
						}
						else {
							uni.showToast({
								title: res.data.message,
								icon: 'none',
								duration: 2000,
								mask: true
							})
						}
					})
				}
				else {
					uni.showToast({
						title: '您输入的格式不正确',
						icon: 'none',
						duration: 2000,
						mask: true
					})
				}
				
				
			}
		},
		components: {
			Nav
		},
		onLoad() {
			this.$refs.son.a = '编辑昵称';  //修改navigatorBarText
			this.$loading(false);
		}
	}
</script>

<style>
	.upName-con-ti {
		display: block;
		margin-top: 16rpx;
	}
	.upName-con input {
		font-weight: bold;
		font-size: 30rpx;
		padding: 9rpx 42rpx;
		border-bottom: 1rpx solid #ddd;
	}
	.upName-con-tip {
		color: #1a1a1a;
		display: block;
		margin-top: 8rpx;
	}
	.upName-con button {
		height: 70rpx;
		line-height: 70rpx;
		margin-top: 35rpx;
	}
</style>
