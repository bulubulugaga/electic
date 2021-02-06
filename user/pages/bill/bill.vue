<template>
	<view class="content" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
		<!-- 导航 -->
		<Nav ref="son"></Nav>

		<!-- 顶部 -->
		<view class="index-header">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
		</view>

		<!-- 内容 -->
		<view class="bill-con w-con" >
			<view class="bill-con-ti white flex-cover f26">
				<view @click="distriCh()"><text>{{distri}}</text><image class="ml10" src="../../static/images/bill_b.png" mode=""></image></view>
				<!-- <view>预约时间由远到近<image class="ml10" src="../../static/images/bill_b.png" mode=""></image> -->
				<!-- </view> -->
				<view @click="typeDis=true">{{array[index]}}
				<!-- <view @click="typeDis=false">{{array[index]}} -->
					<image class="ml10" src="../../static/images/bill_b.png" mode=""></image>
				</view>
			</view>


			<!-- 订单 -->
			<view class="bill-con-de bg-white mt20" v-for="(item,index) in bill" :key="index" @click="toDetail(item)" v-show="index < page * perpage">
				<view class="flex">
					<image class="bill-con-de-photo circle" :src="item.wxPhoto" mode=""></image>
					<view>
						<view class="person f26">{{item.name}}</view>
						<view class="type f30 colorCon">{{item.type}}</view>
					</view>
					<view :class="{stateGreen: item.stateGreen,stateYellow: item.stateYellow,stateRed: item.stateRed}" class="state ml-auto f26">{{item.state}}</view>
				</view>
				<view class="time c999 f26">
					预约时间：{{item.orderdAt || '无'}}
				</view>
				<view class="adress c999 f26 flex">
					<view class="ad-max">预约地址：</view><view class="ad-max-2">{{item.address || '无'}}</view>
				</view>
				<view class="btn flex">
					<view>
						<text v-show="item.priceDis" class="c999 f22" :class="{priceCol:item.priceCol}">{{item.price}}</text>
						<!-- <text v-show="item.priceDis" class="white">a</text>
						<text v-show="item.priceDis" class="c999 f22 txt-line-through">￥{{item.preServiceFee}}</text> -->
					</view>
					<button v-show="item.isBtn" class="white bg-con ml-auto" @click.stop="cancelBill(item.state,item.id,item.electricianId,item.enddAt,item.price,item.doorFee)">{{item.btn}}</button>
					<button v-if="item.state == '等待支付上门费'" class="abaaba white bg-con"
							@click.stop="lastqu(item.id)">取消订单</button>
				</view>
			</view>


			<view class="f24 c999 txt-cen mt30">{{tip}}</view>

		</view>

		<!-- 订单类型选择 -->
		<view class="type-ch" v-show="typeDis" @click="typeDis = false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">选择订单类型</view>
						<view>
							<image src="../../static/images/type_ch.png" mode=""></image>
						</view>
					</view>
					<view class="type-items">
						<view class="type-item f28" v-for="(item,index) in array" :key="index" @click="typeChoose(index)">
							{{item}}
						</view>
					</view>
					<view class="type-ch-cancel" @click="typeDis=false">
						×
					</view>
				</view>
			</view>
		</view>

		<!-- 取消订单弹窗 -->
		<view class="submit-su submit-su-re txt-cen" v-if="isDis" @click="isDis = false">
			<view class="submit-su-con bg-white border-r-20" @click.stop>
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">请输入取消订单的理由</view>
				<view class="f24">
					<textarea class="reason" v-model="reason"></textarea>
				</view>
				<button @click.stop="sureCancel()" class="white bg-con f28">确认</button>
			</view>
		</view>

		<view class="submit-su txt-cen" v-if="isDis1" @click="isDis1 = false">
			<view class="submit-su-con bg-white border-r-20" @click.stop>
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{msg}}</view>
				<button @click="isDis1 = false" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<van-popup :show="payShow" closeable position="bottom"
		  custom-style="height: 40%" @close="payShow=false" round=true>
			<view class="pay-choose">
				<view class="c999 f26">* 积分抵扣规则：{{gradeR}}积分可抵扣一元<br>* 您当前有{{gradeSum}}积分</view>
				<view v-if="isEleRrade" class="flex-cover f30 mt20"><text>请输入需要使用的积分: </text><input type="number" :class="{red: tipa}" v-model="grade" placeholder="0" /></view>
				<view v-else class="flex-cover f30 mt20">您使用了{{useGrade}}积分</view>
				<view class="mt20 red flex-middle">
					<view v-show="tipa" class="f26">您输入的积分不可用</view>
					<view v-if="isEleRrade" class="f36 ml-auto">￥{{doorFact}}</view>
					<view v-else class="f36 ml-auto">￥{{factM}}</view>
				</view>
				<view class="submit mt40" @click="submit(2)">账户余额支付</view>
				<view class="submit" @click="submit(1)">微信支付</view>
			</view>
		</van-popup>
		
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
				array: ['进行中的订单', '已完成订单', '已取消订单','全部订单'], //订单类别选项
				index: 3, //选择了第几个订单类别				
				typeDis: false, //订单类型选择显示
				distri: '预约时间由近到远',  //距离排序

				bill: [], //订单数据 
				billBei: [], //订单备份
				btn: '', //按钮显示

				isDis: false, //取消订单弹窗是否显示
				priceDis: true, //价格模块是否显示
				stateGreen: true, //状态颜色绿色（已完成、等待支付）
				stateYellow: false, //状态颜色黄色（等待接单）
				stateRed: false, //状态颜色红色 （已取消）
				
				id: '', //选中订单的id
				
				reason: '',
				isDis1: false,
				msg: '',
				
				page: 1,
				perpage: 8,
				tip: '没有更多了~',
				
				payShow: false,  //显示支付方式
				gradeR: 0,   //积分抵扣规则
				grade: 0  ,//积分数量
				gradeSum: 0,
				tipa: false,
				useGrade: 0,
				factM: 0,
				isEleRrade: true,
				doorPrice: 0,
				
				
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
				endX: 0,
				
				doorFact: 0,
				state: '',

			}
		},
		onLoad() {

			this.$refs.son.a = '我的订单'; //修改navigatorBarText
			this.$refs.son.indexSer = false; //头部显示客服
			this.$refs.son.conBack = false; //隐藏返回
			this.logo = this.$store.state.logo;

			
			let app = getApp();
			let _this = this;
			this.$loading(false);
			this.$loading(true);
			app.login(this).then(res => {
				_this.getBill(); //获取订单
				
				_this.getGradeRule(); //获取积分规则
				_this.getGrade(); //获取积分规则
				
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			this.$over();
		},
		onReachBottom() {
			let _this = this;
			let total = Math.ceil(this.bill.length / this.perpage);
			if(this.page < total) {
				_this.tip = '加载中……';
				setTimeout(function() {
					_this.page++;
				},1000);
			}
			else {
				this.tip = '没有更多了~';
			}
		},
		watch: {
			grade(e) {
				if(this.grade > this.gradeSum) {
					this.tipa = true;
					this.doorFact = this.doorPrice;
				}
				else {
					if(this.doorPrice - this.grade / this.gradeR < 0) {
						console.log(this.doorPrice);
						console.log(this.grade);
						console.log(this.gradeR);
						this.tipa = true;
						this.doorFact = this.doorPrice;
					}
					else {
						this.tipa = false;
						this.doorFact = Number(this.doorPrice - this.grade / this.gradeR).toFixed(2);
					}
					
				}
			}
		},
		methods: {
			getGrade() {
				this.$listapi.getGradeSum(this.$store.state.sessionId).then(res =>{
					this.gradeSum = res.data.collection[0] || 0;
				})
			},
			getGradeRule() {
				this.$listapi.getGradeRule(this.$store.state.sessionId).then(res =>{
					this.gradeR = res.data.collection[0];
				})
			},
			submit(payment)  {
				if(this.tipa) {
					return 0;
				}
				else {
					new Promise((resolve, reject) =>{
						if(uni.getStorageSync('eleUserGrade')) {
							resolve();
						}
						else {
							if(this.grade == 0 || this.grade == '') {
								let eleUserGrade = {
									id: this.id,
									isGrade: true,
									grade: 0,
									fact: this.doorFact
								}
								uni.setStorageSync('eleUserGrade', eleUserGrade);
								resolve();
							}
							else {
								let feeType = 0;
								if(this.state != '等待支付上门费') {
									feeType = 1;
								}
								let gradeKdata = {
									feeType,
									id: this.id,
									ship: this.grade || 0
								}
								this.$listapi.getGradek(this.$store.state.sessionId, gradeKdata).then(res =>{
									if(res.data.collection) {  //积分抵扣存入本地
										let eleUserGrade = {  
											id: this.id,
											isGrade: true,
											grade: gradeKdata.ship,
											fact: this.doorFact
										}
										uni.setStorageSync('eleUserGrade', eleUserGrade);
										resolve();
									}
								})
							}
						}
					}).then(() => {
						let data1 = {
							orderId: this.id,
							payment
						};
						this.$listapi.unOrder(this.$store.state.sessionId,data1).then(res => {
							let _this = this;
							this.payShow = false;
							_this.$loading(true);
							setTimeout(() => {
								_this.$loading(false);
								if(payment != 1) {
									_this.isDis1 = true;
									if(res.data.code == 'success') {
										_this.msg = '账户余额支付成功。';
										uni.removeStorageSync('eleUserGrade');
										uni.reLaunch({
											url: '/pages/bill/bill'
										})
									}
									else {
										_this.msg = res.data.message;
									}
								}
								else {
									uni.removeStorageSync('eleUserGrade');
									uni.reLaunch({
										url: '/pages/bill/bill'
									})
								}
							},1000)
						});
					})
					uni.reLaunch({
						url: '/pages/bill/bill'
					})
				}
				
			},
			cancelBill(state,id,em,time,price,door) { //点击相应按钮
				this.state = state;
				switch (state) {
					case '等待支付上门费': 
						this.doorPrice = this.doorFact = Number(door).toFixed(2);
						let eleUserGrade = uni.getStorageSync('eleUserGrade');
						if(eleUserGrade) {
							if(eleUserGrade.id == id) {
								this.isEleRrade = false;
								this.useGrade = eleUserGrade.grade;
								this.factM = eleUserGrade.fact;
							}
							else {
								this.isEleRrade = true;
							}
						}
						this.payShow = true;
						this.id = id;
						
						break;
					case '等待接单':
						this.isDis = true;
						this.id = id;
						
						break;
					case '等待支付':
						this.doorPrice = this.doorFact = price.split('￥')[1];
						eleUserGrade = uni.getStorageSync('eleUserGrade');
						if(eleUserGrade) {
							if(eleUserGrade.id == id) {
								this.isEleRrade = false;
								this.useGrade = eleUserGrade.grade;
								this.factM = eleUserGrade.fact;
							}
							else {
								this.isEleRrade = true;
							}
						}
						
						//拉取微信支付
						this.payShow = true;
						this.id = id;

						break;
					case '已完成':
						uni.navigateTo({ //跳转到评价页面
							url: './remark?id=' + id +'&em=' + em + '&time=' + time
						});
						break;
					case '已取消':
						uni.navigateTo({ //跳转到下单页面
							url: '/pages/index/order?aa=' + 0,
						});
						break;
				}
			},
			lastqu(id) {
				this.isDis = true;
				this.id = id;
			},
			typeChoose(index) { //选择类型
				this.page = 1;  //如果直接从已显示的订单筛选，去掉这一行
				this.index = index;
				this.typeDis = false;
				this.bill = [];
				if (this.array[index] == '进行中的订单') {
					this.billBei.forEach(item=>{
						if(item.state != '已完成' && item.state != '已取消') {
							this.bill.push(item);
						}
					})
				} else if (this.array[index] == '已完成订单') {
					this.billBei.forEach(item=>{
						if(item.state == '已完成') {
							this.bill.push(item);
						}
					})
				} else if (this.array[index] == '已取消订单') {
					this.billBei.forEach(item=>{
						if(item.state == '已取消') {
							this.bill.push(item);
						}
					})
				}
				else {
					this.bill = this.billBei;
				}
				
				if(this.bill.length / this.perpage <= 1) {
					this.tip = '没有更多了~';
				}
			},
			distriCh() { //按距离排序
				this.page = 1;
				if(this.distri == '预约时间由近到远') {
					this.distri = '预约时间由远到近';
					this.bill.sort((a, b)=>{ return Date.parse(b.orderdAt.replace(/-/g, "/").replace(/T/g, " ")) - Date.parse(a.orderdAt.replace(/-/g, "/").replace(/T/g, " ")); });
				}
				else {
					this.distri = '预约时间由近到远';
					this.bill.sort((a, b)=>{ return Date.parse(a.orderdAt.replace(/-/g, "/").replace(/T/g, " ")) - Date.parse(b.orderdAt.replace(/-/g, "/").replace(/T/g, " ")); });
				}
			},
			getBill() { //获取订单信息
				let _this = this;
				let adder = [];
				let bill = [];

				this.$listapi.getBill(this.$store.state.sessionId).then(res => {
					// console.log(res);
					bill = res.data.collection;

					bill.forEach(item => {
						this.$set(item, 'allAd', item.address + '-+-' + item.number); //存储完整地址信息
						item.orderdAt = item.orderdAt.replace(/T/g, " ") || item.orderdAt;
						if(item.address != null && item.address.replace(/-*-/)){
							item.address = item.address.split('-*-')[1] || item.address;
						};
						this.$set(item, 'isRemark', false);  //是否评价
						
						switch(item.state) {
							case -1: {
								item.state = '等待支付上门费';
								this.$set(item, 'priceDis', false);
								this.$set(item, 'btn', '支付上门费');
								this.$set(item, 'isBtn', true);
								this.$set(item,'stateGreen' ,false); //状态颜色绿色
								this.$set(item,'stateYellow' ,true);
								this.$set(item,'stateRed' ,false);
								break;
							}
							case 0: {
								item.state = '等待接单';
								this.$set(item, 'priceDis', false);
								this.$set(item, 'btn', '取消订单');
								this.$set(item, 'isBtn', true);
								this.$set(item,'stateGreen' ,false); //状态颜色绿色
								this.$set(item,'stateYellow' ,true);
								this.$set(item,'stateRed' ,false);
								break;
							}
							case 1: {
								item.state = '等待上门服务';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '支付订单');
								this.$set(item, 'isBtn', false);
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'price' ,'等待输入订单金额');
								this.$set(item,'priceCol' ,false);
								break;
							}
							case 2: {
								item.state = '等待报价';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '支付订单');
								this.$set(item, 'isBtn', false);
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'price' ,'等待输入订单金额');
								this.$set(item,'priceCol' ,false);
								break;
							}
							case 3: {
								item.state = '等待支付';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '支付订单');
								this.$set(item, 'isBtn', true);
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
								break;
							}
							case 9: 
							case 10:
							case 11: {
								item.state = '已完成';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '评价订单');
								this.$set(item, 'isBtn', true);
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
								break;
							}
							case 12: {
								item.state = '已完成';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '评价订单');
								this.$set(item, 'isBtn', false);
								this.$set(item,'stateGreen' ,true); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,false);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
								item.isRemark = true;
								break;
							}
							case -100: {
								item.state = '已取消';
								this.$set(item, 'priceDis', false);
								this.$set(item, 'btn', '重新下单');
								this.$set(item, 'isBtn', true);
								this.$set(item,'stateGreen' ,false); //状态颜色绿色
								this.$set(item,'stateYellow' ,false);
								this.$set(item,'stateRed' ,true);
								this.$set(item,'price' ,'￥'+item.serviceFee);
								this.$set(item,'priceCol' ,true);
							}
							
							
							
						}

					})

					_this.billBei = _this.bill = bill;
					if(_this.bill.length/_this.perpage > 1) {
						this.tip = '加载中……';
					}else {
						this.tip = '没有更多了~';
					}
					// console.log(_this.billBei);
					
					this.index = 3;
					this.distri = '预约时间由近到远';
					this.typeDis = false;
					this.isDis = false;
					this.isDis1 = false;
					this.page = 1;
					

				});
			},
			sureCancel() { //确认取消弹窗
				let _this = this;
				if(this.reason == '' || this.reason == null) {
					this.msg = '请填写取单理由';
					this.isDis = false; //关闭弹窗
					this.isDis1 = true;
				}
				else {
					this.$listapi.celBill(this.$store.state.sessionId,this.id,this.reason).then(res=>{
						if(res.data.success) {
							uni.reLaunch({
								url: '/pages/bill/bill'
							})							
						}
						else {
							_this.msg = res.data.message;
							_this.isDis1 = true;
						}
					})
					this.isDis = false; //关闭弹窗
					this.index = 2;
					this.getBill();
				}
			},
			toDetail(item) { //Id是订单编号，跳转到订单详情		

				// let item1 = encodeURIComponent(JSON.stringify(item));	
				// uni.navigateTo({
				// 	url: './detail?item='+item1
				// });
				
				uni.navigateTo({
					url: './detail?item='+item.id
				});
				
			},
			handletouchmove: function(event) {
				if (this.flag !== 0) {
					return;
				}
				let currentX = event.touches[0].pageX;
				let currentY = event.touches[0].pageY;
				let tx = currentX - this.lastX;
				
				let ty = currentY - this.lastY;
				let text = '';
				let flag = 0;
				this.mindex = -1;
				//左右方向滑动
				if (Math.abs(tx) > Math.abs(ty)) {
					if (tx < 0) {
						text = '向左滑动';
						flag = 1;
					//	this.getList();  //调用列表的方法
					} else if (tx > 0) {
						text = '向右滑动';
						flag = 2;
					}
				}
				//上下方向滑动
				else {
					if (ty < 0) {
						text = '向上滑动';
						flag = 3;
					//	this.getList();  //调用列表的方法
					} else if (ty > 0) {
						text = '向下滑动';
						flag = 4;
					}
				}
				
				//将当前坐标进行保存以进行下一次计算
				this.lastX = currentX;
				this.lastY = currentY;
				this.text = text;
				this.flag = flag;
			},
			handletouchstart: function(event) {
				this.endX = 0;
				this.lastX = event.touches[0].pageX;
				this.lastY = event.touches[0].pageY;
			},
			handletouchend: function(event) {
				this.endY = event.changedTouches[0].clientY;
				let _this = this;
				if(this.flag == 4) {
					if(this.endY - this.lastY >= 80) {
						let pages = getCurrentPages();
						let beforePage = pages[pages.length - 1]; // 当前页面
						beforePage.onLoad();
					}
				}
			}
		},
		components: {
			Nav
		},
		mounted() {

		}
	}
</script>

<style>
	@import "/wxcomponents/vant/dist/common/index.wxss";
	
	.content {
		min-height: 90vh;
	}
	/* 修改导航渐变 */
	.demo {
		background: linear-gradient(to bottom, #23d5b1, #23D4B0) !important;
	}

	/* 顶部 */
	.index-header {
		width: 100%;
		height: 0;
		position: relative;
		z-index: 0;
	}

	.indexHBg {
		width: 100%;
		height: 100rpx;
	}

	/* 内容 */
	.bill-con {
		position: relative;
		z-index: 1;
		top: 25rpx;
	}

	.bill-con-ti image {
		width: 17rpx;
		height: 17rpx;
	}

	/* 订单 */
	.bill-con-de {
		padding: 14rpx 20rpx 24rpx;
		border-radius: 15rpx;
	}

	.bill-con-de-photo {
		width: 100rpx;
		height: 100rpx;
		margin-top: 6rpx;
	}

	.bill-con-de .person {
		margin-top: 14rpx;
		margin-left: 30rpx;
	}

	.bill-con-de .type {
		margin-left: 30rpx;
		border: 1rpx solid #20cba7;
		border-radius: 10rpx;
		padding: 0 10rpx;
		margin-top: 10rpx;
	}

	.bill-con-de .stateYellow {
		color: #ffd200;
	}

	.bill-con-de .stateGreen {
		color: #31d8b6;
	}

	.bill-con-de .stateRed {
		color: #fb6464;
	}

	.bill-con-de .time {
		margin-top: 25rpx;
	}

	.bill-con-de .adress {
		margin-top: 15rpx;
	}

	.bill-con-de .btn {
		margin-top: 50rpx;
	}

	.bill-con-de button {
		width: 156rpx;
		height: 47rpx;
		font-size: 24rpx;
		line-height: 47rpx;
		margin-right: 0;
		border-radius: 16rpx;
	}

	.priceCol {
		font-size: 30rpx;
		font-weight: bold;
		color: #fb6464;
	}


	/* 取消订单弹窗 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
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
		margin-top: 25rpx;
	}

	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 57rpx;
		margin-top: 50rpx;
	}
	
	.submit-su-re .submit-su-con {
		height: 405rpx;
		margin-top: 457rpx;
	} 
	.submit-su-re .submit-su-con .reason {
		background: #F0F0F0;
		width: 370rpx;
		height: 140rpx;
		margin-top: -14rpx;
		text-align: left;
		font-size: 26rpx;
		padding: 20rpx;
		color: #a1a1a1;
	}
	.submit-su-re .submit-su-con button {
		margin-top: 25rpx;
	}

	/* 订单类型选择 */
	.type-ch {
		position: fixed;
		top: 0;
		background: rgba(0, 0, 0, .5);
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	.type-ch-con {
		position: fixed;
		bottom: 0;
		width: 100%;
		height: 395rpx;
		background: white;
		border-top-left-radius: 20rpx;
		border-top-right-radius: 20rpx;
		box-sizing: border-box;
		padding: 10rpx 0;
	}

	.type-ch-title image {
		width: 18rpx;
		height: 13rpx;
		margin-left: 8rpx;
		vertical-align: middle;
		margin-top: -5rpx;
	}

	.type-items {
		width: 80%;
		margin: 27rpx auto 0;
		overflow: scroll;
	}

	.type-item {
		height: 70rpx;
		line-height: 70rpx;
		border-bottom: 1rpx solid #E5E5E5;
	}

	.type-item:last-child {
		border-bottom: none;
	}

	.type-ch-cancel {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		color: #ccc;
		font-size: 65rpx;
		line-height: 0;
	}
	
	.ad-max {
		width: 216rpx;
	}
	.ad-max-2 {
		width: 850rpx;
	}
	
	
	.abaaba {
		margin-left: 30rpx;
	}
	
	/* 支付选择 */
	.pay-choose {
		padding: 60rpx 40rpx 40rpx;
	}
	.pay-choose>view input {
		max-width: 300rpx;
		text-align: right;
	}
	.pay-choose>view.submit {
		font-size: 30rpx;
		line-height: 80rpx;
		border-top: 1rpx solid #e7e7e7;
		text-align: center;
	}
	.txt-right {
		text-align: right;
	}
</style>
