<template>
	<view class="content">
		<!-- #ifdef APP-PLUS -->
		<view class="status_bar"><view class="top_view"></view></view>
		<!-- #endif -->
		<view class="reset">
			<view class="top_bg">
				<view class="w_bg"><image src="/static/logo.png" mode="aspectFit"></image></view>
				<view class="top_title">NNPOOL</view>
			</view>
			<view class="sm_b">
				<view class="item clear">
					<view class="i_left">
						<image class="img_left" src="/static/login_user.png" mode="aspectFit"></image>
						<view>
							<picker @change="set1" :value="inde" :range="tele" range-key="tel">
								<view class="flex">
									<view class="uni-inputs">+{{ tele[inde].tel }}<view class="thr"></view></view>
									<view class="triangle"></view>
								</view>
							</picker>
						</view>
					</view>
					<input v-model="account" type="text" placeholder="请输入手机号或者邮箱" />
				</view>
				<view class="item imgCode clear">
					<view class="i_left">
						<image class="img_left" src="/static/reset_emailCode.png" mode="aspectFit"></image>
						<view>验证码</view>
					</view>
					<view class="code" @click="getImgCode()"><image :src="imgUrl" style="width: 100%; height: 54upx;" mode="aspectFit"></image></view>
					<input v-model="imgCode" type="number" placeholder="请输入图片验证码" maxlength="4" />
				</view>
				<view class="item clear">
					<view class="i_left">
						<image class="img_left" src="/static/login_pwd.png" mode="aspectFit"></image>
						<view>新密码</view>
					</view>
					<input v-model="newPwd" type="password" placeholder="登录密码(最小六个字符)" />
				</view>
				<view class="item clear">
					<view class="i_left">
						<image class="img_left" src="/static/login_pwd.png" mode="aspectFit"></image>
						<view>新密码</view>
					</view>
					<input type="password" v-model="cenPwd" placeholder="再次输入密码" />
				</view>
				<view class="item imgCode clear">
					<view class="i_left">
						<image class="img_left" src="/static/reset_emailCode.png" mode="aspectFit"></image>
						<view>验证码</view>
					</view>
					<input v-model="phoneCode" type="number" maxlength="6" placeholder="请输入手机验证码" />
					<view v-if="numTime == false" class="code" @click="getCode()"><button plain>发送验证码</button></view>
					<view v-else class="code">
						<button plain disabled>{{ numText }}</button>
					</view>
				</view>
				<view class="item submit" v-if="loading == false"><button @click="submits()">重置密码</button></view>
				<view class="item submit" v-else><button disabled :loading="true" style="opacity: 0.5;">重置密码</button></view>
			</view>
		</view>
		<HMmessages ref="HMmessages" @complete="HMmessages = $refs.HMmessages"></HMmessages>
	</view>
</template>

<script>
import { REG_EMAIL_PHONE, REG_EMAIL } from '@/common/reg.js';
import HMmessages from '@/components/HM-messages/HM-messages.vue';
import comSvc from '@/common/comSvc.js';
import tel from '../../static/js/tel.js';
import service from './service.js';
export default {
	components: {
		HMmessages
	},
	data() {
		return {
			randomKey: '',
			imgUrl: '',
			imgCode: '',
			newPwd: '',
			cenPwd: '',
			account: '',
			phoneCode: '',
			loading: false,
			numTime: false,
			num: 60,
			timeInt: null,
			numText: '60秒',
			inde: 0,
			tele: []
		};
	},
	created() {
		this.tele = tel;
		this.getImgCode();
	},
	//页面离开，删除定时器
	onUnload() {
		this.timeInt && clearInterval(this.timeInt);
	},
	watch: {
		account() {
			const reg = /\s/;
			if (reg.test(this.account)) {
				this.account = this.account.replace(reg, '');
				return;
			}
		},
		imgCode() {
			const reg = /\s/;
			if (reg.test(this.imgCode)) {
				this.imgCode = this.imgCode.replace(reg, '');
				return;
			}
		},
		phoneCode() {
			const reg = /\s/;
			if (reg.test(this.phoneCode)) {
				this.phoneCode = this.phoneCode.replace(reg, '');
				return;
			}
		},
		newPwd() {
			const reg = /\s/;
			if (reg.test(this.newPwd)) {
				this.newPwd = this.newPwd.replace(reg, '');
				return;
			}
		},
		cenPwd() {
			const reg = /\s/;
			if (reg.test(this.cenPwd)) {
				this.cenPwd = this.cenPwd.replace(reg, '');
				return;
			}
		}
	},
	methods: {
		//选择1
		set1(e) {
			this.inde = e.target.value;
		},
		//确定重置
		submits() {
			if (!this.verif()) {
				return false;
			}
			let num = '';
			if (REG_EMAIL.test(this.account)) {
			} else {
				num = '86';
			}
			this.loading = true;
			service
				.resetLogin(
					{
						loginPassword: this.cenPwd
					},
					{
						'account-no': num + this.account,
						'service-code': this.phoneCode
					}
				)
				.then(({ data }) => {
					this.loading = false;
					if (data.code == '100200') {
						let that = this;
						this.HMmessages.show('重置密码成功', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff',
							callback: () => {
								that.back();
							}
						});
					} else {
						this.errors(data.msg);
					}
				});
		},
		//获取图片验证码
		getImgCode() {
			this.randomKey = new Date().getTime();
			this.imgUrl = '/exchangeApi/captchar/code?randomKey=' + this.randomKey;
			// #ifdef APP-PLUS
			this.imgUrl = this.$api.baseUrl + '/exchangeApi/captchar/code?randomKey=' + this.randomKey;
			// #endif
		},
		//获取验证码
		getCode() {
			if (!this.verif('getCode')) {
				return false;
			}
			let name = '';
			let num = '';
			if (REG_EMAIL.test(this.account)) {
				name = 'EMAIL';
			} else {
				name = 'PHONE';
				num = '86';
			}
			comSvc
				.getCode(
					{
						sendType: name,
						sendAccount: num + this.account
					},
					{
						'captchar-code': this.imgCode,
						'captchar-no': this.randomKey
					}
				)
				.then(({ data }) => {
					if (data.code == '100200') {
						this.numTime = true;
						this.times();
						this.HMmessages.show('验证码已发送', {
							textAlign: 'center',
							background: '#356e36',
							fontColor: '#fff'
						});
					} else {
						this.getImgCode();
						this.errors(data.msg);
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
		//错误提示
		errors(text) {
			this.HMmessages.show(text, {
				textAlign: 'center',
				background: '#74272d',
				fontColor: '#fff'
			});
		},
		//验证
		verif(name) {
			if (!this.account) {
				this.errors('请输入账户');
				return false;
			} else if (!REG_EMAIL_PHONE.test(this.account)) {
				this.errors('请输入正确的账户');
				return false;
			}
			if (!this.imgCode) {
				this.errors('请输入图片验证码');
				return false;
			}
			if (name == 'getCode') {
				return true;
			}
			if (!this.phoneCode) {
				this.errors('请输入验证码');
				return false;
			}
			if (!this.newPwd || this.newPwd.length < 6) {
				this.errors('请输入不小于六位字符的登录密码');
				return false;
			}
			if (!this.cenPwd) {
				this.errors('请再次确认密码');
				return false;
			}
			if (this.cenPwd != this.newPwd) {
				this.errors('密码不一致，请重新输入');
				return false;
			}
			return true;
		},
		//修改手机返回
		back() {
			let length = getCurrentPages();
			if (length.length == 1) {
				uni.redirectTo({
					url: '../login/login'
				});
			} else {
				uni.navigateBack();
			}
		}
	}
};
</script>

<style lang="scss">
@import './style.scss';
</style>
