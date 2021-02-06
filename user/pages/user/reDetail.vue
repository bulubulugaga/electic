<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 明细 -->
		<view class="rede-con">
			<view class="rede-con-de flex-cover w-con bg-white" v-for="(item,index) in detail" :key="index">
				<view class="rede-con-de-l">
					<text class="f28">{{item.title}}</text><br>
					<text class="f24 c999">{{item.createdAt}}</text>
				</view>
				<view class="rede-con-de-r">
					<view class="f28 red txt-right" :class="{colorCon:!item.isRed}">{{item.amount}}</view>
					<text class="f24 c999">余额&ensp;{{item.afterAmount}}</text>					
				</view>
			</view>
			
		</view>
		
		<view class="f24 c999 txt-cen mt30">{{tip}}</view>
		
		<popup></popup>
		<loading></loading>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				detail: [ //明细		
				],
				
				data: {
					page: 1,
					perPage: 10
				},
				total_pages: 0,
				tip: '没有更多了~'
			}
		},
		onReachBottom() {
			let _this = this;
			if(this.data.page < this.total_pages) {
				_this.tip = '加载中……';
				setTimeout(function() {
					_this.data.page++;
					_this.getWalletArr();
				},1000);
			}
			else {
				this.tip = '没有更多了~';
			}
		},
		methods: {
			getWalletArr() {
				this.$listapi.getWallet(this.$store.state.sessionId,this.data).then(res=> {
					let detail = res.data.collection;
					this.total_pages = res.data.meta.pagination.total_pages;

					detail.forEach(item => {
						
						item.amount = item.amount.toString();
						if(item.amount.indexOf('-') != -1) {
							item.amount = item.amount.replace(/-/,'');
						}
						if(item.amount.indexOf('+') != -1) {
							item.amount = item.amount.replace(/\+/,'');
						}
						
						switch(item.type) {
							case 0: 
								this.$set(item,'title','充值金额');
								this.$set(item,'isRed',false);
								this.$set(item,'amount','+' + item.amount);
								break;
							case 1: 
								this.$set(item,'title','支付金额');
								this.$set(item,'isRed',true);
								this.$set(item,'amount','-' + item.amount);
								break;
							case 2: 
								this.$set(item,'title','提现金额');
								this.$set(item,'isRed',true);
								this.$set(item,'amount','-' + item.amount);
								break;
							case 3: 
								this.$set(item,'title','分成金额');
								this.$set(item,'isRed',false);
								this.$set(item,'amount','+' + item.amount);
								break;
							case 4: 
								this.$set(item,'title','会员充值');
								this.$set(item,'isRed',true);
								this.$set(item,'amount','-' + item.amount);
								break;
							case 5:
								this.$set(item,'title','退款金额');
								this.$set(item,'isRed',false);
								this.$set(item,'amount','+' + item.amount);
								break;
						};
						
						item.createdAt = item.createdAt.replace(/T/,' ');
						this.detail.push(item);
					})
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '流水明细';  //修改navigatorBarText
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res => {
				setTimeout(function(){
					_this.getWalletArr();
					_this.$loading(false);
				},800);
			});
		}
	}
</script>

<style>
	.txt-right {
		text-align: right;
	}
	.rede-con-de {
		margin-top: 20rpx;
		padding: 10rpx 20rpx 20rpx; 
		width: 89.6%;
		border-radius: 20rpx;
	}
	.rede-con-de .f28 {
		line-height: 56rpx;
	}
	.red {
		color: #fb6464;
	}
	.rede-con-de .colorCon { /* 增加优先度 */
		color: #31D8B6;
	}
</style>
