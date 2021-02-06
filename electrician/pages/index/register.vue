<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>

		<!-- 头部 -->
		<view class="re-h w pr">
			<image class="re-h-bg" src="../../static/images/regi_bg.png" mode=""></image>
			<view class="re-h-con pa txt-cen w">
				<view class="re-h-wh circle">
					<view class="re-h-wh-small circle hide">
						<image :src="ava" mode=""></image>
					</view>
				</view>
				<image mode="widthFix" class="re_ti" src="../../static/images/re_ti.png"></image>
			</view>
		</view>

		<!-- 内容 -->
		<view class="tobill-con">
			<view class="flex-middle f30">
				<view class="re-img">
					<image class="re-img01" src="../../static/images/re01.png" mode=""></image>
				</view>
				<input type="text" v-model="name" placeholder="请输入真实姓名" placeholder-style="color:#bbb;font-size:30rpx;" />
			</view>
			<view class="flex-middle f30">
				<view class="re-img">
					<image class="re-img02" src="../../static/images/re02.png" mode=""></image>
				</view>
				<input type="text" v-model="idcard" placeholder="请输入身份证号码" placeholder-style="color:#bbb;font-size:30rpx;" />
			</view>
			<view class="flex-middle f30">
				<view class="re-img">
					<image class="re-img03" src="../../static/images/re03.png" mode=""></image>
				</view>
				<input type="text" v-model="phone" placeholder="请输入手机号码" placeholder-style="color:#bbb;font-size:30rpx;" />
			</view>
		</view>

		<!-- 按钮 -->
		<view class="re-btn flex-cover f30 white">
			<button @click="isUpCard = true">点击上传电工证<br><text class="f22">(至少上传1张电工证)</text></button>
			<button @click="isUpId = true">点击上传身份证<br><text class="f22">(请上传身份证正反2面)</text></button>
		</view>
		<button class="re-submit border-r-20 white bg-con f30" @click="submit()">提交</button>

		<!-- 上传身份证 -->
		<view class="unload-idcard" v-show="isUpId" @click="isUpId = false">
			<view @click.stop class="up-id-con bg-white border-r-20">
				<image class="up-user-img circle" :src="logo" />
				<view class="up-id-img border-r-20 txt-cen white" @click="upIdPer()">
					<view v-show="!idPer">
						<view class="f30">
							<image class="up-id-add" src="../../static/images/re_add.png" mode=""></image>
						</view>
						<view class="f26">请上传身份证人像面照片</view>
					</view>
					<view class="wh border-r-20 hide" v-show="idPer != ''">
						<image class="wh" :src="idPer" mode=""></image>
					</view>
				</view>
				<view class="up-id-img border-r-20 txt-cen white" @click="upIdCh()">
					<view v-show="!idCh">
						<view class="f30">
							<image class="up-id-add" src="../../static/images/re_add.png" mode=""></image>
						</view>
						<view class="f26">请上传身份证国徽面照片</view>
					</view>
					<view class="wh border-r-20 hide" v-show="idCh != ''">
						<image class="wh" :src="idCh" mode=""></image>
					</view>
				</view>
				<button class="white bg-con f28" @click="upIdSure()">确认</button>
			</view>
		</view>

		<!-- 上传电工证 -->
		<view class="unload-idcard" v-show="isUpCard" @click="isUpCard = false">
			<view @click.stop class="up-card-con bg-white border-r-20">
				<image class="up-user-img circle" :src="logo" />
				<view class="txt-cen f28">上传电工证(至少上传一张)</view>
				<view class="up-card-con-h">
					<view class="flex-center" v-for="(item,index) in key" :key="item">
						<view class="up-card-img border-r-20 txt-cen white flex-middle flex-center" @click="upCard()">
							<view v-show="!card[index]" class="f30">
								<image class="up-card-add" src="../../static/images/re_add.png" mode=""></image>
							</view>
							<view class="wh border-r-20 hide" v-show="card[index]">
								<image class="wh" :src="card[index]" mode=""></image>
							</view>
						</view>
						<view class="flex-middle">
							<input class="f24" type="text" v-model="cardName[index]" placeholder="请输入证件名称" placeholder-style="font-size:24rpx;color:#ccc;" />
						</view>
					</view>
				</view>
				<view class="more colorCon" @click="moreCard()">+</view>
				<button class="white bg-con f28" @click="upCardSure()">确认</button>
			</view>
		</view>

		<!-- 提交成功弹窗 -->
		<view class="submit-su txt-cen" v-if="isDis" @click="sureCancel()">
			<view @click.stop class="submit-su-con bg-white border-r-20">
				<image class="up-user-img circle" :src="logo" />
				<view class="f28">提示</view>
				<view class="f24">上传成功，请您耐心等待系统审核</view>
				<button @click.stop="sureCancel()" class="white bg-con f28">确认</button>
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
				ava: '', //头像
				islala: false, //审核情况

				name: '',
				idcard: '',
				phone: '',

				isUpId: false, //上传身份证弹窗
				idPer: '', //身份证正面
				idPerId: '',
				idCh: '', //身份证反面
				idChId: '',
				isUpCard: false, //上传电工证弹窗
				card: [], //电工证
				cardId: [],
				cardName: [],  //电工证名字
				isDis: false, //提交成功弹窗显示

				key: 1 //上传电工证数
			}
		},
		methods: {			
			
			upIdPer() { //上传身份证正面
				let that = this;
				this.$listapi.upImg('身份证正面照',this.$store.state.sessionId).then(res=>{
					
					that.idPer = res.img;
					that.idPerId = res.data.collection[0];
				})
			},
			upIdCh() { //上传身份证反面
				let that = this;
				this.$listapi.upImg('身份证反面照',this.$store.state.sessionId).then(res=>{
					
					that.idCh = res.img;
					that.idChId = res.data.collection[0];
				})
			},
			upIdSure() { //确认上传身份证
				this.isUpId = false;
			},
			upCard() { //上传电工证
				let that = this;
				
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有				   
					sourceType: ['album', 'camera'],
					success: function(res) {
						that.card.push(res.tempFilePaths[0]);
					}
				});
			},
			moreCard() { //上传更多电工证
				let that = this;
				uni.uploadFile({
					url: this.$store.state.url + 'common/' + this.$store.state.sessionId + '/uploadFile.json',
					filePath: this.card[this.key-1],
					name: 'file',
					formData: {
						remark: this.cardName[this.key-1],
					},
					success: (uploadFileRes) => {
						let res = JSON.parse(uploadFileRes.data);
						that.cardId.push(res.collection[0]);
					},
					fail(err) {
						console.log(err);
					}
				});
				this.key++;
			},
			upCardSure() { //确认上传电工证
				let that = this;
				uni.uploadFile({
					url: this.$store.state.url + 'common/' + this.$store.state.sessionId + '/uploadFile.json',
					filePath: this.card[this.key-1],
					name: 'file',
					formData: {
						remark: this.cardName[this.key-1],
					},
					success: (uploadFileRes) => {
						let res = JSON.parse(uploadFileRes.data);
						that.cardId.push(res.collection[0]);
						// console.log(that.cardId);
					},
					fail(err) {
						console.log(err);
					}
				});
				this.isUpCard = false;
			},
			submit() { //提交信息
				if(!(/^([\u4e00-\u9fa5]{1,20}|[a-zA-Z\.\s]{1,20})$/.test(this.name))) {
					uni.showToast({
						title: '姓名格式不正确',
						icon: 'none',
						duration: 1200
					})
				}
				else if(!(/^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(this.idcard))) {
					uni.showToast({
						title: '身份证格式不正确',
						icon: 'none',
						duration: 1200
					})
				}
				else if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(this.phone))) {
					uni.showToast({
						title: '手机号格式不正确',
						icon: 'none',
						duration: 1200
					})
				}
				else if(this.idPerId == '' || this.idPerId == null || this.idChId == '' || this.idChId == null) {
					uni.showToast({
						title: '请上传身份证',
						icon: 'none',
						duration: 1200
					})
				}
				else if(this.cardId == [] || this.cardId == '' || this.cardId == null) {
					uni.showToast({
						title: '请上传电工证',
						icon: 'none',
						duration: 1200
					})
				}
				else {
					let data = {
						name: this.name,
						cardNo: this.idcard,
						phone: this.phone,
						certificates: [
							{
								imageId: this.idPerId,
								orderIndex: 1000,
								type: 1
							},{
								imageId: this.idChId,
								orderIndex: 1001,
								type: 2
							}
						]
					}
					this.cardId.forEach((item,i)=>{
						data.certificates.push({imageId:item,orderIndex:1002+i,type:3});
					})
					
					// console.log(data);
					let _this = this;
					
					uni.requestSubscribeMessage({
					  tmplIds: ['H-XNzS3Oq92523cGxLzhRab3PiiQRJ51UVxZjyerdx8','eyT7HjFvmekekDqk6iVM5XojhYC0esrJVJRklhK8UYA','nUjRFV6M3weNlxQYCvntqLDYnNgG33fLypYZYiSxepk'],
					  success (res) { 
						  console.log(res);
						  if(res['H-XNzS3Oq92523cGxLzhRab3PiiQRJ51UVxZjyerdx8'] == "reject" || res['eyT7HjFvmekekDqk6iVM5XojhYC0esrJVJRklhK8UYA'] == "reject" || res['nUjRFV6M3weNlxQYCvntqLDYnNgG33fLypYZYiSxepk'] == "reject") {
							  uni.showToast({
								  icon: 'none',
								  duration: 3000,
								  title: '为了让您及时接收到消息，请您同意发送消息'
							  })
						  }
						   else {
							  _this.$listapi.register(_this.$store.state.sessionId,data).then(res => {
							  	// console.log(res);
							  	_this.isDis = true; //提示弹窗
							  })
						  }
						 
					  },
					  fail(err) {
						  console.log(err);
					  }
					})
				}
				
			},
			sureCancel() { //确认取消弹窗
								
				this.isDis = false; //关闭弹窗
				this.$store.commit('setLogin', false); //重新登录
				
				uni.reLaunch({
					url: '/pages/index/index'
				})
			},
		},
		components: {
			Nav
		},
		onLoad(options) {
			this.$refs.son.a = '注册'; //修改navigatorBarText
			this.$refs.son.conBack = true; //隐藏返回
			
			this.logo = this.$store.state.logo;
			
			this.ava = this.$store.state.avatarUrl;
			// this.$loading();
			
			let app = getApp();
			let _this = this;
			app.login(this).then(res=> {
				
				_this.ava = _this.$store.state.avatarUrl;
			})
			// setTimeout(function(){_this.$loading(false);},1000);
			
			// if(options.s == 1) {
			// 	this.islala = true;
			// }
		}
	}
</script>

<style>
	/* 修改导航渐变 */
	.demo {
		background: linear-gradient(to bottom, #3C94CF, #429DDA) !important;
	}

	/* 顶部 */
	.re-h-bg {
		width: 100%;
		height: 320rpx;
	}

	.re-h-con {
		top: 10rpx;
	}

	.re-h-wh {
		width: 206rpx;
		height: 206rpx;
		background: #77BAE6;
		margin: 0 auto;
		padding: 17rpx;
		box-sizing: border-box;
	}

	.re-h-wh-small {
		background: white;
		width: 172rpx;
		height: 172rpx;
	}

	.re-h-wh-small image {
		width: 100%;
		height: 100%;
	}

	.re_ti {
		width: 160rpx;
		margin-top: 30rpx;
	}

	/* 内容 */
	.tobill-con {
		width: 620rpx;
		margin: 0 auto;
		padding-top: 20rpx;
	}

	.tobill-con>view {
		height: 78rpx;
		border-bottom: 1rpx solid #e5e5e5;
		margin-top: 15rpx;
	}

	.re-img {
		width: 90rpx;
		text-align: center;
		display: flex;
		display: -webkit-flex;
		align-items: center;
		justify-content: center;
	}

	.re-img01 {
		width: 35rpx;
		height: 40rpx;
	}

	.re-img02 {
		width: 54rpx;
		height: 40rpx;
	}

	.re-img03 {
		width: 42rpx;
		height: 42rpx;
	}

	.re-btn {
		width: 690rpx;
		margin: 0 auto;
	}

	.re-btn button {
		margin-top: 50rpx;
		background: #4DA8E4;
		border-radius: 20rpx;
		width: 270rpx;
		height: 100rpx;
		line-height: 34rpx;
		color: white;
		font-size: 30rpx;
		padding: 0 !important;
		padding-top: 16rpx !important;
	}

	.re-submit {
		width: 620rpx;
		margin-top: 40rpx;
	}

	/*上传身份证*/
	.wh {
		width: 100%;
		height: 100%;
	}

	.unload-idcard {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 100;
		padding: 0;
	}

	.up-id-con {
		width: 566rpx;
		margin: 480rpx auto 0;
		text-align: center;
		padding-bottom: 30rpx;
	}

	.up-user-img {
		width: 100rpx;
		height: 100rpx;
		margin-top: -50rpx;
		background: #419AD5;
		margin-bottom: 10rpx;
	}

	.up-id-img {
		width: 470rpx;
		height: 240rpx;
		background: #DDDCDC;
		margin: 20rpx auto 0;
	}

	.unload-idcard button {
		width: 378rpx;
		height: 62rpx;
		line-height: 62rpx;
		border-radius: 100rpx;
		margin-top: 30rpx;
	}

	.up-id-add {
		width: 52rpx;
		height: 52rpx;
		margin-top: 70rpx;
		margin-bottom: 14rpx;
	}

	/*上传电工证*/
	.up-card-con {
		width: 500rpx;
		margin: 480rpx auto 0;
		text-align: center;
		padding-bottom: 30rpx;
	}

	.up-card-img {
		width: 210rpx;
		height: 160rpx;
		background: #DDDCDC;
		margin: 20rpx auto 0;
	}

	.up-card-con input {
		width: 200rpx;
		border-bottom: 1rpx solid #419AD5;
		margin-right: 32rpx;
		padding-bottom: 12rpx;
	}

	.up-card-con .more {
		width: 40rpx;
		height: 40rpx;
		line-height: 40rpx;
		margin: 40rpx auto 0;
		border-radius: 50%;
		border: 1rpx solid #419AD5;
	}

	.up-card-add {
		width: 40rpx;
		height: 40rpx;
	}

	.up-card-con-h {
		max-height: 380rpx;
		overflow-y: scroll;
	}

	/* 弹窗 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, .5);
		z-index: 5;
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
		margin-top: 15rpx;
	}

	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 52rpx;
		margin-top: 50rpx;
	}
	
	.lh {
		line-height: 30rpx;
	}
</style>
