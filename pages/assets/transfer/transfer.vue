<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="NavBar">
			<view class="back" @click="back()"><uni-icons type="arrowleft" :size="28" :color="'#fff'" style="margin-left: -14rpx;"></uni-icons></view>
			<text>划转</text>
			<image @click="$goPage(`../transferRecord/transferRecord`)" src="../../../static/record.png" mode=""></image>
		</view>
		<view class="transfer">
			<picker @change="setCoin" :value="coinType" :range="coinList">
				<view class="tansfer_head">
					<text class="gray">币种</text>
					<view class="right">
						<text>{{ coinList[coinType] }}</text>
						<uni-icons type="arrowright" size="20" :color="'#C5CFD5'"></uni-icons>
					</view>
				</view>
			</picker>
			<view class="transfer_nav">
				<picker @change="setEnter" :value="enter" :range="enterList">
					<view class="t_top">
						<view class="left">
							<text class="word">从</text>

							<text>{{ enterList[enter] }}</text>
						</view>
						<uni-icons class="icons" type="arrowright" size="20" :color="'#C5CFD5'"></uni-icons>
					</view>
				</picker>
				<view class="t_center">
					<image class="ellipsis" src="../../../static/ddd.png" mode=""></image>
					<view class="c_border"></view>
					<image @click="transTo()" src="../../../static/trans.png" mode=""></image>
				</view>
				<picker @change="setOut" :value="out" :range="outList">
					<view class="t_top">
						<view class="left">
							<text class="word">到</text>
							<text>{{ outList[out] }}</text>
						</view>
						<uni-icons class="icons" type="arrowright" size="20" :color="'#C5CFD5'"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="num">
				<view class="title">划转数量</view>
				<view class="inputs">
					<input type="text" placeholder-style="color:#C6D0D6" value="" placeholder="请输入划转数量" />
					<view class="r_input">
						<text>{{ coinList[coinType] }}</text>
						<view class="m_line"></view>
						<text @click="allTo()" class="blue">全部</text>
					</view>
				</view>
				<text class="btm_word">可用 {{ place }} {{ coinList[coinType] }}</text>
			</view>
			<view class="explain">只有将资产划转到对应账户才可进行交易，账户间 的划转不收取手续费</view>
			<view class="blue_btn" @click="tranfer()">确认转出</view>
			<uni-popup :show="showList" position="bottom" mode="fixed" @hidePopup="hidePopup()">
				<view class="transfer_select">
					<view class="item title">{{ title }}</view>
					<view v-if="name == 'out'" v-for="(item, index) in outList" :key="index" class="item" @click="setAccount('out', item)">{{ item }}</view>
					<view v-if="name == 'enter'" v-for="(item, index) in enterList" :key="index" class="item" @click="setAccount('enter', item)">{{ item }}</view>
					<view v-if="name == 'coin'" v-for="(item, index) in coinList" :key="index" class="item" @click="setAccount('coin', item)">{{ item }}</view>
					<view class="item" @click="hidePopup()">取消</view>
				</view>
			</uni-popup>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniPopup } from '@dcloudio/uni-ui';
import uniIcons from '@/components/uni-icon/uni-icon.vue';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import comSvc from '@/common/comSvc.js';
export default {
	components: {
		uniPopup,
		HMmessages,
		uniIcons
	},
	data() {
		return {
			showList: false,
			number: 0,
			coin: 'USDK',
			place: '',
			transQuantity: '',
			pwd: '',
			out: 0,
			enter: 0,
			title: '',
			name: '',
			coinType: 0,
			outList: ['资金账户', '币币账户'],
			enterList: ['资金账户', '币币账户'],
			coinList: ['USDT', 'BTC']
		};
	},
	onShow() {
		comSvc.getAssets().then(({ data }) => {
			if (data.code == '100200') {
				for (let i = 0; i < data.data.length; i++) {
					if (data.data[i].assetCode == 'USDK') {
						this.number = data.data[i].amountAvailable;
						this.place = '可用：' + data.data[i].amountAvailable;
					}
				}
			}
		});
	},
	onBackPress() {
		if (this.showList !== false) {
			this.showList = false;
			return true;
		}
	},
	methods: {
		//返回
		back() {
			uni.navigateBack();
		},
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//设置类型
		setCoin(e) {
			this.coinType = e.target.value;
		},
		//设置类型
		setEnter(e) {
			this.enter = e.target.value;
		},
		//设置类型
		setOut(e) {
			this.out = e.target.value;
		},
		//转换
		transTo() {
			[this.out, this.enter] = [this.enter, this.out];
		},
		//弹出
		showAccount(name) {
			this.name = name;
			if (name == 'out' || name == 'enter') {
				this.title = '选择账户';
			}
			if (name == 'coin') {
				this.title = '选择币种';
			}
			this.showList = true;
		},
		hidePopup() {
			this.showList = false;
		},
		allTo() {
			this.transQuantity = this.number;
		},
		tranfer() {
			if (!this.transQuantity) {
				this.errors('请输入划转数量');
				return false;
			}
			let param = {
				assetCode: this.coin,
				transQuantity: this.transQuantity
			};
			console.log(this.pwd);
			service
				.assetToCloud(param, {
					'pay-password': this.pwd
				})
				.then(({ data }) => {
					this.aloading = false;
					if (data.code == '100200') {
						this.HMmessages.show('划转成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
						setTimeout(function() {
							uni.switchTab({
								url: '/pages/assets/assets'
							});
						}, 1500);
					} else {
						this.errors(data.msg);
					}
				});
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
