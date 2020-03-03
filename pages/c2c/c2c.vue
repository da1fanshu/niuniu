<template>
	<view class="content">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="load">
			<!-- #ifdef APP-PLUS -->
			<view class="status_bar"><view class="top_view"></view></view>
			<!-- #endif -->
			<view class="c2c">
				<view class="c2c_type">
					<view :class="type == 'BUY' ? 'active' : ''" @click="setType('BUY')">购买</view>
					<view :class="type == 'SELL' ? 'active' : ''" @click="setType('SELL')">出售</view>
					<view :class="type == 'LIST' ? 'active' : ''" @click="setType('LIST')">广告</view>
					<image @click="showGo = true" src="../../static/c2c/sh.png"></image>
				</view>
				<view class="c2c_nav">
					<block v-for="(item, index) in cexchange" :key="index">
						<view :class="coin == item.name ? 'active' : ''" @click="setCoin(item.name)">{{ item.name }}</view>
					</block>
				</view>
				<view class="sell_top" v-if="type == 'SELL'">
					<view class="one">
						<text style="padding-right: 10rpx;">可用:</text>
						<text>BTC</text>
					</view>
					<view class="one">
						<text style="padding-right: 10rpx;">冻结:</text>
						<text>BTC</text>
					</view>
				</view>
				<view class="list_top" v-if="type == 'LIST'" @click="$goPage('c2cAdvertisement/c2cAdvertisement')">
					<view class="left"><text>发布广告</text></view>
					<view class="right">
						<text>零手续费</text>
						<uni-icons type="arrowright" :color="'#A3A3A3'" size="24"></uni-icons>
					</view>
				</view>
				<view class="c2c_list">
					<view class="c2c_list_item">
						<view class="item_title clear">
							<text class="fl name">呵呵</text>
							<text class="rig">1111 单</text>
						</view>
						<view class="item_number clear">
							<text class="fl">
								<text style="color: #A3A3A3;">数量：</text>
								5555 USDK
							</text>
						</view>
						<view class="item_number clear two">
							<text class="fl">
								<text style="color: #A3A3A3;">限额：</text>
								1.00~1414 USDK
							</text>
							<text class="fr">
								<!-- {{ item.currency }} -->
								<text style="font-size: 32rpx;">￥ 500</text>
							</text>
						</view>
						<view class="item_type clear">
							<view class="fl">
								<text style="color: #A3A3A3;">支付方式：</text>
								<image src="../../static/c2c/zfb.png" mode=""></image>
								<image src="../../static/c2c/yhk.png" mode=""></image>
								<image src="../../static/c2c/wx.png" mode=""></image>
							</view>
							<button class="fr" @click="showM(item)">购买</button>
						</view>
					</view>

					<template v-if="type == 'BUY' || type == 'SELL'">
						<block v-for="(item, index) in list" :key="index">
							<template v-if="type == 'BUY'">
								<view class="c2c_list_item">
									<view class="item_title clear">										
										<text class="fl name">{{ item.c2cTransactionInfoDto.nickName }}</text>
										<text class="rig">{{ item.c2cTransactionInfoDto.totalCount }} 单</text>
									</view>
									<view class="item_number clear">
										<text class="fl">
											<text style="color: #A3A3A3;">数量：</text>
											{{ type == 'BUY' ? filter.floorFix(item.maxAmount - item.hadSellNum, 2) : filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2)
											}}{{ coin }}
										</text>
									</view>
									<view class="item_number clear  two">
										<text class="fl">
											<text style="color: #A3A3A3;">限额：</text>
											{{ filter.floorFix(item.minAmount > item.maxAmount - item.hadSellNum ? item.maxAmount - item.hadSellNum : item.minAmount, 2) }}~{{
												filter.floorFix(item.maxAmount - item.hadSellNum, 2)
											}}{{ coin }}
										</text>
										<text class="fr">
											<!-- {{ item.currency }} -->
											<text style="font-size: 32rpx;">￥ {{ filter.floorFix(item.tradePrice, 2) }}</text>
										</text>
									</view>
									<view class="item_type clear">
										<view class="fl">
											<text style="color: #A3A3A3;">支付方式：</text>
											<image src="../../static/c2c/zfb.png" mode=""></image>
											<image src="../../static/c2c/yhk.png" mode=""></image>
											<image src="../../static/c2c/wx.png" mode=""></image>
										</view>
										<button class="fr" @click="showM(item)">购买</button>
									</view>
								</view>
							</template>
							<template v-if="type == 'SELL'">
								<view class="c2c_list_item">
									<view class="item_title clear">
										<image class="avatar" src="../../static/c2c/cds.png" mode=""></image>
										<text class="fl name">{{ item.c2cTransactionInfoDto.nickName }}</text>
									</view>
									<view class="item_number clear">
										<text class="fl">
											数量：{{
												type == 'BUY' ? filter.floorFix(item.maxAmount - item.hadSellNum, 2) : filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2)
											}}{{ coin }}
										</text>
										<text class="fr">{{ item.c2cTransactionInfoDto.totalCount }} 笔</text>
									</view>
									<view class="item_number clear  two">
										<text class="fl">
											限额：{{
												filter.floorFix(
													item.purchaseMin > item.purchaseMax - item.hadPurchaseNum ? item.purchaseMax - item.hadPurchaseNum : item.purchaseMin,
													2
												)
											}}
											~ {{ filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2) }} {{ coin }}
										</text>
										<text class="fr">
											<text>￥ {{ filter.floorFix(item.tradePrice, 2) }}</text>
										</text>
									</view>
									<view class="item_type clear">
										<view class="fl">
											<text>支付方式：</text>
											<image src="../../static/c2c/zfb.png" mode="aspectFit"></image>
											<image src="../../static/c2c/yhk.png" mode="aspectFit"></image>
											<image src="../../static/c2c/wx.png" mode="aspectFit"></image>
										</view>
										<button style="background: #313131;" class="fr" @click="showM(item)">出售</button>
									</view>
								</view>
							</template>
						</block>
						<uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
					</template>
					<template v-if="type == 'LIST'">
						<block>
							<view class="list_block">
								<view class="top">
									<view class="one">
										<view class="left">
											<view class="s_color"></view>
											<text>卖出 BTC</text>
											<text v-if="false" style="color: #32B16C;">买入</text>
											<view class="right">限价广告</view>
										</view>
										<text>生效中</text>
										<text v-if="false" style="color: #A3A3A3;">已失效</text>
									</view>
									<view class="two">
										<view class="left">
											<view class="lineh">已成交：0.0000</view>
											<view>数量：20.00000000</view>
										</view>
										<view class="right">
											<view class="lineh">未成交金额：0.0000</view>
											<view>发布时间：02-10 15:19</view>
										</view>
									</view>
								</view>
								<view class="bottom">
									<view class="left">￥ 7.1</view>
									<view class="right">
										<view class="ggbtn">
											<image src="../../static/c2c/bj.png" mode=""></image>
											<text>编辑</text>
										</view>
										<view class="ggbtn">
											<image src="../../static/c2c/xj.png" mode=""></image>
											<text>下架</text>
										</view>
										<view class="ggbtn" v-if="false">
											<image src="../../static/c2c/sc.png" mode=""></image>
											<text>删除</text>
										</view>
									</view>
								</view>
							</view>
						</block>
						<uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
						<!-- <view class="c2c_record">
							<view class="c_r_main">
								<view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=BUY&orderType=SELL&user=ordinary')">
									<view class="fl">购买记录</view>
									<view class="fr"><uni-icons type="arrowright" :color="'#03bcc0'" size="20"></uni-icons></view>
								</view>
								<view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=SELL&orderType=PURCHASE&user=ordinary')">
									<view class="fl">出售记录</view>
									<view class="fr"><uni-icons type="arrowright" :color="'#03bcc0'" size="20"></uni-icons></view>
								</view>
							</view>

							<template v-if="USERINFO.c2cMember == 'INIT'">
								<view class="c_r_main">
									<view class="c_r_main_item clear" @click="$goPage('c2cAgent/c2cAgent')">
										<view class="fl">申请成为承兑商</view>
										<view class="fr"><uni-icons type="arrowright" :color="'#03bcc0'" size="20"></uni-icons></view>
									</view>
								</view>
							</template>

							<template v-if="USERINFO.c2cMember.indexOf('VIP') > -1">
								<view class="c_r_main c_r_main_title">
									<view class="c_r_main_item clear"><view class="fl">承兑商权限</view></view>
								</view>
								<view class="c_r_main">
									<view class="c_r_main_item clear" @click="$goPage('c2cCreated/c2cCreated')">
										<view class="fl">发布订单</view>
										<view class="fr"><uni-icons type="arrowright" :color="'#03bcc0'" size="20"></uni-icons></view>
									</view>
									<view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=BUY&orderType=PURCHASE&user=member')">
										<view class="fl">承兑商收购记录</view>
										<view class="fr"><uni-icons type="arrowright" :color="'#03bcc0'" size="20"></uni-icons></view>
									</view>
									<view class="c_r_main_item clear" @click="$goPage('c2cOrder/c2cOrder?type=SELL&orderType=SELL&user=member')">
										<view class="fl">承兑商出售记录</view>
										<view class="fr"><uni-icons type="arrowright" :color="'#03bcc0'" size="20"></uni-icons></view>
									</view>
								</view>
							</template>
						</view> -->
					</template>
				</view>
			</view>
		</scroll-view>
		<!-- 交易 -->
		<Modal @close="closeModal('isShow')" :eng="eng" :price="oprice" :quota="quota" :numt="numt" :coin="coin" :allPrice="allPrice" v-if="isShow">
			<view class="btn">
				<view class="btn1" @click="closeModal('isShow')">后自动取消</view>
				<view class="btn2" @click="gopage()">下单</view>
			</view>
		</Modal>
		<Goto v-if="showGo" :top="'64upx'" :right="'24upx'" @close="closeModal('showGo')">
			<view class="go_model">
				<view class="goto" @click="goClose('c2cTorder/c2cTorder','showGo')">
					<image src="../../static/c2c/jl.png" mode="aspectFit"></image>
					<text>交易订单</text>
				</view>
				<view class="goto">
					<image src="../../static/c2c/xj.png" mode="aspectFit"></image>
					<text>收款方式</text>
				</view>
			</view>
		</Goto>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import Modal from '@/components/trade-modal/index.vue';
import Goto from '@/components/nor-modal/index.vue';
import service from './service.js';
import filter from '@/common/filter.js';
import { mapGetters } from 'vuex';
export default {
	components: { uniIcons, HMmessages, uniLoadMore, Modal, Goto },
	data() {
		return {
			filter,
			type: 'BUY',
			coin: 'USDK',
			cexchange: [{ name: 'USDK' }, { name: 'BTC' }, { name: 'ETH' }],
			pageNo: 1,
			pageSize: 10,
			list: [],
			loading: true,
			noData: false,
			isShow: false,
			eng: '',
			oprice: '',
			quota: '',
			allPrice: 0,
			numt: '',
			showGo: false
		};
	},
	computed: {
		...mapGetters(['USERINFO', 'COINCONFIG'])
	},
	onShow() {
		this.pageNo = 1;
		this.list = [];
		this.getList();
	},
	methods: {
		//查询列表
		getList() {
			this.loading = true;
			let param = {
				assetCode: this.coin,
				pageSize: this.pageSize,
				pageNo: this.pageNo
			};
			let name = this.type == 'BUY' ? 'sellAdvertQuery' : 'buyAdvertQuery';
			service[name](param).then(({ data }) => {
				this.loading = false;
				if (data.code == '100200') {
					this.list = this.list.concat(data.data.list);
					if (data.data.pageNum == 1 || data.data.pageNum == 0) {
						this.noData = true;
						return false;
					}
					if (this.pageNo >= data.data.pageNum) {
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
			this.getList();
		},
		//设置币种
		setCoin(type) {
			this.coin = type;
			this.pageNo = 1;
			this.list = [];
			this.getList();
		},
		//设置买入还是卖出
		setType(name) {
			if (name == 'LIST') {
				if (this.$api.isLogin()) {
					this.type = name;
					return false;
				}
				this.$api.goLogin('../login/login');
			} else {
				this.type = name;
			}
			if (name == 'BUY' || name == 'SELL') {
				this.list = [];
				this.pageNo = 1;
				this.loading = true;
				this.getList();
			}
		},
		//打开弹窗
		showM(item) {
			this.isShow = 'true';
			this.numt = this.type == 'BUY' ? filter.floorFix(item.maxAmount - item.hadSellNum, 2) : filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2);
			this.oprice = filter.floorFix(item.tradePrice, 2);
			this.quota =
				filter.floorFix(item.purchaseMin > item.purchaseMax - item.hadPurchaseNum ? item.purchaseMax - item.hadPurchaseNum : item.purchaseMin, 2) +
				' ~ ' +
				filter.floorFix(item.maxAmount - item.hadSellNum, 2) +
				this.coin;
			if (this.type == 'BUY') {
				this.eng = '购买';
			}
			if (this.type == 'SELL') {
				this.eng = '出售';
			}
		},
		//跳转
		gopage() {
			if (this.type == 'BUY') {
				this.$goPage('c2cTrade/c2cTrade?type=BUY&coin=' + this.coin);
			}
			if (this.type == 'SELL') {
				this.$goPage('c2cTrade/c2cTrade?type=SELL&coin=' + this.coin);
			}
		},
		//跳转并关闭
		goClose(url,name) {
			this.$goPage(url);
			this.closeModal(name);
		},
		//隐藏弹窗
		closeModal(name) {
			this[name] = '';
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
