<template>
	<view class="content">
		<view class="record">
			<view class="common_list">
				<view class="title clear">
					<text class="fl">{{ coin }} 活动支出明细</text>
					<!-- <view class="fr"><uni-icon type="arrowdown" size="22" :color="'#03bcc0'"></uni-icon></view> -->
				</view>
				<view class="common_list_main">
					<!-- <view class="common_list_main" :style="{ height: depositHeight + 'px' }"> -->
					<view id="deposit">
						<view class="c_l_m_title">
							<text style="max-width: 225upx;">时间</text>
							<text>数量</text>
							<text style="max-width: 150upx;">类型</text>
						</view>
						<view class="c_l_m_list">
							<view class="item" v-for="(item, index) in aList" :key="index">
								<text style="max-width: 225upx;">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm') }}</text>
								<text>{{ filter.fix(item.assetNum, 6) }}</text>
								<!-- 早起活动 -->
								<text style="max-width: 150upx; color: #d14b64;" v-if="item.operType == 'SIGNUP'">早起支出</text>
								<text style="max-width: 150upx; color: #2eb34b;" v-if="item.operType == 'SIGN_PROFIT_ALLOT'">早起收入</text>
								<text style="max-width: 150upx; color: #2eb34b;" v-if="item.operType == 'INVITE_PROFIT_ALLOT'">早起邀请奖励</text>
								<!-- VDS活动 -->
								<text style="max-width: 150upx; color: #d14b64;" v-if="item.operType == 'ACTIVITY_LOCK'">VDS冻结</text>
								<text style="max-width: 150upx; color: #2eb34b;" v-if="item.operType == 'ACTIVITY_UNLOCK'">VDS解冻</text>
								<text style="max-width: 150upx; color: #d14b64;" v-if="item.operType == 'ACTIVITY_SUBASSET'">VDS扣减</text>
								<text style="max-width: 150upx; color: #2eb34b;" v-if="item.operType == 'ACTIVITY_ADDASSET'">VDS增加</text>
								<text style="max-width: 150upx; color: #2eb34b;" v-if="item.operType == 'ACTIVITY_FEE_BACK'">VDS手续费返还</text>
							</view>
						</view>
						<uniLoadMore v-if="!aList[0]" :status="aloading ? 'loading' : !aList[0] ? 'noMore' : ''"></uniLoadMore>
						<view class="common_list_page"><uni-pagination @change="setPageNo($event, 'aPageNo')" :total="aTotal * pageSize" :showIcon="true"></uni-pagination></view>
					</view>
				</view>
			</view>
			<view class="common_list">
				<view class="title clear" @click="setHeight('deposit', 'depositHeight')">
					<text class="fl">{{ coin }}充币</text>
					<!-- <view class="fr"><uni-icon type="arrowdown" size="22" :color="'#03bcc0'"></uni-icon></view> -->
				</view>
				<view class="common_list_main">
					<!-- <view class="common_list_main" :style="{ height: depositHeight + 'px' }"> -->
					<view id="deposit">
						<view class="c_l_m_title">
							<text style="max-width: 225upx;">时间</text>
							<text>充币数量（{{ coin }}）</text>
							<text style="max-width: 62upx;">状态</text>
						</view>
						<view class="c_l_m_list">
							<view class="item" v-for="(item, index) in dList" :key="index">
								<text style="max-width: 225upx;">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm') }}</text>
								<text>{{ filter.fix(item.amount, 6) }}</text>
								<text style="max-width: 62upx; color: #2eb34b;" v-if="item.status == 'SUCCESS'">已完成</text>
								<text style="max-width: 62upx; color: #ff6100;" v-if="item.status == 'REFUSE'">已退还</text>
								<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'PROCESSING'">进行中</text>
								<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'WAIT'">进行中</text>
								<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'UNKNOWN'">进行中</text>
								<text style="max-width: 62upx; color: #d14b64;" v-if="item.status == 'FAILURE'">失败</text>
							</view>
						</view>
						<uniLoadMore v-if="!dList[0]" :status="dloading ? 'loading' : !dList[0] ? 'noMore' : ''"></uniLoadMore>
						<view class="common_list_page"><uni-pagination @change="setPageNo($event, 'dPageNo')" :total="dTotal * pageSize" :showIcon="true"></uni-pagination></view>
					</view>
				</view>
			</view>
			<view class="common_list">
				<view class="title clear" @click="setHeight('withdraw', 'withdrawHeight')">
					<text class="fl">{{ coin }}提币和站内互转</text>
					<!-- <view class="fr"><uni-icon type="arrowdown" size="22" :color="'#03bcc0'"></uni-icon></view> -->
				</view>
				<view class="common_list_main">
					<!-- <view class="common_list_main" :style="{ height: withdrawHeight + 'px' }"> -->
					<view id="withdraw">
						<view class="c_l_m_title">
							<text style="max-width: 170upx; min-width: 170upx;">时间</text>
							<text style="max-width: 246upx;min-width: 200upx; padding-right: 12upx;">转出到</text>
							<text style="padding: 0 12upx;">数量</text>
							<text style="padding: 0 16upx;">区块费</text>
							<text style="max-width: 62upx;">状态</text>
						</view>
						<view class="c_l_m_list">
							<view class="item" v-for="(item, index) in wList" :key="index">
								<text style="max-width: 170upx; min-width: 170upx;">{{ $formta(item.createDate, 'yyyy-MM-dd hh:mm') }}</text>
								<text style="max-width: 246upx;min-width: 246upx; padding-right: 12upx;">{{ item.transferOutAddress }}</text>
								<text style="padding: 0 12upx;">{{ filter.fix(item.amount, 4) }}</text>
								<text style="padding: 0 12upx;">{{ item.fee }}</text>
								<text style="max-width: 62upx; color: #2eb34b;" v-if="item.status == 'SUCCESS'">已完成</text>
								<text style="max-width: 62upx; color: #ff6100;" v-if="item.status == 'REFUSE'">已退还</text>
								<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'PROCESSING'">进行中</text>
								<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'WAIT'">进行中</text>
								<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'UNKNOWN'">进行中</text>
								<text style="max-width: 62upx; color: #d14b64;" v-if="item.status == 'FAILURE'">失败</text>
							</view>
							<uniLoadMore v-if="!wList[0]" :status="wloading ? 'loading' : !wList[0] ? 'noMore' : ''"></uniLoadMore>
						</view>
						<view class="common_list_page"><uni-pagination @change="setPageNo($event, 'wPageNo')" :total="wTotal * pageSize" :showIcon="true"></uni-pagination></view>
					</view>
				</view>
			</view>
			<view class="common_list">
				<view class="title clear" @click="setHeight('transfer', 'transferHeight')">
					<text class="fl">{{ coin }}划转</text>
					<!-- <view class="fr"><uni-icon type="arrowdown" size="22" :color="'#03bcc0'"></uni-icon></view> -->
				</view>
				<view class="common_list_main">
					<!-- <view class="common_list_main" :style="{ height: transferHeight + 'px' }"> -->
					<view id="transfer">
						<view class="c_l_m_title">
							<text style="max-width: 170upx; min-width: 170upx;">时间</text>
							<text>划出账户</text>
							<text>划入账户</text>
							<text>数量</text>
							<text style="max-width: 62upx;">状态</text>
						</view>
						<view class="c_l_m_list">
							<view class="item" v-for="(item, index) in tranList" :key="index">
								<text style="max-width: 170upx; min-width: 170upx;">{{ $formta(item.createTime, 'yyyy-MM-dd hh:mm') }}</text>
								<text v-if="item.transType=='TO_CLOUD'">币币账户</text>
								<text v-if="item.transType=='TO_CLOUD'">算力账户</text>
								<text v-if="item.transType=='FROM_CLOUD'">算力账户</text>
								<text v-if="item.transType=='FROM_CLOUD'">币币账号</text>
								<text>{{ item.quantity }}</text>
								<text v-if="item.transStatus == 'SUCCESS'" style="max-width: 62upx;" class="suc">已完成</text>
								<text v-if="item.transStatus == 'FAIL'" style="max-width: 62upx;" class="suc">失败</text>
								<text v-if="item.transStatus == 'UNKNOW'" style="max-width: 62upx;" class="suc">处理中</text>
								<text v-if="item.transStatus == 'INIT'" style="max-width: 62upx;" class="suc">处理中</text>
							</view>
							<uniLoadMore v-if="!tranList[0]" :status="tranloading ? 'loading' : !tranList[0] ? 'noMore' : ''"></uniLoadMore>
						</view>
						<view class="common_list_page"><uni-pagination @change="setPageNo($event, 'tranPageNo')" :total="ttTotal" :showIcon="true"></uni-pagination></view>
					</view>
				</view>
			</view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import uniPagination from '@/components/uni-pagination/uni-pagination.vue';
import { uniIcon, uniLoadMore } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import filter from '@/common/filter.js';
export default {
	components: {
		uniIcon,
		uniPagination,
		HMmessages,
		uniLoadMore
	},
	data() {
		return {
			filter,
			depositHeight: 0,
			withdrawHeight: 0,
			transferHeight: 0,
			coin: '',
			dPageNo: 1,
			dTotal: 1,
			dList: [],
			wPageNo: 1,
			tranPageNo: 1,
			wTotal: 1,
			tranTotal: 1,
			wList: [],
			tranList: [],
			tPageNo: 1,
			tTotal: 1,
			tList: [],
			aPageNo: 1,
			aTotal: 1,
			ttTotal: 0,
			aList: [],
			pageSize: 10,
			dloading: true,
			wloading: true,
			tloading: true,
			tranloading: true,
			aloading: true
		};
	},
	onLoad(option) {
		if (option && option.type) {
			uni.setNavigationBarTitle({
				title: option.type + '记录'
			});
			this.coin = option.type;
		}
	},
	onShow() {
		if (this.$api.isLogin()) {
			this.depositOutList();
			this.withdrawOutList();
			this.assetTransRecord();
			this.getActList();
			return false;
		}
		this.$api.goLogin('../../login/login');
	},
	methods: {
		//获取活动资产变化
		getActList() {
			this.aloading = true;
			this.aList = [];
			service
				.getActList({
					pageNo: this.aPageNo,
					pageSize: this.pageSize,
					assetCode: this.coin
				})
				.then(({ data }) => {
					this.aloading = false;
					if (data.code == '100200') {
						this.aList = data.data.list;
						this.aTotal = data.data.pageNum;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//设置页码
		setPageNo(e, name) {
			this[name] = e.current;
			if (name == 'wPageNo') {
				this.withdrawOutList();
			} else if (name == 'dPageNo') {
				this.depositOutList();
			} else if (name == 'aPageNo') {
				this.getActList();
			} else if (name == 'tranPageNo') {
				this.assetTransRecord();
			}
		},
		//查询充值记录
		depositOutList() {
			this.dloading = true;
			this.dList = [];
			service
				.depositOutList({
					pageNo: this.dPageNo,
					pageSize: this.pageSize,
					assetCode: this.coin
				})
				.then(({ data }) => {
					this.dloading = false;
					if (data.code == '100200') {
						this.dList = data.data.list;
						this.dTotal = data.data.pageNum;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//查询提现记录
		withdrawOutList() {
			this.wloading = true;
			this.wList = [];
			service
				.withdrawOutList({
					pageNo: this.wPageNo,
					pageSize: this.pageSize,
					assetCode: this.coin
				})
				.then(({ data }) => {
					this.wloading = false;
					if (data.code == '100200') {
						this.wList = data.data.list;
						this.wTotal = data.data.pageNum;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//云算力划转记录
		assetTransRecord() {
			this.tranloading = true;
			this.tranList = [];
			service
				.assetTransRecord({
					pageNo: this.tranPageNo,
					pageSize: this.pageSize,
					assetCode: this.coin
				})
				.then(({ data }) => {
					this.tranloading = false;
					if (data.code == '100200') {
						if (this.coin == 'USDK') {
							this.tranList = data.data.list;
							this.tranTotal = data.data.pageNum;
							this.ttTotal = data.data.total;
						}
					} else {
						this.errors(data.msg);
					}
				});
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//设置手风琴
		setHeight(name, height) {
			return false;
			let that = this;
			let view = uni.createSelectorQuery().select(`#${name}`);
			if (this[height] > 0) {
				this[height] = 0;
			} else {
				view.boundingClientRect(data => {
					that[height] = data.height;
				}).exec();
			}
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
