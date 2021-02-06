<template>
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 顶部 -->
		<view class="index-header">
			<image class="indexHBg" src="../../static/images/indexHBg.png"></image>
		</view>
		
		<!-- 内容 -->
		<view class="bill-con w-con"  @touchmove="handletouchmove" @touchstart="handletouchstart" @touchend="handletouchend">
			
			<!-- 流程 -->
			<view class="view1 bill-state bill-step bg-white"  v-if="bill.state != '已取消'">
				<uni-steps :options="step" :active="stepIndex" active-color="#4DA8E5"></uni-steps>				
			</view>
			
			<!-- 状态 -->
			<view class="view1 bill-state bg-white flex-cover mt15">
				<view class="f30">订单状态：</view>
				<view class="f28" :class="{stateGreen: bill.stateGreen,stateYellow: bill.stateYellow,stateRed: bill.stateRed}">{{bill.state}}</view>
			</view>
			
			<!-- 下单信息 -->
			<view class="view1 bill-user bg-white mt15">
				<view class="bill-user-ti f30">订单信息：</view>
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
					<view class="flex" @click="toMap(myad)">
						<view class="flex-middle bill-user-ad">{{myad}}</view>
						<view class="flex-middle"><image class="more-address" src="../../static/images/more.png" mode=""></image></view>
					</view>
				</view>
				<view class="te flex-cover">
					<view>联系方式：</view>
					<view class="flex">
						<view class="colorCon flex-middle" @click="phoneUser(bill.phone)">
							<view class="emploTelImg flex-middle"><image src="../../static/images/phone.png" mode=""></image></view>
							<view class="emploTel flex-middle">联系用户</view>
						</view>
						<view class="flex-middle flex-middle">
							<view class="emploPhoto flex-middle"><image :src="bill.wxPhoto" mode=""></image></view>
							<view>{{bill.name}}</view>
						</view>
					</view>
				</view>
				<view class="bill-user-img">
					<view>附图：</view>
					<view v-if="!bill.createImage[0].url" class="img flex-MC">暂无图片</view>
					<view v-else class="flex-cover" style="flex-wrap: wrap" @click="createBig()">
						<image v-for="item in bill.createImage" :key="item.id" class="bg-f2 border-r-20" :src="item.url" alt="暂未上传图片" mode=""></image>
					</view>
					
				</view>
				<view class="flex-cover">
					<view>备注：</view>
					<view>{{bill.faultDesc}}</view>
				</view>
			</view>
			
			<!-- 接单信息 -->			
			<view v-show="bill.priceDis" class="bill-user">
				
				<view class="view1 flex-cover mt15 bg-white">
					<view class="f30 black">服务码</view>
					<view class="flex-middle">
						<view class="colorCon f30">{{bill.verificationdCode}}</view>
						<view class="code-border-l c999 f24">已验证</view>
					</view>
				</view>
				<view class="bill-user-img view1 mt15 bg-white">
					<view>现场服务图片：</view>
					<view v-show="!bill.completeImage[0].url" class="img flex-MC">暂无图片</view>
					<image v-show="bill.completeImage[0].url" :src="bill.completeImage[0].url" class="border-r-20" alt="暂未上传图片" mode=""></image>
					<view class="aaa flex-cover">
						<view>费用合计：</view>
						<view :class="{priceCol:bill.priceCol}">{{bill.allFee}}</view>
					</view>
					<view class="aaa flex-cover">
						<view>上门费用：</view>
						<view :class="{priceCol:bill.priceCol}">￥{{bill.doorFee}}</view>
					</view>
					<view class="aaa aaa3 flex-cover">
						<view>维修费用：</view>
						<view :class="{priceCol:bill.priceCol}">{{bill.serviceFee}}</view>
					</view>
				</view>
				
			</view>
			
			
			<view class="view1 bill-user bill-news bg-white mt15">
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
			<view v-if="bill.isRemark" class="view1 bill-user bg-white mt15">
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
		<view v-show="bill.state != '已完成' && bill.state != '已取消'" class="detail-btn bg-white flex-middle"> 
			<view class="load-picture f24 colorCon" v-show="bill.state == '费用报价'" @click="upPhoto()">上传现场照</view>
			<!-- <view v-show="bill.waitBill" class="wait-bill">
				<checkbox :checked="isChecked" @click="isChecked = !isChecked" />
				<text class="f28">我已经认真阅读并同意
					<text class="f22 colorCon">《订单协议》</text>
				</text>
			</view> -->
			<view class="flex ml-auto">
				<button v-if="bill.suDis" class="mr0 white bg-con f26" @click.stop="cancelBill(bill.state,bill.id)">{{bill.btn}}</button>
				<button v-if="bill.quDis" class="white bg-con f26" @click.stop="quBill(bill.id)">取消订单</button>
			</view>
			<!-- <button class="white bg-con f26" @click.stop="cancelBill(bill.state)">{{bill.btn}}</button> -->
		</view>
		
		<!-- 未勾选协议弹窗 -->
		<view v-show="isCheck" class="submit-su txt-cen" @click="isCheck=false">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">请仔细阅读订单协议</view>
				<button @click="isCheck = false" class="white bg-con f28">确认</button>
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
	import uniSteps from '@/components/uni-steps/uni-steps.vue';  //步骤条插件
	import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	export default {
		data() {
			return {
				logo: this.$store.state.logo,
				name: '',
				ava: '',
				myad: '', //地址
				
				isChecked: false, //是否选择已读订单协议
				photo: '../../static/images/index_fun02.png', //电工头像
				isCheck: false,
				
				bill: {}, //订单数据 
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
				
				step: [
					{title: '待接单'}, 
					{title: '待验证'}, 
					{title: '待报价'},
					{title: '待支付'},
					{title: '已完成'}
				],  //步骤
				stepIndex: 0,  //步骤下标
				
				onload: false,  //是否重新加载页面
				
				remark: {}  ,//订单评价
				
				
				flag: 0,
				text: '',
				lastX: 0,
				lastY: 0,
				endX: 0,
			}
		},
		onLoad(options) {
			// console.log(this.bill);
			
			this.$refs.son.a = '订单详情';  //修改navigatorBarText
			this.$refs.son.indexSer = false;  //头部隐藏客服
			this.$refs.son.conBack = true;  //显示返回
			
			this.$loading(false);
			let _this = this;
			this.id = options.item;
			this.$loading(true);
			setTimeout(function(){
				// _this.bill = JSON.parse(decodeURIComponent(options.item));
				_this.getBill();
				
				_this.$loading(false);
			},Math.random()*2000);
			
			this.$over();
			
			// setTimeout(function(){_this.$loading(false);},Math.random()*500);
			
			
			this.name = this.$store.state.userName;
			this.ava = this.$store.state.avatarUrl;
		},        
		methods: {
			createBig() { //预览附图
				let _this = this;
				let urls = [];
				_this.bill.createImage.forEach(item=>{
					urls.push(item.url);
				})
				uni.previewImage({
					urls,
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
			cancelBill(state, id) { //取消订单显示弹窗
			
				this.id = id;
				if(state == '等待接单') {
					let _this = this;
					uni.requestSubscribeMessage({
					  tmplIds: ['nUjRFV6M3weNlxQYCvntqLDYnNgG33fLypYZYiSxepk','MjSfiwtkv8ywzrDKEHadn5QhErlNgbGM6P4gWVMOXW8','FXaoZq7sWeGz9QUXVXZ7u6ZdMpRA8Hhub-AAhFYpRYQ'],
					  success (res) {
						  if(res['nUjRFV6M3weNlxQYCvntqLDYnNgG33fLypYZYiSxepk'] == "reject" || res['MjSfiwtkv8ywzrDKEHadn5QhErlNgbGM6P4gWVMOXW8'] == "reject" || res['FXaoZq7sWeGz9QUXVXZ7u6ZdMpRA8Hhub-AAhFYpRYQ'] == "reject") {
							  uni.showToast({
								  icon: 'none',
								  duration: 3000,
							  	title: '为了让您及时接收到消息，请您同意发送消息'
							  })
						  }
						   else {
							   uni.showModal({
							       title: '提示',
							       content: '是否确认接此订单？',
							       success: function (res) {
							           if (res.confirm) {
							   
							 _this.$listapi.order(_this.$store.state.sessionId,id).then(res => {
							 	if(res.data.success == false) {
							 		if(res.data.message == '消息发送失败') {
							 			uni.reLaunch({
							 				url: '/pages/bill/detail?item='+_this.id
							 			})
							 		}
							 		else {
							 			this.msg = res.data.message;
							 			this.isDis = true;
							 		}
							 		
							 	}
							 	else {
							 		uni.reLaunch({
							 			url: '/pages/bill/detail?item='+_this.id
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
				}
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
							uni.reLaunch({
								url: '/pages/bill/detail?item='+this.id
							})
						})
						
					}catch(e){
						//TODO handle the exception
					};
					
				}
			
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
					this.$listapi.getRemark(this.$store.state.sessionId,this.bill.id).then(res=>{
						_this.remark = res.data.collection[0];
						
						_this.$set(_this.remark,'de1',_this.upCon(_this.remark.allSatisfied));  //获得相应文字描述
						_this.$set(_this.remark,'de2',_this.upCon(_this.remark.attitude));
						_this.$set(_this.remark,'de3',_this.upCon(_this.remark.skill));
						
					})
				}
			},
			getStep() { //获取步骤
				let state = this.bill.state;
				this.step.forEach((item,index)=>{
					switch(state) {
						case '等待接单': this.stepIndex = 0;break;
						case '等待验证服务码': this.stepIndex = 1;break;
						case '费用报价': this.stepIndex = 2;break;
						case '等待支付': this.stepIndex = 3;break;
						case '已完成': this.stepIndex = 4;break;
					}
				})
			},
			getBill() {  //修改部分展示
				let _this = this;
				this.$listapi.getBillDetail(this.$store.state.sessionId,this.id).then(res => {
					let billInit = res.data.collection;
					billInit.forEach(item => {
						
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
									this.$set(item, 'btn', '接单');
									this.$set(item, 'adDis', false);
									this.$set(item, 'suDis', true);
									this.$set(item, 'quDis', false);
									this.$set(item, 'pricePhoto', false);
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
					_this.bill = billInit[0];
					//时间
					_this.bill.createdAt = _this.bill.createdAt.replace(/T/,' ');
					if(_this.bill.selectdAt!=''&&_this.bill.selectdAt!=null) {
						_this.bill.selectdAt = _this.bill.selectdAt.replace(/T/,' ');
					}
					if(_this.bill.enddAt!=''&&_this.bill.enddAt!=null) {
						_this.bill.enddAt = _this.bill.enddAt.replace(/T/,' ');
					}
					
					//费用
					_this.$set(_this.bill,'allFee',0);
					if(_this.bill.serviceFee === '' || _this.bill.serviceFee === null) {
						_this.bill.serviceFee = '等待输入服务费用';
						_this.bill.allFee = '￥0';
					}
					else {
						_this.bill.allFee = '￥' + Number(_this.bill.serviceFee + _this.bill.doorFee).toFixed(2);
						_this.bill.serviceFee = '￥' + _this.bill.serviceFee;
					}
					
					//现场照
					if(this.bill.completeImage == '' || this.bill.completeImage == null) {
						if(uni.getStorageSync('curImg') == '' || uni.getStorageSync('curImg') == null || !uni.getStorageSync('curImg')) {
							
						}
						else {
							let value1 = JSON.parse(uni.getStorageSync('curImg'));
							value1.forEach(item=>{  
								if(item.id == this.bill.id) {  //存在修改
									this.bill.completeImage.push({url:item.url});
									// console.log(this.bill.completeImage);
								}
							})
						}
					}
					
					//地址
					let ad1 = this.bill.allAd.split('-*-')[1].split('-+-')[0];
					let ad2 = this.bill.allAd.split('-*-')[0];
					let ad3 = this.bill.allAd.split('-+-')[1];
					this.myad = ad1 + ' ' + ad2 + ' 门牌号：' + ad3;
					
					_this.getStep();
					_this.getRemark();
				})
				
			},
			toMap(address) { //查看地图
				uni.navigateTo({
					url: './map?la='+this.bill.adLa+'&lo='+this.bill.adLo+'&ad='+address
				})
			},
			
			upPhoto() { //上传或修改现场照
				let that = this;
				if(this.bill.state == '费用报价') {
					this.$listapi.upImg('现场图片', this.$store.state.sessionId).then(res => {
						
						if(res.data.code == 'success'){
							that.orderImgId = res.data.collection[0];
							let url = res.img;
							
							if(this.bill.completeImage == '' || this.bill.completeImage == null) {
								
								this.bill.completeImage.push({url:url});
									
							}
							else {
								this.bill.completeImage[0].url = url;
							}
							
							
							let cur = {id:that.id,img:that.orderImgId,url:url};
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
									if(item.id == that.id) {  //存在修改
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
						url: '/pages/bill/detail?item='+this.id
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
			sureCancelCode() { //确认取消服务码弹窗
				this.isCodeDis = false; //关闭弹窗
				if (this.CodeTip == '验证成功，您可以开始服务，请在本次服务结束上传现场服务照片，并填写本次服务费用。') {
					uni.reLaunch({
						url: '/pages/bill/detail?item='+this.id
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
							url: '/pages/bill/detail?item='+this.id
						})
					})
				}
			},
			quBill(id) {
				//取消订单
				this.isQuDis = true;
				this.id = id;
			},
			phoneUser(phone) {
				uni.makePhoneCall({
				    phoneNumber: phone //仅为示例
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
	/* 修改导航渐变 */
	.demo{
		background: linear-gradient(to bottom,#3C94CF,#419FDC) !important;
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
	.bill-con .view1 {
		padding: 28rpx 25rpx 28rpx 15rpx;
		border-radius: 20rpx;
	}
	.bill-state .stateYellow {
		color: #ffd200;
	}
	.bill-state .stateGreen {
		color: #4DA8E4;
	}
	.bill-state .stateRed {
		color: #fb6464;
	}
	.bill-user>view {
		border-bottom: 1rpx solid #F5F5F5;
		color: #999;
		font-size: 26rpx;
		padding: 20rpx 0;
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
	.more-address {
		width: 10rpx;
		height: 18rpx;
		margin-left: 7rpx;
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
		width: 36rpx;
		height: 36rpx;
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
	.detail-btn button,.load-picture {
		margin-left: auto;
		margin-right: 30rpx;
		border-radius: 100rpx;
		width: 209rpx;
		height: 58rpx;
		line-height: 58rpx;
	}
	.bill-user-ad {
		max-width: 500rpx;
	}
	.load-picture {
		margin-left: 30rpx;
		width: 176rpx;
		height: 58rpx;
		line-height: 58rpx;
		border: 1rpx solid #4DA8E4;
		text-align: center;
	}
	.code-border-l {
		border-left: 1rpx solid #ccc;
		padding-left: 10rpx;
		margin-left: 10rpx;
	}
	.wait-bill checkbox {
		transform: scale(0.6);
		margin-left: 16rpx;
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
	
	
	
	
	.aaa{
		margin-top: 20rpx;
	}
	.aaa3 {
		padding-bottom: 20rpx;
	}
	/* checkbox样式 */
	checkbox .wx-checkbox-input.wx-checkbox-input-checked {
		color: white;
		background: #4DA8E4;	
	}
	button {
		padding: 0 !important;
		border: none !important;
	}
	button::after {
		border: none !important;		
	}
	
	.big-width {
		max-width: 340rpx;
		word-break: break-all;
	}
	.mr0 {
		margin-right: 15rpx !important;
	}
	
	.star-num {
		margin-top: 8rpx;
		margin-right: 14rpx;
	}
	.txt-indent {
		text-indent: 2em;
	}
</style>
