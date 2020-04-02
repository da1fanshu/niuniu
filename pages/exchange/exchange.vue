<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="exchange">
			<view class="index_header">
				<image class="i_h_logo" src="/static/index/logo.png" mode=""></image>
				<image @click="search = true" class="i_h_login" src="../../static/search.png" mode=""></image>
			</view>
			<view class="exchange_header">
				<view class="b_list" :class="pairs == 'optional' ? 'active' : ''" @click="setType('optional')">自选区</view>
				<block v-for="(item, index) in cexchange" :key="index">
					<view class="b_list" :class="item.name == pairs ? 'active' : ''" @click="setType(item.name)">{{ item.cname }}</view>
				</block>
			</view>
			<view class="exchange_main">
				<view class="exchange_nav">
					<text style="width: 300rpx;">名称/成交量</text>
					<text style="width: 240rpx;">最新价格</text>
					<text style="text-align: right;">涨跌幅</text>
				</view>
				<view class="q_list">
					<view class="q_block" v-for="(item, index) in list" :key="index" v-if="item.SHOWSTATUS && item.status != 'INIT'" @click="goSwitch('../coin/coin',item.symbol,item.title,item.assetCode1,item.assetCode2)">
						<view class="unit" style="width: 300rpx;">
							<view class="">
								<text style="font-weight: bold;">{{ item.assetCode2 }}/<text style="color: #8A9EAB;">{{ item.assetCode1 }}</text> </text>
							</view>
							<view class="ss_word">24H量：{{ filter.fix(item.trade ? item.trade['24Total'] : 0, item.AMOUNTPRECISION) | lockNum }}</view>
						</view>
						<view class="unit" style="width: 240rpx;">
							<view class="">{{ filter.fix(item.trade ? item.trade.newPrice : 0, item.PRICEPRECISION) }}</view>
							<view v-if="tether" class="s_word">
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
						<view
							class="rise"
							:class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']"
						>
							{{ item.trade ? item.trade.changeRatio : 0 }}%
						</view>
					</view>
					<view class="q_block" v-for="(item, index) in list" :key="index" v-if="item.SHOWSTATUS && item.status === 'INIT'" @click="goSwitch('../coin/coin',item.symbol,item.title,item.assetCode1,item.assetCode2)">
						<view class="unit">
							<view class="">
								<text style="font-weight: bold;">{{ item.title }}</text>
							</view>
							<view class="ss_word">24H量：--</view>
						</view>
						<view class="unit">
							<view class="">--</view>
							<view v-if="tether" class="s_word">￥--</view>
						</view>
						<view :class="[(item.trade ? item.trade.changeRatioNum : 0) > 0 ? 'rise' : '', (item.trade ? item.trade.changeRatioNum : 0) < 0 ? 'fall' : '']">--%</view>
					</view>
				</view>
			</view>
		</view>
		<view class="self" v-if="pairs == 'optional'" @click="search = true">+添加自选</view>
		<view v-if="search" class="Modal_mask"></view>
		<view class="c_modal" v-if="search">
			<view class="top">
				<view class="left">
					<image src="../../static/search.png" mode=""></image>
					<input v-model="ssCoin" type="text" value="" placeholder-class="pla" placeholder="搜索" />
				</view>
				<text @click="search = false">取消</text>
			</view>
			<view class="list">
				<view class="title">币币</view>
				<view class="block" v-if="item.title.indexOf(ssCoin) > -1" v-for="(item,index) in mainList" :key="index"  @click.stop="startSymbol(item.symbol)">
					<text>{{item.title}}</text>
					<image v-if="userStart.includes(item.symbol)"  src="../../static/c2c/start1.png" mode=""></image>
					<image v-else src="../../static/c2c/start2.png" mode=""></image>
				</view>
			</view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import main from './main.js';
import { uniLoadMore } from '@dcloudio/uni-ui';
import { mapGetters } from 'vuex';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
export default {
	components: {
		uniLoadMore,
		HMmessages
	},
	computed: {
		...mapGetters(['COINRMB', 'EXCHANGE', 'COINCONFIG'])
	},
	mixins: [main]
};
</script>

<style lang="scss">
@import './style.scss';
</style>
