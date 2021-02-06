<template>
	<!-- 修改用户名 -->
	<view class="content">
		<!-- 导航 -->
		<Nav ref="son"></Nav>
		
		<!-- 小标签 -->
		<view class="re-tip w bg-white">
			<view class="re-tip-con w-con flex">
				<view class="re-tip-con-l"><image src="../../static/images/re_tip.png" mode=""></image></view>
				<view class="f24 c999">您本次的好评或建议，将会是对电工服务的肯定和帮助~动动你的小指头帮助他们做个评价，让他们做得更好!</view>
			</view>
		</view>
		<!-- 评价 -->
		<view class="re-con w-con bg-white mt20 border-r-20 pb20">
			<view class="re-con-h flex-cover">
				<view class="f26">您对本次服务满意吗？</view>
				<!-- <view class="f24 c999 flex-middle">
					<view>匿名提交</view>
					<view><radio @click="isCheck = !isCheck" :checked="isCheck" color="#31D8B6"></radio></view>
				</view> -->
			</view>
			<view class="re-con-c">
				<view class="flex mt20">
					<view><image class="photo circle" :src="em.wxPhoto" mode=""></image></view>
					<view class="ml20 mt20">
						<view class="f28">{{em.name}}</view>
						<view class="f22 c999 mt10">{{time}}完成订单</view>
					</view>
				</view>
				
				<!-- 评分 -->
				<view class="re-con-c-r">
					<view class="re-con-remark f26 flex-middle" v-for="(item,index) in rate" :key="index">
						<view>{{item.title}}</view>
						<view class="re-con-c-star">
							<uni-rate @change="remarkRate($event,index)" max="5" value="5" active-color="#F7D065" margin="14"></uni-rate>
						</view>
						<view class="ml20 f24">{{item.de}}</view>
					</view>
				</view>
				<view class="textarea border-r-20 pr">
					<textarea maxlength="-1" v-show="!isDis" v-model="con" class="border-r-20 f26" value="" placeholder="师傅服务态度好,推荐给大家!" placeholder-class="f26 c999" />
					<view class="ca pa border-r-20 hide" @click="camera()">
						<view v-if="!reImg">
							<view><image src="../../static/images/camera.png" mode=""></image></view>
							<view class="f22 c999">添加图片</view>
						</view>
						<view v-if="reImg"><image style="width:120rpx;height:120rpx;margin-top:0;" :src="reImg" mode=""></image></view>
					</view>
					<view class="tip c999 pa f22">本次评价可获得<text class="colorCon">{{grade}}</text>点积分</view>
				</view>
				
			</view>
			<view class="btn">
				<button class="white bg-con f26" @click="submit()">提交评价</button>
			</view>
		</view>
		
		<!-- 提交确认弹窗 -->
		<view class="submit-su txt-cen" v-if="isDis">
			<view class="submit-su-con bg-white border-r-20">
				<image class="circle hide bg-con" :src="logo" mode=""></image>
				<view class="f28">提示</view>
				<view class="f24">{{tip}}</view>
				<button @click="sureCancel()" class="white bg-con f28">确认</button>
			</view>
		</view>
		<loading></loading>
	</view>
</template>

<script>
	import Nav from '../../components/navigationBar.vue';
	import uniRate from '@/components/uni-rate/uni-rate.vue';  //评分组件
	export default {
		data() {
			return {
				logo: this.$store.state.logo,
				
				isCheck: false, //是否匿名
				
				img: '../../static/images/index_fun02.png', //头像
				name: '电工名字',
				time: '5月22日 19：00',
				
				grade: 0, //评价获得的积分
				
				rate: [  //评分
					{title: '准时上门',num: 5,de: '非常好'},
					{title: '服务态度',num: 5,de: '非常好'},
					{title: '技术能力',num: 5,de: '非常好'}
				],
				con: '',
				
				isDis: false , //提交确认弹窗是否显示
				
				id: '',
				emId: '',
				em: {},
				
				reImg: '',  //评价图片
				reImgId: '',  //图片
				tip: '',
					
			}
		},
		methods: {
			getGrade() {
				this.$listapi.getRemarkGrade(this.$store.state.sessionId).then(res => {
					this.grade = res.data.collection[0];
				})
			},
			remarkRate: function (e,index) { //点击星级评分
				//console.log((index+1)+':'+e.value); //第几项评分有多少颗星星
				this.rate[index].num = e.value; //修改data里数据num，可向后台传参
				switch(e.value) {  //动态改变星级评价
					case 1: this.rate[index].de = '很差';break;
					case 2: this.rate[index].de = '差';break;
					case 3: this.rate[index].de = '一般';break;
					case 4: this.rate[index].de = '好';break;
					case 5: this.rate[index].de = '非常好';break;
				}
				
			},
			getEm() {
				this.$listapi.emMsg(this.$store.state.sessionId,this.emId).then(res=>{
					this.em = res.data.collection[0];
				})
			},
			camera() {  //调取相机接口，上传图片
				let that = this;
				this.$listapi.upImg('评价图',this.$store.state.sessionId).then(res=>{
					
					that.reImg = res.img;
					that.reImgId = res.data.collection[0];
				})
			},
			submit() {
				let con = ''
				if(this.con == '' || this.con == null) {
					con = '该用户没有填写评价，默认好评。'
				}
				else {
					con = this.con;
				}
				let data = {
					"allSatisfied": this.rate[0].num,
					"attitude": this.rate[1].num,
					"electricianId": this.em.id,
					"imageList": [{
						imageId: this.reImgId,
						orderIndex: 9999999
					}],
					"remark": con,
					"skill": this.rate[2].num
				};
				this.$listapi.reBill(this.$store.state.sessionId,this.id,data).then(res=>{
					this.isDis = true;
					if(res.data.code == 'success') {
						this.tip = '感谢您的评价，您的评论对我们至关重要，祝您身体健康!';
					}
					else {
						this.tip = '评价失败，请稍后再试或留言反馈给我们。';
					}
					
				})
			},
			sureCancel() {  //提交弹窗
				
				
				this.isDis = false; //关闭弹窗
				uni.reLaunch({
					url: '/pages/bill/bill'
				})
			}
		},
		components: {
			Nav,
			uniRate
		},
		onLoad(options) {			
			this.$refs.son.a = '订单评价';  //修改navigatorBarText
			
			let app = getApp();
			this.$loading(false);
			this.$loading(true);
			app.login(this).then(res=>{
				this.id = options.id;
				this.emId = options.em;
				this.time = options.time.replace(/T/,' ');
				this.getEm();
				this.getGrade();
				this.$loading(false);
			})
			this.$over();
			
		}
	}
</script>

<style>
	/* 小标签 */
	.re-tip-con {
		line-height: 35rpx;
		padding: 18rpx 0;
	}
	.re-tip-con-l {
		margin-right: 15rpx;
	}
	.re-tip-con image {
		width: 37rpx;
		height: 37rpx;
	}
	
	/* 评价 */
	.re-con>view {
		width: 93%;
		margin: 0 auto;
	}
	.re-con-h {
		height: 57rpx;
		align-items: center;
		border-bottom: 1rpx solid #EBEBEB;
	}
	.re-con-h radio {
		transform:scale(0.5);
	}
	.re-con-c .photo {
		width: 101rpx;
		height: 101rpx;
	}
	.re-con-c-r {
		margin-top: 17rpx;
	}
	.re-con-remark {
		height: 66rpx;
	}
	.re-con-c-star {
		margin-top: 10rpx;
		margin-left: 30rpx;
	}
	.re-con-c .textarea {
		background: #F2F2F2;
		height: 320rpx;
		margin-top: 60rpx;
		z-index: 0;
	}
	.re-con-c textarea {
		padding: 10rpx 20rpx;
		height: 150rpx;
		width: 94%;
	}
	.re-con-c .textarea .tip {
		bottom: 20rpx;
		right: 20rpx;
	}
	.re-con-c .textarea .ca {
		width: 120rpx;
		height: 120rpx;
		border: 1rpx dotted #999;
		left: 20rpx;
		bottom: 20rpx;
		text-align: center;
	}
	.re-con-c .textarea .ca image {
		width: 40rpx;
		height: 30rpx;
		margin-top: 26rpx; 
	}
	
	.btn button {
		flex: 1;
		margin-right: 0;
		width: 193rpx;
		height: 56rpx;
		line-height: 56rpx;
		border-radius: 18rpx;
		margin-top: 80rpx;
	}
	
	/* 提交确认弹窗 */
	.submit-su {
		position: fixed;
		top: 0;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,.5);
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
		margin-top: 12rpx;
	}
	.submit-su-con button {
		height: 57rpx;
		line-height: 57rpx;
		border-radius: 52rpx;
		margin-top: 30rpx;
	}
</style>
