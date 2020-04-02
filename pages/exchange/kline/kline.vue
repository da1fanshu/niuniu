<template>
	<view class="content" style="background: #191d29;">
		<!-- #ifdef APP-PLUS -->
		<web-view v-if="show" style="height: 100%; background: #191d29;" :src="`/hybrid/html/echarts.html?type=${type}&money=${money}&title=${title}&coin=${coin}&symbol=${symbol}&app=1`"></web-view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<web-view v-if="show" style="height: 100%; background: #191d29;" :src="`/hybrid/html/echarts.html?type=${type}&money=${money}&title=${title}&coin=${coin}&symbol=${symbol}&app=0`"></web-view>
		<!-- #endif -->
		<!-- #ifdef H5 -->
		<view class="fixed_nav">
			<view class="btn buyTo" @click="buyPage" color="success">买入</view>
			<view class="btn sellTo" @click="sellPage" color="#fa5757">卖出</view>
			<view class="btn goback" @click="goBack" color="#424242">返回</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			type: '',
			money: '',
			coin: '',
			symbol: '',
			title: '',
			show: false
		};
	},
	computed: {
		...mapGetters(['COINRMB'])
	},
	methods: {
		goBack() {
			uni.navigateBack()
		},
		buyPage() {
			uni.setStorageSync('tradeType','BUY');
			uni.switchTab({
				url:'../../coin/coin'
			})
		},
		sellPage() {
			uni.setStorageSync('tradeType','SELL');
			uni.switchTab({
				url:'../../coin/coin'
			})
		}
	},
	onLoad(option) {
		if (option && option.type) {
			this.pairs = option.coin;
			this.title = option.title;
			this.coin = option.coin;
			this.symbol = option.symbol;
			this.symbolType = option.type;
			this.type = option.type;
			this.money =
				option.coin == 'USDT'
					? this.COINRMB.tether
					: option.coin == 'BTC'
					? this.COINRMB.bitcoin
					: option.coin == 'ETH'
					? this.COINRMB.ethereum
					: option.coin == 'DUSD'
					? this.COINRMB.digitalusd
					: 6.58;
			let title = this.type.split('_')[1] + '/' + this.type.split('_')[0];
			// #ifdef H5
			uni.setNavigationBarTitle({
				title: title
			});
			uni.showLoading({
				title: '加载中...'
			});
			// #endif
			setTimeout(() => {
				uni.hideLoading();
				this.show = true;
			}, 100);
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
