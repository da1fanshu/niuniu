<template>
	<view class="content">
		<scroll-view style="height: 100%;" scroll-y @scrolltolower="load">
			<!-- #ifdef APP-PLUS -->
			<view class="status_bar"><view class="top_view"></view></view>
			<!-- #endif -->
			<view class="NavBar">
				<view class="back" @click="back()"><uni-icons type="arrowleft" :size="28" :color="'#fff'" style="margin-left: -14rpx;"></uni-icons></view>
				<text>法币交易</text>
				<image @click="showGo = true" src="../../static/c2c/menu.png" mode=""></image>
			</view>
			<view class="c2c">
				<view class="c2c_type">
					<view :class="type == 'BUY' ? 'active' : ''" @click="setType('BUY')">购买</view>
					<view :class="type == 'SELL' ? 'active' : ''" @click="setType('SELL')">出售</view>
					<view :class="type == 'LIST' ? 'active' : ''" @click="setType('LIST')">广告</view>
				</view>
				<!-- 	<view class="list_top" v-if="type == 'LIST'" @click="$goPage('c2cAdvertisement/c2cAdvertisement')">
					<view class="left"><text>发布广告</text></view>
					<view class="right">
						<text>零手续费</text>
						<uni-icons type="arrowright" :color="'#A3A3A3'" size="24"></uni-icons>
					</view>
				</view> -->

				<template v-if="type == 'BUY' || type == 'SELL'">
					<view class="c2c_nav">
						<view class="block" v-for="(item, index) in cexchange" :key="index" @click="setCoin(item.coin)" :class="coin == item.coin ? 'active' : ''">
							<view class="name">{{ item.name }}</view>
							<view class="coin">{{ item.coin }}</view>
						</view>
					</view>
					<view class="num" v-if="t_type == '数量'">
						<input type="text" placeholder-class="pla" placeholder="10-10000000 CNY" value="" />
						<text>CNY</text>
					</view>
					<view class="num" v-if="t_type == '金额'">
						<input type="text" placeholder-class="pla" placeholder="请输入购买数量" value="" />
						<view class="">
							<text>{{ coin }}</text>
							<text class="blue" v-if="type == 'SELL'">最大</text>
						</view>
					</view>
					<view class="transfer" @click="tradeType()">
						<image src="../../static/c2c/transfer.png" mode=""></image>
						<text>按{{ t_type }}{{ trade }}</text>
					</view>
					<view class="blue_btn" @click="paylist = true">快捷{{ trade }}</view>
					<view class="title">
						<text class="ll">商家列表</text>
						<view class="rr" @click="screen = true">
							<image src="../../static/nav/transfer.png" mode=""></image>
							<text>筛选</text>
						</view>
					</view>
					<view class="c2c_list">
						<view class="c2c_list_item" v-if="type == 'BUY'">
							<view class="item_title">
								<text class="name">呵呵</text>
								<text class="rig">2000 单 | 97%</text>
							</view>
							<view class="number">
								<view class="n_left">
									<view>数量：5555 USDK</view>
									<view class="btm">限额：1.00~1414 USDK</view>
								</view>
								<view class="n_right">
									<!-- {{ item.currency }} -->
									￥ 500
								</view>
							</view>
							<view class="item_type">
								<view class="pay">
									<text>支付方式：</text>
									<image class="aa" src="../../static/c2c/zfb.png" mode=""></image>
									<image class="bb" src="../../static/c2c/yhk.png" mode=""></image>
									<image class="cc" src="../../static/c2c/wx.png" mode=""></image>
								</view>
								<view class="buy_btn" @click="tradeway = true">购买</view>
							</view>
						</view>
						<view class="c2c_list_item" v-if="type == 'SELL'">
							<view class="item_title">
								<text class="name">呵呵</text>
								<text class="rig">2000 单 | 97%</text>
							</view>
							<view class="number">
								<view class="n_left">
									<view>数量：5555 USDK</view>
									<view class="btm">限额：1.00~1414 USDK</view>
								</view>
								<view class="n_right">￥ 500</view>
							</view>
							<view class="item_type">
								<view class="pay">
									<text>支付方式：</text>
									<image class="aa" src="../../static/c2c/zfb.png" mode=""></image>
									<image class="bb" src="../../static/c2c/yhk.png" mode=""></image>
									<image class="cc" src="../../static/c2c/wx.png" mode=""></image>
								</view>
								<view class="buy_btn" @click="tradeway = true">出售</view>
							</view>
						</view>
						<block v-for="(item, index) in list" :key="index">
							<template v-if="type == 'BUY'">
								<view class="c2c_list_item">
									<view class="item_title">
										<text class="name">{{ item.c2cTransactionInfoDto.nickName }}</text>
										<text class="rig">{{ item.c2cTransactionInfoDto.totalCount }} 单</text>
									</view>
									<view class="number">
										<view class="n_left">
											<view>
												数量：{{
													type == 'BUY'
														? filter.floorFix(item.maxAmount - item.hadSellNum, 2)
														: filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2)
												}}{{ coin }}
											</view>
											<view class="btm">
												限额：{{
													filter.floorFix(item.minAmount > item.maxAmount - item.hadSellNum ? item.maxAmount - item.hadSellNum : item.minAmount, 2)
												}}~{{ filter.floorFix(item.maxAmount - item.hadSellNum, 2) }}{{ coin }}
											</view>
										</view>
										<view class="n_right">
											<!-- {{ item.currency }} -->
											￥ {{ filter.floorFix(item.tradePrice, 2) }}
										</view>
									</view>
									<view class="item_type">
										<view class="pay">
											<text>支付方式：</text>
											<image class="aa" src="../../static/c2c/zfb.png" mode=""></image>
											<image class="bb" src="../../static/c2c/yhk.png" mode=""></image>
											<image class="cc" src="../../static/c2c/wx.png" mode=""></image>
										</view>
										<view class="buy_btn" @click="showM(item)">购买</view>
									</view>
								</view>
							</template>
							<template v-if="type == 'SELL'">
								<view class="c2c_list_item">
									<view class="item_title">
										<text class="name">{{ item.c2cTransactionInfoDto.nickName }}</text>
										<text class="rig">{{ item.c2cTransactionInfoDto.totalCount }} 单 | 97%</text>
									</view>
									<view class="number">
										<view class="n_left">
											<view>
												数量：{{
													type == 'BUY'
														? filter.floorFix(item.maxAmount - item.hadSellNum, 2)
														: filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2)
												}}{{ coin }}
											</view>
											<view class="btm">
												限额：{{
													filter.floorFix(
														item.purchaseMin > item.purchaseMax - item.hadPurchaseNum ? item.purchaseMax - item.hadPurchaseNum : item.purchaseMin,
														2
													)
												}}
												~ {{ filter.floorFix(item.purchaseMax - item.hadPurchaseNum, 2) }} {{ coin }}
											</view>
										</view>
										<view class="n_right">
											<!-- {{ item.currency }} -->
											￥ {{ filter.floorFix(item.tradePrice, 2) }}
										</view>
									</view>
									<view class="item_type">
										<view class="pay">
											<text>支付方式：</text>
											<image class="aa" src="../../static/c2c/zfb.png" mode=""></image>
											<image class="bb" src="../../static/c2c/yhk.png" mode=""></image>
											<image class="cc" src="../../static/c2c/wx.png" mode=""></image>
										</view>
										<view class="buy_btn" @click="showM(item)">出售</view>
									</view>
								</view>
							</template>
						</block>
						<uni-load-more :status="loading ? 'loading' : noData ? 'noMore' : 'more'"></uni-load-more>
					</view>
				</template>
				<template v-if="type == 'LIST'">
					<view class="list_list">
						<view class="list_tab">
							<view class="" :class="list_type == 'buy' ? 'active' : ''" @click="list_type = 'buy'">我要购买</view>
							<view class="" :class="list_type == 'sell' ? 'active' : ''" @click="list_type = 'sell'">我要出售</view>
						</view>
						<view class="list_price">
							<text>价格</text>
							<text>当前盘口价格 7.39 CNY</text>
						</view>
						<template v-if="list_type == 'buy'">
							<picker @change="setPrice" :value="priceType" :range="priceList">
								<view class="list_way">
									<view class="way_way">
										<text class="label">定价方式</text>
										<text>{{ priceList[priceType] }}</text>
									</view>
									<uni-icons type="arrowright" :size="24" :color="'#C5CFD5'" style="margin-right: -14rpx;"></uni-icons>
								</view>
							</picker>
							<view class="list_way" v-if="priceType == 1">
								<view class="way_way">
									<text class="label">浮动比例</text>
									<input type="text" placeholder-class="pla" placeholder="默认100，最大限度130" value="" />
								</view>
								<text class="way_right">%</text>
							</view>
							<view class="list_input">
								<text class="label">交易价格</text>
								<input type="text" placeholder-class="pla" placeholder="请输入交易价格" value="" />
							</view>
							<view class="list_price">
								<text>交易数额</text>
								<text></text>
							</view>
							<view class="list_input">
								<text class="label">
									数量
									<text class="l_gray">(USDT)</text>
								</text>
								<input type="text" placeholder-class="pla" placeholder="请输入购买数量" value="" />
							</view>
							<view class="list_input">
								<text class="label">
									金额
									<text class="l_gray">(CNY)</text>
								</text>
								<input type="text" placeholder-class="pla" placeholder="请输入交易金额" value="" />
							</view>
							<view class="list_price">
								<text>对手限制</text>
								<text></text>
							</view>
							<picker @change="setLevel" :value="levelType" :range="levelList">
								<view class="list_way">
									<view class="way_way">
										<text class="label">认证等级</text>
										<text>{{ levelList[levelType] }}</text>
									</view>
									<uni-icons type="arrowright" :size="24" :color="'#C5CFD5'" style="margin-right: -14rpx;"></uni-icons>
								</view>
							</picker>
							<view class="list_way">
								<view class="way_way">
									<text class="label">最小购买</text>
									<input type="text" placeholder-class="pla" placeholder="请输入最小购买" value="" />
								</view>
								<text class="way_right">CNY</text>
							</view>
							<view class="list_explain">
								<text class="ex1">交易说明</text>
								<text class="ex2">下单后极速付款，到账后及时放币</text>
							</view>
						</template>
						<template v-if="list_type == 'sell'">
							<picker @change="setPricesell" :value="priceTypesell" :range="priceList">
								<view class="list_way">
									<view class="way_way">
										<text class="label">定价方式</text>
										<text>{{ priceList[priceTypesell] }}</text>
									</view>
									<uni-icons type="arrowright" :size="24" :color="'#C5CFD5'" style="margin-right: -14rpx;"></uni-icons>
								</view>
							</picker>
							<view class="list_way" v-if="priceTypesell == 1">
								<view class="way_way">
									<text class="label">浮动比例</text>
									<input type="text" placeholder-class="pla" placeholder="默认100，最大限度130" value="" />
								</view>
								<text class="way_right">%</text>
							</view>
							<view class="list_input">
								<text class="label">交易价格</text>
								<input type="text" placeholder-class="pla" placeholder="请输入交易价格" value="" />
							</view>
							<view class="list_price">
								<text>交易数额</text>
								<text></text>
							</view>
							<view class="list_input">
								<text class="label">
									数量
									<text class="l_gray">(USDT)</text>
								</text>
								<input type="text" placeholder-class="pla" placeholder="请输入购买数量" value="" />
							</view>
							<view class="list_input">
								<text class="label">
									金额
									<text class="l_gray">(CNY)</text>
								</text>
								<input type="text" placeholder-class="pla" placeholder="请输入交易金额" value="" />
							</view>
							<view class="list_price">
								<text>对手限制</text>
								<text></text>
							</view>
							<picker @change="setLevel" :value="levelType" :range="levelList">
								<view class="list_way">
									<view class="way_way">
										<text class="label">认证等级</text>
										<text>{{ levelList[levelType] }}</text>
									</view>
									<uni-icons type="arrowright" :size="24" :color="'#C5CFD5'" style="margin-right: -14rpx;"></uni-icons>
								</view>
							</picker>
							<picker @change="setTime" :value="timeType" :range="timeList">
								<view class="list_way">
									<view class="way_way">
										<text class="label">付款时间</text>
										<text>{{ timeList[timeType] }}</text>
									</view>
									<uni-icons type="arrowright" :size="24" :color="'#C5CFD5'" style="margin-right: -14rpx;"></uni-icons>
								</view>
							</picker>
							<view class="list_way">
								<view class="way_way">
									<text class="label">最小购买</text>
									<input type="text" placeholder-class="pla" placeholder="请输入最小购买" value="" />
								</view>
								<text class="way_right">CNY</text>
							</view>
							<view class="list_explain">
								<text class="ex1">交易说明</text>
								<text class="ex2">1.请及时付款并点击「我已支付」<br/>2.币由系统锁定托管，请安心下单 </text>
							</view>
						</template>

						<view class="blue_btn">发布广告</view>
						<view class="list_ensure">
							<text>买单保证金：0USDT</text>
							<text>平台服务费：0%</text>
						</view>
					</view>
				</template>
			</view>
		</scroll-view>
		<!-- 交易 -->
		<Modal @close="closeModal('isShow')" :way="trade" v-if="isShow"></Modal>
		<Screen @close="closeModal('screen')" v-if="screen"></Screen>
		<Goto v-if="showGo" :top="'66upx'" :right="'24upx'" @close="closeModal('showGo')">
			<view class="go_model">
				<view class="goto" @click="goClose('c2cTorder/c2cTorder', 'showGo')">
					<image style="height: 34rpx;" src="../../static/c2c/order.png"></image>
					<text>法币订单</text>
				</view>
				<view class="goto" @click="goClose('c2cTorder/c2cTorder', 'showGo')">
					<image src="../../static/c2c/money.png"></image>
					<text>资金划转</text>
				</view>
				<view class="goto">
					<image src="../../static/c2c/money.png"></image>
					<text>收付款设置</text>
				</view>
			</view>
		</Goto>
		<Paylist @close="closeModal('paylist')" @confirm="conBuy" v-if="paylist"></Paylist>
		<Tradeway :way="trade" @close="closeModal('tradeway')" @confirm="place" v-if="tradeway"></Tradeway>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import { uniLoadMore } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import Modal from '@/components/trade-modal/index.vue';
import Screen from '@/components/screen-modal/index.vue';
import Goto from '@/components/nor-modal/index.vue';
import Paylist from '@/components/paylist-modal/index.vue';
import Tradeway from '@/components/tradeway-modal/index.vue';
import service from './service.js';
import filter from '@/common/filter.js';
import { mapGetters } from 'vuex';
export default {
	components: { uniIcons, HMmessages, uniLoadMore, Modal, Goto, Screen, Paylist, Tradeway },
	data() {
		return {
			filter,
			type: 'BUY',
			coin: 'USDK',
			cexchange: [{ name: '泰达币', coin: 'USDK' }, { name: '比特币', coin: 'BTC' }, { name: '以太坊', coin: 'ETH' }],
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
			showGo: false,
			screen: false,
			t_type: '数量',
			trade: '购买',
			trade_type: 'num_buy',
			paylist: false,
			tradeway: false,
			list_type: 'buy',
			levelType: 0,
			levelList: ['VIP1', 'VIP2'],
			priceType: 0,
			priceTypesell: 0,
			priceList: ['固定价格', '浮动价格'],
			timeType: 0,
			timeList: ['10分钟内完成付款', '15分钟内完成付款', '20分钟内完成付款']
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
		//返回
		back() {
			uni.navigateBack();
		},
		//选择价格方式
		setPrice(e) {
			this.priceType = e.target.value;
		},
		//选择价格方式
		setPricesell(e) {
			this.priceTypesell = e.target.value;
		},
		//选择等级
		setLevel(e) {
			this.levelType = e.target.value;
		},
		//选择时间
		setTime(e) {
			this.timeType = e.target.value;
		},
		//快捷交易
		conBuy() {
			this.paylist = false;
			this.isShow = true;
		},
		//下单
		place() {
			this.$goPage(`c2cTrade/c2cTrade?type=${this.type}&coin=USDT`);
		},
		//切换交易方式
		tradeType() {
			if (this.t_type == '数量') {
				this.t_type = '金额';
			} else {
				this.t_type = '数量';
			}
		},
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
			if (name == 'BUY') {
				this.trade = '购买';
			}
			if (name == 'SELL') {
				this.trade = '出售';
			}
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
		goClose(url, name) {
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
