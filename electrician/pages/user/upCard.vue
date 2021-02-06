<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 内容 -->
		<view class="upcard-con w-con">
			<view class="card">
				<view class="card-ti colorCon f30 mt15 FB">电工证：</view>
				<view class="card-con flex-cover">
					<view class="mb30 txt-cen" v-for="(item,index) in cardD" :key="index">
						<view class="card-img border-r-20 hide bg-con" @click="bigImgFun('card',index)">
							<image :src="item.imageUrl" mode=""></image>
						</view>
						<view class="f26">{{item.imageRemark}}</view>
						<!-- <view class="upcard-btn white bg-con f26" @click="isUpCard2=true">点击修改</view> -->
						<view class="upcard-btn white bg-con f26" @click="aaaa(item.imageId,item.imageUrl,item.imageRemark)">点击修改</view>
					</view>
				</view>
				<button class="big-btn white bg-con f30" @click="upCardSum()">点击添加电工证</button>
			</view>
			<view class="idcard">
				<view class="card-ti colorCon f30 mt15 FB">身份证：</view>
				<view class="card-con flex-cover">
					<view class="mb30 txt-cen" v-for="(item,index) in idCard" :key="index">
						<view class="idcard-img border-r-20 hide bg-con" @click="bigImgFun('idCard',index)">
							<image :src="item.imageUrl" mode=""></image>
						</view>
					</view>
				</view>
				<button class="big-btn white bg-con f30" @click="upIdSum()">点击修改身份证</button>
			</view>
			
		</view>
		
		<!-- 上传身份证 -->
		<view class="unload-idcard" v-show="isUpId" @click="isUpId = false">
			<view class="up-id-con bg-white border-r-20" @click.stop>
				<image class="up-user-img circle bg-con" :src="logo" />
				<view class="up-id-img border-r-20 txt-cen white" @click="upIdPer()">
					<view v-show="!idPer">
						<view class="f30">
							<image class="up-id-add" src="../../static/images/re_add.png" mode=""></image>
						</view>
						<view class="f24">请上传身份证人像面照片</view>
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
						<view class="f24">请上传身份证国徽面照片</view>
					</view>
					<view class="wh border-r-20 hide" v-show="idCh != ''">
						<image class="wh" :src="idCh" mode=""></image>
					</view>
				</view>
				<button class="white bg-con f24" @click="upIdSure()">确认</button>
			</view>
		</view>
		
		<!-- 上传电工证 -->
		<view class="unload-idcard" v-show="isUpCard" @click="isUpCard = false">
			<view @click.stop class="up-card-con bg-white border-r-20">
				<image class="up-user-img circle bg-con" :src="logo" />
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
		
		<!-- 修改电工证 -->
		<view class="unload-idcard" v-show="isUpCard2" @click="isUpCard2 = false">
			<view class="up-card-con bg-white border-r-20" @click.stop>
				<image class="up-user-img circle bg-con" :src="logo" />
				<view class="txt-cen f28">上传电工证</view>
				<view class="up-card-con-h">
					<view class="flex-center">
						<view class="up-card-img border-r-20 txt-cen white flex-middle flex-center" @click="upCard2()">
							<view v-show="!card2" class="f30">
								<image class="up-card-add" src="../../static/images/re_add.png" mode=""></image>
							</view>
							<view class="wh border-r-20 hide" v-show="card2">
								<image class="wh" :src="card2" mode=""></image>
							</view>
						</view>
						<view class="flex-middle">
							<input v-model="upName" class="f24" type="text" placeholder="请输入证件名称" placeholder-style="font-size:24rpx;color:#ccc;" />
						</view>
					</view>
				</view>
				<view class="flex-cover">
					<button class="ww white bg-con f28" @click="delCard()">删除</button>
					<button class="ww white bg-con f28" @click="upCardSure2()">确认</button>
				</view>
			</view>
		</view>
		
		<view class="blank"></view>
		
		<!-- 查看大图 -->
		<view class="unload-idcard" v-show="isBigImg" @click="isBigImg = false">
			<movable-area scale-area @click.stop>
				<movable-view direction="all" scale="true" scale-min="1" scale-max="2">
					<image :src="bigImg" mode="widthFix"></image>
				</movable-view>
			</movable-area>
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
				logo: '',
				cardD: [ //电工证
					
				],
				idCard: [ //身份证
					
				],
				
				isUpId: false, //上传身份证弹窗
				idPer: '', //身份证正面
				idCh: '', //身份证反面
				
				
				isUpCard: false, //上传电工证弹窗
				card: [], //电工证
				cardId: [],
				cardName: [],  //电工证名字
				
				
				key: 1,
				isUpCard2: false, //上传电工证弹窗
				card2: '', //电工证
				
				isBigImg: false, //是否显示大图
				bigImg: '', //大图链接
				
				
				oldCardID: '',
				upName: ''
			}
		},
		methods: {
			upIdSum() {
				if(this.$store.state.login) {
					this.isUpId = true;
				}
				else {
					this.$anoLogin(true);
				}
			},
			upCardSum() {
				if(this.$store.state.login) {
					this.isUpCard=true;
				}
				else {
					this.$anoLogin(true);
				}
			},
			upIdPer() {  //上传身份证正面
				let that = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: ['album', 'camera'], //从相册选择
				    success: function (res) {
				        // console.log(JSON.stringify(res.tempFilePaths));
						that.idPer = res.tempFilePaths[0];
					}
				});
			},
			upIdCh() {  //上传身份证反面
				let that = this;
				uni.chooseImage({
				    count: 1, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有				   
				    sourceType: ['album', 'camera'],
					success: function (res) {
				        that.idCh = res.tempFilePaths[0];
				    }
				});
			},
			upIdSure() { //确认上传身份证
				if(this.idPer == '' || this.idCh == '') {
					this.isUpId = false;
				}
				else {
					let that = this;
					uni.uploadFile({  //修改正面照
						url: this.$store.state.url + 'common/' + this.$store.state.sessionId + '/uploadFile.json',
						filePath: this.idPer,
						name: 'file',
						formData: {
							remark: '身份证正面',
						},
						success: (uploadFileRes) => {
							let res = JSON.parse(uploadFileRes.data);
							let newId = res.collection[0];
							that.$listapi.upCard(that.$store.state.sessionId,that.idCard[0].imageId,newId).then(res=>{
								uni.redirectTo({
									url: '/pages/user/upCard'
								});
								this.isUpId = false;
							})
						},
						fail(err) {
							console.log(err);
						}
					});
					
					uni.uploadFile({  //修改反面照
						url: this.$store.state.url + 'common/' + this.$store.state.sessionId + '/uploadFile.json',
						filePath: this.idCh,
						name: 'file',
						formData: {
							remark: '身份证反面',
						},
						success: (uploadFileRes) => {
							let res = JSON.parse(uploadFileRes.data);
							let newId = res.collection[0];
							that.$listapi.upCard(that.$store.state.sessionId,that.idCard[1].imageId,newId).then(res=>{
								uni.redirectTo({
									url: '/pages/user/upCard'
								});
								this.isUpId = false;
							})
						},
						fail(err) {
							console.log(err);
						}
					});
				}
			},
			upCard() { //上传电工证
				let that = this;
				
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有				   
					sourceType: ['album', 'camera'],
					success: function(res) {
						that.card.push(res.tempFilePaths[0]);
					}
				});
			},
			moreCard() { //上传更多电工证
				let that = this;
				// if(this.cardName.length == 0 || this.card.length == 0) {
				// 	uni.showToast({
				// 		title: '请先完整输入信息',
				// 		icon: 'none',
				// 		duration: 1200
				// 	})
				// }
				// else {
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
				// }
			},
			upCardSure() { //确认上传电工证
				let that = this;
				if(this.cardName.length == 0 || this.card.length == 0) {
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none',
						duration: 1200
					})
				}
				else {
				
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
							
							if(that.cardId == [] || that.cardId == '' || that.cardId == null) {
								this.isUpCard = false;
							}
							else {
								let data = {};
								that.cardId.forEach(item=>{
									data = {
										imageId: item,
										orderIndex: 9999,
										type: 3
									}
									that.$listapi.addCard(that.$store.state.sessionId,data).then(res=>{
										// console.log(res);
									})
								})
								
								that.isUpCard = false;
								uni.redirectTo({
									url: '/pages/user/upCard'
								})
							}
						},
						fail(err) {
							console.log(err);
							
							that.isUpCard = false;
						}
					});
				}
				
			},
			
			aaaa(id,url,name) {  //点击修改电工证
				this.isUpCard2 = true;
				this.oldCardID = id;
				// this.card2 = url;  //显示图片
				this.upName = name;
			},
			
			upCard2() {  //上传要修改的电工证
				let that = this;
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有				   
					sourceType: ['album', 'camera'],
					success: function(res) {
						that.card2 = res.tempFilePaths[0];
					}
				});
			},
			upCardSure2() { //确认修改电工证
				let that = this;
				if(this.card2 == '' || this.upName == '') {
					this.isUpCard2 = false;
					uni.showToast({
						title: '请完整输入信息',
						icon: 'none',
						duration: 1200
					})
				}
				else {
					uni.uploadFile({
						url: this.$store.state.url + 'common/' + this.$store.state.sessionId + '/uploadFile.json',
						filePath: this.card2,
						name: 'file',
						formData: {
							remark: this.upName,
						},
						success: (uploadFileRes) => {
							let res = JSON.parse(uploadFileRes.data);
							let newId = res.collection[0];
							console.log(res);
							that.$listapi.upCard(that.$store.state.sessionId,that.oldCardID,newId).then(res=>{
								uni.redirectTo({
									url: '/pages/user/upCard'
								});
								this.isUpCard2 = false;
							})
							
						},
						fail(err) {
							console.log(err);
						}
					});
				}
			},
			
			// bigImgFun(card,index) { //查看图片大图
			// 	if(card == 'card') { //获取图片路径
			// 		this.bigImg = this.cardD[index].imageUrl;
			// 	}
			// 	else {
			// 		this.bigImg = this.idCard[index].imageUrl;
			// 	}
			// 	this.isBigImg = true;
			// },
			
			bigImgFun() { //预览附图
				let _this = this;
				let urls = [];
				_this.cardD.forEach(item=>{
					urls.push(item.imageUrl);
				})
				_this.idCard.forEach(item=>{
					urls.push(item.imageUrl);
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
			
			
			
			getCard() {
				let _this = this;
				this.$listapi.allCard(this.$store.state.sessionId).then(res=>{
					let cards = res.data.collection;
					cards.forEach(item=>{
						if(item.type == 3) {
							_this.cardD.push(item);
						}
						else {
							_this.idCard.push(item);
						}
					})
				})
			},
			delCard() { //删除电工证
				let _this = this;
				uni.showModal({
				    title: '提示',
				    content: '是否确认删除该电工证？',
				    success: function (res) {
				        if (res.confirm) {
							_this.$listapi.delCard(_this.$store.state.sessionId,_this.oldCardID).then(res=>{
								if(res.data.code == 'success') {
									uni.redirectTo({
										url: '/pages/user/upCard',
									});
									_this.isUpCard2 = false;
								}
								else {
									uni.showToast({
										title: '删除失败，请稍后再试',
										icon: 'none',
										duration: 1000
									})
								}
							})
						}
						else if (res.cancel) {
							  // console.log('用户点击取消');
						}
					}
				})
			}
		},
		components: {
			Nav
		},
		onLoad() {			
			this.$refs.son.a = '修改证件';  //修改navigatorBarText
			
			this.logo = this.$store.state.logo;
			this.$loading(false);
			let app = getApp();
			let _this = this;
			this.$loading(true);
			app.login(this).then(res=> {
				_this.getCard();
				setTimeout(function(){_this.$loading(false);},Math.random()*2000);
			})
			
			this.$over();
			
		}
	}
</script>

<style>
	.card-con {
		flex-wrap: wrap;
		padding: 0 20rpx;
	}
	.card-ti {
		margin-bottom: 20rpx;
	}
	.card-img {
		width: 248rpx;
		height: 168rpx;
		margin-bottom: 6rpx;
	}
	.card-img image,.idcard-img image {
		width: 100%;
		height: 100%;
	}
	.mb30 {
		margin-bottom: 26rpx;
	}
	.upcard-btn {
		width: 132rpx;
		padding: 3rpx 0;
		margin: 0 auto;
		border-radius: 99rpx;
		margin-top: 10rpx;
	}
	.big-btn {
		height: 80rpx;
		border-radius: 99rpx;
		letter-spacing: 4rpx;
		margin-top: 15rpx;
	}
	
	.idcard {
		margin-top: 40rpx;
	}
	.idcard-img {
		width: 307rpx;
		height: 210rpx;
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
		background: rgba(0,0,0,.5);
		z-index: 100;
		padding: 0;
	}
	.up-id-con {
		width: 566rpx;
		margin: 389rpx auto 0;
		text-align: center;
		padding-bottom: 20rpx;
	}
	.up-user-img {
		width: 95rpx;
		height: 95rpx;
		margin-top: -47.5rpx;
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
		height: 54rpx;
		line-height: 54rpx;
		border-radius: 100rpx;
		margin-top: 30rpx;
	}
	.unload-idcard button.ww {
		width: 184rpx;
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
	
	/* 查看大图 */
	movable-area {
		position: fixed;
		top: 300rpx;
		width: 90%;
		left: 5%;
	}
	movable-area movable-view, movable-area image {
		width: 100%;
	}
	
	.blank {
		width: 100%;
		height: 40rpx;
	}
</style>
