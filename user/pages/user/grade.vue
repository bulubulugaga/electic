<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 头部 -->
		<view class="grade-h">
			<view class="grade-h-con">
				<view class="f36 white txt-cen">现有积分</view>
				<view class="flex-center mt20">
					<view class="flex-middle"><image src="../../static/images/grade.png" mode=""></image></view>
					<view class="white f48">{{grade}}</view>
				</view>
			</view>
		</view>
		
		<!-- 积分明细 -->
		<view class="grade-con w-con">
			<view class="bg-white border-r-20 flex-cover flex-middle" v-for="(item,index) in gradeArr" :key="index">
				<view>
					<view class="f28">积分明细</view>
					<view class="f24 c999 mt20">{{item.type}}&emsp;&ensp;{{item.time}}</view>
				</view>
				<view class="f28 colorCon" :class="{red:item.red}">
					{{item.quantity}}
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
	let gradeArr = [ //积分明细
		{title: '积分明细',
		 use: '订单使用',  //用途或来源
		 time: '5月22日 18:00',
		 num: '100',
		 type: 'de', //增加或减少
		},
		{title: '积分明细',use: '下单获得',time: '5月22日 18:00',num: '100',type: 'add'},
		{title: '积分明细',use: '评价获得',time: '5月22日 18:00',num: '100',type: 'add'},
		{title: '积分明细',use: '会员获得',time: '5月22日 18:00',num: '100',type: 'add'}
	];
	export default {		
		data() {
			return {
				grade: 0  ,//现有积分
				
				gradeArr: [], //积分明细
				
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
					_this.getGradeArr();
				},1000);
			}
			else {
				this.tip = '没有更多了~';
			}
		},
		methods: {
			getGradeSum() {  //获取积分信息
				this.$listapi.getGradeSum(this.$store.state.sessionId).then(res=>{
					this.grade = res.data.collection[0];
				})
			},
			getGradeArr() { //获得积分明细
				this.$listapi.getGrade(this.$store.state.sessionId,this.data).then(res => {
					let gradeArr = res.data.collection;
					let year = 0;
					let month = 0;
					let day = 0;
					let time = 0;
					
					gradeArr.forEach(item=>{ //修改数据
						year = item.createdAt.split('-')[0]; //修改时间
						month = item.createdAt.split('-')[1];
						day = item.createdAt.split('-')[2].split('T')[0];
						time = item.createdAt.split('T')[1];
						this.$set(item,'time',year+'年'+month+'月'+day+'日'+' '+time);
						
						item.quantity = item.quantity.toString();
						if(item.quantity.indexOf('-') != -1) {
							item.quantity = item.quantity.replace(/-/,'');
						}
						if(item.quantity.indexOf('+') != -1) {
							item.quantity = item.quantity.replace(/\+/,'');
						}
					
						switch(item.type) {  //修改使用或获得描述
						
							case 0: 
								item.type = '评价获得';
								item.quantity = '+' + item.quantity;
								this.$set(item,'red',false);
								break;
							case 1: 
								item.type = '支付获得';
								item.quantity = '+' + item.quantity;
								this.$set(item,'red',false);
								break;
							case 3:
							case 4:
							case 5:
								item.type = '会员充值';
								item.quantity = '+' + item.quantity;
								this.$set(item,'red',false);
								break;
							case 6:
								item.type = '支付抵扣';
								item.quantity = '-' + item.quantity;
								this.$set(item,'red',true);
								break;
						}
						
						this.gradeArr.push(item);
					})
				})
				
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '积分';  //修改navigatorBarText
			
			
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res => {
				setTimeout(function(){
					_this.$listapi.getGrade(_this.$store.state.sessionId,_this.data).then(res => {
						_this.total_pages = res.data.meta.pagination.total_pages;
					})
					_this.getGradeArr();
					_this.getGradeSum()
					_this.$loading(false);
				},800);
			});
			this.$over();
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#23d5b1,#21CEAB) !important;
	}
	
	/* 头部 */
	.grade-h {
		height: 230rpx;
		background: linear-gradient(to bottom,#21CEAB,#2CAD92) ;
	}
	.grade-h-con {
		padding-top: 40rpx;
	}
	.grade-h-con image {
		width: 30rpx;
		height: 42rpx;
		margin-right: 15rpx;
	}
	.f48 {
		font-size: 48rpx;
	}
	
	/* 明细 */
	.grade-con>view:first-child {
		margin-top: 40rpx;
	}
	.grade-con>view {
		height: 126rpx;
		margin-top: 16rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
	}
	.grade-con .red {
		color: #fb6464;
	}
</style>
