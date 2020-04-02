<template>
	<view class="content withdrawAddress">
		<view class="withdrawAddress_list">
			<view class="s_line" v-if="list.length > 0"></view>
			<view class="item" v-for="(item, index) in list" :key="index" @click="selectAddress(item)">
				<view class="left">
					<text>{{ item.memo }}</text>
					<text class="gray">{{ item.address }}</text>
				</view>
				<image @click.stop="del(item)" src="../../../../static/js/del.png" mode=""></image>
			</view>
		</view>
		<view class="none">
			<image v-if="list.length <= 0" src="../../../../static/c2c/none.png" mode=""></image>
			<view v-if="list.length <= 0">暂无记录</view>
		</view>
		<view class="withdrawAddress_add" @click="$goPage('../withdrawAdd/withdrawAdd')"><view>+添加地址</view></view>
		<!-- 添加地址 -->
		<Modal :title="'添加地址'" :isMask="true" v-if="isAddress" @close="closeModal('isAddress')">
			<view class="common_model">
				<view class="common_form">
					<view class="item clear">
						<text class="fl">名称:</text>
						<view class="fr"><input type="text" v-model="name" placeholder="请输入地址名称" /></view>
					</view>
					<!-- #ifdef H5 -->
					<view class="item clear">
						<text class="fl">地址:</text>
						<view class="fr"><input type="text" v-model="address" placeholder="请输入地址(请认真核对)" /></view>
					</view>
					<!-- #endif -->
					<!-- #ifdef APP-PLUS -->
					<view class="item imgCode clear">
						<text class="fl">地址:</text>
						<view class="fr">
							<view class="code"><button plain @click="scan">扫描</button></view>
							<input type="text" v-model="address" placeholder="请输入地址(请认真核对)" />
						</view>
					</view>
					<!-- #endif -->
				</view>
				<view class="common_btn">
					<button @click="closeModal('isAddress')">取消</button>
					<button class="active" @click="addAddress(true)">确定</button>
				</view>
			</view>
		</Modal>

		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { uniIcon } from '@dcloudio/uni-ui';
import service from '../../service.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import Modal from '@/components/lkex-modal/index.vue';
export default {
	components: {
		uniIcon,
		HMmessages,
		Modal
	},
	data() {
		return {
			isAddress: false,
			list: [],
			coin: 'ALL',
			name: '',
			address: '',
			numTime: false,
			numText: '60秒',
			num: 60
		};
	},
	onLoad(option) {
		if (option && option.type) {
			this.coin = option.type;
		}
	},
	onShow() {
		this.getList();
	},
	methods: {
		//扫描二维码
		scan() {
			let that = this;
			uni.scanCode({
				success: function(res) {
					// console.log('条码类型：' + res.scanType);
					that.address = res.result;
					// console.log('条码内容：' + res.result);
				}
			});
		},
		//获取验证码倒计时
		times() {
			let that = this;
			clearInterval(this.timeInt);
			this.timeInt = setInterval(() => {
				that.num--;
				if (that.num == 0) {
					clearInterval(that.time);
					that.numTime = false;
					that.num = 60;
					that.numText = that.num + '秒';
				} else {
					that.numText = that.num + '秒';
					that.times();
				}
			}, 1000);
		},
		//获取验证码
		getCode() {
			let type = '';
			if (REG_EMAIL.test(this.USERINFO.account)) {
				type = 'EMAIL';
			} else {
				type = 'PHONE';
			}
			this.$api.showLoading();
			comSvc
				.getCode({
					sendType: type,
					sendAccount: this.USERINFO.account
				})
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.numTime = true;
						this.times();
						this.HMmessages.show('验证码已发送', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						uni.showToast({
							title: data.msg,
							icon: 'none'
						});
					}
				});
		},

		//选择地址
		selectAddress(item) {
			this.$store.commit('setAddress', item.address);
			uni.navigateBack({
				delta: 1
			});
		},
		//添加地址
		addAddress(bool) {
			if (this.list.length >= 5) {
				this.errors('地址最多添加五个，请删除部分地址重试');
				return false;
			}
			if (!bool) {
				this.isAddress = true;
				return false;
			}
			if (!this.name) {
				this.errors('请输入地址名称');
				return false;
			}
			if (!this.address) {
				this.errors('请输入地址');
				return false;
			}
			this.$api.showLoading();
			service
				.addAddress({
					address: this.address,
					assetCode: this.coin,
					memo: this.name
				})
				.then(({ data }) => {
					this.$api.hideLoading();
					if (data.code == '100200') {
						this.closeModal('isAddress');
						this.getList();
						this.HMmessages.show('添加地址成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						this.errors(data.msg);
					}
				});
		},
		//获取地址列表
		getList() {
			service
				.addressList({
					assetCode: this.coin,
					pageNo: 1,
					pageSize: 5
				})
				.then(({ data }) => {
					if (data.code == '100200') {
						this.list = data.data.list;
					} else {
						this.errors(data.msg);
					}
				});
		},
		//删除地址
		del(item) {
			let that = this;
			uni.showModal({
				title: '删除地址',
				content: '删除地址后无法恢复，是否操作？',
				success(res) {
					if (res.confirm) {
						that.$api.showLoading();
						service
							.delAddress({
								id: item.addressid
							})
							.then(({ data }) => {
								that.$api.hideLoading();
								if (data.code == '100200') {
									that.getList();
									that.HMmessages.show('删除地址成功', {
										textAlign: 'center',
										background: '#356e36',
										fontColor: '#fff'
									});
								} else {
									that.errors(data.msg);
								}
							});
					}
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
		//隐藏弹窗
		closeModal(name) {
			this[name] = !this[name];
			this.name = '';
			this.address = '';
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
