<template>
	<view class="content"  @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
		<!-- 导航 -->
		<Nav ref="son"></Nav>

		<!-- 顶部 -->
		<view class="index-header">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
		</view>

		<!-- 内容 -->
		<view class="bill-con w-con">
			<view class="bill-con-search">
				<input type="text" placeholder="点击输入关键词" v-model="key" placeholder-style="font-size:24rpx;color:#ccc;" @confirm="search()" />
			</view>

			<view class="bill-con-ti white flex-cover flex-middle f26">
				<view @click="distriCh()"><text>{{distri}}</text>
					<image class="ml10" src="../../static/images/bill_b.png" mode=""></image>
				</view>
				<view @click="typeDis=true">{{array[index]}}
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
					预约时间：{{item.orderdAt}}
				</view>
				<view class="adress c999 f26 flex">
					<view class="ad-max">预约地址：</view><view class="ad-max-2">{{item.address || '无'}}</view>
				</view>
				<view class="btn flex-cover">
					<view :class="{mlAuto: !item.quDis}">
						<text v-show="item.priceDis" class="c999 f22" :class="{priceCol:item.priceCol,pricePhoto:item.pricePhoto}"
						 @click.stop="upPhoto(item.state,item.id)">{{item.price}}</text>
						<text v-show="item.adDis" class="c999 f24">距离用户：<text class="colorCon">7.3km</text></text>
					</view>
					<view class="flex">
						<button v-if="item.suDis" class="white bg-con" @click.stop="cancelBill(item.state,item.id)">{{item.btn}}</button>
						<button v-if="item.quDis" class="white bg-con ml15" @click.stop="quBill(item.id)">取消订单</button>
					</view>
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

		<!-- 费用报价弹窗 isDis-->
		<view class="submit-su txt-cen" v-if="isDis" @click="isDis=false">
			<view v-if="isInputDis" class="submit-su-con bg-white border-r-20" @click.stop>
			<!-- <view v-if="true" class="submit-su-con bg-white border-r-20" @click.stop> -->
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">{{priceTitle}}</view>
				<!-- <view class="f28">输入</view> -->
				<view class="f28">
					<input v-model="fee" type="digit" :placeholder="placeholder" placeholder-style="font-size:28rpx;color: #ccc;" />
				</view>
				<button style="margin-top: 33rpx;" @click.stop="submitPrice()" class="white bg-con f28">确认</button>
			</view>
			<view v-if="isSureDis" class="submit-su-con bg-white border-r-20" @click.stop>
			<!-- <view v-if="true" class="submit-su-con bg-white border-r-20" @click.stop> -->
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24 ccc mt24">
					{{priceTip}}
				</view>
				<button @click.stop="sureCancel()" class="white bg-con f28">确认</button>
			</view>
		</view>

		<!-- 服务码弹窗 -->
		<!-- <view class="submit-su submit-su-code txt-cen" v-if="true" @click="isCodeDis = false"> -->
		<view class="submit-su submit-su-code txt-cen" v-if="isCodeDis" @click="isCodeDis = false">
			<view v-if="isCodeInputDis" class="submit-su-con bg-white border-r-20" @click.stop>
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">{{CodeTitle}}</view>
				<view class="f28">
					<input style="margin-top: 10rpx;" v-model="code" type="text" :placeholder="CodePlaceholder" placeholder-style="font-size: 28rpx;color: #ccc;" />
				</view>
				<button @click.stop="submitCode(id)" class="white bg-con f28">确认</button>
			</view>
			<view v-if="isCodeSureDis" class="submit-su-con bg-white border-r-20 pr" @click.stop>
			<!-- <view v-if="true" class="submit-su-con bg-white border-r-20 pr" @click.stop> -->
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24 ccc">
					{{CodeTip}}
				</view>
				<button @click.stop="sureCancelCode()" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<!-- 取消订单弹窗 -->
		<view class="submit-su submit-su-re txt-cen" v-if="isQuDis" @click="isQuDis = false">
			<view class="submit-su-con bg-white border-r-20" @click.stop>
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">请输入取消订单的理由</view>
				<view class="f24">
					<textarea class="reason" v-model="reason"></textarea>
				</view>
				<button @click.stop="CancelOrder(id)" class="white bg-con f28">确认</button>
			</view>
		</view>
		
		<loading></loading>
		<popup></popup>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	export default {
		data() {
			return {
				logo: this.$store.state.logo,
				ava: '',
				name: '',

				key: '', //搜索的关键字

				distri: '预约时间由近到远', //距离排序

				array: ['进行中的订单', '已完成订单', '已取消订单', '全部订单'], //订单类别选项
				index: 3, //选择了第几个订单类别
				typeDis: false, //订单类型选择显示

				bill: [], //订单数据 
				billBei: [], //订单备份

				isDis: false, //费用报价弹窗是否显示
				isInputDis: false, //费用报价输入窗口
				isSureDis: false, //费用报价提交成功窗口
				priceTitle: '', //弹窗标题
				fee: '',
				placeholder: '', //输入框的这个
				priceTip: '', //提交成功后的提示信息

				isCodeDis: false, //服务码弹窗是否显示
				isCodeInputDis: false, //服务码输入窗口
				isCodeSureDis: false, //服务码提交后窗口
				CodeTitle: '', //弹窗标题
				code: '',
				CodePlaceholder: '', //输入框的这个
				CodeTip: '', //提交后的提示信息

				id: '',
				isQuDis: false,
				reason: '',
				
				orderImgId: '',
				
				page: 1,
				perpage: 8,
				tip: '没有更多了~',
				
				
				
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
				endX: 0,
			}
		},
		onLoad() {

			this.$refs.son.a = '我的订单'; //修改navigatorBarText
			this.$refs.son.indexSer = false; //头部显示客服
			this.$refs.son.conBack = false; //隐藏返回
			this.$loading(false);
			if(this.$store.state.info.imageList.length == 0) {
				
			}
			else if(this.$store.state.info.info) {
				if(this.$store.state.info.info.stateName == '已审核') {
					let app = getApp();
					let _this = this;
					this.$loading(true);
					app.login(this).then(res => {
						_this.getBill(); //获取订单
						
						// this.ava = this.$store.state.avatarUrl;
						// this.name = this.$store.state.userName;
					
						setTimeout(function() {
							_this.$loading(false);
						}, Math.random() * 2000);
					})
				}
			}
			
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
		methods: {
			cancelBill(state, id) { //取消订单显示弹窗

				this.id = id;
				if (state == '费用报价' || state == '等待支付') {
					this.isDis = true; //显示费用报价弹窗
					this.isInputDis = true; //显示输入弹窗
					this.isSureDis = false; //隐藏确认弹窗
					if (state == '费用报价') {
						this.priceTitle = '费用报价';
						this.placeholder = '点击输入本次服务费用';
					} else if (state == '等待支付') {
						// this.priceTitle = '修改费用';
						// this.placeholder = '点击修改本次服务费用';
					}
				}
				if (state == '等待验证服务码') {
					this.isCodeDis = true; //服务码弹窗
					this.isCodeInputDis = true; //显示输入弹窗
					this.isCodeSureDis = false; //隐藏确认弹窗
					this.CodeTitle = '输入服务码';
					this.CodePlaceholder = '点击输入本次服务码';

				}
				if (state == '已完成') {
					// uni.navigateTo({  //跳转到评价页面
					//     url: './remark'
					// });
				}
				if (state == '支付完成') {
					// 同步方式获取数据， 阻塞形式，如果做完了的话代码才会向下进行
					try{
						let data = {
							completeImage: uni.getStorageSync('emElcImg') || ''
						}
						this.$listapi.sureBill(this.$store.state.sessionId, id,data).then(res => {
							console.log(res);
							uni.reLaunch({
								url: '/pages/bill/bill'
							})
						})
						
					}catch(e){
						//TODO handle the exception
					};
					
				}

			},
			typeChoose(index) { //选择类型
				this.page = 1;
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
				
				if(this.bill.length / this.perpage <= 1) {
					this.tip = '没有更多了~';
				}
			},
			getBill() { //获取订单信息
				// this.bill = bill; 
				let _this = this;
				let adder = [];
				let bill = [];

				this.$listapi.getBill(this.$store.state.sessionId).then(res => {

					bill = res.data.collection;

					bill.forEach(item => {
						
						this.$set(item, 'allAd', item.address + '-+-' + item.number); //存储完整地址信息
						this.$set(item, 'adLa', item.gpsLatitude); //存储地址信息
						this.$set(item, 'adLo', item.gpsLongitude); //存储地址信息
						item.orderdAt = item.orderdAt.replace(/T/g, " ");
						item.address = item.address.split('-*-')[1];
						this.$set(item, 'isRemark', false);  //是否评价
						switch (item.state) {
							case -1:
							case 0:
								{
									item.state = '等待接单';
									this.$set(item, 'priceDis', false);
									this.$set(item, 'btn', '取消订单');
									this.$set(item, 'isBtn', true);
									this.$set(item, 'stateGreen', false); //状态颜色绿色
									this.$set(item, 'stateYellow', true);
									this.$set(item, 'stateRed', false);
									break;
								}
							case 1:
								{
									item.state = '等待验证服务码';
									this.$set(item, 'priceDis', false);
									this.$set(item, 'btn', '输入服务码');
									this.$set(item, 'stateGreen', false); //状态颜色绿色
									this.$set(item, 'stateYellow', true);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', true);
									this.$set(item, 'quDis', true);
									break;
								}
							case 2:
								{
									item.state = '费用报价';
									this.$set(item, 'priceDis', true);
									this.$set(item, 'btn', '输入费用');
									this.$set(item, 'price', '上传现场照');
									this.$set(item, 'stateGreen', true); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', true);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', true);
									this.$set(item, 'quDis', true);
									break;
								}
							case 3:
								{
									item.state = '等待支付';
									// this.$set(item, 'priceDis', false);
									this.$set(item, 'priceDis', true);
									this.$set(item, 'btn', '修改费用');
									this.$set(item, 'stateGreen', true); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', false);
									this.$set(item, 'quDis', true);
									this.$set(item, 'price', '￥' + item.serviceFee);
									this.$set(item, 'priceCol', true);
									break;
								}
							case 9:
							case 10:
							case 11:
							{
								item.state = '已完成';
								this.$set(item, 'priceDis', true);
								this.$set(item, 'btn', '评价订单');
								this.$set(item, 'stateGreen', true); //状态颜色绿色
								this.$set(item, 'stateYellow', false);
								this.$set(item, 'stateRed', false);
								this.$set(item, 'pricePhoto', false);
								this.$set(item, 'adDis', false);
								this.$set(item, 'suDis', false);
								this.$set(item, 'quDis', false);
								this.$set(item, 'price', '￥' + item.serviceFee);
								this.$set(item, 'priceCol', true);
								break;
							}
							case 12:
								{
									item.state = '已完成';
									this.$set(item, 'priceDis', true);
									this.$set(item, 'btn', '评价订单');
									this.$set(item, 'stateGreen', true); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', false);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', false);
									this.$set(item, 'quDis', false);
									this.$set(item, 'price', '￥' + item.serviceFee);
									this.$set(item, 'priceCol', true);
									item.isRemark = true;
									break;
								}
							case -100:
								{
									item.state = '已取消';
									this.$set(item, 'priceDis', false);
									this.$set(item, 'btn', '');
									this.$set(item, 'stateGreen', false); //状态颜色绿色
									this.$set(item, 'stateYellow', false);
									this.$set(item, 'stateRed', true);
									this.$set(item, 'pricePhoto', false);
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', false);
									this.$set(item, 'quDis', false);
									break;
								}
						}

					})

					_this.billBei = _this.bill = bill;
					if(_this.bill.length/_this.perpage > 1) {
						this.tip = '加载中……';
					}else {
						this.tip = '没有更多了~';
					}

					this.index = 3;
					this.distri = '预约时间由近到远';
					this.typeDis = false;
					this.isDis = false;
					this.isCodeDis = false;
					this.isQuDis = false;
					this.key = '';
					this.page = 1;
				})


			},

			upPhoto(state,id) { //上传或修改现场照
				let that = this;
				if(state == '费用报价') {
					this.$listapi.upImg('现场图片', this.$store.state.sessionId).then(res => {
						
						if(res.data.code == 'success'){
							that.orderImgId = res.data.collection[0];
							let url = res.img;
							
							let cur = {id:id,img:that.orderImgId,url:url};
							const value = uni.getStorageSync('curImg'); //本地获取是否上传现场照
							if (value == '' || value == null || !value) {
								let arr = [];
								arr.push(cur);
								uni.setStorageSync('curImg', JSON.stringify(arr));
							}
							else {
								let value1 = JSON.parse(uni.getStorageSync('curImg'));
								let exist = false;  //是否已经存在此订单得现场照
								value1.forEach(item=>{  
									if(item.id == id) {  //存在修改
										item.img = that.orderImgId;
										item.url = url;
										exist = true;
									}
								})
								if(exist) {  
									uni.setStorageSync('curImg', JSON.stringify(value1));
								}
								if(!exist) { //不存在添加
									value1.push(cur);
									uni.setStorageSync('curImg', JSON.stringify(value1));
								}
							}
						}
						else {
							uni.showToast({
								title: '上传失败，请稍后再试。',
								icon: 'none',
								duration: 2000
							})
						}
					})
				}
			},

			submitPrice() { //提交费用报价
				this.isDis = true; //显示费用报价弹窗
				this.isInputDis = false; //显示输入弹窗
				this.isSureDis = true; //隐藏确认弹窗
				let _this = this;
				
				const value = uni.getStorageSync('curImg');
				
				if(value == '' || value == null || !value) {
					_this.priceTip = '您需要先上传现场图';
				}
				else {
					const value1 = JSON.parse(uni.getStorageSync('curImg'));
					let exist = false;
					value1.forEach(item=>{
						if(item.id == this.id) {
							this.orderImgId = item.img;
							exist = true;
						}
					})
					if(!exist) {
						_this.priceTip = '您需要先上传现场图';
					}
					else {
						new Promise((resolve,reject) => {
							this.$listapi.getUserVip(this.$store.state.sessionId,this.id).then(res => {
								resolve(res.data.collection[0]);
							})
						}).then(res => {
							if(this.fee == '' || this.fee == null) {
								_this.priceTip = '请输入费用';
							}
							// else if(res && this.fee != 0) {
							// 	_this.priceTip = '该用户是会员用户，服务费只能为0';
							// }
							else {
								
								const value1 = JSON.parse(uni.getStorageSync('curImg'));
								let i = 0;
								value1.forEach((item,index)=>{
									if(item.id == this.id) {
										i = index;
									}
								})
								
								this.$listapi.serPrice(this.$store.state.sessionId, this.id, this.fee,value1[i].img).then(res => {
								// this.$listapi.serPrice(this.$store.state.sessionId, this.id, 0,value1[i].img).then(res => {
									if(res.data.code == 'success') {
										_this.priceTip = '输入成功，请协同用户完成订单支付';
										
										//报价后删除存在本地得现场照
										value1.splice(i,1);
										uni.setStorageSync('curImg', JSON.stringify(value1));
									}
									else {
										_this.priceTip = res.data.message;
									}
									
								})
								
								
								
								
								//提交成功
								// if (this.bill[0].state == '费用报价') {
								// 	this.priceTip = '输入成功，请协同用户完成订单支付';
								// } else if (this.bill[0].state == '等待支付') {
								// 	this.priceTip = '修改成功，请协同用户完成订单支付';
								// }
							}
						})
					}
				} 
			},
			sureCancel(id) { //确认取消费用报价弹窗
				this.isDis = false; //关闭弹窗
				if(this.priceTip == '输入成功，请协同用户完成订单支付') {
					uni.reLaunch({
						url: '/pages/bill/bill'
					})
				}
			},

			submitCode(id) { //提交服务码
				this.isCodeDis = true; //显示服务码弹窗
				this.isCodeInputDis = false; //显示输入弹窗
				this.isCodeSureDis = true; //隐藏确认弹窗

				let _this = this;
				this.$listapi.serCode(this.$store.state.sessionId, id, this.code).then(res => {
					if (res.data.message == '成功') {
						_this.CodeTip = '验证成功，您可以开始服务，请在本次服务结束上传现场服务照片，并填写本次服务费用。';
					} else {
						_this.CodeTip = '验证失败，请和用户再次确认服务码后再进行尝试输入。';
					}
				})
			},
			sureCancelCode() { //确认取消费用报价弹窗
				console.log(this.isCodeDis);
				this.isCodeDis = false; //关闭弹窗
				if (this.CodeTip == '验证成功，您可以开始服务，请在本次服务结束上传现场服务照片，并填写本次服务费用。') {
					uni.reLaunch({
						url: '/pages/bill/bill'
					})
				} else {
					this.isDis = false;
				}

			},
			CancelOrder(id) {
				if(this.reason == '' || this.reason == null) {
					uni.showToast({
						title: '请输入理由',
						icon: 'none',
						duration: 1200,
						mask: true
					})
				}
				else {
					this.$listapi.quBill(this.$store.state.sessionId,this.id,this.reason).then(res => {
						uni.reLaunch({
							url: '/pages/bill/bill'
						})
					})
				}
			},
			quBill(id) {
				//取消订单
				this.isQuDis = true;
				this.id = id;
			},

			toDetail(item) { //Id是订单编号，跳转到订单详情	
				// let item1 = encodeURIComponent(JSON.stringify(item));
				uni.navigateTo({
					url: './detail?item='+item.id
				});
			},
			
			
			search() { //关键词搜索
				this.page = 1;
				if(this.key == '' || this.key == null) {
					this.bill = this.billBei;
					this.index = 3;
				}
				else {
					this.bill = [];
					this.billBei.forEach(item=>{
						let str = JSON.stringify(item);
						if(str.indexOf(this.key) != -1) {
							this.bill.push(item);
						}
					})
				}
				
				if(this.bill.length / this.perpage <= 1) {
					this.tip = '没有更多了~';
				}
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
	.content {
		min-height: 90vh;
	}
	/* 修改导航渐变 */
	.demo {
		background: linear-gradient(to bottom, #3C94CF, #419FDC) !important;
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
		height: 184rpx;
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
	.bill-con-search input {
		box-sizing: border-box;
		background-color: white;
		color: #333;
		border-radius: 99rpx;
		height: 62rpx;
		line-height: 62rpx;
		width: 100%;
		font-size: 24rpx;
		padding-left: 62rpx;
		background-image: url(../../static/images/search.png);
		background-repeat: no-repeat;
		background-size: 32rpx 32rpx;
		background-position: 18rpx 15rpx;
		margin-bottom: 20rpx;
	}

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
		border: 1rpx solid #4DA8E5;
		border-radius: 10rpx;
		padding: 0 10rpx;
		margin-top: 10rpx;
	}

	.bill-con-de .stateYellow {
		color: #ffd200;
	}

	.bill-con-de .stateGreen {
		color: #4DA8E5;
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
		padding: 0 !important;
	}

	.priceCol {
		font-size: 30rpx;
		font-weight: bold;
		color: #fb6464;
	}

	.pricePhoto {
		color: #4DA8E4;
		font-size: 24rpx;
		border: 1rpx solid #4DA8E4;
		padding: 6rpx 10rpx;
		border-radius: 15rpx;
	}

	.mlAuto {
		margin-left: auto;
	}


	/* 费用报价弹窗 */
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
		height: auto;
		margin: 0 auto;
		margin-top: 486rpx;
		padding: 0 20rpx 20rpx;
	}

	.submit-su-con image {
		width: 100rpx;
		height: 100rpx;
		margin-top: -50rpx;
	}

	.submit-su-con .f24 {
		color: #ccc;
		margin-top: 25rpx;
	}

	.submit-su-con input {
		border-bottom: 2rpx solid #4DA8E4;
		margin-top: 27rpx;
	}

	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 57rpx;
		margin-top: 40rpx;
	}

	/* .submit-su-code .f24 {
		margin-top: 15rpx;
	}

	.submit-su-code button {
		bottom: 20rpx;
		width: 91%;
	} */
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

	.mt24 {
		margin-top: 24rpx;
	}
	.ad-max {
		width: 216rpx;
	}
	.ad-max-2 {
		width: 850rpx;
	}
</style>
