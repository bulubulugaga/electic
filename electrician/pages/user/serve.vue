<template>
	
	
<view style="height: 100vh;">
	<chat bind:queryCallback="getQueryCallback" generic:operateCard="customoperateCard" />
</view>
	
	
</template>

<script>
	export default {
		data() {
			return {
					
			}
		},
		methods: {
			// getQueryCallback回调 返回query与结果
			  getQueryCallback: function (e) {
			    // console.log(e.detail);
			  }
		},
		onLoad() {		
						
			
		}
	}
</script>

<style>
	/* movable-area {
		height: 70vh !important;
	}
	movable-area scroll-view {
		height: 600rpx !important;
	} */
	
	.chat--scroll-wrap {
		padding-bottom: 16rpx !important;
	}
	.chat--container {  /* 面板背景 */
		background: #EDEDED !important;
	}
	.bottom-operate-view { /* 底部背景 */
		background: #f7f7f7 !important;
	}
	.welcomeCard--leftView,.textCard-textCard--leftView,.textCusCard-textCard--leftView { /* 左侧对话框 */
		box-shadow: none !important;
		border: none !important;
	}
	.queryCard--rightView {  /* 右侧对话框 */
		box-shadow: none !important;
		border: none !important;
		background: #95EC69 !important;
	}
	.chat--move-view {
		display: none !important;
	}
	
</style>
