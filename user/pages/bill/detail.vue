<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 顶部 -->
		<view class="index-header">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
		</view>
		
		<!-- 内容 -->
		<view class="bill-con w-con" @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
			
			<!-- 流程 -->
			<view class="bill-state bill-step bg-white hide" v-if="bill.state != '已取消'">
				<uni-steps :options="step" :active="stepIndex" active-color="#31d8b6"></uni-steps>				
			</view>
			
			<!-- 地图 -->
			<view v-if="bill.electricianId && bill.state != '已完成' && bill.state != '已取消'" class="bill-state" style="padding: 0;margin-top:14rpx;">
				<map class="border-r-20" style="width: 710rpx; height: 300rpx;"
					:markers="covers" :include-points="points" :polyline="polyline">
				</map>
			</view>
			
			<!-- 状态 -->
			<view class="bill-state bg-white flex-cover mt15">
				<view class="f30">订单状态：</view>
				<view class="f28" :class="{stateGreen: bill.stateGreen,stateYellow:  bill.stateYellow,stateRed:  bill.stateRed}">{{bill.state}}</view>
			</view>
			
			
			
			<!-- 下单信息 -->
			<view class="bill-user bg-white mt15">
				<view class="bill-user-ti f30">下单信息：</view>
				<view class="flex-cover">
					<view>所需服务：</view>
					<view class="colorCon">{{bill.type}}</view>
				</view>
				<view class="flex-cover">
					<view>预约时间：</view>
					<view>{{bill.orderdAt}}</view>
				</view>
				<view class="flex-cover">
					<view>预约地点：</view>
					<view class="bill-user-ad">{{myad}}</view>
				</view>
				<view class="bill-user-img">
					<view>附图：</view>
					<view v-if="!bill.createImage[0].url" class="img flex-MC">暂无图片</view>
					<view v-else class="flex-cover" style="flex-wrap: wrap">
						<image v-for="item in bill.createImage" :key="item.id" class="bg-f2 border-r-20" :src="item.url" alt="暂未上传图片" mode=""></image>
					</view>
				</view>
				<view class="flex-cover">
					<view>备注：</view>
					<view>{{bill.faultDesc}}</view>
				</view>
			</view>
			
			<!-- 接单信息 -->			
			<view v-if="bill.priceDis" class="bill-user bg-white mt15">
				<view class="bill-user-ti f30">接单信息：</view>
				<view class="te flex-cover">
					<view>接单电工：</view>
					<view class="flex">
						<view class="colorCon flex-middle" @click="phoneEm(em.phone)">
							<view class="emploTelImg flex-middle"><image src="../../static/images/detail.png" mode=""></image></view>
							<view class="emploTel flex-middle">联系电工</view>
						</view>
						<view class="flex-middle colorCon flex-middle" @click="toEmDetail(em)">
							<view class="emploPhoto flex-middle"><image :src="em.wxPhoto" mode=""></image></view>
							<view>{{em.name}}</view>
						</view>
					</view>
				</view>
				<view class="flex-cover">
					<view>服务码：</view>
					<view class="black">{{bill.verificationdCode}}</view>
				</view>
				<view class="bill-user-img">
					<view>现场服务图片：</view>
					<view v-show="!bill.completeImage[0].url" class="img flex-MC">暂无图片</view>
					<image v-show="bill.completeImage[0].url" :src="bill.completeImage[0].url" class="border-r-20" alt="暂未上传图片" mode=""></image>
				</view>
				<view class="flex-cover">
					<view>费用合计：</view>
					<view :class="{priceCol:bill.priceCol}">￥{{Number(bill.doorFee+bill.serviceFee).toFixed(2)}}</view>
				</view>
				<view class="flex-cover">
					<view>上门费用：</view>
					<view>
						<view class="txt-cen" :class="{priceCol:bill.priceCol}">￥{{bill.doorFee}}</view>
						<view v-if="bill.doorFee != bill.preDoorFee" class="txt-cen txt-line-through">￥{{bill.preDoorFee}}</view>
					</view>
				</view>
				<view class="flex-cover">
					<view>维修费用：</view>
					<!-- <view :class="{priceCol:bill.priceCol}">￥{{bill.serPrice}}</view> -->
					<view>
						<view class="txt-cen" :class="{priceCol:bill.priceCol}">{{bill.price}}</view>
						<view v-if="bill.price != bill.preServiceFee && bill.preServiceFee != null" class="txt-cen txt-line-through">￥{{bill.preServiceFee}}</view>
					</view>
				</view>
			</view>
			
			
			<view class="bill-user bill-news bg-white mt15">
				<view class="bill-user-ti flex-cover">
					<view class="f30">订单信息：</view>
					<!-- <view><image src="../../static/images/bill_detail.png" mode=""></image></view> -->
				</view>
				<view class="flex-cover">
					<view>订单编号：</view>
					<view class="big-width">{{bill.id}}</view>
				</view>
				<view class="flex-cover">
					<view>下单时间：</view>
					<view>{{bill.createdAt}}</view>
				</view>
				<view class="flex-cover" v-if="bill.selectdAt != null">
					<view>接单时间：</view>
					<view>{{bill.selectdAt}}</view>
				</view>
				<view class="flex-cover" v-if="bill.enddAt != null">
					<view>完成时间：</view>
					<view>{{bill.enddAt}}</view>
				</view>
			</view>
			
			<!-- 评价 -->
			<view v-if="bill.isRemark" class="bill-user bg-white mt15">
				<view class="bill-user-ti flex-cover">
					<view class="f30">订单评价：</view>
				</view>
				<view class="flex">
					<view>准时上门：</view>
					<view class="star-num flex-middle mt5">
						<uni-rate class="in-block" size='18' max="5" :value="remark.allSatisfied" active-color="#fecb01" margin="7" disabled></uni-rate>
					</view>
					<view class="star-con">{{remark.de1}}</view>
				</view>
				<view class="flex">
					<view>服务态度：</view>
					<view class="star-num flex-middle mt5">
						<uni-rate class="in-block" size='18' max="5" :value="remark.attitude" active-color="#fecb01" margin="7" disabled></uni-rate>
					</view>
					<view class="star-con">{{remark.de2}}</view>
				</view>
				<view class="flex">
					<view>技术能力：</view>
					<view class="star-num flex-middle mt5">
						<uni-rate class="in-block" size='18' max="5" :value="remark.skill" active-color="#fecb01" margin="7" disabled></uni-rate>
					</view>
					<view class="star-con">{{remark.de3}}</view>
				</view>
				<view v-if="remark.imageList[0].url != null">
					<view class="bill-user-img"><image :src="remark.imageList[0].url" mode=""></image></view>
				</view>
				<view class="txt-indent">
					{{remark.remark}}
				</view>
			</view>
			
		</view>
		
		
		<!-- 占位 -->
		<view class="blank"></view>
		
		<!-- 底部按钮 -->
		<view v-show="bill.isBtn" class="detail-btn bg-white flex-middle"> 
			<button class="white bg-con f26" @click.stop="cancelBill(bill.state,bill.id,bill.electricianId,bill.enddAt,bill.price,bill.doorFee)">{{bill.btn}}</button>
			<button v-if="bill.state == '等待支付上门费'" class="abaaba white bg-con f26"
					@click.stop="lastqu(bill.id)">取消订单</button>
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
	import uniSteps from '@/components/uni-steps/uni-steps.vue';  //步骤条插件
	import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	import map from '../../static/map/qqmap-wx-jssdk.min.js';  //腾讯地图
	export default {
		data() {
			return {
				logo: '',
				bill: {}, //订单数据 
				btn: '',  //按钮显示
				
				myad: '', //地址拼接
				
				isDis: false , //取消订单弹窗是否显示
				priceDis: true,  //价格模块是否显示
				stateGreen: true, //状态颜色绿色（已完成、等待支付）
				stateYellow: false, //状态颜色黄色（等待接单）
				stateRed: false, //状态颜色红色 （已取消）
				
				isBtn: true ,//是否隐藏底部按钮
				em: {},
				
				
				id: '',
				reason: '',
				isDis1: false,
				msg: '',
				
				step: [
					{title: '已下单'}, 
					{title: '待接单'}, 
					{title: '待上门'}, 
					{title: '待报价'},
					{title: '待支付'},
					{title: '已完成'},
				],  //步骤
				stepIndex: 0,  //步骤下标
				remark: {},  //订单评价
				
				latitude: 39.909,  //经纬度
				longitude: 116.39742,
				covers: [{  //标记显示的位置
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../static/images/location.png',
					width: '56rpx', 
					height: '67rpx'
				}],
				points: [],
				polyline: [],
				
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
		onLoad(options) {
			
				// this.bill = JSON.parse(options.item);
				// console.log(this.bill);
			
			this.$refs.son.a = '订单详情';  //修改navigatorBarText
			this.$refs.son.indexSer = false;  //头部隐藏客服
			this.$refs.son.conBack = true;  //显示返回
			
			this.logo = this.$store.state.logo;
			
			this.$loading(false);
			this.$loading(true);
			this.id = options.item;
			let _this = this;
			setTimeout(function(){
				
				
				// _this.bill = JSON.parse(decodeURIComponent(options.item));
				
				_this.getBill();
				
				_this.getGradeRule(); //获取积分规则
				_this.getGrade(); //获取积分规则
				
				// _this.getStep();
				// _this.getRemark();
					
				_this.$loading(false);
			},Math.random()*2000);
			
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
			getStep() { //获取步骤
				let state = this.bill.state;
				this.step.forEach((item,index)=>{
					switch(state) {
						case '等待接单': this.stepIndex = 1;break;
						case '等待上门服务': this.stepIndex = 2;break;
						case '等待报价': this.stepIndex = 3;break;
						case '等待支付': this.stepIndex = 4;break;
						case '已完成': this.stepIndex = 5;break;
					}
				})
			},
			phoneEm(phone) { //拨打电话
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
				});
			},
			getBill() {  //修改部分展示
				let _this = this;
				_this.$listapi.getBillD(_this.$store.state.sessionId,_this.id).then(res => {
					let billInit = res.data.collection;
					billInit.forEach(item => {
						this.$set(item, 'allAd', item.address + '-+-' + item.number); //存储完整地址信息
						item.orderdAt = item.orderdAt.replace(/T/g, " ") || item.orderdAt;
						if(item.address.replace(/-*-/)){
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
					_this.bill = billInit[0];
					
					
					//时间
					_this.bill.createdAt = _this.bill.createdAt.replace(/T/,' ');
					if(_this.bill.selectdAt!=''&&_this.bill.selectdAt!=null) {
						_this.bill.selectdAt = _this.bill.selectdAt.replace(/T/,' ');
					}
					if(_this.bill.enddAt!=''&&_this.bill.enddAt!=null) {
						_this.bill.enddAt = _this.bill.enddAt.replace(/T/,' ');
					}
					
					//电工
					if(_this.bill.electricianId == '' || _this.bill.electricianId == null)  {
						
					}
					else {
						
						_this.$listapi.emMsg(_this.$store.state.sessionId,_this.bill.electricianId).then(res=>{						
							_this.em = res.data.collection[0];
							
							uni.getLocation({
								type: 'gcj02',
								success: function(res1) {
									_this.latitude = res1.latitude;
									_this.longitude = res1.longitude;
								}
							})
							
							let qqmapsdk = new map({
								key: _this.$store.state.mapKey //腾讯地图生成的key
							});
							new Promise((resolve,reject) => {
								qqmapsdk.calculateDistance({
									mode: 'straight',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
															   						 
									to: [{  //终点坐标
										latitude: _this.em.gpsLatitude,
										longitude: _this.em.gpsLongitude
										
									}],
									success: function(res) {//成功后的回调
										resolve(res.result.elements[0].distance + '米');
									},
									fail: function(error) {
									  console.log(error);
									  resolve('暂无距离');
									},
									complete: function(res) {
									  // console.log(res);
									}
								});
							}).then(district => {
								_this.covers =[{
									latitude: _this.em.gpsLatitude,
									longitude: _this.em.gpsLongitude,
									iconPath: _this.em.wxPhoto,
									width: '60rpx',
									height: '60rpx',
									callout: {
										content: _this.em.name
									}
								},{
									latitude: _this.latitude,
									longitude: _this.longitude,
									iconPath: _this.$store.state.avatarUrl,
									width: '60rpx',
									height: '60rpx',
									callout: {
										content: _this.$store.state.userName
									},
									// label: {
									// 	content: district,
									// 	bgColor: '#31D8B6',
									// 	color: '#ffffff'
									// }
								}];
								
								_this.points = [
									{latitude: _this.em.gpsLatitude, longitude: _this.em.gpsLongitude},
									{latitude: _this.latitude, longitude: _this.longitude}
								];
								
								_this.polyline =[{
									points: [
										{latitude: _this.em.gpsLatitude, longitude: _this.em.gpsLongitude},
										{latitude: _this.latitude, longitude: _this.longitude}
									],
									dottedLine: true,
									color: '#31D8B6',
									width: 2
								}]
							})
							
						})
					}
					
					//费用
					// if(_this.)
					
					//地址
					let ad1 = _this.bill.allAd.split('-*-')[1].split('-+-')[0];
					let ad2 = _this.bill.allAd.split('-*-')[0];
					let ad3 = _this.bill.allAd.split('-+-')[1];
					_this.myad = ad1 + ' ' + ad2 + ' 门牌号：' + ad3;
					
					_this.getStep();
					_this.getRemark();
				})
			},
			upCon(num) {  //获取星级评价的描述
				switch(num) {
					case 1: return '很差';break;
					case 2: return '差';break;
					case 3: return '一般';break;
					case 4: return '好';break;
					case 5: return '非常好';break;
				}
			},
			getRemark() { //获取评价
				let _this = this;
				if(this.bill.isRemark) {
					this.$listapi.getRemark1(this.$store.state.sessionId,this.bill.id).then(res=>{
						_this.remark = res.data.collection[0];
						
						_this.$set(_this.remark,'de1',_this.upCon(_this.remark.allSatisfied));  //获得相应文字描述
						_this.$set(_this.remark,'de2',_this.upCon(_this.remark.attitude));
						_this.$set(_this.remark,'de3',_this.upCon(_this.remark.skill));
						
					})
				}
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
								if(this.bill.state != '等待支付上门费') {
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
									}
									else {
										_this.msg = res.data.message;
									}
								}
								else {
									uni.removeStorageSync('eleUserGrade');
								}
							},1000)
						});
					})
					uni.reLaunch({
						url: '/pages/bill/detail?item=' + this.id
					})
				}
				
			},
			cancelBill(state,id,em,time,price,door) { //点击相应按钮
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
			toEmDetail(item) { //电工详情
				let item1 = encodeURIComponent(JSON.stringify(item));	
				uni.navigateTo({
					url: '/pages/index/emdetail?item=' + item1
				})
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
						beforePage.onLoad({item:this.id});
					}
				}
			}
		},
		components: {
			Nav,
			uniSteps
		},
		mounted() {
			
		}
	}
</script>

<style>
	@import "/wxcomponents/vant/dist/common/index.wxss";
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#23d5b1,#23D4B0) !important;
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
	.bill-con>view {
		padding: 28rpx 25rpx 28rpx 15rpx;
		border-radius: 20rpx;
	}
	.bill-state .stateYellow {
		color: #ffd200;
	}
	.bill-state .stateGreen {
		color: #31d8b6;
	}
	.bill-state .stateRed {
		color: #fb6464;
	}
	.bill-user>view {
		border-bottom: 1rpx solid #F5F5F5;
		color: #999;
		font-size: 26rpx;
		padding: 18rpx 0;
	}
	.bill-user>view.te {
		padding: 0;
		align-items: center;
		height: 68rpx;
	}
	.bill-user-ti {
		padding: 0 0 30rpx 0 !important;
		color: black !important;
		font-size: 30rpx !important;
	}
	.bill-user-img image,.bill-user-img .img {
		width: 300rpx;
		height: 220rpx;
		border-radius: 20rpx;
		margin-top: 8rpx;
		background: #F0F0F0;
	}
	.emploTelImg image {
		margin: 0;
		width: 34rpx;
		height: 34rpx;
	}
	.emploTel {
		padding: 0 10rpx;
		border-right: 1rpx solid #ccc;
	}
	.emploPhoto image {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		margin: 0 10rpx;
	}
	.bill-user>view:last-child {
		padding-bottom: 0;
		border: none;
	}
	.bill-user-ad {
		max-width: 530rpx;
		/* text-align: right; */
	}
	.bill-user>view .priceCol {
		font-size: 30rpx;
		font-weight: bold;
		color: #fb6464;
	}
	.bill-user>view .black {
		color: black;
	}
	.bill-news image {
		width: 34rpx;
		height: 14rpx;
	}
	.blank {
		height: 130rpx;
	}
	.detail-btn {
		height: 92rpx;
		position: fixed;
		bottom: 0;
		width: 100%;
		z-index: 2;
	}
	.detail-btn button {
		margin-left: auto;
		margin-right: 30rpx;
		border-radius: 100rpx;
		width: 260rpx;
		height: 58rpx;
		line-height: 58rpx;
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
	
	.big-width {
		max-width: 340rpx;
		word-break: break-all;
	}
	
	.star-num {
		margin-top: 8rpx;
		margin-right: 14rpx;
	}
	.txt-indent {
		text-indent: 2em;
	}
	
	.abaaba {
		margin-left: 0rpx !important;
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
