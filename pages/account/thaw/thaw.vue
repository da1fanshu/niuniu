<template>
	<view class="content">
		<view class="l-title">
			<view class="m-title">
				<text class="sm-title">币种:</text>
				<picker @change="set1" :value="coinType" :range="coinList">
					<view class="flex">
						<view class="uni-inputs">{{ coinList[coinType] }}</view>
						<view class="triangle"></view>
					</view>
				</picker>
			</view>
			<view class="m-title">
				<text class="sm-title">类型:</text>
				<picker @change="set1" :value="reason1" :range="reasonList1">
					<view class="flex">
						<view class="uni-inputs">{{ reasonList1[reason1] }}</view>
						<view class="triangle"></view>
					</view>
				</picker>
			</view>
			<view class="m-title">
				<text class="sm-title">状态:</text>
				<picker @change="set2" :value="reason2" :range="reasonList2">
					<view class="flex">
						<view class="uni-inputs">{{ reasonList2[reason2] }}</view>
						<view class="triangle"></view>
					</view>
				</picker>
			</view>
		</view>
		<view class="record">
			<view class="common_list">
				<view class="common_list_main">
					<!-- <view class="common_list_main" :style="{ height: depositHeight + 'px' }"> -->
					<view id="deposit">
						<view class="c_l_m_title">
							<text>币种</text>
							<text>数量</text>
							<text>时间</text>
						</view>
						<view class="c_l_m_list">
							<view class="item" v-for="(item, index) in aList" :key="index">
								<text>{{ item.assetCode }}</text>
								<text>{{ filter.fix(item.lockNum, 6) }}</text>
								<text>{{ $formta(item.dateTime, 'yyyy-MM-dd hh:mm') }}</text>
							</view>
						</view>
						<uniLoadMore v-if="!aList[0]" :status="aloading ? 'loading' : !aList[0] ? 'noMore' : ''"></uniLoadMore>
						<view class="common_list_page"><uni-pagination @change="setPageNo($event, 'aPageNo')" :total="aTotal * pageSize" :showIcon="true"></uni-pagination></view>
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
			coinType: 0,
			dPageNo: 1,
			dTotal: 1,
			dList: [],
			wPageNo: 1,
			wTotal: 1,
			wList: [],
			tPageNo: 1,
			tTotal: 1,
			tList: [],
			aPageNo: 1,
			aTotal: 1,
			aList: [],
			pageSize: 10,
			dloading: true,
			wloading: true,
			tloading: true,
			aloading: true,
			coinList: [],
			reason1: 0,
			reason2: 0,
			reasonList1: ['持仓解锁'],
			reasonList2: ['解冻', '冻结']
		};
	},
	onLoad(option) {},
	watch: {
		coinType() {
			this.getAllList();
		},
		reason2() {
			this.getAllList();
		}
	},
	onShow() {
		if (this.$api.isLogin()) {
			this.getCodeList();
			return false;
		}
		this.$api.goLogin('../../login/login');
	},
	methods: {
		getCodeList() {
			service.getCodeList().then(({ data }) => {
				this.aloading = false;
				if (data.code == '100200') {
					this.coinList = data.data;
					this.getAllList();
				} else {
					this.errors(data.msg);
				}
			});
		},
		//选择1
		set1(e) {
			this.reason1 = e.target.value;
		},
		//选择2
		set2(e) {
			this.reason2 = e.target.value;
		},
		//获取活动资产变化
		getAllList() {
			this.aloading = true;
			this.aList = [];
			let amountType;
			if (this.reason2 == 0) {
				amountType = 'UNFREEZE';
			} else {
				amountType = 'FREEZE';
			}

			service
				.getAllList({
					pageNo: this.aPageNo,
					pageSize: this.pageSize,
					assetCode: this.coinList[this.coinType],
					amountType: amountType,
					amountLockType: 'INFLOW_COMPUT_POWER'
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
			}
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
