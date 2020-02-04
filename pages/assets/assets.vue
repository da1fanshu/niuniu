<template>
	<view class="content">
		<view class="assets_header">
			<text style="font-size: 40upx; font-weight: 700;">{{ filter.fix(USDT + power, 4) }} USDT</text>
			<text style="font-size: 27upx; color: #acaeb1;">≈￥{{ filter.fix((USDT + power) * COINRMB.tether, 2) }}</text>
		</view>
		<view class="account_select">
			<view class="account_select_nav">
				<view :class="type == 'coin' ? 'account_select_nav_active' : ''" @click="setType('coin')">币币账户</view>
				<view :class="type == 'game' ? 'account_select_nav_game' : ''" @click="setType('game')">比特算力账户</view>
			</view>
		</view>
		<view class="assets_list" v-show="type == 'coin'">
			<view class="assets_list_money" :style="{ background: type == 'coin' ? '#03bcc0' : type == 'game' ? '#00c0e9' : type == 'shop' ? '#eabb77' : '' }">
				<text style="font-size: 40upx; font-weight: 700;">{{ filter.fix(USDT, 4) }} USDT</text>
				<text style="font-size: 27upx; color: #fff;">≈￥{{ filter.fix(USDT * COINRMB.tether, 2) }}</text>
			</view>
			<view class="assets_detailed clear">
				<view class="fl" style="color: #fff; font-size: 23upx; font-weight: 700;">资产明细</view>
				<view class="fr" @click="isZero = !isZero">
					<view class="checkbox" :class="[type == 'coin' ? 'coin' : type == 'game' ? 'game' : type == 'shop' ? 'shop' : '', !isZero ? 'nobg' : '']">
						<uni-icon v-if="isZero" type="checkmarkempty" :color="'#fff'"></uni-icon>
					</view>
					<text style="color: #fff; float: left;margin-left: 28upx;">隐藏资产为0的币种</text>
				</view>
			</view>
			<view class="account_list_nav clear">
				<view class="fl">币种/估值</view>
				<view class="fr">可用/冻结</view>
			</view>
			<view class="list_main">
				<view class="list_main_item" v-for="(item, index) in list" :key="index">
					<view class="list_main_item_coin">
						<view class="clear coins">
							<view class="fl">
								<text style="float: left; ">{{ item.assetCode }}</text>
							</view>
							<text class="fr">可用：{{ filter.fix(item.amountAvailable, 6) }}</text>
						</view>
						<view class="clear" style="margin-top: 20upx;">
							<text class="fl" style="line-height: 30upx;">≈￥{{ filter.fix((item.amountAvailable + item.amountLock) * item.RMB, 2) }}</text>
							<text class="fr" style="line-height: 30upx; color: #fff;">冻结：{{ filter.fix(item.amountLock, 6) }}</text>
						</view>
					</view>
					<view class="list_main_item_fun" :class="typeClass">
						<view class="flex" @click="goPage(item, 'deposit')">
							<view class="fun_coin" :style="{ background: !item.isDeposit ? '#9da1a8' : '' }">
								<image src="/static/deposit.png" style="width: 17upx; height: 14upx;" mode=""></image>
							</view>
							<text>充币</text>
						</view>
						<view class="flex" @click="goPage(item, 'withdraw')">
							<view class="fun_coin" :style="{ background: !item.isWithdraw ? '#9da1a8' : '' }">
								<image src="/static/withdraw.png" style="width: 17upx; height: 14upx;" mode=""></image>
							</view>
							<text>提币</text>
						</view>
						<view class="flex" v-if="item.assetCode=='USDK'" @click="$goPage(`transfer/transfer`)">
							<view class="fun_coin"><image src="/static/transfer.png" style="width: 18upx; height: 14upx;" mode=""></image></view>
							<text>划转</text>
						</view>
						<view class="flex" v-if="item.assetCode!='USDK'">
							<view class="fun_coin" :style="{ background: '#9da1a8' }"><image src="/static/transfer.png" style="width: 18upx; height: 14upx;" mode=""></image></view>
							<text>划转</text>
						</view>
						<view class="flex" @click="$goPage(`record/record?type=${item.assetCode}`)">
							<view class="fun_coin"><image src="/static/history.png" style="width: 18upx; height: 17upx;" mode=""></image></view>
							<text>记录</text>
						</view>
					</view>
				</view>
			</view>
			<uni-load-more :status="loading ? 'loading' : 'noMore'"></uni-load-more>
		</view>
		<view class="assets_list" v-show="type == 'game'">
			<view class="assets_list_money" :style="{ background: type == 'coin' ? '#03bcc0' : type == 'game' ? '#00c0e9' : type == 'shop' ? '#eabb77' : '' }">
				<text style="font-size: 40upx; font-weight: 700;">{{ filter.fix(power, 4) }} USDT</text>
				<text style="font-size: 27upx; color: #fff;">≈￥{{ filter.fix(power * COINRMB.tether, 2) }}</text>
			</view>
			<view class="assets_detailed clear">
				<view class="fl" style="color: #fff; font-size: 23upx; font-weight: 700;">资产明细</view>
				<view class="fr" @click="isZeroTwo = !isZeroTwo">
					<view class="checkbox" :class="[type == 'game' ? 'game' : '', !isZeroTwo ? 'nobg' : '']">
						<uni-icon v-if="isZeroTwo" type="checkmarkempty" :color="'#fff'"></uni-icon>
					</view>
					<text style="color: #fff; float: left;margin-left: 28upx;">隐藏资产为0的币种</text>
				</view>
			</view>
			<view class="account_list_nav clear">
				<view class="fl">币种/估值</view>
				<view class="fr">可用/冻结</view>
			</view>
			<view class="list_main">
				<view class="list_main_item" v-for="(item, index) in powerList" :key="index">
					<view class="list_main_item_coin">
						<view class="clear coins">
							<view class="fl">
								<text style="float: left; ">{{ item.coin_name }}</text>
							</view>
							<text class="fr">可用：{{ filter.fix(item.available_total, 6) }}</text>
						</view>
						<view class="clear" style="margin-top: 20upx;">
							<text class="fl" style="line-height: 30upx;">≈￥{{ filter.fix((parseFloat(item.available_total) + parseFloat(item.frozen_total)) * item.RMB, 2) }}</text>
							<text class="fr" style="line-height: 30upx; color: #fff;">冻结：{{ filter.fix(item.frozen_total, 6) }}</text>
						</view>
					</view>
					<view class="list_main_item_fun" :class="typeClass">
							<view class="flex" v-if="item.coin_name=='USDK'" @click="$goPage(`transfer/transfer`)">
								<view class="fun_coin"><image src="/static/transfer.png" style="width: 18upx; height: 14upx;" mode=""></image></view>
								<text>划转</text>
							</view>
							<view class="flex" v-if="item.coin_name!='USDK'">
								<view class="fun_coin" :style="{ background: '#9da1a8' }"><image src="/static/transfer.png" style="width: 18upx; height: 14upx;" mode=""></image></view>
								<text>划转</text>
							</view>
							<view class="flex" @click="$goPage(`record/record?type=${item.coin_name}`)">
								<view class="fun_coin"><image src="/static/history.png" style="width: 18upx; height: 17upx;" mode=""></image></view>
								<text>记录</text>
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
import { uniIcon, uniLoadMore } from '@dcloudio/uni-ui';
import service from './service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import comSvc from '@/common/comSvc.js';
import { mapGetters } from 'vuex';
import api from '@/common/api.js';
export default {
	components: {
		uniIcon,
		HMmessages,
		uniLoadMore
	},
	data() {
		return {
			filter,
			coinImgUrl: api.coinImgUrl,
			type: 'coin',
			typeClass: 'type_coin',
			list: [],
			powerList: [],
			powerListCopy: [],
			mainList: [],
			isZero: false,
			isZeroTwo: false,
			USDT: 0,
			power: 0,
			loading: true
		};
	},
	computed: {
		...mapGetters(['COINRMB','USERINFO'])
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
		//设置颜色
		setColor(name) {
			switch (name) {
				case 'coin':
					return (this.typeClass = 'type_coin');
				case 'game':
					return (this.typeClass = 'type_game');
				case 'shop':
					return (this.typeClass = 'type_shop');
				default:
					return (this.typeClass = '');
			}
		},
		//切换账户
		setType(name) {
			this.type = name;
			// this.USDT = 0;
			//    if (name == 'coin') {
			//      this.getAssets();
			//    }
			// if (name == 'game') {
			//   this.assetDetail();
			// }
			this.setColor(this.type);
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
