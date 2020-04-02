<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="NavBar">
			<view class="back" @click="back()"><uni-icons type="arrowleft" :size="28" :color="'#fff'" style="margin-left: -14rpx;"></uni-icons></view>
			<text>充币</text>
			<image @click="$goPage(`../record/record?status=deposit&type=${coinList[values]}`)" src="../../../static/record.png" mode=""></image>
		</view>
		<view class="deposit">
			<picker @change="bindPickerChange" :value="values" :range="coinList">
				<view class="g_block">
					<view class="g_left">{{ coinList[values] }}</view>
					<view class="g_right">
						<text>选择币种</text>
						<uni-icons style="margin-right: -11rpx;" type="arrowright" :color="'#C5CFD5'" size="22"></uni-icons>
					</view>
				</view>
			</picker>
			<view class="title">链名称</view>
			<view class="chain">
				<view :class="{ active: index == inde }" @click="inde = index" v-for="(item, index) in chain" :key="index">{{ item }}</view>
			</view>
			<view class="deposit_main">
				<view class="deposit_code" v-if="!isImg" @click="isImg = true"><tki-qrcode ref="qrcode" :val="address" :loadMake="true" :onval="true" :size="230" /></view>
				<view class="deposit_tpis"><text>充币地址请勿充值其他数字资产</text></view>
				<view class="deposit_address">{{ address }}</view>
				<view class="copy" @click="copy">复制地址</view>
			</view>
			<view class="deposit_sync" v-if="coin === 'SWTC' || coin === 'WKT' || coin === 'NTCC' || coin === 'TCC' || coin === 'MAE' || coin === 'CALL'">
				<button @click="syncMoney(coin)">同步资产</button>
			</view>
			<view class="tip">
				<view class="deposit_tips_one">禁止充提{{ coin }}之外的其他资产，非{{ coin }}资产转币充值的该地址将丢失，不可找回。</view>
				<view class="deposit_tips_two">1. 本站 {{ coin }} 的钱包地址底层链为 {{ COINCONFIG.asset[coin] }}。</view>
				<view class="deposit_tips_two">2. 往该地址充币，等待区块网络自动确认 (5个确认) 后，本系统会自动入账。</view>
				<view class="deposit_tips_two">3. 为了快速到账，转币时可适当提高旷工手续费。</view>
			</view>
		</view>
		<view v-if="isImg" class="Modal_mask" @click="isImg = false"></view>
		<view class="c_modal" v-if="isImg">
			<view class="qrcode"><tki-qrcode ref="qrcode" :val="address" :loadMake="true" :size="750" /></view>
		</view>
		<image v-if="isImg" @click="downImg()" class="down" src="../../../static/account/down.png" mode=""></image>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import tkiQrcode from '@/components/tki-qrcode/tki-qrcode.vue';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import service from '../service.js';
import { mapGetters } from 'vuex';
export default {
	components: {
		HMmessages,
		tkiQrcode,
		uniIcons
	},
	data() {
		return {
			address: '',
			coin: '',
			values: 0,
			coinList: ['BTC', 'USDT'],
			chain: ['ERC20', 'TRC20', '0MNI'],
			inde: 0,
			isImg: false
		};
	},
	computed: {
		...mapGetters(['COINCONFIG'])
	},
	onLoad(option) {},
	onShow() {
		this.getAddress();
		if (this.coin == 'EOS') {
			uni.showModal({
				title: '充值提示',
				content: 'EOS充值需要备注本平台ID，账户，如充值时不进行备注，将无法到账，本平台概不负责。',
				showCancel: false
			});
		}
	},
	methods: {
		//设置币种
		bindPickerChange(e) {
			this.values = e.target.value;
			this.getAddress();
		},
		//下载图片
		downImg() {
			this.$refs.qrcode1._saveCode();
		},
		//返回
		back() {
			uni.navigateBack();
		},
		//同步资产
		syncMoney(coin) {
			this.$api.showLoading();
			service
				.syncMoney({
					assetCode: coin,
					address: this.address
				})
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.HMmessages.show('同步资产成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						this.errors(data.msg);
					}
				});
		},
		//获取体现地址
		getAddress() {
			this.$api.showLoading();
			service
				.getAddress({
					assetCode: this.coinList[this.values]
				})
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.address = data.data[0].address;
						console.log(address);
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
		//复制
		copy() {
			let that = this;
			uni.setClipboardData({
				data: that.address,
				success: () => {
					that.HMmessages.show('复制成功', {
						textAlign: 'center',
						background: '#356e36',
						fontColor: '#fff'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
