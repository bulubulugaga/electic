<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<view class="detail-info w-con mt30 border-r-20 bg-white f28">
			<view>提交时间：{{ info.createdAt.replace(/T/, '  ') || '' }}</view>
			<view>提现金额：{{ info.amount || '' }}</view>
			<view v-if="info.afterAmount">剩余金额：{{ info.afterAmount }}</view>
			<view v-if="info.state">审核状态：
				<text v-if="info.state == 0">待审核</text>
				<text v-if="info.state == 1">审核通过</text>
				<text v-if="info.state == 2">审核被拒绝</text>
			</view>
			<view v-if="info.approveAt">审核时间：{{ info.approveAt.replace(/T/, '  ') }}</view>
			<view v-if="info.approveRemark">拒绝理由：{{ info.approveRemark.replace(/T/, '  ') }}</view>
		</view>
		
		<loading></loading>
	</view>
</template>
<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				info: {}
			}
		},
		methods: { 
			getDetail(id) {
				//获取列表
				
				this.$listapi.getransferDe(this.$store.state.sessionId,id).then(res => {
					this.info = res.data.collection[0];
				})
			}
		},
		components: {
			Nav
		},
		onLoad(e) {			
			this.$refs.son.a = '提现详情';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				_this.getDetail(e.id);
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			
			this.$over();
		}
	}
</script>

<style>
.detail-info {
	padding: 20rpx;
}
.detail-info>view {
	margin-top: 16rpx;
}
</style>
