<template>
	<view class="content index">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="Modal_mask" v-if="isCoin" @click.stop="closes"></view>
		<view class="index_header">
			<image class="i_h_logo" src="/static/index/logo.png" mode=""></image>
			<image @click="isCenter = true" class="i_h_login" src="../../static/index/user.png" mode=""></image>
		</view>
		<view class="index_banner">
			<swiper style="height: 307upx;" :autoplay="true" :circular="true" :interval="5000" :duration="1000">
				<swiper-item v-for="(item, index) in IMGLIST" :key="index">
					<view class="swiper-item"><image :lazy-load="true" :src="item.imageAddress" style="width: 100%; height: 307upx;" mode=""></image></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><image :lazy-load="true" src="/static/banner1.gif" style="width: 100%; height: 307upx;" mode=""></image></view>
				</swiper-item>
				<swiper-item v-if="!IMGLIST[0]"><uni-load-more color="#fff" status="loading"></uni-load-more></swiper-item>
			</swiper>
		</view>
		<view class="index_fun">
			<view class="f_m_item">
				<!-- @click="goPage('newInfo/newInfo')" -->
				<view class="i_flex i1" @click="$goPage('../assets/deposit/deposit')">
					<image src="/static/index/i1.png" mode=""></image>
					<text>充币</text>
				</view>
				<view class="i_flex i2" @click="$goPage('../assets/withdraw/withdraw')">
					<image src="/static/index/i2.png" mode=""></image>
					<text>提币</text>
				</view>
				<view class="i_flex i3" @click="$goPage('../c2c/c2c')">
					<image src="/static/index/i3.png" mode=""></image>
					<text>法币</text>
				</view>
				<view class="i_flex i4">
					<image src="/static/index/i4.png" mode=""></image>
					<text>矿池</text>
				</view>
				<view class="i_flex i5" @click="$goPage('newNotice/newNotice')">
					<image src="/static/index/i5.png" mode=""></image>
					<text>公告</text>
				</view>
			</view>
		</view>
		<view class="g_line"></view>
		<view class="buy">
			<view class="title" style="font-weight: bold;">快捷买币</view>
			<view class="cen">
				<text>
					<text class="s_word">参考价：</text>
					<text class="blue">¥62999.29 CNY/BTC</text>
				</text>
				<view class="rr">
					<image src="../../static/index/order.png" mode=""></image>
					<text>订单</text>
				</view>
			</view>
			<view class="btm">
				<view class="sel" @click="showSel">
					<view class="left">
						<image src="../../static/index/BTC.png" mode=""></image>
						<text style="#3D465D">{{ coin }}</text>
					</view>
					<view class="right" v-if="isCoin"><uni-icons type="arrowup" :color="'#03bcc0'" size="18"></uni-icons></view>
					<view class="right" v-if="!isCoin"><uni-icons type="arrowdown" :color="'#03bcc0'" size="18"></uni-icons></view>
				</view>
				<!-- 选择币种 -->
				<view class="selList" v-if="isCoin">
					<view class="block" v-for="(item, index) in coinList" :key="index" @click="selCoin(item)">
						<image src="../../static/index/BTC.png" mode=""></image>
						<text>{{ item }}</text>
					</view>
				</view>
				<view class="b_btn">
					<image src="../../static/index/light.png" mode="aspectFit"></image>
					<text>购买</text>
				</view>
			</view>
		</view>
		<view class="g_line"></view>
		<view class="q_title">行情</view>
		<view class="q_list">
			<view class="q_block" v-for="(item, index) in list" :key="index" v-if="item.SHOWSTATUS && item.status != 'INIT'" @click="goSwitch('../coin/coin',item.symbol,item.title,item.assetCode1,item.assetCode2,item.PRICEPRECISION,item.AMOUNTPRECISION)">
				<view class="unit" style="min-width: 300rpx;">
					<view class="">
						<text style="font-weight: bold;">{{ item.assetCode2 }}/</text>
						<text style="color: #8A9EAB;font-weight: bold;">{{ item.assetCode1 }}</text>
					</view>
					<view class="ss_word">24H量：{{ filter.fix(item.trade ? item.trade['24Total'] : 0, item.AMOUNTPRECISION) | lockNum }}</view>
				</view>
				<view class="unit"  style="width: 240rpx;">
					<view v-if="tether" class="s_num">{{ filter.fix(item.trade ? item.trade.newPrice : 0, item.PRICEPRECISION) }}</view>
					<view class="s_word">
						￥{{
							filter.fix(
								(item.trade ? item.trade.newPrice : 0) *
									(item.assetCode1 == 'USDT'
										? tether
										: item.assetCode1 == 'BTC'
										? bitcoin
										: item.assetCode1 == 'ETH'
										? ethereum
										: item.assetCode1 == 'DUSD'
										? digitalusd
										: 6.58),
								item.PRICEPRECISION
							)
						}}
					</view>
				</view>
				<view class="rise" :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">
					{{ item.trade ? item.trade.changeRatio : 0 }}%
				</view>
			</view>
			<view class="q_block" v-for="(item, index) in list" :key="index" v-if="item.SHOWSTATUS && item.status === 'INIT'" @click="goSwitch('../coin/coin',item.symbol,item.title,item.assetCode1,item.assetCode2,item.PRICEPRECISION,item.AMOUNTPRECISION)">
				<view class="unit"  style="min-width: 300rpx;">
					<view class="">
						<text style="font-weight: bold;">{{ item.assetCode2 }}/</text>
						<text style="color: #8A9EAB;font-weight: bold;">{{ item.assetCode1 }}</text>
					</view>
					<view class="ss_word">24H量：--</view>
				</view>
				<view class="unit" style="width: 240rpx;">
					<view v-if="tether" class="s_num">--</view>
					<view class="s_word">￥--</view>
				</view>
				<view class="rise" :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">
					--%
				</view>
			</view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
		<!-- #ifdef H5 -->
		<view class="down_app clear" v-if="$store.state.closeDown == false">
			<text class="fl" @click="$goPage('/pages/downloadApp/downloadApp')">前往下载APP</text>
			<uni-icons @click="closeDown()" class="fr" type="closeempty" color="#fff" size="30"></uni-icons>
		</view>
		<!-- #endif -->
		<!-- 个人中心 -->
		<!-- 遮罩 -->
		<uni-transition :mode-class="['fade']" :styles="maskClass" :show="isCenter" @click="onTap" />
		<uni-transition :duration="500" :mode-class="modeClass" :styles="transfromClass" :show="isCenter" @change="change">
			<Center></Center>
		</uni-transition>
	</view>
</template>

<script>
import service from './service.js';
import comSvc from '@/common/comSvc.js';
import filter from '@/common/filter.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import yomolUpgrade from '@/components/yomol-upgrade/yomol-upgrade.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import Center from '@/components/cen-modal/index.vue';
import uniTransition from "@/components/uni-transition/uni-transition.vue"
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		HMmessages,
		uniLoadMore,
		yomolUpgrade,
		uniIcons,
		Center,
		uniTransition
	},
	data() {
		return {
			isLogin: false,
			pageNo: 1,
			filter,
			pageSize: 10,
			list: [],
			loading: true,
			noData: false,
			mainList: [],
			tradeList: [],
			configList: [],
			userStart: [],
			Time: null,
			tether: 0,
			bitcoin: 0,
			ethereum: 0,
			digitalusd: 0,
			tokens: uni.getStorageSync('TOKEN'),
			upgradeType: 'pkg', //pkg 整包 wgt 升级包
			upgradeContent: '', //更新内容
			upgradeUrl: 'http://nnex.io//download/lkex.apk', //更新地址
			noticeList: [],
			pairs: 'USDK',
			cexchange: [{ name: 'USDK' }, { name: 'LKB' }, { name: 'USDT' }],
			coin: 'BTC',
			coinList: ['BTC', 'USDT'],
			isCoin: false,
			isCenter: false,
			modeClass: ['slide-right'],
			maskClass: {
				'position': 'fixed',
				'bottom': 0,
				'top': 0,
				'left': 0,
				'right': 0,
				'z-index': '9998',
				'background-color': 'rgba(0, 0, 0, 0.4)'
			},
			transfromClass: {
				'position': 'fixed',
				'z-index': '9999',
				'bottom': 0,
				'top': 0,
				'width':'440upx',
				'right': 0,
				/* #ifndef APP-NVUE */
				'display': 'flex',
				/* #endif */
				'justify-content': 'center',
				'align-items': 'center'
			}
		};
	},
	computed: {
			...mapGetters(['IMGLIST', 'APPVERSION', 'USERINFO'])
		},
		watch: {
			pairs(val) {
				this.list = this.formatTrade(this.formatData(this.mainList));
			},
			'$store.state.appVersion'(val) {
				// #ifdef APP-PLUS
				if (this.APPVERSION.renew && this.APPVERSION.renew.version && this.APPVERSION.old.version != this.APPVERSION.renew.version) {
					this.upgradeContent = this.APPVERSION.renew.message;
					setTimeout(() => {
						this.$refs.yomolUpgrade.show();
					}, 500);
				}
				// #endif
			}
		},
		mounted() {
			this.getNewList();
			this.getAppId();
			this.getNoticeList();
		},
		onLoad(option) {
			if (option && option.html) {
				uni.navigateTo({
					url: `../activation/activation?id=${option.userPreRegistrationId}&code=${option.randomCode}`
				});
			} else if (option.type == 'red') {
				uni.navigateTo({
					url: `/pages/luckDraw/luckDraw?redCode=${option.redCode}`
				});
			}
		},
		onUnload() {
			clearTimeout(this.Time);
			this.$store.commit('setIsExchange', false);
		},
		onHide() {
			clearTimeout(this.Time);
			this.$store.commit('setIsExchange', false);
		},
		onShow() {
			//动画
			// 初始化一个动画
			var animation = uni.createAnimation({
				duration: 3000,
				timingFunction: 'ease'
			});
			this.animation = animation;
			let token = uni.getStorageSync('TOKEN');
			if (token) {
				this.isLogin = true;
			} else {
				this.isLogin = false;
			}
			this.$store.commit('setIsExchange', true);
			this.userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : [];
			this.loading = true;
			Promise.all([service.getConfigSymbolRank(), comSvc.getTrade(), service.symbolConfigList()])
				.then(data => {
					this.loading = false;
					if (data[0].data.code == '100200') {
						this.mainList = data[0].data.data;
						this.tradeList = data[1].data;
						this.configList = data[2].data.data;
						let innerObj;
						for (let key in this.mainList) {
							for (let i = 0; i < this.configList.length; i++) {
								innerObj = this.configList[i];
								if (this.mainList[key].symbol === innerObj.symbol) {
									this.mainList[key][innerObj.profileKey] = innerObj.profileValue;
								}
							}
						}
						this.list = this.formatTrade(this.formatData(this.mainList));
						this.loopPan();
					} else {
						this.errors(data[0].data.msg);
					}
				})
				.catch(err => {
					this.loading = false;
				});
			service.getUSDT().then(({ data }) => {
				if (data.code == '100200') {
					let regEx = /[^\d|^\.|^\-]/g;
					for (let i in data.data) {
						data.data[i] = data.data[i].replace(regEx, '') * 1;
					}
					this.tether = data.data.tether;
					this.bitcoin = data.data.bitcoin;
					this.ethereum = data.data.ethereum;
					this.digitalusd = data.data.digitalusd;
				}
			});
		},
		filters: {
			lockNum(value) {
				if (value >= 10000) {
					value = Math.round((value / 10000) * 100) / 100 + 'w';
				} else {
					value = value;
				}
				return value;
			}
		},
		methods: {
			closeDown() {
				this.$store.commit('setCloseDown', true);
			},
			showSel() {
				this.isCoin = true;
			},
			//快捷购买
			purchase() {
				uni.showToast({
					title:'暂未开放',
					icon:'none'
				})
			},
			goSwitch(url,type,title,coin,symbol,PRICEPRECISION,AMOUNTPRECISION) {
				uni.switchTab({
					url:url
				})
				uni.setStorageSync('symbol',type);
				uni.setStorageSync('title', title);
				uni.setStorageSync('coin', coin);
				uni.setStorageSync('type', symbol);
				uni.setStorageSync('PRICEPRECISION', PRICEPRECISION);
				uni.setStorageSync('AMOUNTPRECISION', AMOUNTPRECISION);
				
			},
			onTap() {
				this.isCenter = false;
			},
			change(e) {
				
			},
			closes() {
				this.isCoin = false;
			},
			selCoin(name) {
				this.coin = name;
				this.isCoin = false;
			},
			closeModal() {
				this.isCenter = false;
			},
			getQueryString(name) {
				var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
				var r = window.location.search.substr(1).match(reg);
				if (r != null) return unescape(r[2]);
				return null;
			},
			//获取公告前5滚动
			getNoticeList() {
				service
					.getNewList({
						type: 'NOTICE',
						pageNo: 1,
						pageSize: 5
					})
					.then(({ data }) => {
						if (data.code == '100200') {
							this.noticeList = data.data.records;
						} else {
							this.errors(data.msg);
						}
					});
			},
			getCloudInfo() {
				service.getCloudInfo().then(({ data }) => {
					if (data.code == '100200') {
						window.location.href = `http://pool.kakoex.com/#/?uid=${data.data.uid}&token=${data.data.token}&tokens=${this.tokens}&status=${this.$store.state.closeDown}`;
					} else {
						this.errors(data.msg);
					}
				});
			},
			...mapActions(['getAppId']),
			//判断是否登录
			isLogins() {
				if (this.$api.isLogin()) {
					this.$goPage('activity/activityMain/activityMain');
					return false;
				}
				this.$api.goLogin('../login/login');
			},
	
			isPower() {
				if (this.$api.isLogin()) {
					// #ifdef APP-PLUS
					this.$goPage(`power/power?tokens=${this.tokens}`);
					//#endif
					//#ifdef H5
					this.getCloudInfo();
					//#endif
					return false;
				}
				this.$api.goLogin('../login/login');
			},
			//尚未开启
			noOpen() {
				uni.showToast({
					icon: 'none',
					title: '敬请期待',
					position: 'bottom'
				});
			},
			//获取公告资讯
			getNewList() {
				this.loading = true;
				service
					.getNewList({
						type: 'ALL',
						pageNo: 1,
						pageSize: 5
					})
					.then(({ data }) => {
						this.loading = false;
						if (data.code == '100200') {
							this.list = this.list.concat(data.data.records);
							if (data.data.pages == 1 || data.data.pages == 0) {
								this.noData = true;
								return false;
							}
							if (this.pageNo >= data.data.pages) {
								this.noData = true;
							} else {
								this.noData = false;
							}
						} else {
							this.pageNo--;
							this.errors(data.msg);
						}
					});
			},
			//加载更多
			load() {
				if (this.loading) {
					return false;
				}
				if (this.noData) {
					return false;
				}
				this.pageNo++;
				this.loading = true;
				this.getNewList();
			},
			//错误提示
			errors(text) {
				this.HMmessages.show(text, {
					textAlign: 'center',
					background: '#74272d',
					fontColor: '#fff'
				});
			},
			//轮训盘
			loopPan() {
				if (!this.EXCHANGE) {
					clearTimeout(this.Time);
					return false;
				}
				comSvc.getTrade().then(({ data }) => {
					this.tradeList = data;
					this.Time = setTimeout(() => {
						this.loopPan();
					}, 1000);
					this.list = this.formatTrade(this.formatData(this.mainList));
				});
			},
			//自选交易对
			startSymbol(coin) {
				let userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : null;
				if (userStart) {
					if (userStart.includes(coin)) {
						Array.prototype.indexOfs = function(val) {
							for (var i = 0; i < this.length; i++) {
								if (this[i] == val) return i;
							}
							return -1;
						};
						Array.prototype.remove = function(val) {
							var index = this.indexOfs(val);
							if (index > -1) {
								this.splice(index, 1);
							}
						};
						userStart.remove(coin);
						uni.setStorageSync('userStart', JSON.stringify(userStart));
					} else {
						userStart.push(coin);
						uni.setStorageSync('userStart', JSON.stringify(userStart));
					}
				} else {
					uni.setStorageSync('userStart', JSON.stringify([coin]));
				}
				this.userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : [];
			},
			//设置交易币种
			setType(name) {
				this.pairs = name;
			},
			//格式化币种交易数据
			formatTrade(data) {
				data.map((e, index) => {
					for (let i in this.tradeList) {
						if (e.symbol == i) {
							e.trade = this.tradeList[i];
							let pr_ne = this.tradeList[i].newPrice ? this.tradeList[i]['newPrice'] * 1 : 0; // 最新價
							let pr_op = this.tradeList[i].newPrice ? this.tradeList[i]['24Price'] * 1 : 0; // 開盤價
							// 漲跌幅
	
							let distance = pr_ne - pr_op;
							let symbol = '';
							if (distance < 0) {
								symbol = '-';
							} else if (distance > 0) {
								symbol = '+';
							}
							if ((this.tradeList[i].newPrice ? this.tradeList[i]['24Price'] * 1 : 0) == 0) {
								e.trade.changeRatio = filter.floorFix(0, 2);
							} else {
								e.trade.changeRatio = symbol + filter.floorFix((filter.abs(distance) / pr_op) * 100, 2);
							}
							e.trade.changeRatioNum = parseFloat(e.trade.newPrice ? e.trade.changeRatio : 0);
						}
					}
				});
				return data;
			},
			//格式化数据
			formatData(data) {
				let arr = [];
				data.map((e, i) => {
					if (this.pairs == 'optional') {
						if (this.userStart.includes(e.symbol) && e.status !== 'DELISTED') {
							arr.push(e);
						}
					} else if (e.status !== 'DELISTED') {
						arr.push(e);
					}
				});
				return arr;
			}
		}
	};
</script>

<style lang="scss">
@import './style.scss';
</style>
