<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="index_header">
			<image class="i_h_logo" src="/static/index/logo.png" mode=""></image>
			<text>资产</text>
		</view>
		<view class="exchange_header">
			<view class="b_list" v-for="(item,index) in typeList" :key="index" :class="type == item.account ? 'active' : ''" @click="setType(item.account,index)">{{item.name}}</view>
		</view>
		<view class="assets_header">
			<view class="top">
				<text>{{typeList[inde].name}}</text>
				<image v-if="open" @click="open=false" src="../../static/open.png" mode=""></image>
				<image v-if="!open" @click="open=true" src="../../static/close.png" mode=""></image>
			</view>
			<view class="title">总资产折合（USDT）</view>
			<text v-if="open" class="my">{{ filter.fix(USDT + power, 4) }} USDT</text>
			<text v-if="open" class="rmb">≈￥{{ filter.fix((USDT + power) * COINRMB.tether, 2) }}</text>
			<text v-if="!open" class="my">****</text>
			<text v-if="!open" class="rmb">≈￥****</text>
		</view>
		<view class="list_main_item_fun">
			<view class="flex" @click="$goPage(`deposit/deposit`)">
				<image style="width: 56rpx;height: 44rpx;" src="../../static/index/i1.png"></image>
				<text>充值</text>
			</view>
			<view class="flex" @click="$goPage(`withdraw/withdraw`)">
				<image style="width: 56rpx;height: 44rpx;" src="../../static/index/i2.png"></image>
				<text>提币</text>
			</view>
			<view class="flex" @click="$goPage(`transfer/transfer`)">
				<image style="width: 48rpx;height: 44rpx;" src="/static/transfer.png" mode=""></image>
				<text>划转</text>
			</view>
			<view class="flex" @click="$goPage(`assetsRecord/assetsRecord`)">
				<image style="width: 44rpx;height: 44rpx;" src="/static/history.png" mode=""></image>
				<text>记录</text>
			</view>
		</view>
		<view class="assets_list" v-show="type == 'coin'">
			<view class="assets_detailed">
				<view class="search">
					<image src="../../static/search.png" mode=""></image>
					<input v-model="sCoin" placeholder-class="pla" type="text" placeholder="搜索币种" />
				</view>
				<view class="fr" @click="isZero = !isZero">
					<view class="checkbox" :class="[type == 'coin' ? 'coin' : type == 'game' ? 'game' : type == 'shop' ? 'shop' : '', !isZero ? 'nobg' : '']">
						<uni-icons v-if="isZero" type="checkmarkempty" :color="'#fff'"></uni-icons>
					</view>
					<text style="color:#C5CFD5;font-size: 24rpx; float: left;margin-left: 8upx;">隐藏资产为0的币种</text>
				</view>
			</view>
			<view class="w_bg">
				<view class="list_main">
					<view class="list_main_item">
						<view class="list_main_item_coin" v-for="(item, index) in list" :key="index" v-if="item.assetCode.indexOf(sCoin) > -1">
							<view class="b_title">
								{{ item.assetCode }}
							</view>
							<view class="top">
								<text style="width: 200rpx;">可用</text>
								<text style="width: 200rpx;">冻结</text>
								<text style="width: 180rpx;">折合(CNY)</text>
							</view>
							<view class="block">
								<text style="width: 200rpx;">{{ filter.fix(item.amountAvailable, 6) }}</text>
								<text style="width: 200rpx;">{{ filter.fix(item.amountLock, 6) }}</text>
								<text style="width: 180rpx;">{{ filter.fix(item.amountLock, 6) }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loading ? 'loading' : 'noMore'"></uni-load-more>
		</view>
		<view class="assets_list" v-show="type == 'game'">
			<!-- <view class="assets_list_money" :style="{ background: type == 'coin' ? '#03bcc0' : type == 'game' ? '#00c0e9' : type == 'shop' ? '#eabb77' : '' }">
				<text style="font-size: 40upx; font-weight: 700;">{{ filter.fix(power, 4) }} USDT</text>
				<text style="font-size: 27upx; color: #fff;">≈￥{{ filter.fix(power * COINRMB.tether, 2) }}</text>
			</view> -->
			<view class="assets_detailed clear">
				<view class="fr" @click="isZeroTwo = !isZeroTwo">
					<view class="checkbox" :class="[type == 'game' ? 'game' : '', !isZeroTwo ? 'nobg' : '']">
						<uni-icons v-if="isZeroTwo" type="checkmarkempty" :color="'#fff'"></uni-icons>
					</view>
					<text style="color: #A4A4A4; float: left;margin-left: 28upx;">隐藏资产为0的币种</text>
				</view>
			</view>
			<view class="w_bg">
				<view class="account_list_nav">
					<text>币种</text>
					<text>可用</text>
					<text>冻结</text>
					<text>锁仓</text>
				</view>
				<view class="list_main">
					<view class="list_main_item" v-for="(item, index) in powerList" :key="index">
						<view class="list_main_item_coin">
							<text>{{ item.coin_name }}</text>
							<text>{{ filter.fix(item.available_total, 6) }}</text>
							<!-- <text class="fl" style="line-height: 30upx;">≈￥{{ filter.fix((item.amountAvailable + item.amountLock) * item.RMB, 2) }}</text> -->
							<text>{{ filter.fix(item.frozen_total, 6) }}</text>
							<text>{{ filter.fix(item.frozen_total, 6) }}</text>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loading ? 'loading' : 'noMore'"></uni-load-more>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import filter from '@/common/filter.js';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import service from './service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import comSvc from '@/common/comSvc.js';
import { mapGetters } from 'vuex';
import api from '@/common/api.js';
export default {
	components: {
		uniIcons,
		HMmessages,
		uniLoadMore
	},
	data() {
		return {
			filter,
			coinImgUrl: api.coinImgUrl,
			type: 'coin',
			typeClass: 'type_coin',
			sCoin: '',
			typeList: [
				{
					account: 'coin',
					name: '币币账户'
				},
				{
					account: 'currency',
					name: '法币账户'
				},
				{
					account: 'power',
					name: '算力账户'
				},
			],
			list: [],
			powerList: [],
			powerListCopy: [],
			mainList: [],
			isZero: false,
			isZeroTwo: false,
			USDT: 0,
			power: 0,
			loading: true,
			open: true,
			inde: 0,
		};
	},
	computed: {
		...mapGetters(['COINRMB', 'USERINFO'])
	},
	onShow() {
		if (this.$api.isLogin()) {
			this.getAssets();
			this.assetDetail();
			return false;
		}
		this.$api.goLogin('../login/login');
	},
	onNavigationBarButtonTap() {
		uni.navigateTo({
			url: 'allAssets/allAssets'
		});
	},
	watch: {
		isZero(val) {
			if (val) {
				this.list = [];
				for (let i of this.mainList) {
					if (i.amountAvailable * 1 > 0 || i.amountLock * 1 > 0) {
						this.list.push(i);
					}
				}
			} else {
				this.list = this.mainList;
			}
		},
		isZeroTwo(val) {
			if (val) {
				this.powerList = [];
				for (let i of this.powerListCopy) {
					if (i.available_total * 1 > 0 || i.frozen_total * 1 > 0) {
						this.powerList.push(i);
					}
				}
			} else {
				this.powerList = this.powerListCopy;
			}
		}
	},
	methods: {
		getAssets() {
			this.loading = true;
			Promise.all([comSvc.getAssets(), service.depositList(), service.withdrawList(), comSvc.getTrade()])
				.then(data => {
					this.loading = false;
					if (data[0].data.code != '100200') {
						this.errors(data[0].data.msg);
						return false;
					}
					let off = false;
					if (data[1].data.code != '100200') {
						this.errors('获取可充值列表失败');
						off = true;
					}
					if (data[2].data.code != '100200') {
						this.errors('获取可提现列表失败');
						off = true;
					}

					let array = data[0].data.data;
					let USDTNum = 0;
					for (let i of array) {
						i.isDeposit = false;
						i.isWithdraw = false;
						i.USDT = 0;
						i.RMB = 0;
						if (!off) {
							if (data[1].data.data.includes(i.assetCode)) {
								i.isDeposit = true;
							}
							if (data[2].data.data.includes(i.assetCode)) {
								i.isWithdraw = true;
							}
						}
						if (data[3].data[`USDT_${i.assetCode}`]) {
							i.USDT = data[3].data[`USDT_${i.assetCode}`].newPrice || 0;
						} else if (i.assetCode == 'USDT') {
							i.USDT = 1;
						} else if (i.assetCode == 'UDC') {
							i.USDT = 1;
						} else if (i.assetCode == 'DUSD') {
							i.USDT = 1;
						} else if (data[3].data[`UDC_${i.assetCode}`]) {
							i.USDT = data[3].data[`UDC_${i.assetCode}`].newPrice || 0;
						} else if (data[3].data[`DUSD_${i.assetCode}`]) {
							i.USDT = data[3].data[`DUSD_${i.assetCode}`].newPrice || 0;
						} else if (data[3].data[`DUSK_${i.assetCode}`]) {
							i.USDT = data[3].data[`DUSK_${i.assetCode}`].newPrice || 0;
						} else if (data[3].data[`USDK_${i.assetCode}`]) {
							i.USDT = data[3].data[`USDK_${i.assetCode}`].newPrice || 0;
						} else {
							i.USDT = 1;
						}
						i.USDT = filter.fix(i.USDT, 6);
						if (i.assetCode == 'UDC' || data[3].data[`UDC_${i.assetCode}`]) {
							i.RMB = 6.58 * i.USDT;
						} else if (i.assetCode == 'DUSD' || data[3].data[`DUSD_${i.assetCode}`]) {
							i.RMB = this.COINRMB.digitalusd * i.USDT;
						} else {
							i.RMB = this.COINRMB.tether * i.USDT;
						}
						i.RMB = filter.fix(i.RMB, 6);
						let sum = filter.fix(filter.fix((i.amountAvailable + i.amountLock) * i.RMB, 2) / this.COINRMB.tether, 6);
						USDTNum += sum * 1;
					}
					this.USDT = USDTNum;
					this.list = array;
					this.mainList = array;
					if (this.isZero) {
						this.list = [];
						for (let i of this.mainList) {
							if (i.amountAvailable * 1 > 0 || i.amountLock * 1 > 0) {
								this.list.push(i);
							}
						}
					} else {
						this.list = this.mainList;
					}

					this.list = this.list.sort((a, b) => {
						return a.assetCode[0].charCodeAt(0) - b.assetCode[0].charCodeAt(0);
					});
				})
				.catch(() => {
					this.loading = false;
				});
		},
		assetDetail() {
			service.assetDetail().then(({ data }) => {
				this.aloading = false;
				if (data.code == '100200') {
					this.powerList = data.data;
					this.powerListCopy = data.data;
					let USDTNum = 0;
					for (let i of this.list) {
						for (let j of this.powerList) {
							if (i.assetCode == j.coin_name) {
								j.USDT = i.USDT;
								j.RMB = i.RMB;
								let sum = filter.fix(filter.fix(parseFloat(j.total) * j.RMB, 2) / this.COINRMB.tether, 6);
								USDTNum += sum * 1;
							}
						}
					}
					this.power = USDTNum;
				} else {
					this.errors(data.msg);
				}
			});
		},
		//是否要权限前往充值或者提现
		goPage(item, type) {
			if (type == 'deposit') {
				if (item.isDeposit) {
					this.$goPage(`deposit/deposit?type=${item.assetCode}`);
				}
			} else {
				if (item.isWithdraw) {
					this.$goPage(`withdraw/withdraw?type=${item.assetCode}`);
				}
			}
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		toastto() {
			uni.showToast({
				icon: 'none',
				title: '暂未开放',
				position: 'bottom'
			});
		},
		//切换账户
		setType(name,index) {
			this.type = name;
			this.inde = index;
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
