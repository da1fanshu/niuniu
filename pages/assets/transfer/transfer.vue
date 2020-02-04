<template>
	<view class="content">
		<view class="transfer">
			<view class="transfer_nav">
				<button>币币账户</button>
				<view class="change"><image src="/static/change.png" style="width: 51upx; height: 32upx;" mode=""></image></view>
				<!-- @click="showList = true" -->
				<button>
					比特算力账户
					<uni-icon type="arrowdown" :size="20" :color="'#191e2a'"></uni-icon>
				</button>
			</view>
			<view class="transfer_form">
				<view class="item clear">
					<text class="fl">划转币种:</text>
					<view class="fr"><input style="width: 100%; height: 100%;" type="text" value="USDK" disabled /></view>
				</view>
				<view class="item clear">
					<text class="fl">划转数量:</text>
					<view class="fr">
						<input v-model="transQuantity" style="float: left; width: calc(100% - 54upx); height: 100%;" type="number" :placeholder="place" />
						<button style="width: 54upx;" @click="allTo()">全部</button>
					</view>
				</view>
				<view class="item clear">
					<text class="fl">资金密码:</text>
					<view class="fr">
						<input v-model="pwd" style="float: left; width: calc(100% - 180upx); height: 100%;" type="password" placeholder="请输入资金密码" />
						<!-- <button style="width: 180upx;" @click="$goPage('../../account/securitySetting/securitySetting')">忘记资金密码？</button> -->
					</view>
				</view>
			</view>
			<view class="submits"><button @click="tranfer()">确认转出</button></view>
			<uni-popup :show="showList" position="bottom" mode="fixed" @hidePopup="hidePopup()">
				<view class="transfer_select">
					<view class="item" @click="setAccount('game')">游戏账户</view>
					<view class="item" @click="setAccount('shop')">电商账户</view>
					<view class="item" @click="hidePopup()">取消</view>
				</view>
			</uni-popup>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniPopup } from '@dcloudio/uni-ui';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import service from '../service.js';
import comSvc from '@/common/comSvc.js';
export default {
	components: {
		uniPopup,
		HMmessages
	},
	data() {
		return {
			showList: false,
			number: 0,
			coin: 'USDK',
			place: '',
			transQuantity: '',
			pwd: ''
		};
	},
	onShow() {
		comSvc.getAssets().then(({ data }) => {
			if (data.code == '100200') {
				for (let i=0;i<data.data.length;i++) {	
					if(data.data[i].assetCode=='USDK') {
						this.number = data.data[i].amountAvailable;
						this.place = '可用：'+data.data[i].amountAvailable
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
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//设置划转账户
		setAccount(name) {
			this.showList = false;
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
