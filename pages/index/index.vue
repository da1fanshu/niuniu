<template>
	<view class="content index">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="index_header" v-if="isLogin == false">
			<view class="i_h_logo"><image src="/static/logo.png" style="width: 80upx; height: 80upx;margin-left: 14upx;" mode=""></image></view>
			<view class="i_h_login">
				<view @click="$goPage('../login/login')">登录/注册</view>
				<!-- <image src="/static/cn.jpg" style="width: 75upx; height: 50upx;margin-top: 2upx; margin-left: 20upx;" mode=""></image> -->
			</view>
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
			<view class="banner_hot">
				<view class="b_h_left"><image src="/static/notice.png" style="width: 34upx; height: 26upx ;" mode=""></image></view>
				<view class="b_h_list">
					<swiper style="height: 44upx;" :autoplay="true" :circular="true" :vertical="true" :interval="3000" :duration="1000">
						<swiper-item v-for="(item, index) in noticeList" :key="index" @click="$goPage('newInfo/newDetails/newDetails?id=' + item.id)">
							<view class="swiper-item">{{ item.title }}</view>
						</swiper-item>
					</swiper>
				</view>
			</view>
		</view>
		<view class="index_fun">
			<view class="fun_mian">
				<view class="f_m_item">
					<!-- @click="goPage('newInfo/newInfo')" -->
					<view class="i_flex" @click="$goPage('newInfo/newInfo')">
						<image src="/static/huodong.png" mode=""></image>
						<text>最新活动</text>
					</view>
					<view class="i_flex" @click="$goPage('newNotice/newNotice')">
						<image src="/static/zixun.png" mode=""></image>
						<text>公告资讯</text>
					</view>
					<view class="i_flex" @click="isLogins()">
						<image src="/static/shouyi.png" mode=""></image>
						<text>早起打鸟</text>
					</view>
					<view class="i_flex" @click="isPower()">
						<image src="/static/power.png" mode=""></image>
						<text>比特算力</text>
					</view>
				</view>
			</view>
		</view>
		<view class="index_ban" @click="isPower()"><image src="/static/banner.png" mode=""></image></view>
		<!-- <view class="index_news">
			<view class="uni-timeline">
				<view class="index_title">最新活动/资讯</view>
				<block v-for="(item, index) in list" :key="index">
					<view
						class="uni-timeline-item"
						:class="[index == 0 ? 'uni-timeline-first-item' : '', index == list.length - 1 ? 'uni-timeline-last-item' : '']"
						@click="$goPage('newInfo/newDetails/newDetails?id=' + item.id)"
					>
						<view class="uni-timeline-item-divider"></view>
						<view class="uni-timeline-item-content">
							<view class="datetime">{{ $formta(item.createTime, 'yyyy-MM-dd') }}</view>
							<view class="title" v-if="item.type == 'NOTICE'">[公告] {{ item.title }}</view>
							<view class="title" v-if="item.type == 'ACTIVITY'">[活动] {{ item.title }}</view>
							<view class="title" v-if="item.type == 'TOP'">[资讯] {{ item.title }}</view>
							<view class="text">{{ item.summary }}</view>
						</view>
					</view>
				</block>
				<uni-load-more v-if="loading" :status="loading ? 'loading' : 'noMore'"></uni-load-more>
			</view>
			<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
			<yomol-upgrade :type="upgradeType" :url="upgradeUrl" title="发现新版本" :content="upgradeContent" ref="yomolUpgrade"></yomol-upgrade>
		</view> -->
		<view class="exchange_header">
			<view class="b_list" :class="pairs == 'optional' ? 'active' : ''" @click="setType('optional')">自选</view>
			<block v-for="(item, index) in cexchange" :key="index">
				<view class="b_list" :class="item.name == pairs ? 'active' : ''" @click="setType(item.name)">{{ item.name }}</view>
			</block>
		</view>
		<view class="exchange_main">
			<view class="exchange_nav">
				<text style="min-width: 288upx;">名称/成交量</text>
				<text style="min-width: 179upx;">最新价格</text>
				<text style="min-width: 127upx;">涨跌</text>
				<text style="text-align: right;">自选</text>
			</view>
			<view class="exchange_list">
				<view
					class="item"
					v-for="(item, index) in list"
					:key="index"
					v-if="item.SHOWSTATUS && item.status != 'INIT'"
					@click="$goPage(`quotation/quotation?type=${item.symbol}&title=${item.title}&coin=${item.assetCode1}&symbol=${item.assetCode2}`)"
				>
					<view class="flex" style="min-width: 288upx;">
						<image class="icon-cion" :src="'../../static/coin/' + item.assetCode2.toLowerCase() + '@2x.png'"></image>
						<view class="item_coin">
							<text style="font-size: 28rpx;">{{ item.title }}</text>
							<text style="font-size: 24upx;color: #A4A4A4;">24h量：{{ filter.fix(item.trade ? item.trade['24Total'] : 0, 4) | lockNum }}</text>
						</view>
					</view>
					<view class="flex price" style="min-width: 179upx;font-size: 24rpx;">
						<text class="new">{{ filter.fix(item.trade ? item.trade.newPrice : 0, 4) }}</text>
						<text class="money" style="font-size: 24rpx;" v-if="tether">
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
									4
								)
							}}
						</text>
					</view>
					<view class="flex gain"  style="font-size: 24rpx;">
						<text :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">
							{{ item.trade ? item.trade.changeRatio : 0 }}%
						</text>
					</view>
					<view class="flex optional" @click.stop="startSymbol(item.symbol)">
						<text v-if="userStart.includes(item.symbol)" class="iconfont">&#xe658;</text>
						<text v-else class="iconfont">&#xe657;</text>
					</view>
				</view>
				<view class="item" v-for="(item, index) in list" :key="index" v-if="item.SHOWSTATUS && item.status === 'INIT'">
					<view class="flex" style="min-width: 288upx;">
						<image class="icon-cion" :src="'../../static/coin/' + item.assetCode2.toLowerCase() + '@2x.png'"></image>
						<view class="item_coin">
							<text>{{ item.title }}</text>
							<text style="font-size: 24upx;">24h量：--</text>
						</view>
					</view>
					<view class="flex price" style="min-width: 179upx;">
						<text class="new">--</text>
						<text class="money" style="font-size: 24rpx;" v-if="tether">￥--</text>
					</view>
					<view class="flex gain">
						<text :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">--%</text>
					</view>
					<view class="flex optional" @click.stop="startSymbol(item.symbol)">
						<text v-if="userStart.includes(item.symbol)" class="iconfont">&#xe658;</text>
						<text v-else class="iconfont">&#xe657;</text>
					</view>
				</view>
				<uni-load-more v-if="!list[0]" :status="loading ? 'loading' : !list[0] ? 'noMore' : ''"></uni-load-more>
			</view>
		</view>
		<!-- #ifdef H5 -->
		<view class="down_app clear" v-if="$store.state.closeDown == false">
			<text class="fl" @click="$goPage('/pages/downloadApp/downloadApp')">前往下载APP</text>
			<uni-icons @click="closeDown()" class="fr" type="closeempty" color="#fff" size="30"></uni-icons>
		</view>
		<!-- #endif -->
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
import { mapGetters, mapActions } from 'vuex';
export default {
	components: {
		HMmessages,
		uniLoadMore,
		yomolUpgrade,
		uniIcons
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
			tether:0,
			bitcoin:0,
			ethereum:0,
			digitalusd:0,
			tokens: uni.getStorageSync('TOKEN'),
			upgradeType: 'pkg', //pkg 整包 wgt 升级包
			upgradeContent: '', //更新内容
			upgradeUrl: 'http://nnex.io//download/lkex.apk', //更新地址
			noticeList: [],
			pairs: 'USDK',
			cexchange: [{ name: 'USDK' }, { name: 'LKB' }, { name: 'USDT' }]
		};
	},
	computed: {
		...mapGetters(['IMGLIST', 'APPVERSION', 'USERINFO'])
	},
	watch: {
		pairs(val) {
		  this.list = this.formatTrade(this.formatData(this.mainList))
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
	  clearTimeout(this.Time)
	  this.$store.commit('setIsExchange',false);
	},
	onHide() {
	  clearTimeout(this.Time)
	  this.$store.commit('setIsExchange',false);
	},
	onShow() {
		let token = uni.getStorageSync('TOKEN');
		if (token) {
			this.isLogin = true;
		} else {
			this.isLogin = false;
		};
		this.$store.commit('setIsExchange',true);
		this.userStart = uni.getStorageSync('userStart') ? JSON.parse(uni.getStorageSync('userStart')) : [];
		this.loading = true;
		Promise.all([service.getConfigSymbolRank(), comSvc.getTrade(), service.symbolConfigList()]).then((data) => {
		  this.loading = false;
		  if (data[0].data.code == '100200') {
		    this.mainList = data[0].data.data;
		    this.tradeList = data[1].data;
			this.configList = data[2].data.data;
			let innerObj;
			for(let key in this.mainList) {
				for (let i = 0; i < this.configList.length; i++) {
					innerObj = this.configList[i];
					if (this.mainList[key].symbol === innerObj.symbol) {
						this.mainList[key][innerObj.profileKey] = innerObj.profileValue;
					}
				}
			}	
			console.log(this.mainList)
		    this.list = this.formatTrade(this.formatData(this.mainList))
		    this.loopPan()
		  } else {
		    this.errors(data[0].data.msg);
		  }
		}).catch(err => {
		  this.loading = false;
		})
		service.getUSDT().then(({
		  data
		}) => {
		  if (data.code == '100200') {
			let regEx = /[^\d|^\.|^\-]/g;
		    for(let i in data.data){	  
		      data.data[i] = data.data[i].replace(regEx,"") * 1;
		    }
		    this.tether = data.data.tether;
			this.bitcoin = data.data.bitcoin;
			this.ethereum = data.data.ethereum;
			this.digitalusd = data.data.digitalusd;
		  }
		})
	},
	filters: {
	  lockNum(value) {
	    if (value >= 10000) {
	      value = Math.round(value / 10000 * 100) / 100 + 'w';
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
					window.location.href = `http://pool.lkex.co/#/?uid=${data.data.uid}&token=${data.data.token}&tokens=${this.tokens}&status=${this.$store.state.closeDown}`;
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
		    clearTimeout(this.Time)
		    return false;
		  }
		  comSvc.getTrade().then(({
		    data
		  }) => {
		    this.tradeList = data;
		    this.Time = setTimeout(() => {
		      this.loopPan();
		    }, 1000)
		    this.list = this.formatTrade(this.formatData(this.mainList))
		  })
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
		      }
		      userStart.remove(coin);
		      uni.setStorageSync('userStart', JSON.stringify(userStart));
		    } else {
		      userStart.push(coin);
		      uni.setStorageSync('userStart', JSON.stringify(userStart));
		    }
		  } else {
		    uni.setStorageSync('userStart', JSON.stringify([coin]))
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
		          symbol = '-'
		        } else if (distance > 0) {
		          symbol = '+'
		        }
		        if ((this.tradeList[i].newPrice ? this.tradeList[i]['24Price'] * 1 : 0) == 0) {
		          e.trade.changeRatio = filter.floorFix(0, 2);
		        } else {
		          e.trade.changeRatio = symbol + filter.floorFix(filter.abs(distance) / pr_op * 100, 2);
		        }
		        e.trade.changeRatioNum = parseFloat(e.trade.newPrice ? e.trade.changeRatio : 0);
		      }
		    }
		  })
		  return data
		},
		//格式化数据
		formatData(data) {
		  let arr = [];
		  data.map((e, i) => {
		    if (this.pairs == 'optional') {
		      if (this.userStart.includes(e.symbol) && e.status !== "DELISTED") {
		        arr.push(e);
		      }
		    } else if (e.assetCode1 == this.pairs && e.status !== "DELISTED") {
		      arr.push(e);
		    }
		  })
		  return arr;
		},
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
