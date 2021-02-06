<template>
	<!--  -->
    <view class="loading_box" v-show="is_loading" @click="switch_loading">
		<view class="con">
			<view class="img"><image src="../../static/images/loading.png" mode="widthFix"></image></view>
			<!-- <view class="txt">加载中……</view> -->
		</view>
    </view>
</template>

<script>
    export default {
        data() {
            return {
                
            };
        },
        methods:{
            switch_loading(){
                // this.$store.commit("switch_loading")
            }
        },
        //实测直接在标签属性里写  $store.state.XX  拿不到数据  所以这里通过 计算属性去监听一下
        computed:{
            is_loading(){
                return this.$store.state.loading
            }
        },
		onLoad() {
			console.log('a');
		}
    }
</script>

<style>
	.loading_box {
		position: fixed;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0,0,0,.3);
		text-align: center;
		z-index: 9999999;
	}
	.loading_box .con {
		position: relative;
		width: 22%;
		height: 192rpx;
		margin-top: 516rpx;
		left: 39%;
		background: white;
		border-radius: 30rpx;
		text-align: center;
	}
	.loading_box .img {
		/* position: absolute; */
	/* 	width: 200rpx;
		height: 200rpx; */
		border-radius: 30rpx;
		/* top: -50rpx; */
		/* overflow: hidden; */
	}
	.loading_box .img image {
		width: 100rpx;
		height: auto;
		margin-top: 43rpx;
	}
	.loading_box .txt {
		position: absolute;
		bottom: 30rpx;
		color: #999;
		left: 50%;
		font-size: 30rpx;
		transform: translateX(-50%);
		background: white;
		padding-top: 16rpx;
	}
</style>