<template>
	<view class="content">
		<view class="re_block">
			<view class="s_line"></view>
			<view class="list">
				<view class="block">
					<view class="top">
						<view class="left">
							<text>BTC</text>
							<view>ERC20</view>
						</view>
						<view class="right">+100.159079</view>
					</view>
					<view class="center">3ASRnJWaRfMX3QZeLignTMEpQeLWZoxm36</view>
					<view class="btm">
						<view class="left">2020-02-24 14:53:05</view>
						<view class="right">充币成功</view>
					</view>
				</view>
			</view>
			<!-- <view class="list" v-for="(item, index) in dList" :key="index">
				<text style="max-width: 225upx;">{{ $formta(item.updateDate, 'yyyy-MM-dd hh:mm') }}</text>
				<text>2</text>
				<text>{{ filter.fix(item.amount, 6) }}</text>
				<text style="max-width: 62upx; color: #4FB869;" v-if="item.status == 'SUCCESS'">已完成</text>
				<text style="max-width: 62upx; color: #ff6100;" v-if="item.status == 'REFUSE'">已退还</text>
				<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'PROCESSING'">进行中</text>
				<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'WAIT'">进行中</text>
				<text style="max-width: 62upx; color: #ccc;" v-if="item.status == 'UNKNOWN'">进行中</text>
				<text style="max-width: 62upx; color: #488FD3;" v-if="item.status == 'FAILURE'">失败</text>
			</view> -->
			<uniLoadMore v-if="!dList[0]" :status="dloading ? 'loading' : !dList[0] ? 'noMore' : ''"></uniLoadMore>
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
		if (option && option.status) {
			if (option.status == 'deposit') {
				uni.setNavigationBarTitle({
					title: '充币记录'
				});
			} else {
				uni.setNavigationBarTitle({
					title: '提币记录'
				});
			}
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
		//切换
		setType(name) {
			this.pairs = name;
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
