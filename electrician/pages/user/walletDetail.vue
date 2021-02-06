<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<view class="detail-box w-con mt20 border-r-20 bg-white" v-for="item in list" :key="item.id" @click="toDetail(item.id)">
			<view class="detail-title f26">{{ item.createdAt.replace(/T/, '  ') }}</view>
			<view class="flex-cover">
				<view class="f36" :class="{red: item.state == 2, green: item.state == 1, yellow: item.state == 0}">{{ item.amount }}</view>
				<view class="f28">
					<text v-if="item.state == 0">待审核</text>
					<text v-if="item.state == 1">审核通过</text>
					<text v-if="item.state == 2">审核被拒绝</text>
				</view>
			</view>
		</view>
		
		<loading></loading>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				list: []
			}
		},
		methods: { 
			getList() {
				//获取列表
				let data = {
					// start: '2020-07-07 00: 00: 00',
					// end: '2040-07-07 00: 00: 00',
					page: 1,
					perPage: 10
				}
				this.$listapi.transferDe(this.$store.state.sessionId,data).then(res => {					
					this.list = res.data.collection;
				})
			},
			toDetail(id) {
				uni.navigateTo({
					url: '/pages/user/walletDetail1?id=' + id
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '提现详情';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				_this.getList();
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			
			this.$over();
		}
	}
</script>

<style>
	.detail-box {
		box-sizing: border-box;
		padding: 20rpx;
	}
	.detail-title {
		margin-bottom: 16rpx;
	}
	.red {
		color: red;
	}
	.green {
		color: #31D8B6;
	}
	.yellow {
		color: #ffd200;
	}
</style>
