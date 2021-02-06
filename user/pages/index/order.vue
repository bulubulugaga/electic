<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>

		<!-- 顶部 -->
		<view class="index-header">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
		</view>

		<!-- 内容 -->
		<view class="order-con w-con bg-white border-r-20">
			<view class="colorCon f30">订单详情选择</view>
			<view class="order-con-de">
				<view class="flex-cover flex-middle">
					<view class="f28">订单类型：</view>
					<view class="flex-middle" @click="toType">
						<view class="f26 c999">{{szType}}</view>
						<view class="more">
							<image src="../../static/images/more.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="flex-cover flex-middle">
					<view class="f28">预约服务时间：</view>
					<view class="flex-middle" @click="timeDis=true">
						<view class="f26 c999">{{time}}</view>
						<view class="more">
							<image src="../../static/images/more.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="flex-cover">
					<view class="f28">服务地址：</view>
					<view @click="toAddress()">
						<view class="flex-middle">
							<view class="order-con-ad f26">{{ad.address}}</view>
							<view class="more">
								<image src="../../static/images/more.png" mode=""></image>
							</view>
						</view>
						<view class="ad-per f24 c999">
							{{ad.name}} {{ad.phone}}
						</view>
						<!-- <view v-show="ad.address!=null&&ad.address!=''" class="ad-free f24 colorCon FB" v-if="true">
							该地区服务限时免费
						</view> -->
					</view>
				</view>
				<view class="flex-cover flex-middle">
					<view class="f28">接单电工：</view>
					<view class="flex-middle" @click="distriDis=true">
						<view class="f26 c999">{{distriArr[distriIndex]}}</view>
						<view class="more">
							<image src="../../static/images/more.png" mode=""></image>
						</view>
					</view>
				</view>
				<view class="em flex-middle flex-cover" v-if="emDis" @click="toEmDetail()">
					<view class="flex-middle">
						<view class="order-em-photo circle hide">
							<image :src="em.wxPhoto" mode=""></image>
						</view>
						<view class="white f26">{{em.name}}</view>
					</view>
					<view class="f26 white">
						接单量：{{em.completeCount}}单
					</view>
					<view class="star ml-auto flex-middle">
						<view class="flex-middle mt5">
							<uni-rate class="in-block" size='11' max="5" :value="em.average" active-color="#fecb01" margin="1" disabled></uni-rate>
						</view>
						<view class="f18 flex-middle">{{em.average}}</view>
					</view>
				</view>
				<view class="flex-cover">
					<view class="f28">上门费用：</view>
					<view class="">
						<!-- <view class="f30 red FB">￥0</view>						 -->
						<view class="f30 red FB">￥{{doorPrice}}</view>
						<view v-if="doorPrice != preDoorFee" class="f28 txt-cen c999 txt-line-through">￥{{preDoorFee}}</view>
					</view>
				</view>
				<view>
					<view class="f28">服务说明：</view>
					<view>
						<textarea maxlength="100" v-show="!agreDis" class="serIntro f24" v-model="serIntro" placeholder-class="c999 f24"
						 placeholder="请描述您的故障或问题(100字以内)"></textarea>
					</view>
				</view>
				<view>
					<view class="ababa f28">附图(非必传)：</view>
					<van-uploader :file-list="fileList" @after-read="afterRead" @item-click="btnClick" />
				</view>
			</view>
		</view>


		<!-- 底部 -->
		<view class="order-footer bg-white flex-middle">
			<view class="flex-middle">
				<checkbox :checked="isCheck" @click="isCheck = !isCheck" />
				<view class="f28 flex-middle">我已经认真阅读并同意<view class="f22 colorCon" @click.stop="agreDis = true">《订单协议》</view>
				</view>
			</view>
			<button class="white bg-con f28" @click="submit()">提交</button>
		</view>

		<!-- 维修类型选择 -->
		<view class="type-ch" v-show="typeDis" @click="typeDis=false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">选择订单类型</view>
						<view>
							<image src="../../static/images/type_ch.png" mode=""></image>
						</view>
					</view>
					<view class="type-items type-items-type">
						<view v-for="(item,index) in typeArr" :key="index">
							<view class="type-item f28 flex-center flex-middle" @click="typeArrDis(index)">
								<view>{{item.title}}</view>
								<!-- <view>{{item}}</view> -->
								<!-- <image src="../../static/images/type_ch.png" mode=""></image> -->
							</view>
							<!-- <view v-show="item.isDis" @click="typeChoose(index,i)" class="type-item-con f26 c999" v-for="(item2,i) in typeArr[index].con" :key="i">
								{{item2}}
							</view> -->
						</view>
					</view>
					<view class="type-ch-cancel" @click="typeDis=false">
						×
					</view>
				</view>
			</view>
		</view>

		<!-- 接单电工类型选择 -->
		<view class="type-ch" v-show="distriDis" @click="distriDis=false">
			<view class="type-ch-con" @click.stop>
				<view class="type-ch-content pr txt-cen w">
					<view class="type-ch-title flex-center flex-middle">
						<view class="f26">选择电工分配类型</view>
						<view>
							<image src="../../static/images/type_ch.png" mode=""></image>
						</view>
					</view>
					<view class="type-items">
						<view class="type-item f28" v-for="(item,index) in distriArr" :key="index" @click="distriChange(index)">
							{{item}}
						</view>
					</view>
					<view class="type-ch-cancel" @click="distriDis=false">
						×
					</view>
				</view>
			</view>
		</view>

		<!-- 预约时间选择 -->
		<view v-show="timeDis" class="time-ch" @click="timeDis=false">
			<view class="time-ch-con" @click.stop>
				<view class="time-ch-content pr w">
					<view class="time-ch-title flex-center txt-cen flex-middle">
						<view class="f28">选择预约时间</view>
					</view>
					<view class="time-items flex-cover f26">
						<view class="time-ch-l txt-cen">
							<view>
								<view @click="chDate(index)" :class="{bgWhite:item.active}" v-for="(item,index) in date" :key="index">{{item.con}}</view>
							</view>
						</view>
						<view class="time-ch-m">
							<view>
								<view @click="chHour(index)" :class="{bgWhite:item.ac}" v-for="(item,index) in datetime" :key="index">{{item.title}}</view>
							</view>
						</view>
						<view class="time-ch-r">
							<view>
								<view @click="chTime(index)" v-for="(item,index) in datetime2" :key="index">{{item}}</view>
							</view>
						</view>

					</view>
					<view class="type-ch-cancel" @click="timeDis=false">
						×
					</view>
				</view>
			</view>
		</view>

		<!-- 未勾选订单协议弹窗 -->
		<view class="submit-su txt-cen" v-if="isDis" @click="isDis = false">
			<view class="submit-su-con bg-white border-r-20" @click.stop>
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{msg}}</view>
				<button @click="isDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>

		<!-- 订单协议 -->
		<view class="submit-su txt-cen" v-if="agreDis" @click="agreDis = false">
			<view class="submit-su-con submit-su-con1 bg-white border-r-20" @click.stop>
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">请您认真阅读《订单协议》</view>
				<view class="f26 txt-left">
					<rich-text :nodes="agree"></rich-text>
				</view>
				<button @click="agreDis = false" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<van-popup :show="payShow" closeable position="bottom"
		  custom-style="height: 36%" @close="payShow=false" round=true>
			<view class="pay-choose">
				<view class="c999 f26">* 积分抵扣规则：{{gradeR}}积分可抵扣一元<br>* 您当前有{{gradeSum}}积分</view>
				<view class="flex-cover f30 mt20"><text>请输入需要使用的积分: </text><input type="number" :class="{red: tipa}" v-model="grade" placeholder="0" /></view>
				<view class="mt20 red flex-middle">
					<view v-show="tipa" class="f26">您输入的积分不可用</view>
					<view class="f36 ml-auto">￥{{doorFact}}</view>
				</view>
				<view class="submit mt40" @click="asd(2)">账户余额支付</view>
				<view class="submit" @click="asd(1)">微信支付</view>
			</view>
		</van-popup>

		<loading></loading>
		<popup></popup>


	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import uniRate from '@/components/uni-rate/uni-rate.vue'; //评分组件
	import map from '../../static/map/qqmap-wx-jssdk.min.js'; //腾讯地图
	import * as getAdderId from '@/common/getAdId.js'

	export default {
		data() {
			return {
				logo: this.$store.state.logo,
				ava: '',
				name: '',
				agreDis: false,
				agree: '', //订单协议
				msg: '', //提示信息

				doorPrice: '0', //上门费用
				preDoorFee: '0',
				
				serIntro: '', //服务说明
				isVip: false, //用户是否为vip

				distriDis: false, //接单电工分配显示
				distriArr: ['系统分配', '由我指定'], //接单电工分配选择
				distriIndex: 0, //接单电工分配选择第几个
				emDis: false, //由我指定下电工的展示

				ad: { //地址
					id: 0,
					address: '',
					name: '',
					phone: '',
					// isFree: false //该地区是否免费
				},

				em: { //由我指定电工信息

				},

				typeDis: false, //订单类型选择显示
				typeArr: [ //订单类型

				],
				typeIndex: 0, //选中的订单类型下标
				typeIndex2: 0, //选中的订单二级分类下标

				timeDis: false, //预约时间是否显示
				date: [{
					con: '今天',
					active: true
				}], //左侧七天时间显示
				date2: [], //对应日期
				dateIndex: 0, //选择的日期索引
				//右侧时间
				datetime: ['00: 00', '01: 00', '02: 00', '03: 00', '04: 00', '05: 00',
					'06: 00', '07: 00', '08: 00', '09: 00', '10: 00', '11: 00',
					'12: 00', '13: 00', '14: 00', '15: 00', '16: 00', '17: 00',
					'18: 00', '19: 00', '20: 00', '21: 00', '22: 00', '23: 00'
				],
				datetimeIndex: 0, //选择的时间索引
				//右侧时间详细
				datetime2: [],
				datetime2Index: 0, //详细日期索引
				time: '立即预约', //显示的预约时间

				orderImg: '', //附图
				orderImgId: '', //附图id

				isCheck: true, //是否选择同意协议
				isDis: false, //未勾选协议弹窗
				img: '../../static/images/index_fun02.png', //用户头像

				radio: 0, //地址页面选中的地址下标,
				emRadio: 0, //电工列表页面选中的地址下标,
				jin: false,

				fileList: [],
				fileList2: [],
				
				payShow: false,  //显示支付方式
				
				gradeR: 0,   //积分抵扣规则
				grade: 0  ,//积分数量
				gradeSum: 0,
				tipa: false,
				szType: '',
				cfIndex: 0,
				csIndex: 0,
				
				payment: 0,
				res: {}
			}
		},
		onLoad(options) {
			this.$refs.son.a = '电工联盟'; //修改navigatorBarText
			this.$refs.son.indexSer = false; //头部隐藏客服
			this.$refs.son.conBack = true; //显示返回

			if (options.em) {
				this.getEm(options.em);
				this.emRadio = options.emRadio;
			}
			
			if (options.aa) {
				if (options.aa == 0) {
					this.szType = '';
				}
				else {
					this.szType = options.aa;
				}
			}
			
			if (options.cfIndex) {
				this.cfIndex = options.cfIndex;
			}
			
			this.agree = '您需要先登录，才能查看订单。'

			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res => {
				if (options.aa == 0) {
					_this.getBillState();
				}
				
				_this.getAddress();

				_this.getDate(); //获取时间
				_this.chHour(0);
				_this.getAgree(); //获取协议
				
				_this.getGradeRule(); //获取积分规则
				_this.getGrade(); //获取积分规则


				setTimeout(function() {
					_this.$loading(false);
				}, 1000);

				this.ava = this.$store.state.avatarUrl;
				this.name = this.$store.state.userName;
			})
			this.$over();


		},
		computed: {
			doorFact() {
				if(this.grade > this.gradeSum) {
					this.tipa = true;
					return this.doorPrice;
				}
				else {
					if(this.doorPrice - this.grade / this.gradeR < 0) {
						this.tipa = true;
						return this.doorPrice;
					}
					else {
						this.tipa = false;
						return Number(this.doorPrice - this.grade / this.gradeR).toFixed(2);
					}
					
				}
			}
		},
		methods: {
			toType() {
				uni.navigateTo({
					url: '/pages/index/category?type=' + this.szType + '&cfIndex=' + this.cfIndex
				})
			},
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
			btnClick(e) {
				let index = e.detail.currentTarget.dataset.index;
				this.fileList.splice(index, 1);
				this.fileList2.splice(index, 1);
			},
			afterRead(event) {
				let _this = this;
				const {
					file
				} = event.detail;
				// 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
				uni.uploadFile({
					url: _this.$store.state.url + 'common/' + _this.$store.state.sessionId + '/uploadFile.json', // 仅为示例，非真实的接口地址
					filePath: file.path,
					name: 'file',
					formData: {
						remark: '附图'
					},
					success(res) {
						// 上传完成需要更新 fileList
						// const { fileList = [] } = this.data;
						// _this.fileList.push({ ...file });
						_this.fileList.push({ ...file
						});
						_this.fileList2.push({ ...file,
							id: JSON.parse(res.data).collection[0],
							sortIndex: 1000
						});
						// this.setData({ fileList });
					},
				});

			},
			bigImg() { //预览
				let _this = this;
				uni.previewImage({
					urls: _this.orderImg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			getJin() { //检测是否有进行中订单
				let _this = this;
				return new Promise((resolve, reject) => {
					_this.$listapi.getBill(_this.$store.state.sessionId).then(res => {
						try { //用抛出异常的方式结束循环
							res.data.collection.forEach(item => {
								if (item.state == -1 || item.state == 0 || item.state == 1 || item.state == 2 || item.state == 3) {
									_this.jin = true;
									throw new Error("EndIterative");
								}
							})
						} catch (e) {
							if (e.message != "EndIterative") throw e;
						};
						resolve();
					})
				})
			},
			getDoor() { //获取上门费
				getAdderId.getLocation(this, this.ad.gpsLongitude, this.ad.gpsLatitude).then(res => {
					this.$listapi.getDoor(this.$store.state.sessionId, res).then(res1 => {
						this.doorPrice = res1.data.collection[0].doorFee;
						this.preDoorFee = res1.data.collection[0].preDoorFee;
					})
				});
			},
			getAgree() { //获取协议
				let _this = this;
				this.$listapi.getAgreement(this.$store.state.sessionId).then(res => {
					let l = res.data.collection.length;
					this.agree = res.data.collection[l - 1].content;
					// this.agree = res.data.collection[1].content;

				})


			},
			getEm(id) {
				let _this = this;
				this.$listapi.emMsg(this.$store.state.sessionId, id).then(res => {
					_this.em = res.data.collection[0];
					console.log(_this.em);
				})
				this.emDis = true;
				this.distriIndex = 1;
			},
			getBillState() { //获取订单类型
				this.$listapi.getBillState(this.$store.state.sessionId).then(res => {
					let arr = res.data.collection;
					let i = 0;
					arr.forEach((item, index) => {
						if (item.parentId == null || item.parentId == '') {
							this.typeArr.push({
								title: item.typeName,
								con: [],
								isDis: false
							});
							arr.forEach(item1 => {
								if (item.id == item1.parentId) {
									this.typeArr[i].con.push(item1.typeName);
								}
							})
							i++;
						}
					})
					this.getType(this.typeArr);
				})
			},
			getType(typeArr) {
				for(let item of typeArr) {
					for(let item1 of item.con) {
						if(item1) {
							this.szType = item1;
							return 0;
						};
					}
				}
			},
			getAddress() { //默认地址
				this.$listapi.getAdderss(this.$store.state.sessionId).then(res => {
					if (res.data.collection.length != 0) {
						this.ad = res.data.collection[0];
					}

					// this.ad.isFree = false;

					if (this.ad.id != 0) {
						this.ad.phone = this.ad.phone.substr(0, 3) + '****' + this.ad.phone.substr(7);
						this.ad.address = this.ad.address.split('-*-')[1];
					} else {

					}

					this.getDoor();
				})
			},
			toAddress() { //选择地址
				uni.navigateTo({
					url: '/pages/user/adress?key=order&radio=' + this.radio
				})
			},
			uploadPic() { //调取相机接口上传图片
				let that = this;
				this.$listapi.upImg2('现场图片', this.$store.state.sessionId, 6).then(res => {
					this.$loading(true);
					that.orderImg = res.img;
					that.orderImgId = res.imgId;
					console.log(res.img);
					if (res.img) {
						// this.$loading(false);
					}
				})
			},
			submit() { //提交订单
				console.log(this.isCheck);
				this.getJin().then(() => {
					if (this.jin) {
						this.isDis = true;
						this.msg = '您还有进行中的订单没有处理。'
					} else if (this.ad.id == 0) {
						this.isDis = true;
						this.msg = '您还没有选择地址。'
					} else {
						if (this.$store.state.login) {
							
							if(this.tipa) {
								return 0;
							}
							
							if (this.isCheck) { //勾选同意协议
								let time;
								if (this.time == '立即预约') {
									//立即预约应该传什么时间戳
									var today = new Date();
									var tYear = today.getFullYear();
									var tMonth = today.getMonth();
									var tDate = today.getDate();
					
									var h = this.doHandleMonth(today.getHours());
									var m = this.doHandleMonth(today.getMinutes());
									// var s = this.doHandleMonth(today.getSeconds()); 
					
									tMonth = tMonth + 1; //月份不补零
									tDate = this.doHandleMonth(tDate);
					
									time = tYear + "-" + tMonth + "-" + tDate + " " + h + ":" + m + ":00";
								} else {
					
									time = this.date2[this.dateIndex] + ' ' + this.datetime2[this.datetime2Index];
									time = time.replace(/年|月/g, "-").replace(/日/g, '').replace(/: /g, ':') + ":00";
					
								}
					
								let serIntro = '';
								if (this.serIntro == '' || this.serIntro == null) { //未填写服务说明
									serIntro = this.szType;
								} else {
									serIntro = this.serIntro;
								}
								
								
								//附图
								let createImage = [];
								
								let data = { //参数
									addressId: this.ad.id,
									createImage: this.fileList2,
									// doorFee: 1,
									doorFee: this.doorPrice,
									preDoorFee: this.preDoorFee,
									faultDesc: serIntro,
									orderdAt: time,
									szType: this.szType,
									wantElectricianId: this.em.id
								}
					
								let qqmapsdk = new map({
									key: this.$store.state.mapKey //腾讯地图生成的key
								});
								let myAd = '';
								let _this = this;
								qqmapsdk.reverseGeocoder({ //腾讯题图逆解析地址
									location: {
										latitude: this.ad.gpsLatitude,
										longitude: this.ad.gpsLongitude
									},
									success(res) {
										let endAd = res.result.address_component
										myAd = endAd.province + endAd.city + endAd.district;
					
										// if (myAd != '四川省凉山彝族自治州德昌县') {
										// 	_this.isDis = true;
										// 	_this.msg = '该地区暂未开通服务。'
										// } else {
											uni.requestSubscribeMessage({
												tmplIds: ['0IBq_ltR27H06STbnqAO8JR6HPmmiKAnbYI4PveqCEg', 'HPwCPdOcTMJCT_MysX3lv3uDycLOjSFJm8RuSKHXWmQ',
													'QS7f1QMGwVvUeok8fmtFGZmlXu4p7xeKU8VQOCC5lFM'
												],
												success(res) {
													// console.log(res);
													if (res['0IBq_ltR27H06STbnqAO8JR6HPmmiKAnbYI4PveqCEg'] == "reject" || res[
															'HPwCPdOcTMJCT_MysX3lv3uDycLOjSFJm8RuSKHXWmQ'] == "reject" || res[
															'QS7f1QMGwVvUeok8fmtFGZmlXu4p7xeKU8VQOCC5lFM'] == "reject") {
														uni.showToast({
															icon: 'none',
															duration: 3000,
															title: '为了让您及时接收到消息，请您同意发送消息'
														})
													} else {
														uni.showModal({
															title: '提示',
															content: '是否确认发布订单？',
															success: function(res) {
																if (res.confirm) {
																	new Promise((resolve, reject) => {
																		_this.$listapi.order(_this.$store.state.sessionId, data).then(res => {
					
																			if (res.data.success == false) {
																				if (res.data.message == '消息发送失败') {
																					uni.reLaunch({
																						url: '/pages/bill/bill'
																					})
																				} else {
																					_this.msg = res.data.message;
																					_this.isDis = true;
																				}
					
																			} else {
																				resolve(res);
																				
																			}
					
					
																		})
																	}).then(res => {
																		if(data.doorFee != 0) {
																			_this.payShow = true;
																			
																			
																			_this.res = res;
																			
																		}
																		else {
																			uni.reLaunch({
																				url: '/pages/bill/bill'
																			})
																		}
																		
																		
																	})
					
																} else if (res.cancel) {
																	// console.log('用户点击取消');
																}
															}
														});
					
													}
					
												},
												fail(err) {
													console.log(err);
												}
											})
					
										// }
					
									},
									fail(err) {
										console.log(err);
									}
								})
					
							} else {
								this.isDis = true;
								this.msg = "请您认真阅读并同意《订单协议》。"
							}
						} else {
							this.$anoLogin(true);
						}
					}
				})
				// console.log(this.fileList2);
				
			},
			asd(payment) {
				let _this = this;
				new Promise((resolve, reject) =>{
					if(_this.grade == 0 || _this.grade == '') {
						let eleUserGrade = {
							id: _this.res.data.collection[0].orderId,
							isGrade: true,
							grade: 0,
							fact: _this.doorFact
						}
						uni.setStorageSync('eleUserGrade', eleUserGrade);
						resolve();
					}
					else {
						let gradeKdata = {
							feeType: 0,
							id: _this.res.data.collection[0].orderId,
							ship: _this.grade || 0
						}
						_this.$listapi.getGradek(_this.$store.state.sessionId, gradeKdata).then(res =>{
							if(res.data.collection) {  //积分抵扣存入本地
								let eleUserGrade = {  
									id: _this.res.data.collection[0].orderId,
									isGrade: true,
									grade: gradeKdata.ship,
									fact: _this.doorFact
								}
								uni.setStorageSync('eleUserGrade', eleUserGrade);
								resolve();
							}
						})
					}
				}).then(() => {
					let data1 = {
						orderId: _this.res.data.collection[0].orderId,
						payment
					};
					_this.$listapi.unOrder(_this.$store.state.sessionId,data1).then(res => {
						// uni.reLaunch({
						// 	url: '/pages/bill/bill'
						// })
						
						if(payment != 1) {
							_this.isDis = true;
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
						
					});
				})
			},
			distriChange(index) { //接单电工分配选择
				// this.distriIndex = index;
				if (index == 1) {
					uni.navigateTo({
						url: './emlist?emRadio=' + this.emRadio + '&prev=' + 'order'
					});
					// this.emDis = true;
				} else {
					this.distriIndex = 0;
					this.em.id = '';
					this.emDis = false;
				}
				this.distriDis = false;
			},
			typeChoose(index, i) { //选择订单类型
				console.log(index);
				this.typeIndex = index;
				this.typeIndex2 = i;
				this.typeDis = false;
			},
			typeArrDis(index) { //显示或关闭订单类型二级分类
				// this.typeArr[index].isDis = !this.typeArr[index].isDis;
				this.typeIndex = index;
				this.typeDis = false;
			},
			getDay(day) { //计算日期函数
				var today = new Date();
				var targetday_milliseconds = today.getTime() + 1000 * 60 * 60 * 24 * day;
				today.setTime(targetday_milliseconds); //注意，这行是关键代码                
				var tYear = today.getFullYear();
				var tMonth = today.getMonth();
				var tDate = today.getDate();
				tMonth = this.doHandleMonth(tMonth + 1);  
				// tMonth = tMonth + 1; //月份不补零
				tDate = this.doHandleMonth(tDate);
				return tYear + "年" + tMonth + "月" + tDate + "日";
			},
			doHandleMonth(month) { //日期一位补0
				var m = month;
				if (month.toString().length == 1) {
					m = "0" + month;
				}
				return m;
			},
			getDate() { //获取接下来的一周时间
				// var bbb7 = [];
				var bbb7 = [{
					con: '',
					active: false
				}, {}, {}, {}, {}, {}, {}];
				let bb7 = [];
				// 获取最近7天日期
				bb7.push(this.getDay(0)); //当天日期
				bb7.push(this.getDay(1));
				bb7.push(this.getDay(2));
				bb7.push(this.getDay(3));
				bb7.push(this.getDay(4));
				bb7.push(this.getDay(5));
				bb7.push(this.getDay(6));

				this.date2 = bb7;

				bbb7.forEach((item, index) => {
					item.con = this.getDay(index).split('年')[1];
					item.active = false;
				})
				this.date = bbb7;
				this.date[0].con = '今天';
				this.date[1].con = '明天';
				this.date[this.dateIndex].active = true;

				this.getDatetime();
			},
			getDatetime() { //获取时间
				if (this.date[this.dateIndex].con == '今天') {
					this.datetime = [];
					let oDate = new Date();
					let hour = oDate.getHours() + 1;

					// this.datetime.push({title: '立即预约',ac: true});
					for (hour; hour <= 23; hour++) {
						this.datetime.push({
							title: this.doHandleMonth(hour) + ': 00',
							ac: false
						});
					}
					this.datetime2 = [];
				} else {
					this.datetime = [];
					for (let i = 0; i < 24; i++) {
						if (i < 10) {
							i = '0' + i;
						}
						this.datetime.push({
							title: i + ': 00',
							ac: false
						});
					}

				}

				this.datetime[0].ac = true;
				this.time = this.date[0].con + ' ' + this.datetime[0].title;
			},
			chDate(index) { //选择日期
				this.date.forEach((item, index) => {
					item.active = false;
				})
				this.date[index].active = true;
				this.dateIndex = index;

				this.getDatetime();
			},
			chHour(index) { //选择小时时间
				// this.datetimeIndex = index;
				if (this.datetime[index].title == '立即预约') {
					// console.log('立即预约');
					this.time = '立即预约';
					this.datetime2 = [];
					this.timeDis = false;
				} else {
					this.datetime2 = [];
					let hour = this.datetime[index].title.substring(0, 2); //截取hour
					for (let i = 0; i < 6; i++) {
						let time = hour + ': ' + i + '0';
						this.datetime2.push(time);
					}
				}

				//修改选择后的背景颜色
				this.datetime.forEach(item => {
					item.ac = false;
				})
				this.datetime[index].ac = true;
			},
			chTime(index) { //选择时辰
				// this.datetimeIndex = index;
				// console.log('选择的时间：' + this.date[this.dateIndex].con 
				// 	+ ' ' + this.datetime2[index]);
				this.datetime2Index = index;
				this.time = this.date[this.dateIndex].con + ' ' + this.datetime2[index];
				this.timeDis = false;

				// console.log(this.time);
			},
			toEmDetail() { //电工详细信息
				let item1 = encodeURIComponent(JSON.stringify(this.em));
				uni.navigateTo({
					url: '/pages/index/emdetail?item=' + item1
				})
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

	.wh {
		width: 100%;
		height: 100%;
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
	.order-con {
		position: relative;
		z-index: 1;
		top: 10rpx;
		box-sizing: border-box;
		padding: 15rpx 10rpx;
		margin-bottom: 100rpx;
	}

	.order-con-de {
		margin-top: 20rpx;
	}

	.order-con-de>view {
		background: #F1F1F1;
		box-sizing: border-box;
		padding: 18rpx 20rpx;
		border-radius: 20rpx;
		margin-top: 15.5rpx;
	}

	.order-con-de>view.em {
		height: 92rpx;
		width: 92%;
		background: #2DD3B1;
		padding: 0;
		border-radius: 40rpx;
		margin: 12rpx auto 17rpx;
	}

	.order-con-de>view.em>view:first-child {
		margin-right: 54rpx;
	}

	.order-em-photo {
		width: 65rpx;
		height: 65rpx;
		background: white;
		margin: 0 10rpx 0 16rpx;
	}

	.order-em-photo image {
		width: 100%;
		height: 100%;
	}

	.star .f18 {
		font-size: 18rpx;
		color: #fecb01;
		margin-left: 10rpx;
		font-weight: bold;
		margin-right: 40rpx;
	}

	.mt5 {
		margin-top: 5rpx;
	}

	.order-con-de .more image {
		width: 12rpx;
		height: 20rpx;
		margin-left: 10rpx;
	}

	.ad-per,
	.ad-free {
		text-align: right;
		margin-right: 22rpx;
		margin-top: 15rpx;
	}

	.order-con-ad {
		max-width: 450rpx;
		/* text-align: right; */
	}

	.serIntro {
		width: 100%;
		height: 130rpx;
		margin-top: 12rpx;
	}

	.cam {
		width: 300rpx;
		height: 220rpx;
		text-align: center;
		background: white;
		margin-top: 24rpx;
		border-radius: 20rpx;
	}

	.cam image {
		width: 42rpx;
		height: 42rpx;
	}

	/* 底部 */
	.order-footer {
		width: 100%;
		height: 80rpx;
		position: fixed;
		bottom: 0;
		z-index: 3;
	}

	.order-footer checkbox {
		transform: scale(0.7);
		margin-left: 37rpx;
	}

	.order-footer button {
		width: 168rpx;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 100rpx;
	}

	/* 订单类型和时间选择 */
	.type-ch,
	.time-ch {
		position: fixed;
		top: 0;
		background: rgba(0, 0, 0, .5);
		width: 100%;
		height: 100%;
		z-index: 10;
	}

	.type-ch-con,
	.time-ch-con {
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

	.time-ch-con {
		height: 500rpx;
	}

	.type-ch-title image,
	.type-item image {
		width: 18rpx;
		height: 13rpx;
		margin-left: 8rpx;
		vertical-align: middle;
		margin-top: -5rpx;
	}

	.type-items {
		width: 80%;
		height: 300rpx;
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

	.type-items-type view:last-child .type-item {
		border-bottom: none;
	}

	.type-item-con {
		line-height: 60rpx;
	}

	/* .type-item-con:last-child {
		border-bottom: 1rpx solid #E5E5E5;
	} */
	.type-ch-cancel {
		position: absolute;
		top: 20rpx;
		right: 30rpx;
		color: #ccc;
		font-size: 65rpx;
		line-height: 0;
	}

	.time-ch-l>view,
	.time-ch-m>view,
	.time-ch-r>view {
		height: 410rpx;
		overflow-y: scroll;

	}

	.time-ch-l {
		width: 246rpx;
		height: 430rpx;
		background: #E5E5E5;
		margin-top: 20rpx;
		line-height: 66rpx;
		box-sizing: border-box;
	}

	.time-ch-m {
		box-sizing: border-box;
		width: 234rpx;
		height: 430rpx;
		margin-top: 20rpx;
		line-height: 66rpx;
		text-align: center;
		/* border-right: 1rpx solid #F0F0F0; */
		background: #F0F0F0;
		margin-left: -20rpx;
	}

	.time-ch-r {
		box-sizing: border-box;
		width: 250rpx;
		height: 430rpx;
		margin-top: 20rpx;
		line-height: 66rpx;
		padding-left: 20rpx;
	}

	.bgWhite {
		background: white;
	}

	/* 未勾选订单协议弹窗 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 999;
	}

	.submit-su-con {
		width: 54.67%;
		height: auto;
		margin: 0 auto;
		margin-top: 486rpx;
		padding: 0 20rpx 20rpx;
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
		border-radius: 52rpx;
		margin-top: 50rpx;
	}

	.submit-su-con1 {
		width: 80%;
		height: 893rpx;
		margin-top: 274rpx;
	}

	.submit-su-con1 .f28 {
		margin: 10rpx 0;
	}

	.submit-su-con1 .f26 {
		height: 676rpx;
		overflow: scroll;
		text-align: left;
		line-height: 40rpx;
	}

	/* .submit-su-con1 button {
		width: 100%;
	} */

	.ababa {
		margin-bottom: 20rpx;
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
